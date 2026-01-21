# Employee Work Assistant - Demo Application

> **RAG-powered personal work assistant for employees**

A demo-level implementation of an AI-powered work assistant that helps employees manage emails, tasks, and calendar events through natural language chat interface using Retrieval-Augmented Generation (RAG).

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Python FastAPI
- **Vector Database**: Pinecone (serverless)
- **LLM**: Google Gemini Pro
- **Embeddings**: Google Gemini Embeddings (768 dimensions)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth


## 📁 Project Structure

```
delligent/
├── backend/
│   ├── app/
│   │   ├── api/              # API routes and middleware
│   │   ├── services/         # Core services (RAG, Firebase, Vector DB)
│   │   ├── models/           # Pydantic schemas
│   │   ├── config.py         # Configuration
│   │   └── main.py           # FastAPI app
│   ├── scripts/
│   │   └── generate_mock_data.py  # Mock data generator
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/       # React components
    │   ├── services/         # API and Firebase clients
    │   └── App.tsx
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Firebase project (already configured: `delligent-8f6a2`)
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))
- Pinecone API key ([Sign up here](https://app.pinecone.io/))

### 1. Firebase Setup

✅ **Already Done!** Your Firebase project is configured:
- Project ID: `delligent-8f6a2`
- Service account: `service-accnt.json`

**You still need to:**
1. Go to [Firebase Console](https://console.firebase.google.com/project/delligent-8f6a2)
2. Enable **Authentication** → Email/Password provider
3. Create a **Firestore Database** (if not already created)
   - Start in test mode for development

### 2. Get API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

#### Pinecone API Key
1. Visit [Pinecone Console](https://app.pinecone.io/)
2. Sign up for free account
3. Create a new project
4. Copy your API key and environment (e.g., `us-east-1`)


### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Edit .env file and add your API keys
# The file already has FIREBASE_SERVICE_ACCOUNT_PATH configured
# You just need to add:
# - GEMINI_API_KEY
# - PINECONE_API_KEY
# - PINECONE_ENVIRONMENT
```

Your `.env` should look like:
```bash
FIREBASE_SERVICE_ACCOUNT_PATH=./service-accnt.json
GEMINI_API_KEY=your-gemini-api-key-here
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=employee-assistant
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```


### 4. Generate Mock Data

```bash
# Make sure you're in the backend directory with venv activated
python scripts/generate_mock_data.py
```

This will create:
- 20 mock emails
- 15 mock tasks  
- 10 mock calendar events
- Embeddings using Google Gemini
- Vectors stored in Pinecone
- Test user: `test_user_001`

**Note**: First run will create the Pinecone index automatically (takes ~1 minute).


### 4. Start Backend Server

```bash
# In backend directory with venv activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### 5. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Install additional dependencies
npm install firebase axios

# Create .env file
# Add your Firebase config:
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# VITE_FIREBASE_PROJECT_ID=...
# VITE_FIREBASE_STORAGE_BUCKET=...
# VITE_FIREBASE_MESSAGING_SENDER_ID=...
# VITE_FIREBASE_APP_ID=...
# VITE_API_BASE_URL=http://localhost:8000
```

### 6. Start Frontend

```bash
# In frontend directory
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 🔑 Environment Variables

### Backend (.env)

```bash
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./service-accnt.json

# Google Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=employee-assistant

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Server Configuration
LOG_LEVEL=INFO
```


### Frontend (.env)

```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_API_BASE_URL=http://localhost:8000
```

## 📡 API Endpoints

### Chat
- `POST /api/chat` - Send chat message
- `GET /api/chat/conversations` - List conversations
- `GET /api/chat/conversations/{id}` - Get conversation

### Emails
- `GET /api/emails` - List emails
- `GET /api/emails/urgent` - Get urgent emails
- `GET /api/emails/{id}` - Get single email

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/{id}` - Update task

### Health
- `GET /health` - Health check

## 🧪 Testing

### Test Chat Queries

Once the application is running, try these queries:

1. **"What urgent emails do I have today?"**
2. **"Show me my tasks for this week"**
3. **"What meetings do I have tomorrow?"**
4. **"Summarize my high priority items"**
5. **"What action items do I need to complete?"**

## 🔧 How It Works

### RAG Pipeline

1. **Query Classification**: Detect intent (email/task/calendar), urgency, time range
2. **Context Retrieval**: 
   - Structured query from Firebase Firestore
   - Semantic search from ChromaDB vector database
3. **Context Merging**: Combine and rank results by relevance
4. **LLM Generation**: Send context + query to OpenAI GPT
5. **Response**: Return AI-generated response with sources

### Data Flow

```
User Query → FastAPI → Query Classifier
                    ↓
            Context Builder (Firebase + ChromaDB)
                    ↓
            LLM Service (OpenAI GPT)
                    ↓
            Save to Firestore
                    ↓
            Return Response
```

## ⚠️ Important Notes

### This is a DEMO Implementation

- **Not production-ready**
- Using Pinecone free tier (1 index, 100K vectors)
- Mock data instead of real integrations
- Basic error handling
- No caching or optimization
- Running locally only

### Limitations

- No real email/calendar integration
- Simplified authentication
- No user management UI
- Basic UI (not polished)
- No deployment configuration
- Pinecone free tier limits


## 🐛 Troubleshooting

### Backend won't start
- Check `.env` file has all required variables
- Verify `service-accnt.json` exists in backend directory
- Ensure Gemini API key is valid
- Ensure Pinecone API key is valid
- Check Python version is 3.11+

### Pinecone errors
- Verify API key is correct
- Check environment matches your Pinecone project (e.g., `us-east-1`)
- Ensure you're on free tier (serverless)
- First run creates index automatically (wait ~1 minute)

### Gemini API errors
- Verify API key is valid from Google AI Studio
- Check you have API access enabled
- Ensure you're within rate limits
- Try regenerating the API key

### Frontend can't connect to backend
- Verify backend is running on port 8000
- Check CORS_ORIGINS in backend `.env`
- Verify VITE_API_BASE_URL in frontend `.env`

### Authentication errors
- Verify Firebase project is set up correctly
- Check Email/Password auth is enabled in Firebase Console
- Ensure `service-accnt.json` is valid


## 📚 Next Steps

To make this production-ready, you would need to:

1. **Real Integrations**: Connect to actual email/calendar APIs (Gmail, Outlook, Google Calendar)
2. **User Management**: Add user registration, profile management
3. **UI Polish**: Implement proper design with shadcn/ui components
4. **Error Handling**: Add comprehensive error handling and logging
5. **Testing**: Add unit tests, integration tests
6. **Deployment**: Deploy backend (Railway/Cloud Run) and frontend (Vercel)
7. **Security**: Implement rate limiting, input validation, security headers
8. **Optimization**: Add caching (Redis), optimize queries
9. **Monitoring**: Add logging, metrics, error tracking

## 📄 License

This is a demo project for educational purposes.

## 🤝 Support

For issues or questions, please refer to the architecture document: `EMPLOYEE_WORK_ASSISTANT_ARCHITECTURE.md`
