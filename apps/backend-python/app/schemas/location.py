from pydantic import BaseModel

class AddressInput(BaseModel):
    address: str

class LocationOutput(BaseModel):
    latitude: float
    longitude: float
    altitude: float
    tz: str
