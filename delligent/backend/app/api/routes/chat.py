from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.rag_engine import RAGEngine
from app.api.middleware.auth import get_current_user

router = APIRouter()

@router.post("", response_model=ChatResponse)
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

@router.get("/conversations")
async def get_conversations(
    current_user: dict = Depends(get_current_user)
):
    """
    Get user's conversation history
    """
    # TODO: Implement conversation listing
    return {"conversations": []}

@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get specific conversation
    """
    # TODO: Implement conversation retrieval
    return {"conversation_id": conversation_id, "messages": []}
