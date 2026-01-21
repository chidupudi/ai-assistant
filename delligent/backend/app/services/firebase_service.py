import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth
from app.config import settings
from typing import Optional, Dict, List
from datetime import datetime
import os

class FirebaseService:
    def __init__(self):
        if not firebase_admin._apps:
            # Load credentials from JSON file
            if os.path.exists(settings.FIREBASE_SERVICE_ACCOUNT_PATH):
                cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
            else:
                raise FileNotFoundError(f"Firebase service account file not found: {settings.FIREBASE_SERVICE_ACCOUNT_PATH}")
            
            firebase_admin.initialize_app(cred)
        
        self.db = firestore.client()

    
    async def get_user(self, user_id: str) -> Optional[Dict]:
        """Get user document"""
        doc = self.db.collection('users').document(user_id).get()
        return doc.to_dict() if doc.exists else None
    
    async def get_emails(
        self, 
        user_id: str, 
        filters: Optional[Dict] = None,
        limit: int = 10
    ) -> List[Dict]:
        """Get user emails with optional filters"""
        query = self.db.collection('emails').where('userId', '==', user_id)
        
        if filters:
            if filters.get('priority'):
                query = query.where('priority', '==', filters['priority'])
            if filters.get('time_range'):
                time_range = filters['time_range']
                if time_range.get('start'):
                    query = query.where('receivedAt', '>=', time_range['start'])
        
        query = query.limit(limit).order_by('receivedAt', direction=firestore.Query.DESCENDING)
        
        docs = query.stream()
        return [doc.to_dict() for doc in docs]
    
    async def get_tasks(
        self,
        user_id: str,
        filters: Optional[Dict] = None,
        limit: int = 10
    ) -> List[Dict]:
        """Get user tasks with optional filters"""
        query = self.db.collection('tasks').where('userId', '==', user_id)
        
        if filters:
            if filters.get('status'):
                query = query.where('status', '==', filters['status'])
            if filters.get('priority'):
                query = query.where('priority', '==', filters['priority'])
        
        query = query.limit(limit)
        docs = query.stream()
        return [doc.to_dict() for doc in docs]
    
    async def get_calendar_events(
        self,
        user_id: str,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 10
    ) -> List[Dict]:
        """Get user calendar events"""
        query = self.db.collection('calendar_events').where('userId', '==', user_id)
        
        if start_time:
            query = query.where('startTime', '>=', start_time)
        if end_time:
            query = query.where('startTime', '<=', end_time)
        
        query = query.limit(limit).order_by('startTime')
        docs = query.stream()
        return [doc.to_dict() for doc in docs]
    
    async def save_conversation(
        self,
        user_id: str,
        conversation_id: Optional[str],
        user_message: str,
        assistant_message: str,
        context_sources: List[Dict]
    ) -> Dict:
        """Save conversation to Firestore"""
        timestamp = datetime.now()
        
        if conversation_id:
            # Update existing conversation
            conv_ref = self.db.collection('conversations').document(conversation_id)
            conv_doc = conv_ref.get()
            
            if conv_doc.exists:
                messages = conv_doc.to_dict().get('messages', [])
                messages.extend([
                    {
                        "messageId": f"msg_{len(messages) + 1:03d}",
                        "role": "user",
                        "content": user_message,
                        "timestamp": timestamp
                    },
                    {
                        "messageId": f"msg_{len(messages) + 2:03d}",
                        "role": "assistant",
                        "content": assistant_message,
                        "timestamp": timestamp,
                        "contextUsed": context_sources
                    }
                ])
                
                conv_ref.update({
                    "messages": messages,
                    "lastMessageAt": timestamp,
                    "messageCount": len(messages)
                })
                
                return {
                    "id": conversation_id,
                    "timestamp": timestamp
                }
        
        # Create new conversation
        conv_ref = self.db.collection('conversations').document()
        conversation_data = {
            "conversationId": conv_ref.id,
            "userId": user_id,
            "title": user_message[:50] + "..." if len(user_message) > 50 else user_message,
            "messages": [
                {
                    "messageId": "msg_001",
                    "role": "user",
                    "content": user_message,
                    "timestamp": timestamp
                },
                {
                    "messageId": "msg_002",
                    "role": "assistant",
                    "content": assistant_message,
                    "timestamp": timestamp,
                    "contextUsed": context_sources
                }
            ],
            "createdAt": timestamp,
            "lastMessageAt": timestamp,
            "messageCount": 2
        }
        
        conv_ref.set(conversation_data)
        
        return {
            "id": conv_ref.id,
            "timestamp": timestamp
        }

firebase_service = FirebaseService()
