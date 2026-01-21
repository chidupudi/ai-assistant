"""
Mock Data Generator for Employee Work Assistant
Generates sample emails, tasks, and calendar events for demo purposes
"""

import firebase_admin
from firebase_admin import credentials, firestore
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
        # Load credentials from JSON file
        if os.path.exists(settings.FIREBASE_SERVICE_ACCOUNT_PATH):
            cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
        else:
            raise FileNotFoundError(f"Firebase service account file not found: {settings.FIREBASE_SERVICE_ACCOUNT_PATH}")
        firebase_admin.initialize_app(cred)
    return firestore.client()


async def generate_mock_emails(db, user_id: str, count: int = 20):
    """Generate mock emails"""
    print(f"\nGenerating {count} mock emails...")
    
    senders = [
        {"name": "Jane Smith", "email": "jane.smith@company.com"},
        {"name": "Bob Johnson", "email": "bob.j@company.com"},
        {"name": "HR Department", "email": "hr@company.com"},
        {"name": "Sarah Williams", "email": "sarah.w@company.com"},
        {"name": "Mike Chen", "email": "mike.chen@company.com"},
    ]
    
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
    
    bodies = [
        "Hi, We need to review the Q1 budget and finalize the numbers by end of week. Please review the attached spreadsheet and provide your feedback.",
        "Great work team! Sprint 23 is complete. Let's discuss the retrospective findings in our next meeting.",
        "This is a reminder that benefits enrollment closes this Friday. Please make sure to complete your selections.",
        "We're having a team lunch next Friday at 12:30 PM. Please RSVP so we can make reservations.",
        "I've submitted PR #234 for the new authentication feature. Could you please review when you get a chance?",
        "Following up on our client meeting yesterday. We need to send them the proposal by Wednesday.",
        "Your performance review is scheduled for next week. Please complete the self-assessment form.",
        "Please review the new security policy document and acknowledge that you've read it.",
        "Here's the agenda for our weekly sync. Let me know if you want to add anything.",
        "URGENT: We'll be performing server maintenance tonight from 10 PM to 2 AM. Please save your work.",
    ]
    
    for i in range(count):
        email_id = f"email_{i+1:05d}"
        sender = random.choice(senders)
        subject = random.choice(subjects)
        body = random.choice(bodies)
        
        received_at = datetime.now() - timedelta(hours=random.randint(1, 72))
        priority = random.choice(["high", "high", "medium", "medium", "medium", "low"])
        
        email_data = {
            "emailId": email_id,
            "userId": user_id,
            "subject": subject,
            "sender": sender,
            "body": body,
            "bodyPreview": body[:150] + "...",
            "receivedAt": received_at,
            "priority": priority,
            "isRead": random.choice([True, False]),
            "isStarred": False,
            "labels": random.sample(["work", "urgent", "review", "info", "action-required"], k=random.randint(1, 3)),
            "extractedActions": ["Review document", "Provide feedback"] if priority == "high" else [],
            "createdAt": received_at
        }
        
        # Save to Firestore
        db.collection('emails').document(email_id).set(email_data)
        
        # Generate embedding and save to ChromaDB
        text_to_embed = f"Subject: {subject}\nFrom: {sender['name']} ({sender['email']})\nBody: {body}"
        embedding = await embedding_service.generate_embedding(text_to_embed)
        
        await vector_service.add_email_embedding(
            email_id=email_id,
            user_id=user_id,
            text=text_to_embed,
            embedding=embedding,
            metadata={
                "priority": priority,
                "sender": sender['email'],
                "receivedAt": received_at,
                "labels": email_data['labels']
            }
        )
        
        print(f"  Created email: {email_id} - {subject[:50]}...")
    
    print(f"✓ Generated {count} emails")

async def generate_mock_tasks(db, user_id: str, count: int = 15):
    """Generate mock tasks"""
    print(f"\nGenerating {count} mock tasks...")
    
    task_titles = [
        "Complete API documentation for v2 endpoints",
        "Review and merge pending pull requests",
        "Update project timeline and milestones",
        "Prepare presentation for client meeting",
        "Fix critical bug in payment processing",
        "Conduct code review for authentication module",
        "Write unit tests for new features",
        "Update dependencies and security patches",
        "Create user guide for new dashboard",
        "Optimize database queries for performance",
        "Schedule team retrospective meeting",
        "Review Q1 performance metrics",
        "Update CI/CD pipeline configuration",
        "Refactor legacy codebase modules",
        "Implement new feature requests from backlog",
    ]
    
    for i in range(count):
        task_id = f"task_{i+1:05d}"
        title = task_titles[i % len(task_titles)]
        
        due_date = datetime.now() + timedelta(days=random.randint(-2, 14))
        priority = random.choice(["high", "medium", "medium", "low"])
        status = random.choice(["pending", "in_progress", "in_progress", "completed"])
        
        task_data = {
            "taskId": task_id,
            "userId": user_id,
            "title": title,
            "description": f"Description for {title}",
            "dueDate": due_date,
            "priority": priority,
            "status": status,
            "category": random.choice(["development", "documentation", "meeting", "review"]),
            "tags": random.sample(["api", "documentation", "backend", "frontend", "testing"], k=random.randint(1, 3)),
            "estimatedHours": random.randint(2, 8),
            "actualHours": random.randint(1, 6) if status == "completed" else 0,
            "createdAt": datetime.now() - timedelta(days=random.randint(1, 30)),
            "updatedAt": datetime.now() - timedelta(hours=random.randint(1, 48)),
            "completedAt": datetime.now() - timedelta(days=random.randint(1, 5)) if status == "completed" else None
        }
        
        # Save to Firestore
        db.collection('tasks').document(task_id).set(task_data)
        
        # Generate embedding and save to ChromaDB
        text_to_embed = f"Title: {title}\nDescription: {task_data['description']}\nCategory: {task_data['category']}"
        embedding = await embedding_service.generate_embedding(text_to_embed)
        
        await vector_service.add_task_embedding(
            task_id=task_id,
            user_id=user_id,
            text=text_to_embed,
            embedding=embedding,
            metadata={
                "priority": priority,
                "status": status,
                "dueDate": due_date
            }
        )
        
        print(f"  Created task: {task_id} - {title[:50]}...")
    
    print(f"✓ Generated {count} tasks")

async def generate_mock_events(db, user_id: str, count: int = 10):
    """Generate mock calendar events"""
    print(f"\nGenerating {count} mock calendar events...")
    
    event_titles = [
        "Sprint Planning - Sprint 24",
        "Daily Standup",
        "Client Demo Presentation",
        "Team Retrospective",
        "1-on-1 with Manager",
        "Architecture Review Meeting",
        "Product Roadmap Discussion",
        "Security Training Session",
        "Department All-Hands",
        "Code Review Session",
    ]
    
    for i in range(count):
        event_id = f"cal_{i+1:05d}"
        title = event_titles[i % len(event_titles)]
        
        start_time = datetime.now() + timedelta(days=random.randint(-2, 7), hours=random.randint(9, 16))
        end_time = start_time + timedelta(hours=random.randint(1, 2))
        
        event_data = {
            "eventId": event_id,
            "userId": user_id,
            "title": title,
            "description": f"Description for {title}",
            "startTime": start_time,
            "endTime": end_time,
            "location": random.choice(["Conference Room A", "Conference Room B", "Zoom", "Teams", "Office"]),
            "meetingLink": "https://zoom.us/j/123456789" if random.choice([True, False]) else None,
            "status": "confirmed",
            "createdAt": datetime.now() - timedelta(days=random.randint(1, 14)),
            "updatedAt": datetime.now() - timedelta(hours=random.randint(1, 24))
        }
        
        # Save to Firestore
        db.collection('calendar_events').document(event_id).set(event_data)
        
        # Generate embedding and save to ChromaDB
        text_to_embed = f"Title: {title}\nDescription: {event_data['description']}\nLocation: {event_data['location']}"
        embedding = await embedding_service.generate_embedding(text_to_embed)
        
        await vector_service.add_event_embedding(
            event_id=event_id,
            user_id=user_id,
            text=text_to_embed,
            embedding=embedding,
            metadata={
                "startTime": start_time
            }
        )
        
        print(f"  Created event: {event_id} - {title[:50]}...")
    
    print(f"✓ Generated {count} events")

async def create_test_user(db, user_id: str):
    """Create test user document"""
    print(f"\nCreating test user: {user_id}...")
    
    user_data = {
        "userId": user_id,
        "email": "test@company.com",
        "name": "Test User",
        "department": "Engineering",
        "timezone": "America/New_York",
        "createdAt": datetime.now(),
        "lastActive": datetime.now()
    }
    
    db.collection('users').document(user_id).set(user_data)
    print(f"✓ Created user: {user_id}")

async def main():
    print("=" * 60)
    print("Employee Work Assistant - Mock Data Generator")
    print("=" * 60)
    
    # Initialize Firebase
    db = init_firebase()
    
    # Test user ID
    user_id = "test_user_001"
    
    # Create test user
    await create_test_user(db, user_id)
    
    # Generate mock data
    await generate_mock_emails(db, user_id, count=20)
    await generate_mock_tasks(db, user_id, count=15)
    await generate_mock_events(db, user_id, count=10)
    
    print("\n" + "=" * 60)
    print("✓ Mock data generation complete!")
    print("=" * 60)
    print(f"\nTest User ID: {user_id}")
    print("You can now use this user ID to test the application.")

if __name__ == "__main__":
    asyncio.run(main())
