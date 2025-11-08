"""
Artwork domain entity
"""
from typing import Optional, Dict, Any
from datetime import datetime

from ..shared.base_entity import Entity
from .room import MultilingualText


class Artwork(Entity):
    """Artwork domain entity representing a piece of art in the museum"""
    
    def __init__(
        self,
        title: str,
        description: MultilingualText,
        category: str,
        period: str,
        origin: str,
        room_id: int,
        image_url: Optional[str] = None,
        audio_url: Optional[str] = None,
        video_url: Optional[str] = None,
        qr_code_url: Optional[str] = None,
        popularity: int = 0,
        view_count: int = 0,
        id: Optional[int] = None,
        created_at: Optional[datetime] = None
    ):
        super().__init__(id, created_at)
        self._title = title
        self._description = description
        self._category = category
        self._period = period
        self._origin = origin
        self._room_id = room_id
        self._image_url = image_url
        self._audio_url = audio_url
        self._video_url = video_url
        self._qr_code_url = qr_code_url
        self._popularity = popularity
        self._view_count = view_count
        self._validate()
    
    @property
    def title(self) -> str:
        return self._title
    
    @property
    def description(self) -> MultilingualText:
        return self._description
    
    @property
    def category(self) -> str:
        return self._category
    
    @property
    def period(self) -> str:
        return self._period
    
    @property
    def origin(self) -> str:
        return self._origin
    
    @property
    def room_id(self) -> int:
        return self._room_id
    
    @property
    def image_url(self) -> Optional[str]:
        return self._image_url
    
    @property
    def audio_url(self) -> Optional[str]:
        return self._audio_url
    
    @property
    def video_url(self) -> Optional[str]:
        return self._video_url
    
    @property
    def qr_code_url(self) -> Optional[str]:
        return self._qr_code_url
    
    @property
    def popularity(self) -> int:
        return self._popularity
    
    @property
    def view_count(self) -> int:
        return self._view_count
    
    def _validate(self) -> None:
        """Validate artwork domain rules"""
        if not self._title or not self._title.strip():
            raise ValueError("Artwork title is required")
        
        if not self._description.fr or not self._description.fr.strip():
            raise ValueError("Artwork description in French is required")
        
        if not self._category or not self._category.strip():
            raise ValueError("Artwork category is required")
        
        if not self._period or not self._period.strip():
            raise ValueError("Artwork period is required")
        
        if not self._origin or not self._origin.strip():
            raise ValueError("Artwork origin is required")
        
        if self._room_id <= 0:
            raise ValueError("Valid room ID is required")
        
        if self._popularity < 0:
            raise ValueError("Popularity cannot be negative")
        
        if self._view_count < 0:
            raise ValueError("View count cannot be negative")
    
    def set_image(self, image_url: str) -> None:
        """Set the image URL for the artwork"""
        if not image_url or not image_url.strip():
            raise ValueError("Image URL cannot be empty")
        self._image_url = image_url
    
    def set_audio(self, audio_url: str) -> None:
        """Set the audio URL for the artwork"""
        if not audio_url or not audio_url.strip():
            raise ValueError("Audio URL cannot be empty")
        self._audio_url = audio_url
    
    def set_video(self, video_url: str) -> None:
        """Set the video URL for the artwork"""
        if not video_url or not video_url.strip():
            raise ValueError("Video URL cannot be empty")
        self._video_url = video_url
    
    def set_qr_code(self, qr_code_url: str) -> None:
        """Set the QR code URL for the artwork"""
        if not qr_code_url or not qr_code_url.strip():
            raise ValueError("QR code URL cannot be empty")
        self._qr_code_url = qr_code_url
    
    def increment_view_count(self) -> None:
        """Increment the view count for this artwork"""
        self._view_count += 1
    
    def set_popularity(self, popularity: int) -> None:
        """Set the popularity score for this artwork"""
        if popularity < 0:
            raise ValueError("Popularity cannot be negative")
        self._popularity = popularity
    
    def move_to_room(self, new_room_id: int) -> None:
        """Move artwork to a different room"""
        if new_room_id <= 0:
            raise ValueError("Valid room ID is required")
        self._room_id = new_room_id
    
    def has_multimedia(self) -> bool:
        """Check if artwork has any multimedia content"""
        return bool(self._audio_url or self._video_url)
    
    def has_audio_guide(self) -> bool:
        """Check if artwork has audio guide"""
        return bool(self._audio_url)
    
    def has_video_content(self) -> bool:
        """Check if artwork has video content"""
        return bool(self._video_url)
    
    def get_description(self, language: str = "fr") -> str:
        """Get artwork description in specified language"""
        return self._description.get_text(language)
    
    @classmethod
    def create(
        cls,
        title: str,
        description_fr: str,
        description_en: str,
        description_wo: str,
        category: str,
        period: str,
        origin: str,
        room_id: int,
        image_url: Optional[str] = None,
        audio_url: Optional[str] = None,
        video_url: Optional[str] = None,
        popularity: int = 0
    ) -> 'Artwork':
        """Factory method to create a new artwork"""
        description = MultilingualText(fr=description_fr, en=description_en, wo=description_wo)
        
        return cls(
            title=title,
            description=description,
            category=category,
            period=period,
            origin=origin,
            room_id=room_id,
            image_url=image_url,
            audio_url=audio_url,
            video_url=video_url,
            popularity=popularity
        )
    
    def to_dict(self, language: str = "fr") -> Dict[str, Any]:
        """Convert artwork to dictionary representation"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.get_description(language),
            'category': self.category,
            'period': self.period,
            'origin': self.origin,
            'room_id': self.room_id,
            'image_url': self.image_url,
            'audio_url': self.audio_url,
            'video_url': self.video_url,
            'qr_code_url': self.qr_code_url,
            'popularity': self.popularity,
            'view_count': self.view_count,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }