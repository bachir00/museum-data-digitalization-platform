"""
Base Entity class for Domain-Driven Design
"""
from abc import ABC
from typing import Any, Dict, Optional
from datetime import datetime


class Entity(ABC):
    """Base class for all domain entities"""
    
    def __init__(self, id: Optional[int] = None, created_at: Optional[datetime] = None):
        self._id = id
        self._created_at = created_at or datetime.now()
        
    @property
    def id(self) -> Optional[int]:
        return self._id
    
    @property 
    def created_at(self) -> datetime:
        return self._created_at
    
    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Entity):
            return False
        return self._id == other._id and self._id is not None
    
    def __hash__(self) -> int:
        return hash(self._id) if self._id else hash(id(self))


class ValueObject(ABC):
    """Base class for value objects"""
    
    def __eq__(self, other: object) -> bool:
        if not isinstance(other, self.__class__):
            return False
        return self.__dict__ == other.__dict__
    
    def __hash__(self) -> int:
        return hash(tuple(sorted(self.__dict__.items())))