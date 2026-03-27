import { mockTasks, mockWorkers, POLITICIAN } from '@/data/mock';
import { Task } from '@/types';
import { apiClient } from './apiClient';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Simulated delay for mock API responses
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Beautify and clean AI response text
 * - Removes asterisks and markdown formatting
 * - Cleans up excess whitespace
 * - Improves readability
 */
export function beautifyAIResponse(text: string): string {
  if (!text) return '';
  
  return text
    // Remove bold markers (**)
    .replace(/\*\*/g, '')
    // Remove single asterisks (*)
    .replace(/\*/g, '')
    // Ensure lists (Bullet points, dashes, numbers) have proper newlines
    .replace(/(\n|^)(\s*)([•\-\*]|\d+\.)(\s+)/g, '$1$2$3$4')
    // Fix common case where AI misses newline before a list item
    .replace(/([^.\n])(\s+)([•\-\*]|\d+\.)(\s+)/g, '$1\n$3$4')
    // Clean up excessive newlines (more than 2)
    .replace(/\n{3,}/g, '\n\n')
    // Trim leading/trailing whitespace
    .trim();
}

function buildPoliticianContext(liveComplaints?: any[]): string {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  
  const tasks = liveComplaints || mockTasks;
  const total = tasks.length;
  const inProgress = tasks.filter((t: any) => (t.status || '').toLowerCase() === 'in-progress' || (t.status || '').toLowerCase() === 'in progress');
  const awaiting  = tasks.filter((t: any) => (t.status || '').toLowerCase().includes('awaiting'));
  const completed = tasks.filter((t: any) => (t.status || '').toLowerCase() === 'completed' || (t.status || '').toLowerCase() === 'done');
  const newTasks  = tasks.filter((t: any) => (t.status || '').toLowerCase() === 'new' || (t.status || '').toLowerCase() === 'unassigned');

  return `You are PSRM-AI, a highly intelligent and concise AI Co-Pilot embedded inside the PSRM-AI (Public Smart Relation Management System with AI) platform.

YOUR USER: An elected Indian politician / MLA managing constituency public works.
PLATFORM: PSRM-AI — a CRM for politician-to-field-worker task management and citizen complaint resolution.
TODAY: ${today}

LIVE CONSTITUENCY DATA:
- Total complaints/tasks in system: ${total}
- Currently In Progress: ${inProgress.length}
- Awaiting your Approval: ${awaiting.length} — these need your review NOW
- Completed / Resolved: ${completed.length}
- New / Unassigned: ${newTasks.length}

PENDING APPROVALS (tasks waiting for politician's action):
${awaiting.slice(0, 5).map((t: any) => `  • "${t.summary || t.ticket_id || t.title}" — Category: ${t.category || 'Unknown'}, Notes: ${t.resolution_note || 'No worker notes'}`).join('\n') || '  (None currently)'}

IN-PROGRESS TASKS:
${inProgress.slice(0, 5).map((t: any) => `  • "${t.summary || t.ticket_id || t.title}" — Category: ${t.category || 'Unknown'}`).join('\n') || '  (None currently)'}

FIELD WORKERS:
${mockWorkers.map(w => `  • ${w.name} — Ward: ${w.ward}, Active: ${w.activeTasks} tasks, Completed: ${w.completedTasks}`).join('\n')}

YOUR CAPABILITIES:
- Draft speeches about constituency achievements
- Write media responses and press releases
- Summarize pending works and approvals
- Analyze worker performance
- Explain how to approve/reject tasks in PSRM-AI
- Answer questions about the platform workflow

RESPONSE STYLE: Be direct, concise, and professional. Speak as a trusted advisor to the politician. Reference real numbers from the data above. Use plain language — no markdown asterisks.`;
}

function buildWorkerContext(liveComplaints?: any[], workerName?: string): string {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const tasks = liveComplaints || mockTasks.filter(t => t.assignedWorker === 'w1');
  const total = tasks.length;
  const inProgress = tasks.filter((t: any) => (t.status || '').toLowerCase().includes('progress'));
  const awaiting   = tasks.filter((t: any) => (t.status || '').toLowerCase().includes('awaiting'));
  const completed  = tasks.filter((t: any) => (t.status || '').toLowerCase() === 'completed' || (t.status || '').toLowerCase() === 'done');

  return `You are PSRM-AI, an intelligent AI assistant embedded in the PSRM-AI Field Worker Portal.

YOUR USER: ${workerName || 'A field worker'} — a ground-level government field worker responsible for resolving citizen complaints.
PLATFORM: PSRM-AI — a CRM where politicians assign tasks to field workers, who complete them and appeal for approval.
TODAY: ${today}

MY ASSIGNED TASKS SUMMARY:
- Total tasks assigned to me: ${total}
- Currently In Progress: ${inProgress.length}
- Awaiting politician approval: ${awaiting.length}
- Completed: ${completed.length}

MY CURRENT TASKS:
${tasks.slice(0, 6).map((t: any) => `  • "${t.summary || t.ticket_id || t.title}" — Status: ${t.status || 'New'}, Category: ${t.category || 'General'}, Notes: ${t.resolution_note || 'None yet'}`).join('\n') || '  (No tasks currently assigned)'}

HOW THE WORKFLOW WORKS:
1. Politician assigns a complaint/task to me
2. I work on it in the field
3. When done, I go to "Assigned Work" and click "Submit Progress / Appeal"
4. I write my completion notes and submit
5. The status changes to "Awaiting Approval" and the politician reviews it
6. If approved, it's marked Completed. If rejected, I get feedback and try again
7. I can also "Propose Work" from the dashboard to suggest new tasks to the politician

WHAT I CAN HELP WITH:
- Draft daily progress reports
- Write completion notes for task approval
- Compose professional messages to supervisor/politician
- Summarize my workload and priorities
- Advise how to handle delayed or blocked tasks
- Explain the PSRM-AI platform workflow

RESPONSE STYLE: Be practical, supportive, and concise. Speak in a friendly but professional tone. Help the worker do their job efficiently. No asterisks or markdown symbols.`;
}

// ---- Mock AI response generators ----

const MOCK_RESPONSES: Record<string, string> = {
  'overdue': `Based on your current data, here are the most urgent overdue items:\n\nDrainage System Repair — Ward 5 - West\n- Assigned to Rajiv Singh\n- Progress: 0% — Work hasn't started yet\n- Recommendation: Contact Rajiv immediately. This is a flooding risk.\n\nStreet Light Installation — Ward 4 - East\n- Approaching deadline, Progress: 40%\n- Recommendation: Check if additional resources are needed to meet deadline.`,

  'approval': `You have tasks pending your approval.\n\nCommunity Park Development — Ward 3 - South\n- Worker: Suresh Reddy\n- Notes: "Park construction complete. Playground equipment installed and pathways paved."\n- Recommendation: This looks ready for approval.`,

  'performance': `Your team performance summary:\n\nTop Performer: Priya Patel\n- 18 tasks completed, Avg 5 days\n\nLakshmi Devi — 22 completed, Avg 6 days — Reliable and consistent.\n\nAmit Sharma — 12 completed, Avg 8 days.\n\nSuresh Reddy — 9 completed, Avg 12 days — May need closer oversight.`,

  'feedback': `Rejection feedback template:\n\nTask: [Task Name]\nDecision: Requires Revision\n\nDear [Worker Name],\n\nThank you for your work on this task. After review, I've identified areas that need attention before approval:\n\n1. [Specific issue] — [What needs to change]\n2. [Missing documentation] — [What's needed]\n\nPlease address these points and resubmit.\n\nRegards,\n${POLITICIAN.name}`,
};

function getDefaultResponse(message: string, detailed = false): string {
  const lower = message.toLowerCase();

  if (detailed || lower.includes('overdue') || lower.includes('urgent') || lower.includes('delayed')) return MOCK_RESPONSES['overdue'];
  if (detailed || lower.includes('approval') || lower.includes('pending') || lower.includes('approve')) return MOCK_RESPONSES['approval'];
  if (detailed || lower.includes('perform') || lower.includes('team')) return MOCK_RESPONSES['performance'];
  if (detailed || lower.includes('feedback') || lower.includes('reject') || lower.includes('write')) return MOCK_RESPONSES['feedback'];

  // Short default
  return `You have ${mockTasks.filter(t => t.status === 'in-progress').length} tasks in progress and ${mockTasks.filter(t => t.status === 'awaiting-approval').length} awaiting approval. Ask me about overdue tasks, worker performance, or pending approvals for details.`;
}

// ---- Public API ----

/**
 * Send a message to the AI Copilot
 * Calls: POST /api/v1/copilot/chat
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  queryType: string = 'general',
  userRole: string = 'Politician',
  liveComplaints?: any[],
  userName?: string
): Promise<{ reply: string }> {
  try {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const messageContent = lastUserMsg?.content || '';

    // Determine if user is requesting detail
    const wantsDetail = /\b(detail|explain|full|list|elaborate|describe|breakdown|summarize)\b/i.test(messageContent);

    // Build a rich, role-specific system context
    const systemContext = userRole === 'FieldWorker'
      ? buildWorkerContext(liveComplaints, userName)
      : buildPoliticianContext(liveComplaints);
    
    const conciseSuffix = wantsDetail
      ? '\n\nThe user is requesting detailed information — provide a thorough, structured response.'
      : '\n\nBe concise and conversational. Reply in 2-4 sentences max unless the user explicitly asks for details or uses words like explain, list, describe, or summarize.';

    const historyWithSystem = [
      { role: 'assistant' as const, content: systemContext + conciseSuffix },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ];
    
    const response = await apiClient.sendCopilotMessage(
      messageContent,
      historyWithSystem,
      queryType
    );

    if ((response.data as any)?.response) {
      return { reply: beautifyAIResponse((response.data as any).response) };
    }

    // Fallback to mock response if API fails
    await delay(1200 + Math.random() * 800);
    return { reply: beautifyAIResponse(getDefaultResponse(messageContent, wantsDetail)) };
  } catch (error) {
    console.error('Chat error:', error);
    await delay(1200 + Math.random() * 800);
    const lastMsg = messages[messages.length - 1]?.content || '';
    const wantsDetail = /\b(detail|explain|full|list|elaborate|describe|breakdown|summarize)\b/i.test(lastMsg);
    return { reply: beautifyAIResponse(getDefaultResponse(lastMsg, wantsDetail)) };
  }
}

/**
 * Get AI insights for a specific page
 * Falls back to mock data if real API not available
 */
export async function getAIInsights(
  page: string,
  _context?: Record<string, unknown>
): Promise<{ suggestions: string[] }> {
  await delay(800 + Math.random() * 400);

  const overdue = mockTasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'completed');

  const insightsMap: Record<string, string[]> = {
    dashboard: [
      `You have ${mockTasks.filter(t => t.status === 'awaiting-approval').length} task(s) awaiting your approval — oldest submitted ${mockTasks.find(t => t.status === 'awaiting-approval')?.completedAt || 'recently'}.`,
      overdue.length > 0
        ? `⚠️ ${overdue.length} task(s) are past deadline. The Drainage System Repair in Ward 5 is at 0% and needs immediate attention.`
        : '✅ No overdue tasks — all work is on track.',
      `Priya Patel is your top performer this month with a 5-day average completion time.`,
    ],
    approvals: [
      `Community Park Development has been pending approval for ${Math.round((Date.now() - new Date('2026-02-22').getTime()) / (1000 * 60 * 60 * 24))} days — consider reviewing soon.`,
      `Worker Suresh Reddy has a 12-day avg completion time. His previous task was rejected — review this submission carefully.`,
      `This task includes completion notes — "Playground equipment installed and pathways paved."`,
    ],
    'active-works': [
      overdue.length > 0 ? `🔴 ${overdue.length} task(s) overdue: ${overdue.map(t => t.title).join(', ')}` : '✅ All tasks are on schedule.',
      `Street Light Installation in Ward 4 is at 40% with a March 10 deadline — may need extra resources.`,
      `Water Pipeline Extension is progressing well at 65% — on track for March 15 deadline.`,
    ],
    analytics: [
      `Your overall approval rate is ${Math.round((mockTasks.filter(t => t.status === 'completed').length / Math.max(1, mockTasks.filter(t => t.status === 'completed').length + mockTasks.filter(t => t.status === 'rejected').length)) * 100)}% — above constituency average.`,
      `Ward 1 - Central has the most completed tasks (3). Consider assigning more work to underutilized wards.`,
      `Average task completion time is trending downward — good sign of improving efficiency.`,
    ],
  };

  return { suggestions: insightsMap[page]?.map(s => beautifyAIResponse(s)) || insightsMap['dashboard'].map(s => beautifyAIResponse(s)) };
}

export async function getTaskAISuggestions(
  taskId: string
): Promise<{ suggestions: string[] }> {
  await delay(600 + Math.random() * 400);

  const task = mockTasks.find(t => t.id === taskId);
  if (!task) return { suggestions: ['Task not found.'] };

  const worker = mockWorkers.find(w => w.id === task.assignedWorker);
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';
  const daysToDeadline = Math.round((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const suggestions: string[] = [];

  if (isOverdue) {
    suggestions.push(`⚠️ This task is ${Math.abs(daysToDeadline)} days overdue — consider sending a reminder to ${task.assignedWorkerName}.`);
  } else if (daysToDeadline <= 7 && task.progress < 80) {
    suggestions.push(`⏰ Deadline in ${daysToDeadline} days but progress is at ${task.progress}% — may need additional support.`);
  }

  if (worker) {
    const rate = worker.completedTasks > 0
      ? Math.round((worker.completedTasks / (worker.completedTasks + worker.activeTasks)) * 100)
      : 0;
    suggestions.push(`${worker.name} has a ${rate}% completion rate with avg ${worker.avgCompletionDays || '?'} days per task.`);
  }

  if (task.status === 'awaiting-approval' && task.workerNotes) {
    suggestions.push(`Proof submitted with notes: "${task.workerNotes.slice(0, 80)}…" — review and decide.`);
  }

  if (suggestions.length === 0) {
    suggestions.push(`This task is progressing normally at ${task.progress}%.`);
  }

  return { suggestions: suggestions.map(s => beautifyAIResponse(s)) };
}

export async function getApprovalAIReview(
  taskId: string
): Promise<{ review: string }> {
  await delay(1000 + Math.random() * 500);

  const task = mockTasks.find(t => t.id === taskId);
  if (!task) return { review: beautifyAIResponse('Task not found.') };

  const worker = mockWorkers.find(w => w.id === task.assignedWorker);
  const completionRate = worker
    ? Math.round((worker.completedTasks / Math.max(1, worker.completedTasks + worker.activeTasks)) * 100)
    : 0;

  const daysInProgress = task.completedAt && task.createdAt
    ? Math.round((new Date(task.completedAt).getTime() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : '?';

  let review = `Based on the submission, ${task.assignedWorkerName} completed this task in ${daysInProgress} days. `;
  review += `Worker has a ${completionRate}% historical completion rate (avg ${worker?.avgCompletionDays || '?'} days). `;

  if (task.workerNotes) {
    review += `Notes indicate: "${task.workerNotes}" `;
  }

  review += `\n\n**Recommendation:** `;
  if (completionRate >= 80) {
    review += `Approve — worker has strong track record and the submission details look complete.`;
  } else {
    review += `Review carefully — worker's completion rate (${completionRate}%) suggests some previous issues. Verify proof images if available.`;
  }

  return { review: beautifyAIResponse(review) };
}





