# Employee Work Assistant - Quick Setup Guide

## ✅ What's Already Done

- ✅ Firebase service account configured (`service-accnt.json`)
- ✅ Backend structure with Pinecone + Gemini integration
- ✅ All RAG pipeline services implemented
- ✅ API routes created

## 🔑 Required API Keys

You need to obtain these API keys:

### 1. Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key

### 2. Pinecone API Key

1. Go to [Pinecone Console](https://app.pinecone.io/)
2. Sign up for free account
3. Create a new project
4. Go to "API Keys" section
5. Copy your API key and environment (e.g., `us-east-1`)

## 🚀 Setup Steps

### 1. Configure Environment Variables

Edit `backend/.env` file and add your API keys:

```bash
# Google Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_ENVIRONMENT=us-east-1
```

### 2. Install Backend Dependencies

```bash
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Generate Mock Data

```bash
# Make sure you're in the backend directory with venv activated
python scripts/generate_mock_data.py
```

This will:
- Create test user in Firebase
- Generate 20 mock emails
- Generate 15 mock tasks
- Generate 10 mock calendar events
- Create embeddings using Gemini
- Store vectors in Pinecone

### 4. Start Backend Server

```bash
# In backend directory with venv activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

Test it: `http://localhost:8000/health`

## 📝 Next Steps

After backend is running:

1. **Set up Frontend** (React + TypeScript)
2. **Configure Firebase Auth** in frontend
3. **Build chat interface**
4. **Test the RAG pipeline**

## 🧪 Testing the Backend

Once the server is running, you can test the API:

### Health Check
```bash
curl http://localhost:8000/health
```

### Get Emails (requires authentication)
```bash
curl http://localhost:8000/api/emails \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

## ⚠️ Important Notes

### Pinecone Free Tier
- Free tier includes 1 index
- 100K vectors
- Sufficient for demo purposes

### Gemini API
- Free tier available
- Rate limits apply
- Embeddings: 768 dimensions

### Firebase
- Using existing project: `delligent-8f6a2`
- Service account already configured
- Make sure Firestore is enabled in Firebase Console

## 🐛 Troubleshooting

### "Firebase service account file not found"
- Make sure `service-accnt.json` is in the `backend` directory
- Check the path in `.env` file

### "Pinecone API error"
- Verify API key is correct
- Check environment matches your Pinecone project
- Make sure you're on the free tier (serverless)

### "Gemini API error"
- Verify API key is valid
- Check you have API access enabled
- Ensure you're within rate limits

### Import errors
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

## 📚 API Endpoints

- `GET /health` - Health check
- `POST /api/chat` - Send chat message (requires auth)
- `GET /api/emails` - List emails (requires auth)
- `GET /api/emails/urgent` - Get urgent emails (requires auth)
- `GET /api/tasks` - List tasks (requires auth)

## 🔐 Authentication

The backend uses Firebase Authentication. You'll need to:
1. Enable Email/Password auth in Firebase Console
2. Create a test user
3. Get the Firebase ID token from frontend
4. Include in requests: `Authorization: Bearer <token>`

For now, focus on getting the backend running and generating mock data!
