from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.tasks.schemas import TaskCreate, TaskUpdate, TaskResponse, ReorderRequest
from app.modules.tasks import service
from app.modules.tasks.rotation import rotate_tasks

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskResponse])
async def list_tasks(
    assigned_to: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    return await service.get_all_tasks(db, assigned_to=assigned_to)


@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(data: TaskCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_task(db, data)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, data: TaskUpdate, db: AsyncSession = Depends(get_db)):
    return await service.update_task(db, task_id, data)


@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task(task_id: int, db: AsyncSession = Depends(get_db)):
    return await service.toggle_task(db, task_id)


@router.delete("/{task_id}")
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete_task(db, task_id)
    return {"message": "Task deleted"}


@router.patch("/reorder")
async def reorder_tasks(data: ReorderRequest, db: AsyncSession = Depends(get_db)):
    await service.reorder_tasks(db, data.ids)
    return {"message": "Tasks reordered"}


@router.post("/rotate")
async def rotate(db: AsyncSession = Depends(get_db)):
    await rotate_tasks(db)
    return {"message": "Task rotation complete"}
