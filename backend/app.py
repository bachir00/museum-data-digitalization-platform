"""
Main Flask application using Domain-Driven Design architecture
"""
import os
from flask import Flask, request, redirect, url_for
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

from src.interfaces.controllers import create_controllers

# Load environment variables
load_dotenv()

def create_app():
    """Application factory"""
    app = Flask(__name__)
    
    # Configuration
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
    
    # Initialize extensions
    jwt = JWTManager(app)
    CORS(app, origins='*')
    
    # Configuration from environment
    db_path = os.getenv('DATABASE_PATH', 'museum.db')
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    
    # Create and register controllers
    print("Creating controllers...")
    print(f'db_path: {db_path}, front_url: {frontend_url}')
    controllers = create_controllers(db_path, frontend_url)
    print(f"Controllers created: {list(controllers.keys())}")
    
    for name, controller in controllers.items():
        print(f"Registering blueprint: {name}")
        app.register_blueprint(controller)
    
    print("All controllers registered!")
    
    # Routes de compatibilité pour le frontend existant
    @app.route('/api/login', methods=['POST', 'OPTIONS'])
    def login_compatibility():
        """Route de compatibilité pour /api/login -> /api/auth/login"""
        if request.method == 'OPTIONS':
            return '', 200
        # Rediriger vers la vraie route d'authentification
        from flask import redirect, url_for
        return redirect(url_for('auth.login'), code=307)
    
    @app.route('/api/register', methods=['POST', 'OPTIONS']) 
    def register_compatibility():
        """Route de compatibilité pour /api/register -> /api/auth/register"""
        if request.method == 'OPTIONS':
            return '', 200
        from flask import redirect, url_for
        return redirect(url_for('auth.register'), code=307)
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'architecture': 'Domain-Driven Design'}
    
    # API info endpoint
    @app.route('/api/info')
    def api_info():
        return {
            'name': 'Museum API',
            'version': '2.0.0',
            'architecture': 'Domain-Driven Design',
            'endpoints': {
                'auth': {
                    'login': 'POST /api/auth/login',
                    'register': 'POST /api/auth/register'
                },
                'users': {
                    'list': 'GET /api/users/',
                    'get': 'GET /api/users/<id>'
                },
                'rooms': {
                    'list': 'GET /api/rooms/',
                    'get': 'GET /api/rooms/<id>',
                    'create': 'POST /api/rooms/'
                },
                'artworks': {
                    'list': 'GET /api/artworks/',
                    'get': 'GET /api/artworks/<id>',
                    'create': 'POST /api/artworks/',
                    'search': 'GET /api/artworks/search'
                }
            }
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    # Development server configuration
    debug_mode = True  # Force debug mode for development
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    
    app.run(host=host, port=port, debug=debug_mode)