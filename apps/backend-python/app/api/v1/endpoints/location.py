from fastapi import APIRouter, Depends
from app.schemas.location import AddressInput, LocationOutput
from app.services.location_service import get_location_from_address

router = APIRouter()


@router.post("/from_address", response_model=LocationOutput)
def location_from_address(
    address: AddressInput,
):
    """
    Get location data (latitude, longitude, etc.) from a given address.
    """
    location_data = get_location_from_address(address.address)
    return location_data
