from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import auth, complaints, analytics, copilot, webhooks, wards, users
from utils.database import engine, Base
import os

app = FastAPI(title="P-CRM API", version="1.0.0")

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS configuration - MUST be added FIRST before any routes or other middleware
# Use permissive CORS to ensure preflight requests always succeed. We are not using cookies, so credentials can remain False.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for dev / preview
    allow_origin_regex=".*",
    allow_credentials=False,  # Authorization header is still allowed without credentialed mode
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,  # 24 hours
)

# Include routers AFTER middleware
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
