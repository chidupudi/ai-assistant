from fastapi import HTTPException, Security, Depends
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

async def get_current_user(
    decoded_token: dict = Depends(verify_firebase_token)
) -> dict:
    """Get current user from token"""
    return {
        "uid": decoded_token['uid'],
        "email": decoded_token.get('email'),
        "name": decoded_token.get('name')
    }
