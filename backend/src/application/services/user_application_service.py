"""
User Application Service - Use Cases for User Management
"""
from typing import Optional, List
import jwt
import datetime
from flask import current_app

from ..dtos.user_dtos import (
    LoginRequest, RegisterRequest, ChangePasswordRequest,
    UserResponse, AuthenticationResult
)
from ...domain.entities.user import User
from ...domain.repositories.repository_interfaces import UserRepository
from ...domain.services.authentication_service import AuthenticationService


class UserApplicationService:
    """
    Service applicatif pour les cas d'usage utilisateur
    Orchestre les opérations métier via les services du domaine
    """
    
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository
        self._auth_service = AuthenticationService(user_repository)
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """
        Use Case: Récupération d'un utilisateur par ID
        
        Args:
            user_id: ID de l'utilisateur
            
        Returns:
            Utilisateur trouvé ou None
        """
        return self._user_repository.find_by_id(user_id)
    
    def login_user(self, request: LoginRequest) -> AuthenticationResult:
        """
        Use Case: Authentification utilisateur
        
        Args:
            request: Données d'authentification
            
        Returns:
            Résultat d'authentification avec token JWT
        """
        try:
            # Valider les données d'entrée
            if not request.username or not request.password:
                return AuthenticationResult(
                    success=False,
                    message="Nom d'utilisateur et mot de passe requis"
                )
            
            # Authentifier via le service domaine
            user = self._auth_service.authenticate(request.username, request.password)
            
            if not user:
                return AuthenticationResult(
                    success=False,
                    message="Identifiants invalides"
                )
            
            # Générer token JWT
            token = self._generate_jwt_token(user)
            
            return AuthenticationResult(
                success=True,
                user=UserResponse.from_entity(user),
                token=token,
                message="Connexion réussie"
            )
            
        except Exception as e:
            return AuthenticationResult(
                success=False,
                message=f"Erreur lors de l'authentification: {str(e)}"
            )
    
    def register_user(self, request: RegisterRequest) -> AuthenticationResult:
        """
        Use Case: Inscription d'un nouvel utilisateur
        
        Args:
            request: Données d'inscription
            
        Returns:
            Résultat d'inscription avec utilisateur créé
        """
        try:
            # Valider les données d'entrée
            validation_error = self._validate_registration_request(request)
            if validation_error:
                return AuthenticationResult(
                    success=False,
                    message=validation_error
                )
            
            # Créer utilisateur via le service domaine
            user = self._auth_service.register_user(
                username=request.username,
                email=request.email,
                password=request.password,
                role=request.role
            )
            
            return AuthenticationResult(
                success=True,
                user=UserResponse.from_entity(user),
                message="Inscription réussie"
            )
            
        except ValueError as ve:
            return AuthenticationResult(
                success=False,
                message=str(ve)
            )
        except Exception as e:
            return AuthenticationResult(
                success=False,
                message=f"Erreur lors de l'inscription: {str(e)}"
            )
    
    def change_user_password(self, request: ChangePasswordRequest) -> AuthenticationResult:
        """
        Use Case: Changement de mot de passe
        
        Args:
            request: Données de changement de mot de passe
            
        Returns:
            Résultat de l'opération
        """
        try:
            # Valider les données d'entrée
            if not request.old_password or not request.new_password:
                return AuthenticationResult(
                    success=False,
                    message="Ancien et nouveau mot de passe requis"
                )
            
            # Changer mot de passe via le service domaine
            success = self._auth_service.change_password(
                user_id=request.user_id,
                old_password=request.old_password,
                new_password=request.new_password
            )
            
            if success:
                user = self._user_repository.get_by_id(request.user_id)
                return AuthenticationResult(
                    success=True,
                    user=UserResponse.from_entity(user) if user else None,
                    message="Mot de passe modifié avec succès"
                )
            else:
                return AuthenticationResult(
                    success=False,
                    message="Échec du changement de mot de passe"
                )
                
        except ValueError as ve:
            return AuthenticationResult(
                success=False,
                message=str(ve)
            )
        except Exception as e:
            return AuthenticationResult(
                success=False,
                message=f"Erreur lors du changement de mot de passe: {str(e)}"
            )
    
    def get_user_profile(self, user_id: int) -> Optional[UserResponse]:
        """
        Use Case: Récupération du profil utilisateur
        
        Args:
            user_id: ID de l'utilisateur
            
        Returns:
            Profil utilisateur ou None si non trouvé
        """
        try:
            user = self._user_repository.get_by_id(user_id)
            return UserResponse.from_entity(user) if user else None
        except Exception:
            return None
    
    def get_all_users(self, requesting_user_id: int) -> List[UserResponse]:
        """
        Use Case: Liste des utilisateurs (admin uniquement)
        
        Args:
            requesting_user_id: ID de l'utilisateur qui fait la demande
            
        Returns:
            Liste des utilisateurs
        """
        try:
            # Vérifier permissions admin
            requesting_user = self._user_repository.get_by_id(requesting_user_id)
            if not requesting_user or requesting_user.role != "admin":
                return []
            
            users = self._user_repository.get_all()
            return [UserResponse.from_entity(user) for user in users]
        except Exception:
            return []
    
    def delete_user(self, user_id: int, requesting_user_id: int) -> bool:
        """
        Use Case: Suppression d'utilisateur (admin uniquement)
        
        Args:
            user_id: ID de l'utilisateur à supprimer
            requesting_user_id: ID de l'utilisateur qui fait la demande
            
        Returns:
            True si suppression réussie
        """
        try:
            # Vérifier permissions admin
            requesting_user = self._user_repository.get_by_id(requesting_user_id)
            if not requesting_user or requesting_user.role != "admin":
                return False
            
            # Ne pas supprimer son propre compte
            if user_id == requesting_user_id:
                return False
            
            return self._user_repository.delete(user_id)
        except Exception:
            return False
    
    def _generate_jwt_token(self, user: User) -> str:
        """Générer token JWT pour l'utilisateur"""
        payload = {
            'user_id': user.id,
            'username': user.username,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        try:
            # Essayer d'utiliser le contexte Flask si disponible
            secret_key = current_app.config['SECRET_KEY']
        except RuntimeError:
            # Fallback pour les tests hors contexte Flask
            secret_key = "test_secret_key_for_ddd_testing"
        
        return jwt.encode(payload, secret_key, algorithm='HS256')
    
    def _validate_registration_request(self, request: RegisterRequest) -> Optional[str]:
        """Valider les données d'inscription"""
        if not request.username or len(request.username.strip()) < 3:
            return "Le nom d'utilisateur doit contenir au moins 3 caractères"
        
        if not request.email or '@' not in request.email:
            return "Adresse email invalide"
        
        if not request.password or len(request.password) < 6:
            return "Le mot de passe doit contenir au moins 6 caractères"
        
        if request.role not in ["user", "admin"]:
            return "Rôle invalide"
        
        return None