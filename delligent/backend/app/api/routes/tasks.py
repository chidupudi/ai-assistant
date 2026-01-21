from fastapi import APIRouter, Depends, HTTPException
from app.services.firebase_service import firebase_service
from app.api.middleware.auth import get_current_user

router = APIRouter()

@router.get("")
@router.get("/")
async def get_tasks(
    current_user: dict = Depends(get_current_user),
    limit: int = 20
):
    """
    Get user's tasks
    """
    try:
        tasks = await firebase_service.get_tasks(
            user_id=current_user['uid'],
            limit=limit
        )
        return {"tasks": tasks, "count": len(tasks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/overdue")
async def get_overdue_tasks(
    current_user: dict = Depends(get_current_user)
):
    """
    Get overdue tasks
    """
    # TODO: Implement overdue task filtering
    return {"tasks": [], "count": 0}

@router.post("/")
async def create_task(
    current_user: dict = Depends(get_current_user)
):
    """
    Create new task
    """
    # TODO: Implement task creation
    return {"message": "Task created", "task_id": "task_new"}

@router.patch("/{task_id}")
async def update_task(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Update task
    """
    # TODO: Implement task update
    return {"message": "Task updated", "task_id": task_id}
