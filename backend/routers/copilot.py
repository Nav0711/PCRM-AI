from fastapi import APIRouter, Depends
import re
import uuid
from typing import Optional
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.dependencies import get_current_user, require_role
from models.user import User
from models.complaint import Complaint
from models.briefing import Briefing
from schemas.copilot import ChatRequest, BriefingResponse
from services.ai_service import chat_with_data, generate_morning_briefing, identify_assignment_intent
from datetime import date, datetime, timedelta
from sqlalchemy import func

router = APIRouter(prefix="/api/v1/copilot", tags=["copilot"])

# Handle OPTIONS preflight requests without authentication
@router.options("/chat")
def options_chat():
    return {}

@router.options("/briefing/today")
def options_briefing():
    return {}

@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(require_role(["Politician"]))):
    # Fetch real context from DB based on query_type
    context_data = ""
    
    if request.query_type == "complaint" and request.complaint_id:
        complaint = db.query(Complaint).filter(Complaint.id == request.complaint_id).first()
        if complaint:
            context_data = f"""
            Complaint Details:
            Ticket ID: {complaint.ticket_id}
            Citizen: {complaint.citizen_name} ({complaint.citizen_phone})
            Category: {complaint.category} / {complaint.subcategory}
            Priority: {complaint.priority}
            Status: {complaint.status}
            Raw Text: {complaint.raw_text}
            AI Summary: {complaint.summary or 'Not available'}
            AI Overview: {complaint.ai_overview or 'Not available'}
            Suggested Action: {complaint.suggested_action or 'Not available'}
            Suggested Assignee: {complaint.suggested_assignee_role or 'Not available'}
            """
        else:
            context_data = "Complaint not found."

    elif request.query_type == "data":
        # ... existing code ...
        open_count = db.query(Complaint).filter(
            Complaint.constituency_id == current_user.constituency_id,
            Complaint.status.in_(["New", "Acknowledged", "In Progress"])
        ).count()
        
        urgent_count = db.query(Complaint).filter(
            Complaint.constituency_id == current_user.constituency_id,
            Complaint.priority == 5,
            Complaint.status != "Resolved"
        ).count()
        
        context_data = f"Current Constituency Stats: {open_count} total open complaints. {urgent_count} urgent (Priority 5) complaints."
        
    elif request.query_type in ["speech", "media"]:
        # ... existing code ...
        thirty_days_ago = datetime.now() - timedelta(days=30)
        resolved_recent = db.query(Complaint.category, func.count(Complaint.id)).filter(
            Complaint.constituency_id == current_user.constituency_id,
            Complaint.status == "Resolved",
            Complaint.resolved_at >= thirty_days_ago
        ).group_by(Complaint.category).all()
        
        resolved_str = ", ".join([f"{count} {cat} issues" for cat, count in resolved_recent])
        context_data = f"Accomplishments in last 30 days: Resolved {resolved_str}."

    elif request.query_type in ["pending_complaints", "pending", "complaints"]:
        pending_statuses = ["New", "Acknowledged", "In Progress", "Assigned"]
        complaints = (
            db.query(Complaint)
            .filter(
                Complaint.status.in_(pending_statuses),
                Complaint.constituency_id == current_user.constituency_id,
            )
            .order_by(Complaint.created_at.desc())
            .limit(20)
            .all()
        )

        worker_ids = {c.assigned_to for c in complaints if c.assigned_to}
        workers_by_id = {}
        if worker_ids:
            workers = db.query(User).filter(User.id.in_(worker_ids)).all()
            workers_by_id = {w.id: w.name for w in workers}

        if not complaints:
            context_data = "No pending complaints found for your constituency."
        else:
            lines = ["Pending complaints (showing latest 20):"]
            for c in complaints:
                assignee = workers_by_id.get(c.assigned_to)
                lines.append(
                    f"• {c.ticket_id} — {c.summary or c.raw_text[:80]} (Status: {c.status}, Priority: {c.priority}{', Assigned to: ' + assignee if assignee else ''})"
                )
            context_data = "\n".join(lines)
            
        # Let the code fall through to `chat_with_data` below to format the `context_data`.

    elif request.query_type == "assign":
        # First query recent open complaints and available workers to build context
        recent_complaints = db.query(Complaint).filter(
            Complaint.constituency_id == current_user.constituency_id,
            Complaint.status.in_(["New", "Acknowledged", "In Progress"])
        ).order_by(Complaint.created_at.desc()).limit(20).all()

        workers = db.query(User).filter(
            User.role == "FieldWorker",
            User.constituency_id == current_user.constituency_id,
        ).all()

        context_lines = ["Recent open complaints:"]
        for c in recent_complaints:
            context_lines.append(f"Ticket: {c.ticket_id}, Category: {c.category}, Summary: {c.summary or c.raw_text[:50]}")

        context_lines.append("\nAvailable Workers:")
        for w in workers:
            context_lines.append(f"Name: {w.name}, ID: {w.id}")
            
        context_data = "\n".join(context_lines)

        intent = identify_assignment_intent(request.message, context_data)

        if not intent.get("found") or not intent.get("ticket_id") or not intent.get("worker_name"):
            return {"response": "I couldn't clearly identify which complaint to assign or to whom. Please mention the issue description and the worker's name."}

        ticket_id = intent.get("ticket_id")
        worker_name = intent.get("worker_name")
        description = intent.get("description")

        complaint = db.query(Complaint).filter(
            Complaint.ticket_id == ticket_id, 
            Complaint.constituency_id == current_user.constituency_id
        ).first()
        
        worker = next((w for w in workers if w.name.lower() == worker_name.lower() or str(w.id) == worker_name), None)

        if not complaint:
            return {"response": f"I understood you wanted to assign {ticket_id}, but I couldn't find it actively open in your constituency."}

        if not worker:
            return {"response": f"I understood you wanted to assign this to {worker_name}, but I couldn't find a worker by that name."}

        if complaint.status in ["Resolved", "Closed"]:
            return {"response": f"Complaint {complaint.ticket_id} is already {complaint.status} and cannot be reassigned."}

        complaint.assigned_to = worker.id
        complaint.status = "Assigned"
        if description:
            complaint.resolution_note = f"Assignment Note: {description}"

        db.commit()
        db.refresh(complaint)

        res_msg = f"I've successfully assigned {complaint.ticket_id} ({complaint.category}) to {worker.name}."
        if description:
            res_msg += f" Note attached: '{description}'"
        return {"response": res_msg}

    if not context_data or request.query_type == "general":
        recent_complaints = db.query(Complaint).filter(
            Complaint.constituency_id == current_user.constituency_id
        ).order_by(Complaint.created_at.desc()).limit(50).all()
        
        lines = ["Recent Constituency Database Records:"]
        for c in recent_complaints:
            lines.append(f"- Ticket: {c.ticket_id}, Category: {c.category}, Status: {c.status}, Summary: {c.summary or c.raw_text[:50]}, Priority: {c.priority}")
        db_context = "\n".join(lines)
        
        if not context_data:
            context_data = db_context
        else:
            context_data += "\n\n" + db_context

    response_text = chat_with_data(request.message, request.history, request.query_type, context_data)
    return {"response": response_text}


@router.get("/briefing/today", response_model=BriefingResponse)
def get_briefing_today(db: Session = Depends(get_db), current_user: User = Depends(require_role(["PA", "Politician"]))):
    today = date.today()
    
    # Check if briefing already exists for today
    existing_briefing = db.query(Briefing).filter(
        Briefing.constituency_id == current_user.constituency_id,
        Briefing.date == today
    ).first()
    
    # Calculate real stats
    yesterday = datetime.now() - timedelta(days=1)
    
    total_open = db.query(Complaint).filter(
        Complaint.constituency_id == current_user.constituency_id,
        Complaint.status.in_(["New", "Acknowledged", "In Progress"])
    ).count()
    
    new_since_yesterday = db.query(Complaint).filter(
        Complaint.constituency_id == current_user.constituency_id,
        Complaint.created_at >= yesterday
    ).count()
    
    resolved_today = db.query(Complaint).filter(
        Complaint.constituency_id == current_user.constituency_id,
        Complaint.status == "Resolved",
        func.date(Complaint.resolved_at) == today
    ).count()
    
    sla_breaches = db.query(Complaint).filter(
        Complaint.constituency_id == current_user.constituency_id,
        Complaint.is_sla_breached == True,
        Complaint.status != "Resolved"
    ).count()
    
    stats = {
        "total_open": total_open,
        "new_since_yesterday": new_since_yesterday,
        "resolved_today": resolved_today,
        "sla_breaches": sla_breaches
    }
    
    if existing_briefing:
        return {
            "briefing": existing_briefing,
            "stats": stats
        }
        
    # If no briefing exists, generate one using Gemini
    ai_response = generate_morning_briefing(stats)
    
    new_briefing = Briefing(
        constituency_id=current_user.constituency_id,
        date=today,
        stats_snapshot=stats,
        ai_summary=ai_response.get("ai_summary", "No summary generated."),
        trend_alert=ai_response.get("trend_alert", "No alerts today.")
    )
    
    db.add(new_briefing)
    db.commit()
    db.refresh(new_briefing)
    
    return {
        "briefing": new_briefing,
        "stats": stats
    }
