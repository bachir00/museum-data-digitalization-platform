"""
Data Transfer Objects for Artwork operations
"""
from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime


@dataclass
class CreateArtworkRequest:
    """DTO for artwork creation request"""
    title: str
    description_fr: str
    description_en: str
    description_wo: str
    category: str
    period: str
    origin: str
    room_id: int
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    video_url: Optional[str] = None


@dataclass
class UpdateArtworkRequest:
    """DTO for artwork update request"""
    artwork_id: int
    room_id: Optional[int] = None
    popularity: Optional[int] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    video_url: Optional[str] = None


@dataclass
class ArtworkSearchRequest:
    """DTO for artwork search request"""
    query: Optional[str] = None
    category: Optional[str] = None
    period: Optional[str] = None
    origin: Optional[str] = None
    room_id: Optional[int] = None
    language: str = "fr"
    limit: Optional[int] = None


@dataclass
class ViewArtworkRequest:
    """DTO for viewing artwork request"""
    artwork_id: int
    increment_views: bool = True


@dataclass
class ArtworkResponse:
    """DTO for artwork response"""
    id: int
    title: str
    description_fr: str
    description_en: str
    description_wo: str
    category: str
    period: str
    origin: str
    room_id: int
    image_url: Optional[str]
    audio_url: Optional[str]
    video_url: Optional[str]
    qr_code_data: Optional[str]
    view_count: int
    popularity: int
    created_at: datetime
    room_name: Optional[str] = None
    
    @classmethod
    def from_entity(cls, artwork, room_name: Optional[str] = None):
        """Create ArtworkResponse from Artwork entity"""
        return cls(
            id=artwork.id,
            title=artwork.title,
            description_fr=artwork.description_fr,
            description_en=artwork.description_en,
            description_wo=artwork.description_wo,
            category=artwork.category,
            period=artwork.period,
            origin=artwork.origin,
            room_id=artwork.room_id,
            image_url=artwork.image_url,
            audio_url=artwork.audio_url,
            video_url=artwork.video_url,
            qr_code_data=artwork.qr_code_data,
            view_count=artwork.view_count,
            popularity=artwork.popularity,
            created_at=artwork.created_at,
            room_name=room_name
        )


@dataclass
class PopularArtworksRequest:
    """DTO for popular artworks request"""
    limit: int = 10
    category: Optional[str] = None