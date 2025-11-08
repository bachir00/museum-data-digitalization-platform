"""
Application DTOs (Data Transfer Objects)
"""
from .user_dtos import (
    LoginRequest,
    RegisterRequest,
    ChangePasswordRequest,
    UserResponse,
    AuthenticationResult
)
from .room_dtos import (
    CreateRoomRequest,
    UpdateRoomRequest,
    RoomSearchRequest,
    RoomResponse
)
from .artwork_dtos import (
    CreateArtworkRequest,
    UpdateArtworkRequest,
    ArtworkSearchRequest,
    ViewArtworkRequest,
    ArtworkResponse,
    PopularArtworksRequest
)

__all__ = [
    # User DTOs
    "LoginRequest",
    "RegisterRequest", 
    "ChangePasswordRequest",
    "UserResponse",
    "AuthenticationResult",
    
    # Room DTOs
    "CreateRoomRequest",
    "UpdateRoomRequest",
    "RoomSearchRequest",
    "RoomResponse",
    
    # Artwork DTOs
    "CreateArtworkRequest",
    "UpdateArtworkRequest",
    "ArtworkSearchRequest",
    "ViewArtworkRequest",
    "ArtworkResponse",
    "PopularArtworksRequest"
]