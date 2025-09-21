from fastapi import APIRouter

from app.api.v1.endpoints import location

api_router = APIRouter()
api_router.include_router(location.router, prefix="/location", tags=["location"])
