"""
Generate mock data for current logged-in user
Run this after you've logged in to the app
"""

import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime, timedelta
import random
import asyncio
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.embedding_service import embedding_service
from app.services.vector_service import vector_service
from app.config import settings

# Initialize Firebase
def init_firebase():
    if not firebase_admin._apps:
        if os.path.exists(settings.FIREBASE_SERVICE_ACCOUNT_PATH):
            cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
        else:
            raise FileNotFoundError(f"Firebase service account file not found: {settings.FIREBASE_SERVICE_ACCOUNT_PATH}")
        firebase_admin.initialize_app(cred)
    return firestore.client()

async def generate_data_for_email(db, email: str):
    """Generate mock data for a user by email"""
    
    # Get user by email
    try:
        user = auth.get_user_by_email(email)
        user_id = user.uid
        print(f"\n✓ Found user: {email}")
        print(f"  User ID: {user_id}")
    except Exception as e:
        print(f"\n✗ Error: Could not find user with email {email}")
        print(f"  {str(e)}")
        return
    
    # Generate emails
    print(f"\nGenerating 20 mock emails for {email}...")
    subjects = [
        "Q1 Budget Review Meeting - Action Required",
        "Project Update - Sprint 23 Completed",
        "Benefits Enrollment Reminder - Deadline Friday",
        "Team Lunch Next Friday - RSVP",
        "Code Review Request - PR #234",
        "Client Meeting Notes - Follow Up Needed",
        "Performance Review Schedule",
        "New Security Policy - Please Review",
        "Weekly Team Sync - Agenda",
        "Urgent: Server Maintenance Tonight",
    ]
    
    for i in range(20):
        email_id = f"email_{user_id}_{i+1:05d}"
        subject = random.choice(subjects)
        body = f"This is the body of email about: {subject}"
        
        email_data = {
            "emailId": email_id,
            "userId": user_id,
            "subject": subject,
            "sender": {"name": "Jane Smith", "email": "jane@company.com"},
            "body": body,
            "bodyPreview": body[:150],
            "receivedAt": datetime.now() - timedelta(hours=random.randint(1, 72)),
            "priority": random.choice(["high", "medium", "low"]),
            "isRead": random.choice([True, False]),
            "isStarred": False,
            "labels": random.sample(["work", "urgent", "review"], k=2),
            "extractedActions": [],
            "createdAt": datetime.now()
        }
        
        db.collection('emails').document(email_id).set(email_data)
        
        # Add to vector DB
        text = f"Subject: {subject}\nBody: {body}"
        embedding = await embedding_service.generate_embedding(text)
        await vector_service.add_email_embedding(
            email_id=email_id,
            user_id=user_id,
            text=text,
            embedding=embedding,
            metadata={"priority": email_data["priority"], "sender": "jane@company.com", "receivedAt": email_data["receivedAt"], "labels": email_data["labels"]}
        )
        print(f"  ✓ Email {i+1}/20")
    
    # Generate tasks
    print(f"\nGenerating 15 mock tasks for {email}...")
    task_titles = [
        "Complete API documentation",
        "Review pull requests",
        "Update project timeline",
        "Prepare client presentation",
        "Fix critical bug",
        "Code review session",
        "Write unit tests",
        "Update dependencies",
        "Create user guide",
        "Optimize database queries",
    ]
    
    for i in range(15):
        task_id = f"task_{user_id}_{i+1:05d}"
        title = random.choice(task_titles)
        
        task_data = {
            "taskId": task_id,
            "userId": user_id,
            "title": title,
            "description": f"Description for {title}",
            "dueDate": datetime.now() + timedelta(days=random.randint(-2, 14)),
            "priority": random.choice(["high", "medium", "low"]),
            "status": random.choice(["pending", "in_progress", "completed"]),
            "category": random.choice(["development", "documentation", "meeting"]),
            "tags": random.sample(["api", "backend", "testing"], k=2),
            "estimatedHours": random.randint(2, 8),
            "actualHours": 0,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now(),
            "completedAt": None
        }
        
        db.collection('tasks').document(task_id).set(task_data)
        
        # Add to vector DB
        text = f"Title: {title}\nDescription: {task_data['description']}"
        embedding = await embedding_service.generate_embedding(text)
        await vector_service.add_task_embedding(
            task_id=task_id,
            user_id=user_id,
            text=text,
            embedding=embedding,
            metadata={"priority": task_data["priority"], "status": task_data["status"], "dueDate": task_data["dueDate"]}
        )
        print(f"  ✓ Task {i+1}/15")
    
    # Generate calendar events
    print(f"\nGenerating 10 mock calendar events for {email}...")
    event_titles = [
        "Sprint Planning",
        "Daily Standup",
        "Client Demo",
        "Team Retrospective",
        "1-on-1 with Manager",
    ]
    
    for i in range(10):
        event_id = f"cal_{user_id}_{i+1:05d}"
        title = random.choice(event_titles)
        
        event_data = {
            "eventId": event_id,
            "userId": user_id,
            "title": title,
            "description": f"Description for {title}",
            "startTime": datetime.now() + timedelta(days=random.randint(-2, 7)),
            "endTime": datetime.now() + timedelta(days=random.randint(-2, 7), hours=1),
            "location": random.choice(["Conference Room A", "Zoom", "Teams"]),
            "meetingLink": "https://zoom.us/j/123456789",
            "status": "confirmed",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        
        db.collection('calendar_events').document(event_id).set(event_data)
        
        # Add to vector DB
        text = f"Title: {title}\nDescription: {event_data['description']}"
        embedding = await embedding_service.generate_embedding(text)
        await vector_service.add_event_embedding(
            event_id=event_id,
            user_id=user_id,
            text=text,
            embedding=embedding,
            metadata={"startTime": event_data["startTime"]}
        )
        print(f"  ✓ Event {i+1}/10")
    
    print("\n" + "=" * 60)
    print("✓ Mock data generation complete!")
    print("=" * 60)
    print(f"\nGenerated data for: {email}")
    print(f"User ID: {user_id}")
    print("\nRefresh your app and try asking:")
    print('  - "What urgent emails do I have?"')
    print('  - "Show me my tasks"')
    print('  - "What meetings do I have this week?"')

async def main():
    print("=" * 60)
    print("Generate Mock Data for Current User")
    print("=" * 60)
    
    # Get email from user
    email = input("\nEnter your email (the one you logged in with): ").strip()
    
    if not email:
        print("Error: Email is required")
        return
    
    # Initialize Firebase
    db = init_firebase()
    
    # Generate data
    await generate_data_for_email(db, email)

if __name__ == "__main__":
    asyncio.run(main())
