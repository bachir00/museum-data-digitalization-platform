"""
Test de debug pour l'authentification DDD
"""
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.infrastructure.repositories.sqlite_repositories import SQLiteUserRepository
from src.application.services.user_application_service import UserApplicationService
from src.application.dtos.user_dtos import LoginRequest

def test_login_debug():
    """Test debug du login admin"""
    print("🔍 Debug de l'authentification admin...")
    
    try:
        # Initialisation
        user_repo = SQLiteUserRepository("museum.db")
        user_service = UserApplicationService(user_repo)
        
        # Test avec admin
        login_request = LoginRequest(username="admin", password="admin")
        
        print(f"📋 Tentative de connexion: {login_request.username}")
        
        auth_result = user_service.login_user(login_request)
        
        print(f"✅ Résultat: {auth_result.success}")
        print(f"📝 Message: {auth_result.message}")
        
        if auth_result.user:
            print(f"👤 Utilisateur: {auth_result.user.username} ({auth_result.user.role})")
            print(f"🔑 Token: {auth_result.token[:20] if auth_result.token else 'None'}...")
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_login_debug()