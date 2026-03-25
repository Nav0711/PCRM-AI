from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import auth, complaints, analytics, copilot, webhooks, wards, users
from utils.database import engine, Base
import os

app = FastAPI(title="P-CRM API", version="1.0.0")

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS configuration - allow specific origins for credentials
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://pcrm-ai-wine.vercel.app",  # production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # allow Vercel preview deploys
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    max_age=600,
)

app.include_router(auth.router)
app.include_router(complaints.router)
app.include_router(analytics.router)
app.include_router(copilot.router)
app.include_router(webhooks.router)
app.include_router(wards.router)
app.include_router(users.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
