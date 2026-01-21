from fastapi import APIRouter, Depends, HTTPException
from app.services.firebase_service import firebase_service
from app.api.middleware.auth import get_current_user
from typing import List

router = APIRouter()

@router.get("/")
async def get_emails(
    current_user: dict = Depends(get_current_user),
    limit: int = 20
):
    """
    Get user's emails
    """
    try:
        emails = await firebase_service.get_emails(
            user_id=current_user['uid'],
            limit=limit
        )
        return {"emails": emails, "count": len(emails)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/urgent")
async def get_urgent_emails(
    current_user: dict = Depends(get_current_user)
):
    """
    Get urgent emails
    """
    try:
        emails = await firebase_service.get_emails(
            user_id=current_user['uid'],
            filters={"priority": "high"},
            limit=10
        )
        return {"emails": emails, "count": len(emails)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{email_id}")
async def get_email(
    email_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get single email
    """
    # TODO: Implement single email retrieval
    return {"email_id": email_id}

@router.post("/sync")
async def sync_emails(
    current_user: dict = Depends(get_current_user)
):
    """
    Trigger email sync (for demo purposes)
    """
    return {"message": "Email sync triggered", "status": "success"}
