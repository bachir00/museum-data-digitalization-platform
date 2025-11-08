"""
Room domain entity
"""
from typing import Optional, Dict, Any
from datetime import datetime
from dataclasses import dataclass

from ..shared.base_entity import Entity


@dataclass
class MultilingualText:
    """Value object for multilingual text content"""
    fr: str
    en: str
    wo: str
    
    def get_text(self, language: str = "fr") -> str:
        """Get text in specified language, fallback to French"""
        return getattr(self, language, self.fr)


@dataclass
class RoomAccessibility:
    """Value object for room accessibility levels"""
    EASY = "facile"
    MODERATE = "modéré"
    ADVANCED = "avancé"


class Room(Entity):
    """Room domain entity representing an exhibition room"""
    
    def __init__(
        self,
        name: MultilingualText,
        description: MultilingualText,
        theme: str,
        accessibility_level: str,
        panorama_url: Optional[str] = None,
        hotspots: Optional[str] = None,
        has_audio: bool = False,
        has_interactive: bool = False,
        id: Optional[int] = None,
        created_at: Optional[datetime] = None
    ):
        super().__init__(id, created_at)
        self._name = name
        self._description = description
        self._theme = theme
        self._accessibility_level = accessibility_level
        self._panorama_url = panorama_url
        self._hotspots = hotspots or "[]"
        self._has_audio = has_audio
        self._has_interactive = has_interactive
        self._validate()
    
    @property
    def name(self) -> MultilingualText:
        return self._name
    
    @property
    def description(self) -> MultilingualText:
        return self._description
    
    @property
    def theme(self) -> str:
        return self._theme
    
    @property
    def accessibility_level(self) -> str:
        return self._accessibility_level
    
    @property
    def panorama_url(self) -> Optional[str]:
        return self._panorama_url
    
    @property
    def hotspots(self) -> str:
        return self._hotspots
    
    @property
    def has_audio(self) -> bool:
        return self._has_audio
    
    @property
    def has_interactive(self) -> bool:
        return self._has_interactive
    
    def _validate(self) -> None:
        """Validate room domain rules"""
        if not self._name.fr or not self._name.fr.strip():
            raise ValueError("Room name in French is required")
        
        if not self._description.fr or not self._description.fr.strip():
            raise ValueError("Room description in French is required")
        
        if not self._theme or not self._theme.strip():
            raise ValueError("Room theme is required")
        
        valid_accessibility_levels = [
            RoomAccessibility.EASY,
            RoomAccessibility.MODERATE,
            RoomAccessibility.ADVANCED
        ]
        
        if self._accessibility_level not in valid_accessibility_levels:
            raise ValueError(f"Invalid accessibility level: {self._accessibility_level}")
    
    def set_panorama(self, panorama_url: str) -> None:
        """Set the panorama URL for the room"""
        if not panorama_url or not panorama_url.strip():
            raise ValueError("Panorama URL cannot be empty")
        self._panorama_url = panorama_url
    
    def enable_audio(self) -> None:
        """Enable audio guide for this room"""
        self._has_audio = True
    
    def disable_audio(self) -> None:
        """Disable audio guide for this room"""
        self._has_audio = False
    
    def enable_interactive(self) -> None:
        """Enable interactive features for this room"""
        self._has_interactive = True
    
    def disable_interactive(self) -> None:
        """Disable interactive features for this room"""
        self._has_interactive = False
    
    def get_name(self, language: str = "fr") -> str:
        """Get room name in specified language"""
        return self._name.get_text(language)
    
    def get_description(self, language: str = "fr") -> str:
        """Get room description in specified language"""
        return self._description.get_text(language)
    
    @classmethod
    def create(
        cls,
        name_fr: str,
        name_en: str,
        name_wo: str,
        description_fr: str,
        description_en: str,
        description_wo: str,
        theme: str,
        accessibility_level: str,
        panorama_url: Optional[str] = None,
        hotspots: Optional[str] = None,
        has_audio: bool = False,
        has_interactive: bool = False
    ) -> 'Room':
        """Factory method to create a new room"""
        name = MultilingualText(fr=name_fr, en=name_en, wo=name_wo)
        description = MultilingualText(fr=description_fr, en=description_en, wo=description_wo)
        
        return cls(
            name=name,
            description=description,
            theme=theme,
            accessibility_level=accessibility_level,
            panorama_url=panorama_url,
            hotspots=hotspots,
            has_audio=has_audio,
            has_interactive=has_interactive
        )
    
    def to_dict(self, language: str = "fr") -> Dict[str, Any]:
        """Convert room to dictionary representation"""
        return {
            'id': self.id,
            'name': self.get_name(language),
            'description': self.get_description(language),
            'theme': self.theme,
            'accessibility_level': self.accessibility_level,
            'panorama_url': self.panorama_url,
            'hotspots': self.hotspots,
            'has_audio': self.has_audio,
            'has_interactive': self.has_interactive,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }