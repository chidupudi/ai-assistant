# Personal Employee Work Assistant - System Architecture

> **Tech Stack**: React TypeScript + Firebase + ChromaDB + Python (FastAPI)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Component Details](#4-component-details)
5. [Firebase Schema](#5-firebase-schema)
6. [Vector Database Strategy](#6-vector-database-strategy)
7. [API Endpoints](#7-api-endpoints)
8. [Chat Request Flow](#8-chat-request-flow)
9. [Implementation Guide](#9-implementation-guide)
10. [Security & Privacy](#10-security--privacy)
11. [Deployment Strategy](#11-deployment-strategy)
12. [Scalability Considerations](#12-scalability-considerations)

---

## 1. Executive Summary

A privacy-first productivity copilot that helps employees manage:
- Email summaries and urgent items
- Calendar events and meetings
- Tasks and deadlines
- Natural language queries via chat interface

**Key Features**:
- RAG (Retrieval-Augmented Generation) approach
- Employee data stays in Firebase + ChromaDB
- Only minimal context sent to LLM
- Real-time updates
- Modular and scalable

---

## 2. Technology Stack

### Frontend
```
- Framework: React 18+ with TypeScript
- UI Library: shadcn/ui + Tailwind CSS
- State Management: Zustand or React Context
- Real-time: Firebase Realtime listeners
- Build Tool: Vite
- HTTP Client: Axios
```

### Backend
```
- Language: Python 3.11+
- Framework: FastAPI
- Async Runtime: asyncio + uvicorn
- Authentication: Firebase Admin SDK
- LLM Integration: OpenAI Python SDK / Anthropic SDK
```

### Databases
```
- Structured Data: Firebase Firestore
- Authentication: Firebase Auth
- Vector Database: ChromaDB (free, embedded or server mode)
- Embeddings: OpenAI text-embedding-3-small
```

### Infrastructure
```
- Backend Hosting: Railway / Render / Google Cloud Run
- Frontend Hosting: Vercel / Netlify / Firebase Hosting
- Vector DB: ChromaDB (local or Docker container)
- Background Jobs: Firebase Cloud Functions (Python)
```

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                           │
│                      React TypeScript + Vite                     │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │ Chat UI      │  │ Dashboard    │  │ Settings Panel     │   │
│  │ Component    │  │ (Email/Tasks)│  │                    │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Firebase SDK (Auth + Firestore listeners)        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ REST API + WebSocket
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                    PYTHON BACKEND (FastAPI)                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API Routes Layer                        │ │
│  │  /api/chat  |  /api/emails  |  /api/tasks  |  /api/sync   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                 Authentication Middleware                  │ │
│  │            (Firebase Admin SDK - Token Verification)       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    RAG Engine / Services                   │ │
│  │                                                            │ │
│  │  ┌──────────────────┐  ┌─────────────────────────────┐   │ │
│  │  │ Query Classifier │  │  Context Builder            │   │ │
│  │  │ (Intent Detection)  │  (Retrieval + Filtering)    │   │ │
│  │  └──────────────────┘  └─────────────────────────────┘   │ │
│  │                                                            │ │
│  │  ┌──────────────────┐  ┌─────────────────────────────┐   │ │
│  │  │ Embedding Service│  │  LLM Service                │   │ │
│  │  │ (OpenAI API)     │  │  (Prompt + Response)        │   │ │
│  │  └──────────────────┘  └─────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────┬──────────────────────┬────────────────────────────┘
               │                      │
               ↓                      ↓
┌──────────────────────────┐  ┌─────────────────────────────┐
│   Firebase Firestore     │  │    ChromaDB (Vector Store)  │
│   (Structured Data)      │  │    (Semantic Embeddings)    │
│                          │  │                             │
│  Collections:            │  │  Collections:               │
│  - users                 │  │  - employee_emails          │
│  - emails                │  │  - employee_tasks           │
│  - calendar_events       │  │  - employee_events          │
│  - tasks                 │  │                             │
│  - deadlines             │  │  Metadata filtering:        │
│  - conversations         │  │  - userId, type, date       │
└──────────────────────────┘  └─────────────────────────────┘

                         ↓
              ┌──────────────────────┐
              │   External LLM API   │
              │   (OpenAI GPT-4)     │
              │   (Anthropic Claude) │
              └──────────────────────┘
```

---

## 4. Component Details

### 4.1 Frontend Components (React TypeScript)

#### **Main Components**

```typescript
src/
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx       // Main chat UI
│   │   ├── MessageList.tsx         // Message history
│   │   ├── InputBox.tsx            // User input
│   │   └── TypingIndicator.tsx
│   ├── dashboard/
│   │   ├── EmailSummary.tsx        // Email cards
│   │   ├── CalendarView.tsx        // Calendar widget
│   │   ├── TaskList.tsx            // Task management
│   │   └── DeadlineTracker.tsx
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── ProtectedRoute.tsx
│   └── ui/                         // shadcn/ui components
├── contexts/
│   ├── AuthContext.tsx             // Firebase auth state
│   └── ChatContext.tsx             // Chat state management
├── services/
│   ├── api.ts                      // Backend API calls
│   ├── firebase.ts                 // Firebase config
│   └── realtime.ts                 // Firestore listeners
├── hooks/
│   ├── useAuth.ts
│   ├── useChat.ts
│   └── useFirestore.ts
└── lib/
    └── utils.ts
```

#### **Key Hooks Example**

```typescript
// hooks/useChat.ts
export const useChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    setLoading(true);
    try {
      const response = await api.post('/api/chat', {
        message: content,
        conversationId
      });
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};
```

### 4.2 Backend Services (Python FastAPI)

#### **Project Structure**

```python
backend/
├── app/
│   ├── main.py                     # FastAPI app initialization
│   ├── config.py                   # Environment config
│   ├── dependencies.py             # Auth dependencies
│   │
│   ├── api/
│   │   ├── routes/
│   │   │   ├── chat.py            # Chat endpoint
│   │   │   ├── emails.py          # Email CRUD
│   │   │   ├── tasks.py           # Task management
│   │   │   └── sync.py            # Data sync
│   │   └── middleware/
│   │       └── auth.py            # Firebase token verification
│   │
│   ├── services/
│   │   ├── rag_engine.py          # Main RAG orchestration
│   │   ├── query_classifier.py    # Intent detection
│   │   ├── context_builder.py     # Context assembly
│   │   ├── embedding_service.py   # Generate embeddings
│   │   ├── llm_service.py         # LLM API calls
│   │   ├── firebase_service.py    # Firestore operations
│   │   └── vector_service.py      # ChromaDB operations
│   │
│   ├── models/
│   │   ├── schemas.py             # Pydantic models
│   │   └── enums.py               # Enums (Priority, Status)
│   │
│   └── utils/
│       ├── logger.py
│       └── helpers.py
│
├── tests/
├── requirements.txt
├── Dockerfile
└── .env
```

#### **Main FastAPI App**

```python
# app/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import chat, emails, tasks
from app.api.middleware.auth import verify_firebase_token

app = FastAPI(title="Employee Work Assistant API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(emails.router, prefix="/api/emails", tags=["emails"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

---

## 5. Firebase Schema

### 5.1 Collection: `users`

```javascript
{
  "userId": "emp_12345",
  "email": "john.doe@company.com",
  "name": "John Doe",
  "department": "Engineering",
  "timezone": "America/New_York",
  "photoURL": "https://...",
  "preferences": {
    "workHours": {
      "start": "09:00",
      "end": "17:00"
    },
    "notifications": {
      "email": true,
      "urgent": true
    }
  },
  "createdAt": "2026-01-15T10:00:00Z",
  "lastActive": "2026-01-21T09:30:00Z"
}
```

### 5.2 Collection: `emails`

```javascript
{
  "emailId": "email_67890",
  "userId": "emp_12345",
  "threadId": "thread_456",
  "subject": "Q1 Budget Review Meeting",
  "sender": {
    "name": "Jane Smith",
    "email": "jane.smith@company.com"
  },
  "recipients": [
    "john.doe@company.com"
  ],
  "body": "Hi John, We need to review the Q1 budget...",
  "bodyPreview": "Hi John, We need to review...", // First 150 chars
  "receivedAt": "2026-01-21T08:30:00Z",
  "priority": "high", // high, medium, low
  "isRead": false,
  "isStarred": false,
  "labels": ["action-required", "budget"],
  "attachments": [
    {
      "name": "Q1_Budget.xlsx",
      "size": 245678,
      "type": "application/vnd.ms-excel"
    }
  ],
  "extractedActions": [
    "Review Q1 budget spreadsheet",
    "Provide feedback by Friday"
  ],
  "vectorId": "vec_email_67890",
  "createdAt": "2026-01-21T08:30:00Z"
}
```

### 5.3 Collection: `calendar_events`

```javascript
{
  "eventId": "cal_54321",
  "userId": "emp_12345",
  "title": "Sprint Planning - Sprint 23",
  "description": "Planning for next sprint, review backlog",
  "startTime": "2026-01-21T14:00:00Z",
  "endTime": "2026-01-21T15:30:00Z",
  "location": "Conference Room B",
  "meetingLink": "https://zoom.us/j/123456",
  "attendees": [
    {
      "email": "jane.smith@company.com",
      "name": "Jane Smith",
      "status": "accepted" // accepted, declined, tentative, pending
    }
  ],
  "reminders": [15, 60], // minutes before event
  "isRecurring": false,
  "recurringPattern": null,
  "status": "confirmed", // confirmed, cancelled, tentative
  "vectorId": "vec_cal_54321",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-20T11:00:00Z"
}
```

### 5.4 Collection: `tasks`

```javascript
{
  "taskId": "task_99887",
  "userId": "emp_12345",
  "title": "Complete API documentation for v2 endpoints",
  "description": "Document all new REST API endpoints with examples",
  "dueDate": "2026-01-21T17:00:00Z",
  "priority": "high", // high, medium, low
  "status": "in_progress", // pending, in_progress, completed, cancelled
  "category": "documentation", // development, documentation, meeting, review
  "tags": ["api", "documentation", "backend"],
  "estimatedHours": 4,
  "actualHours": 2.5,
  "relatedEmailId": "email_67890",
  "subtasks": [
    {
      "title": "Document GET endpoints",
      "completed": true
    },
    {
      "title": "Document POST endpoints",
      "completed": false
    }
  ],
  "vectorId": "vec_task_99887",
  "createdAt": "2026-01-19T09:00:00Z",
  "updatedAt": "2026-01-21T10:00:00Z",
  "completedAt": null
}
```

### 5.5 Collection: `deadlines`

```javascript
{
  "deadlineId": "dl_11223",
  "userId": "emp_12345",
  "title": "Q1 Performance Report Submission",
  "description": "Submit completed Q1 report to management",
  "dueDate": "2026-01-25T23:59:59Z",
  "category": "compliance", // project, compliance, review, financial
  "status": "upcoming", // upcoming, overdue, completed
  "importance": "critical", // critical, important, normal
  "associatedTaskIds": ["task_99887", "task_88776"],
  "notificationsSent": [
    "2026-01-18T09:00:00Z"
  ],
  "reminderSchedule": [-7, -3, -1, 0], // days before
  "vectorId": "vec_dl_11223",
  "createdAt": "2026-01-10T10:00:00Z"
}
```

### 5.6 Collection: `conversations`

```javascript
{
  "conversationId": "conv_55667",
  "userId": "emp_12345",
  "title": "Daily productivity check", // Auto-generated from first query
  "messages": [
    {
      "messageId": "msg_001",
      "role": "user",
      "content": "What emails need my attention today?",
      "timestamp": "2026-01-21T09:15:00Z"
    },
    {
      "messageId": "msg_002",
      "role": "assistant",
      "content": "You have 3 urgent emails that need attention...",
      "timestamp": "2026-01-21T09:15:05Z",
      "contextUsed": [
        {
          "type": "email",
          "id": "email_67890",
          "relevance": 0.95
        }
      ],
      "tokensUsed": 450
    }
  ],
  "createdAt": "2026-01-21T09:15:00Z",
  "lastMessageAt": "2026-01-21T09:15:05Z",
  "messageCount": 2
}
```

---

## 6. Vector Database Strategy

### 6.1 Why ChromaDB?

**Advantages**:
- **Free & Open Source**: No licensing costs
- **Easy Setup**: `pip install chromadb`
- **Embedded or Client-Server**: Start embedded, scale to server mode
- **Metadata Filtering**: Built-in filtering support
- **Python Native**: Excellent Python integration
- **Persistent Storage**: Saves to disk automatically
- **No Infrastructure Overhead**: Can run in same container as FastAPI

**Alternatives Considered**:
- **Qdrant**: Also free, but requires separate Docker container
- **Weaviate**: More complex setup
- **Pinecone**: Has free tier (1M vectors), but cloud-dependent

### 6.2 ChromaDB Setup

#### **Installation**

```bash
pip install chromadb
pip install chromadb-client  # For client-server mode
```

#### **Python Service Implementation**

```python
# app/services/vector_service.py
import chromadb
from chromadb.config import Settings
from typing import List, Dict
import os

class VectorService:
    def __init__(self):
        # Persistent storage
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="./chroma_db"
        ))

        # Create collections for different data types
        self.email_collection = self.client.get_or_create_collection(
            name="employee_emails",
            metadata={"hnsw:space": "cosine"}
        )
        self.task_collection = self.client.get_or_create_collection(
            name="employee_tasks"
        )
        self.event_collection = self.client.get_or_create_collection(
            name="employee_events"
        )

    async def add_email_embedding(
        self,
        email_id: str,
        user_id: str,
        text: str,
        embedding: List[float],
        metadata: Dict
    ):
        """Add email embedding to vector store"""
        self.email_collection.add(
            ids=[f"{user_id}_{email_id}"],
            embeddings=[embedding],
            metadatas=[{
                "userId": user_id,
                "emailId": email_id,
                "type": "email",
                "priority": metadata.get("priority", "medium"),
                "sender": metadata.get("sender", ""),
                "receivedAt": metadata.get("receivedAt", ""),
                "labels": ",".join(metadata.get("labels", []))
            }],
            documents=[text]  # Original text for reference
        )

    async def search_emails(
        self,
        user_id: str,
        query_embedding: List[float],
        filters: Dict = None,
        top_k: int = 5
    ):
        """Semantic search for emails"""
        where_filter = {"userId": user_id}

        # Add additional filters
        if filters:
            if "priority" in filters:
                where_filter["priority"] = filters["priority"]
            if "date_from" in filters:
                where_filter["receivedAt"] = {"$gte": filters["date_from"]}

        results = self.email_collection.query(
            query_embeddings=[query_embedding],
            where=where_filter,
            n_results=top_k
        )

        return results

    async def delete_user_data(self, user_id: str):
        """Delete all data for a user (GDPR compliance)"""
        # Delete from all collections
        for collection in [self.email_collection, self.task_collection, self.event_collection]:
            results = collection.get(where={"userId": user_id})
            if results['ids']:
                collection.delete(ids=results['ids'])
```

### 6.3 Embedding Generation

```python
# app/services/embedding_service.py
import openai
from typing import List
import os

class EmbeddingService:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.model = "text-embedding-3-small"  # 1536 dimensions

    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text"""
        # Truncate to max tokens (8191 for text-embedding-3-small)
        text = text[:30000]  # Rough char limit

        response = await openai.Embedding.acreate(
            model=self.model,
            input=text
        )

        return response['data'][0]['embedding']

    async def generate_batch_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        response = await openai.Embedding.acreate(
            model=self.model,
            input=texts
        )

        return [item['embedding'] for item in response['data']]
```

### 6.4 Data Sync Flow (Email Example)

```python
# Triggered when new email is added to Firestore
async def sync_email_to_vector_db(email_data: dict):
    """
    Cloud Function or background job that:
    1. Listens to Firestore email creation
    2. Generates embedding
    3. Stores in ChromaDB
    """
    embedding_service = EmbeddingService()
    vector_service = VectorService()

    # Prepare text for embedding
    text_to_embed = f"""
    Subject: {email_data['subject']}
    From: {email_data['sender']['name']} ({email_data['sender']['email']})
    Body: {email_data['bodyPreview']}
    """

    # Generate embedding
    embedding = await embedding_service.generate_embedding(text_to_embed)

    # Store in ChromaDB
    await vector_service.add_email_embedding(
        email_id=email_data['emailId'],
        user_id=email_data['userId'],
        text=text_to_embed,
        embedding=embedding,
        metadata={
            "priority": email_data['priority'],
            "sender": email_data['sender']['email'],
            "receivedAt": email_data['receivedAt'],
            "labels": email_data['labels']
        }
    )
```

---

## 7. API Endpoints

### 7.1 Authentication

All endpoints require Firebase JWT token in header:
```
Authorization: Bearer <firebase_jwt_token>
```

### 7.2 Endpoint List

#### **Chat Endpoints**

```python
POST   /api/chat
GET    /api/chat/conversations
GET    /api/chat/conversations/{conversation_id}
DELETE /api/chat/conversations/{conversation_id}
```

#### **Email Endpoints**

```python
GET    /api/emails                    # List user's emails
GET    /api/emails/{email_id}         # Get single email
PATCH  /api/emails/{email_id}         # Mark read/starred
GET    /api/emails/urgent             # Get urgent emails
POST   /api/emails/sync               # Trigger email sync (mock data)
```

#### **Task Endpoints**

```python
GET    /api/tasks                     # List user's tasks
POST   /api/tasks                     # Create task
PATCH  /api/tasks/{task_id}           # Update task
DELETE /api/tasks/{task_id}           # Delete task
GET    /api/tasks/overdue             # Get overdue tasks
```

#### **Calendar Endpoints**

```python
GET    /api/calendar/events           # List events
GET    /api/calendar/events/today     # Today's events
GET    /api/calendar/events/week      # This week's events
```

#### **Utility Endpoints**

```python
GET    /api/health                    # Health check
POST   /api/sync/all                  # Sync all data sources
GET    /api/user/profile              # Get user profile
```

### 7.3 Chat Endpoint Implementation

```python
# app/api/routes/chat.py
from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.rag_engine import RAGEngine
from app.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Handle chat request with RAG pipeline
    """
    try:
        rag_engine = RAGEngine(user_id=current_user['uid'])

        response = await rag_engine.process_query(
            query=request.message,
            conversation_id=request.conversation_id
        )

        return ChatResponse(**response)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 7.4 Pydantic Models

```python
# app/models/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    conversation_id: Optional[str] = None

class ContextSource(BaseModel):
    type: str  # email, task, event, deadline
    id: str
    title: str
    relevance: float

class ChatResponse(BaseModel):
    conversation_id: str
    response: str
    context_sources: List[ContextSource]
    timestamp: datetime
    tokens_used: int

class EmailSchema(BaseModel):
    email_id: str
    user_id: str
    subject: str
    sender: dict
    body_preview: str
    received_at: datetime
    priority: str
    is_read: bool
    labels: List[str]
```

---

## 8. Chat Request Flow

### 8.1 Complete Flow Diagram

```
User Query: "What urgent emails do I have today?"
     ↓
[1] Frontend sends POST /api/chat
     ↓
[2] Auth Middleware validates Firebase token → Extract user_id
     ↓
[3] Query Classifier analyzes intent
     ├─ Intent: email_query
     ├─ Urgency: high_priority
     └─ Time Range: today
     ↓
[4] Context Builder (Parallel Execution)
     ├─ Firebase Query: emails WHERE priority='high' AND receivedAt=today
     └─ Vector Search: Semantic search for "urgent" + metadata filter
     ↓
[5] Merge & Rank Results
     ├─ Deduplicate by email_id
     ├─ Sort by (relevance_score * priority_weight)
     └─ Select top 5-10 items
     ↓
[6] Build Context Payload
     ├─ System prompt (role, guidelines)
     ├─ User context (name, time, timezone)
     └─ Retrieved data (emails, metadata)
     ↓
[7] LLM Service constructs prompt & calls API
     ├─ OpenAI GPT-4-turbo API call
     └─ Temperature: 0.3, Max tokens: 500
     ↓
[8] Parse LLM Response
     ↓
[9] Save conversation to Firestore
     ├─ User message
     ├─ Assistant response
     └─ Context sources used
     ↓
[10] Return response to frontend
     └─ Display in chat UI
```

### 8.2 RAG Engine Implementation

```python
# app/services/rag_engine.py
from typing import Dict, List
from app.services.query_classifier import QueryClassifier
from app.services.context_builder import ContextBuilder
from app.services.llm_service import LLMService
from app.services.firebase_service import FirebaseService
import asyncio

class RAGEngine:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.classifier = QueryClassifier()
        self.context_builder = ContextBuilder(user_id)
        self.llm_service = LLMService()
        self.firebase_service = FirebaseService()

    async def process_query(
        self,
        query: str,
        conversation_id: str = None
    ) -> Dict:
        """Main RAG pipeline"""

        # Step 1: Classify query intent
        intent = await self.classifier.classify(query)

        # Step 2: Retrieve relevant context (parallel)
        context = await self.context_builder.build_context(
            query=query,
            intent=intent
        )

        # Step 3: Generate LLM response
        llm_response = await self.llm_service.generate_response(
            query=query,
            context=context,
            user_id=self.user_id
        )

        # Step 4: Save conversation
        conversation = await self.firebase_service.save_conversation(
            user_id=self.user_id,
            conversation_id=conversation_id,
            user_message=query,
            assistant_message=llm_response['response'],
            context_sources=context['sources']
        )

        return {
            "conversation_id": conversation['id'],
            "response": llm_response['response'],
            "context_sources": context['sources'],
            "timestamp": conversation['timestamp'],
            "tokens_used": llm_response['tokens_used']
        }
```

### 8.3 Query Classifier

```python
# app/services/query_classifier.py
import re
from typing import Dict
from datetime import datetime, timedelta

class QueryClassifier:
    def __init__(self):
        self.intent_patterns = {
            "email_query": [
                r"email",
                r"inbox",
                r"message",
                r"mail"
            ],
            "calendar_query": [
                r"meeting",
                r"calendar",
                r"schedule",
                r"appointment"
            ],
            "task_query": [
                r"task",
                r"todo",
                r"assignment",
                r"work"
            ],
            "deadline_query": [
                r"deadline",
                r"due",
                r"overdue"
            ]
        }

        self.urgency_keywords = ["urgent", "asap", "important", "critical", "high priority"]
        self.time_keywords = {
            "today": 0,
            "tomorrow": 1,
            "this week": 7,
            "next week": 14
        }

    async def classify(self, query: str) -> Dict:
        """Classify query intent and extract parameters"""
        query_lower = query.lower()

        # Detect intent
        detected_intents = []
        for intent, patterns in self.intent_patterns.items():
            if any(re.search(pattern, query_lower) for pattern in patterns):
                detected_intents.append(intent)

        # If no specific intent, it's a general query
        if not detected_intents:
            detected_intents = ["general_query"]

        # Detect urgency
        is_urgent = any(keyword in query_lower for keyword in self.urgency_keywords)

        # Detect time range
        time_range = None
        for keyword, days in self.time_keywords.items():
            if keyword in query_lower:
                time_range = {
                    "keyword": keyword,
                    "days": days,
                    "start": datetime.now().replace(hour=0, minute=0, second=0),
                    "end": datetime.now() + timedelta(days=days)
                }
                break

        return {
            "intents": detected_intents,
            "is_urgent": is_urgent,
            "time_range": time_range,
            "original_query": query
        }
```

### 8.4 Context Builder

```python
# app/services/context_builder.py
import asyncio
from typing import Dict, List
from app.services.firebase_service import FirebaseService
from app.services.vector_service import VectorService
from app.services.embedding_service import EmbeddingService

class ContextBuilder:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.firebase = FirebaseService()
        self.vector_db = VectorService()
        self.embedding_service = EmbeddingService()
        self.max_context_items = 10

    async def build_context(self, query: str, intent: Dict) -> Dict:
        """Build context from Firebase + Vector DB"""

        # Generate query embedding
        query_embedding = await self.embedding_service.generate_embedding(query)

        # Parallel retrieval
        tasks = []

        for intent_type in intent['intents']:
            if intent_type == "email_query":
                tasks.append(self._retrieve_emails(query_embedding, intent))
            elif intent_type == "task_query":
                tasks.append(self._retrieve_tasks(query_embedding, intent))
            elif intent_type == "calendar_query":
                tasks.append(self._retrieve_events(intent))

        # Execute all retrieval tasks in parallel
        results = await asyncio.gather(*tasks)

        # Merge and rank
        all_items = []
        for result in results:
            all_items.extend(result)

        # Sort by relevance
        all_items.sort(key=lambda x: x.get('relevance', 0), reverse=True)

        # Limit to max items
        top_items = all_items[:self.max_context_items]

        return {
            "items": top_items,
            "sources": [
                {
                    "type": item['type'],
                    "id": item['id'],
                    "title": item.get('subject') or item.get('title'),
                    "relevance": item.get('relevance', 1.0)
                }
                for item in top_items
            ],
            "intent": intent
        }

    async def _retrieve_emails(self, query_embedding: List[float], intent: Dict):
        """Retrieve relevant emails"""
        # Firebase structured query
        firebase_emails = await self.firebase.get_emails(
            user_id=self.user_id,
            filters={
                "priority": "high" if intent['is_urgent'] else None,
                "time_range": intent.get('time_range')
            },
            limit=5
        )

        # Vector semantic search
        vector_results = await self.vector_db.search_emails(
            user_id=self.user_id,
            query_embedding=query_embedding,
            filters={
                "priority": "high" if intent['is_urgent'] else None
            },
            top_k=5
        )

        # Merge results
        merged = self._merge_results(firebase_emails, vector_results, 'emailId')

        return merged

    def _merge_results(self, firebase_items: List, vector_results: Dict, id_field: str):
        """Merge Firebase and vector results, add relevance scores"""
        merged = {}

        # Add Firebase items
        for item in firebase_items:
            item['relevance'] = 0.5  # Base relevance
            item['type'] = 'email'
            merged[item[id_field]] = item

        # Enhance with vector scores
        if vector_results.get('ids'):
            for i, vec_id in enumerate(vector_results['ids'][0]):
                item_id = vec_id.split('_')[-1]  # Extract ID from "userId_emailId"

                if item_id in merged:
                    # Boost relevance with vector score
                    distance = vector_results['distances'][0][i]
                    similarity = 1 - distance  # Convert distance to similarity
                    merged[item_id]['relevance'] = max(merged[item_id]['relevance'], similarity)

        return list(merged.values())
```

### 8.5 LLM Service

```python
# app/services/llm_service.py
import openai
import os
from typing import Dict, List

class LLMService:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.model = "gpt-4-turbo-preview"

    async def generate_response(
        self,
        query: str,
        context: Dict,
        user_id: str
    ) -> Dict:
        """Generate LLM response using RAG context"""

        # Build system prompt
        system_prompt = self._build_system_prompt()

        # Build user prompt with context
        user_prompt = self._build_user_prompt(query, context)

        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )

        return {
            "response": response.choices[0].message.content,
            "tokens_used": response.usage.total_tokens
        }

    def _build_system_prompt(self) -> str:
        return """You are a helpful personal work assistant for an employee.

Your responsibilities:
- Summarize emails, tasks, and calendar events
- Identify urgent items and action points
- Provide clear, concise, and actionable information
- Prioritize based on importance and deadlines

Guidelines:
- Be professional but friendly
- Use bullet points for clarity
- Highlight urgent items with appropriate emphasis
- Always extract clear action items
- Keep responses under 300 words
- Do not make up information not in the context
"""

    def _build_user_prompt(self, query: str, context: Dict) -> str:
        """Build user prompt with retrieved context"""

        context_text = "Here is relevant information from the employee's data:\n\n"

        for item in context['items']:
            if item['type'] == 'email':
                context_text += f"""
📧 Email:
- Subject: {item.get('subject')}
- From: {item.get('sender', {}).get('name')} ({item.get('sender', {}).get('email')})
- Received: {item.get('receivedAt')}
- Priority: {item.get('priority')}
- Preview: {item.get('bodyPreview', '')[:200]}
- Action Items: {', '.join(item.get('extractedActions', []))}

"""
            elif item['type'] == 'task':
                context_text += f"""
📋 Task:
- Title: {item.get('title')}
- Due: {item.get('dueDate')}
- Priority: {item.get('priority')}
- Status: {item.get('status')}

"""

        return f"""User's question: "{query}"

{context_text}

Please provide a helpful response based on the above context."""
```

---

## 9. Implementation Guide

### 9.1 Project Setup

#### **Backend Setup**

```bash
# Create project directory
mkdir employee-assistant
cd employee-assistant

# Create backend
mkdir backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn[standard] firebase-admin chromadb openai python-dotenv pydantic

# Create requirements.txt
pip freeze > requirements.txt
```

#### **Frontend Setup**

```bash
# In project root
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install dependencies
npm install
npm install firebase axios zustand @tanstack/react-query
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card dialog
```

### 9.2 Environment Configuration

#### **Backend `.env`**

```bash
# backend/.env
FIREBASE_PROJECT_ID=delligent-8f6a2
FIREBASE_PRIVATE_KEY=your-private-key-from-service-account
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@delligent-8f6a2.iam.gserviceaccount.com

OPENAI_API_KEY=sk-your-openai-key

CHROMA_DB_PATH=./chroma_db

CORS_ORIGINS=http://localhost:5173,http://localhost:3000

LOG_LEVEL=INFO
```

#### **Frontend `.env`**

```bash
# frontend/.env
VITE_FIREBASE_API_KEY=AIzaSyA8OfLAIDxgSsZ7ZzOCd7EFaDaDvi_SmjY
VITE_FIREBASE_AUTH_DOMAIN=delligent-8f6a2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=delligent-8f6a2
VITE_FIREBASE_STORAGE_BUCKET=delligent-8f6a2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=923464161547
VITE_FIREBASE_APP_ID=1:923464161547:web:42e2c0121e1ec901046a0e
VITE_FIREBASE_MEASUREMENT_ID=G-L26VRZ15TG

VITE_API_BASE_URL=http://localhost:8000
```

### 9.3 Firebase Configuration

#### **Initialize Firebase (Frontend)**

```typescript
// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
```

#### **Initialize Firebase Admin (Backend)**

```python
# app/services/firebase_service.py
import firebase_admin
from firebase_admin import credentials, firestore, auth
import os

class FirebaseService:
    def __init__(self):
        if not firebase_admin._apps:
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            })
            firebase_admin.initialize_app(cred)

        self.db = firestore.client()

    async def get_user(self, user_id: str):
        """Get user document"""
        doc = self.db.collection('users').document(user_id).get()
        return doc.to_dict() if doc.exists else None
```

### 9.4 Mock Data Generator

```python
# scripts/generate_mock_data.py
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import random

# Initialize Firebase
cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def generate_mock_emails(user_id: str, count: int = 20):
    """Generate mock emails"""
    senders = [
        {"name": "Jane Smith", "email": "jane.smith@company.com"},
        {"name": "Bob Johnson", "email": "bob.j@company.com"},
        {"name": "HR Department", "email": "hr@company.com"},
    ]

    subjects = [
        "Q1 Budget Review Meeting",
        "Project Update - Sprint 23",
        "Benefits Enrollment Reminder",
        "Team Lunch Next Friday",
        "Code Review Request - PR #234"
    ]

    for i in range(count):
        email_id = f"email_{i:05d}"
        sender = random.choice(senders)
        subject = random.choice(subjects)

        email_data = {
            "emailId": email_id,
            "userId": user_id,
            "subject": subject,
            "sender": sender,
            "body": f"This is mock email body for {subject}...",
            "bodyPreview": f"This is mock email preview...",
            "receivedAt": datetime.now() - timedelta(hours=random.randint(1, 72)),
            "priority": random.choice(["high", "medium", "low"]),
            "isRead": random.choice([True, False]),
            "labels": random.sample(["work", "urgent", "review", "info"], k=2),
            "extractedActions": ["Review document", "Provide feedback"],
            "createdAt": datetime.now()
        }

        db.collection('emails').document(email_id).set(email_data)
        print(f"Created email: {email_id}")

# Run
generate_mock_emails("emp_12345", 20)
```

### 9.5 Running the Application

#### **Start Backend**

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### **Start Frontend**

```bash
cd frontend
npm run dev
```

---

## 10. Security & Privacy

### 10.1 Authentication Flow

```
1. User logs in via Firebase Auth (frontend)
   ↓
2. Firebase returns ID token (JWT)
   ↓
3. Frontend includes token in all API requests
   ↓
4. Backend middleware verifies token using Firebase Admin SDK
   ↓
5. Extract user_id from verified token
   ↓
6. Use user_id to query user-specific data
```

### 10.2 Backend Auth Middleware

```python
# app/api/middleware/auth.py
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
import logging

security = HTTPBearer()
logger = logging.getLogger(__name__)

async def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    """Verify Firebase ID token"""
    try:
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )

# Use as dependency
async def get_current_user(
    decoded_token: dict = Depends(verify_firebase_token)
) -> dict:
    """Get current user from token"""
    return {
        "uid": decoded_token['uid'],
        "email": decoded_token.get('email'),
        "name": decoded_token.get('name')
    }
```

### 10.3 Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /emails/{emailId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    match /tasks/{taskId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    match /calendar_events/{eventId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    match /conversations/{conversationId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### 10.4 Data Privacy Measures

1. **Minimal Context Principle**
   - Only send relevant excerpts to LLM, not full documents
   - Truncate email bodies to first 500 characters when possible
   - Use subject lines instead of full content when sufficient

2. **PII Redaction** (Future Enhancement)
   ```python
   import re

   def redact_pii(text: str) -> str:
       # Redact emails
       text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
                     '[EMAIL]', text)
       # Redact phone numbers
       text = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[PHONE]', text)
       # Redact SSNs
       text = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '[SSN]', text)
       return text
   ```

3. **Data Retention**
   - Implement automatic deletion of old conversations (>90 days)
   - Archive old emails, tasks (>12 months) to cold storage
   - GDPR compliance: User data deletion endpoint

4. **Audit Logging**
   ```python
   async def log_llm_call(user_id: str, query: str, context_ids: List[str]):
       """Log all LLM API calls for audit"""
       log_entry = {
           "userId": user_id,
           "timestamp": datetime.now(),
           "query_length": len(query),
           "context_items": len(context_ids),
           "context_ids": context_ids
       }
       db.collection('audit_logs').add(log_entry)
   ```

---

## 11. Deployment Strategy

### 11.1 Backend Deployment Options

#### **Option 1: Railway (Easiest)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and init
railway login
railway init

# Deploy
railway up
```

**railway.json**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### **Option 2: Google Cloud Run**

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

```bash
# Deploy
gcloud run deploy employee-assistant \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### **Option 3: Render**

**render.yaml**:
```yaml
services:
  - type: web
    name: employee-assistant-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### 11.2 ChromaDB Deployment

#### **Embedded Mode (Development)**
```python
# Runs in same process as FastAPI
client = chromadb.Client(Settings(
    persist_directory="./chroma_db"
))
```

#### **Server Mode (Production)**

```dockerfile
# docker-compose.yml
version: '3.8'

services:
  chromadb:
    image: ghcr.io/chroma-core/chroma:latest
    ports:
      - "8001:8000"
    volumes:
      - chroma_data:/chroma/chroma
    environment:
      - ANONYMIZED_TELEMETRY=False

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - chromadb
    environment:
      - CHROMA_HOST=chromadb
      - CHROMA_PORT=8000

volumes:
  chroma_data:
```

```python
# Connect to server
client = chromadb.HttpClient(
    host=os.getenv("CHROMA_HOST", "localhost"),
    port=os.getenv("CHROMA_PORT", "8001")
)
```

### 11.3 Frontend Deployment

#### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

#### **Firebase Hosting**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Init
firebase init hosting

# Build and deploy
npm run build
firebase deploy --only hosting
```

### 11.4 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 12. Scalability Considerations

### 12.1 Current Architecture Limits

| Component | Current Limit | Notes |
|-----------|--------------|-------|
| Firebase Firestore | 1M reads/day (free) | Pay-as-you-go beyond |
| ChromaDB | ~10K vectors (embedded) | Use server mode for more |
| OpenAI API | Rate limited | Tier-based limits |
| FastAPI | ~1K concurrent (single instance) | Scale horizontally |

### 12.2 Scaling Strategies

#### **Database Scaling**

1. **Firebase**: Auto-scales, pay for usage
2. **ChromaDB**:
   - Embedded mode: Single machine, ~100K vectors
   - Server mode: Multi-node, millions of vectors
   - Alternative: Migrate to Pinecone/Qdrant for >1M vectors

#### **Backend Scaling**

1. **Horizontal Scaling**: Deploy multiple FastAPI instances behind load balancer
2. **Caching**: Add Redis for frequent queries
   ```python
   import redis
   from functools import wraps

   redis_client = redis.Redis(host='localhost', port=6379)

   def cache_response(expiry=300):
       def decorator(func):
           @wraps(func)
           async def wrapper(*args, **kwargs):
               cache_key = f"{func.__name__}:{str(args)}"
               cached = redis_client.get(cache_key)

               if cached:
                   return json.loads(cached)

               result = await func(*args, **kwargs)
               redis_client.setex(cache_key, expiry, json.dumps(result))
               return result
           return wrapper
       return decorator
   ```

3. **Background Jobs**: Use Celery for async tasks
   ```python
   from celery import Celery

   celery_app = Celery('tasks', broker='redis://localhost:6379')

   @celery_app.task
   def generate_embeddings_async(email_id):
       # Generate embeddings in background
       pass
   ```

#### **LLM Optimization**

1. **Response Caching**: Cache common queries
2. **Batch Processing**: Group similar queries
3. **Model Selection**:
   - Use GPT-3.5-turbo for simple queries (cheaper, faster)
   - Use GPT-4 only for complex reasoning
4. **Fallback Strategy**: Multiple LLM providers (OpenAI → Anthropic → Local model)

### 12.3 Cost Estimation (1000 Users)

```
Assumptions:
- 1000 active users
- 10 queries/user/day = 10,000 queries/day
- 5 emails/user/day = 5,000 new documents/day

Monthly Costs:
├─ Firebase Firestore
│  ├─ Reads: 10K queries * 5 docs * 30 days = 1.5M reads
│  ├─ Writes: 5K docs * 30 days = 150K writes
│  └─ Cost: ~$5-10/month
│
├─ OpenAI API
│  ├─ Embeddings: 5K * 30 = 150K embeddings * $0.0001/1K = $15
│  ├─ GPT-4: 10K * 30 = 300K calls * $0.03/1K tokens * 500 tokens avg = $4,500
│  │  (Optimize: Use GPT-3.5 for 70% → ~$1,500)
│  └─ Cost: ~$1,500-4,500/month
│
├─ ChromaDB (Self-hosted)
│  └─ Server cost: $50-100/month (DigitalOcean/Railway)
│
├─ Backend Hosting (Railway/Cloud Run)
│  └─ Cost: $20-50/month
│
└─ Total: ~$1,600-4,700/month

Cost per user: $1.60-4.70/month
```

### 12.4 Future Enhancements

#### **Phase 2 Features**
- [ ] Multi-modal support (document analysis, image recognition)
- [ ] Proactive notifications ("Meeting in 15 min, here's prep")
- [ ] Email draft generation
- [ ] Voice interface
- [ ] Mobile app (React Native)

#### **Phase 3 Features**
- [ ] Team collaboration (shared tasks, delegation)
- [ ] Analytics dashboard (productivity insights)
- [ ] Third-party integrations (Slack, Jira, GitHub)
- [ ] Custom workflows and automation
- [ ] Offline mode with local caching

---

## 13. Sample Code: Complete Chat Flow

```python
# Example: Complete chat request handling

from fastapi import FastAPI, Depends
from app.services.rag_engine import RAGEngine
from app.dependencies import get_current_user

app = FastAPI()

@app.post("/api/chat")
async def chat_endpoint(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    User: "What urgent emails do I have today?"

    Flow:
    1. Verify user authentication ✓
    2. Initialize RAG engine
    3. Classify query intent → email_query, urgent, today
    4. Retrieve from Firebase → 3 high-priority emails
    5. Retrieve from ChromaDB → 5 semantically similar
    6. Merge → Top 5 emails
    7. Build prompt with context
    8. Call OpenAI GPT-4
    9. Parse response
    10. Save conversation to Firestore
    11. Return response
    """

    # Initialize RAG engine with user context
    rag = RAGEngine(user_id=current_user['uid'])

    # Process query through RAG pipeline
    response = await rag.process_query(
        query=request.message,
        conversation_id=request.conversation_id
    )

    # Response structure:
    # {
    #   "conversation_id": "conv_55667",
    #   "response": "You have 3 urgent emails today:\n\n1. ...",
    #   "context_sources": [
    #     {"type": "email", "id": "email_67890", "title": "Q1 Budget", "relevance": 0.95}
    #   ],
    #   "timestamp": "2026-01-21T09:15:30Z",
    #   "tokens_used": 450
    # }

    return response
```

---

## 14. Quick Start Guide

### Step-by-Step Setup (30 minutes)

1. **Firebase Setup** (5 min)
   ```bash
   # Go to Firebase Console → Create project
   # Enable Authentication (Email/Password)
   # Create Firestore database
   # Download service account key
   ```

2. **Backend Setup** (10 min)
   ```bash
   git clone <your-repo>
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt

   # Add .env file with Firebase + OpenAI keys
   uvicorn app.main:app --reload
   ```

3. **Frontend Setup** (10 min)
   ```bash
   cd frontend
   npm install
   # Add .env with Firebase config
   npm run dev
   ```

4. **Generate Mock Data** (5 min)
   ```bash
   python scripts/generate_mock_data.py
   ```

5. **Test** (5 min)
   - Open http://localhost:5173
   - Login with test account
   - Send query: "What emails need my attention?"

---

## 15. Troubleshooting

### Common Issues

#### **ChromaDB Connection Error**
```python
# Error: Cannot connect to ChromaDB
# Solution: Ensure ChromaDB is initialized correctly
client = chromadb.Client(Settings(
    persist_directory="./chroma_db",
    chroma_db_impl="duckdb+parquet"
))
```

#### **Firebase Token Verification Fails**
```python
# Error: Invalid token
# Solution: Check token is sent in Authorization header
# Frontend: axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
```

#### **CORS Error**
```python
# Solution: Add frontend URL to CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 16. Monitoring & Logging

```python
# app/utils/logger.py
import logging
from logging.handlers import RotatingFileHandler

def setup_logger():
    logger = logging.getLogger("employee_assistant")
    logger.setLevel(logging.INFO)

    handler = RotatingFileHandler(
        "logs/app.log",
        maxBytes=10_000_000,
        backupCount=5
    )

    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger

logger = setup_logger()

# Usage
logger.info(f"Chat query processed: user_id={user_id}, tokens={tokens}")
logger.error(f"LLM API error: {error}")
```

---

## 17. Summary

### Architecture Highlights

✅ **Modular Design**: Clear separation of concerns (UI, API, RAG, Data)
✅ **Privacy-First**: Data stays in Firebase/ChromaDB, minimal LLM exposure
✅ **Scalable**: Horizontal scaling, caching, async processing
✅ **Cost-Effective**: Free tiers for development, predictable costs at scale
✅ **Developer-Friendly**: Python + TypeScript, well-documented APIs

### Key Technologies

- **Frontend**: React TypeScript + Vite + shadcn/ui
- **Backend**: Python FastAPI + Firebase Admin SDK
- **Vector DB**: ChromaDB (free, embedded or server mode)
- **LLM**: OpenAI GPT-4 / GPT-3.5-turbo
- **Database**: Firebase Firestore + Firebase Auth

### Next Steps

1. Set up Firebase project
2. Implement core RAG pipeline
3. Build chat interface
4. Generate mock data
5. Test end-to-end flow
6. Deploy to production (Railway + Vercel)
7. Monitor and optimize

---

**Document Version**: 1.0
**Last Updated**: 2026-01-21
**Author**: System Architect
**Tech Stack**: React TS + Firebase + ChromaDB + Python FastAPI

---
