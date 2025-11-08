"""
Data Transfer Objects for Room operations
"""
from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime


@dataclass
class CreateRoomRequest:
    """DTO for room creation request"""
    name_fr: str
    name_en: str
    name_wo: str
    description_fr: str
    description_en: str
    description_wo: str
    theme: str
    accessibility_level: str
    panorama_url: Optional[str] = None
    has_audio: bool = False
    has_interactive: bool = False


@dataclass
class UpdateRoomRequest:
    """DTO for room update request"""
    room_id: int
    theme: Optional[str] = None
    accessibility_level: Optional[str] = None
    panorama_url: Optional[str] = None
    has_audio: Optional[bool] = None
    has_interactive: Optional[bool] = None


@dataclass
class RoomSearchRequest:
    """DTO for room search request"""
    theme: Optional[str] = None
    accessibility_level: Optional[str] = None
    has_audio: Optional[bool] = None
    has_interactive: Optional[bool] = None
    language: str = "fr"


@dataclass
class RoomResponse:
    """DTO for room response"""
    id: int
    name_fr: str
    name_en: str
    name_wo: str
    description_fr: str
    description_en: str
    description_wo: str
    theme: str
    accessibility_level: str
    panorama_url: Optional[str]
    has_audio: bool
    has_interactive: bool
    created_at: datetime
    artwork_count: Optional[int] = None
    
    @classmethod
    def from_entity(cls, room, artwork_count: Optional[int] = None):
        """Create RoomResponse from Room entity"""
        return cls(
            id=room.id,
            name_fr=room.name.get_text('fr'),
            name_en=room.name.get_text('en'),
            name_wo=room.name.get_text('wo'),
            description_fr=room.description.get_text('fr'),
            description_en=room.description.get_text('en'),
            description_wo=room.description.get_text('wo'),
            theme=room.theme,
            accessibility_level=room.accessibility_level,
            panorama_url=room.panorama_url,
            has_audio=room.has_audio,
            has_interactive=room.has_interactive,
            created_at=room.created_at,
            artwork_count=artwork_count
        )