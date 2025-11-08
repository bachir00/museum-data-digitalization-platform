"""
User authentication domain service
"""
from typing import Optional
from werkzeug.security import check_password_hash

from ..entities.user import User
from ..repositories.repository_interfaces import UserRepository


class AuthenticationService:
    """Domain service for user authentication"""
    
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository
    
    def authenticate(self, username: str, password: str) -> Optional[User]:
        """
        Authenticate user with username and password
        
        Args:
            username: The username
            password: The plain text password
            
        Returns:
            User entity if authentication successful, None otherwise
        """
        if not username or not username.strip():
            return None
        
        if not password:
            return None
        
        # Find user by username
        user = self._user_repository.get_by_username(username.strip())
        if not user:
            return None
        
        # Check password
        if user.check_password(password):
            return user
        
        return None
    
    def register_user(self, username: str, email: str, password: str, role: str = "user") -> User:
        """
        Register a new user
        
        Args:
            username: The username
            email: The email address
            password: The plain text password
            role: The user role (default: "user")
            
        Returns:
            The created User entity
            
        Raises:
            ValueError: If validation fails or user already exists
        """
        # Check if username already exists
        existing_user = self._user_repository.get_by_username(username)
        if existing_user:
            raise ValueError("Username already exists")
        
        # Check if email already exists
        existing_email = self._user_repository.get_by_email(email)
        if existing_email:
            raise ValueError("Email already exists")
        
        # Create new user
        user = User.create(username=username, email=email, password=password, role=role)
        
        # Save user
        return self._user_repository.save(user)
    
    def change_password(self, user_id: int, old_password: str, new_password: str) -> bool:
        """
        Change user password
        
        Args:
            user_id: The user ID
            old_password: The current password
            new_password: The new password
            
        Returns:
            True if password changed successfully
            
        Raises:
            ValueError: If validation fails
        """
        user = self._user_repository.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        # Check old password
        if not user.check_password(old_password):
            raise ValueError("Current password is incorrect")
        
        # Set new password
        user.set_password(new_password)
        
        # Save user
        self._user_repository.save(user)
        return True