"""
User domain entity
"""
from typing import Optional
from datetime import datetime
from dataclasses import dataclass
from werkzeug.security import check_password_hash, generate_password_hash

from ..shared.base_entity import Entity


@dataclass
class UserRole:
    """Value object for user roles"""
    ADMIN = "admin"
    USER = "user"


class User(Entity):
    """User domain entity"""
    
    def __init__(
        self,
        username: str,
        password_hash: str,
        role: str = UserRole.USER,
        email: Optional[str] = None,
        is_active: bool = True,
        id: Optional[int] = None,
        created_at: Optional[datetime] = None
    ):
        super().__init__(id, created_at)
        self._username = username
        self._password_hash = password_hash
        self._role = role
        self._email = email
        self._is_active = is_active
        self._validate()
    
    @property
    def username(self) -> str:
        return self._username
    
    @property
    def password_hash(self) -> str:
        return self._password_hash
    
    @property
    def role(self) -> str:
        return self._role
    
    @property
    def email(self) -> Optional[str]:
        return self._email
    
    @property
    def is_active(self) -> bool:
        return self._is_active
    
    def _validate(self) -> None:
        """Validate user domain rules"""
        if not self._username or len(self._username.strip()) < 3:
            raise ValueError("Username must be at least 3 characters long")
        
        if not self._password_hash:
            raise ValueError("Password hash is required")
        
        if self._role not in [UserRole.ADMIN, UserRole.USER]:
            raise ValueError(f"Invalid role: {self._role}")
        
        if self._email and '@' not in self._email:
            raise ValueError("Invalid email format")
    
    def check_password(self, password: str) -> bool:
        """Check if provided password matches user's password"""
        return check_password_hash(self._password_hash, password)
    
    def set_password(self, new_password: str) -> None:
        """Set user's password"""
        if len(new_password) < 6:
            raise ValueError("Password must be at least 6 characters long")
        
        self._password_hash = generate_password_hash(new_password)
    
    def change_password(self, new_password: str) -> None:
        """Change user's password (alias for set_password)"""
        self.set_password(new_password)
    
    def set_email(self, email: str) -> None:
        """Set user's email"""
        if email and '@' not in email:
            raise ValueError("Invalid email format")
        self._email = email
    
    def deactivate(self) -> None:
        """Deactivate user account"""
        self._is_active = False
    
    def activate(self) -> None:
        """Activate user account"""
        self._is_active = True
    
    def is_admin(self) -> bool:
        """Check if user is an admin"""
        return self._role == UserRole.ADMIN
    
    @classmethod
    def create(cls, username: str, password: str, role: str = UserRole.USER, email: Optional[str] = None) -> 'User':
        """Factory method to create a new user"""
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")
        
        if email and '@' not in email:
            raise ValueError("Invalid email format")
        
        password_hash = generate_password_hash(password)
        return cls(username, password_hash, role, email)
    
    def to_dict(self) -> dict:
        """Convert user to dictionary representation"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }