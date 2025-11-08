"""
Repository interfaces for data access
"""
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any

from ..entities.user import User
from ..entities.room import Room  
from ..entities.artwork import Artwork


class UserRepository(ABC):
    """Abstract repository interface for User entities"""
    
    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        pass
    
    @abstractmethod
    def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        pass
    
    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        pass
    
    @abstractmethod
    def save(self, user: User) -> User:
        """Save or update user"""
        pass
    
    @abstractmethod
    def delete(self, user_id: int) -> bool:
        """Delete user by ID"""
        pass
    
    @abstractmethod
    def get_all(self) -> List[User]:
        """Get all users"""
        pass


class RoomRepository(ABC):
    """Abstract repository interface for Room entities"""
    
    @abstractmethod
    def get_by_id(self, room_id: int) -> Optional[Room]:
        """Get room by ID"""
        pass
    
    @abstractmethod
    def get_all(self) -> List[Room]:
        """Get all rooms"""
        pass
    
    @abstractmethod
    def save(self, room: Room) -> Room:
        """Save or update room"""
        pass
    
    @abstractmethod
    def delete(self, room_id: int) -> bool:
        """Delete room by ID"""
        pass
    
    @abstractmethod
    def search(self, criteria: Dict[str, Any]) -> List[Room]:
        """Search rooms by criteria"""
        pass


class ArtworkRepository(ABC):
    """Abstract repository interface for Artwork entities"""
    
    @abstractmethod
    def get_by_id(self, artwork_id: int) -> Optional[Artwork]:
        """Get artwork by ID"""
        pass
    
    @abstractmethod
    def get_all(self) -> List[Artwork]:
        """Get all artworks"""
        pass
    
    @abstractmethod
    def get_by_room_id(self, room_id: int) -> List[Artwork]:
        """Get all artworks in a specific room"""
        pass
    
    @abstractmethod
    def get_by_category(self, category: str) -> List[Artwork]:
        """Get artworks by category"""
        pass
    
    @abstractmethod
    def get_popular(self, limit: int = 10) -> List[Artwork]:
        """Get most popular artworks"""
        pass
    
    @abstractmethod
    def save(self, artwork: Artwork) -> Artwork:
        """Save or update artwork"""
        pass
    
    @abstractmethod
    def delete(self, artwork_id: int) -> bool:
        """Delete artwork by ID"""
        pass
    
    @abstractmethod
    def search(self, criteria: Dict[str, Any]) -> List[Artwork]:
        """Search artworks by criteria"""
        pass
    
    @abstractmethod
    def increment_view_count(self, artwork_id: int) -> bool:
        """Increment view count for artwork"""
        pass