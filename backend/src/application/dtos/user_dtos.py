"""
Data Transfer Objects for User operations
"""
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class LoginRequest:
    """DTO for user login request"""
    username: str
    password: str


@dataclass
class RegisterRequest:
    """DTO for user registration request"""
    username: str
    email: str
    password: str
    role: str = "user"


@dataclass
class ChangePasswordRequest:
    """DTO for password change request"""
    user_id: int
    old_password: str
    new_password: str


@dataclass
class UserResponse:
    """DTO for user response"""
    id: int
    username: str
    email: str
    role: str
    created_at: datetime
    is_active: bool
    
    @classmethod
    def from_entity(cls, user):
        """Create UserResponse from User entity"""
        return cls(
            id=user.id,
            username=user.username,
            email=user.email,
            role=user.role,
            created_at=user.created_at,
            is_active=user.is_active
        )


@dataclass
class AuthenticationResult:
    """DTO for authentication result"""
    success: bool
    user: Optional[UserResponse] = None
    token: Optional[str] = None
    message: Optional[str] = None