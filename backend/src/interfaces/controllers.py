"""
Flask controllers using DDD architecture
"""
import os
from time import time
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from typing import Dict, Any

from database import get_connection

from ..application import UserApplicationService, RoomApplicationService, ArtworkApplicationService
from ..infrastructure import SQLiteUserRepository, SQLiteRoomRepository, SQLiteArtworkRepository


import qrcode
import os
import time 
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration des variables d'environnement
BASE_URL = os.getenv('BASE_URL', 'http://127.0.0.1:5000')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://127.0.0.1:3000')
JWT_SECRET = os.getenv('JWT_SECRET_KEY', 'votre-clé-secrète-très-sécurisée')

QR_FOLDER = os.path.join("static", "qrcodes")
IMAGES_FOLDER = os.path.join("static", "images")
AUDIO_FOLDER = os.path.join("static", "audios")
VIDEOS_FOLDER = os.path.join("static", "videos")
os.makedirs(QR_FOLDER, exist_ok=True)
os.makedirs(IMAGES_FOLDER, exist_ok=True)
os.makedirs(AUDIO_FOLDER, exist_ok=True)
os.makedirs(VIDEOS_FOLDER, exist_ok=True)

def create_controllers(db_path: str, frontend_url: str) -> Dict[str, Blueprint]:
    """Create and configure all controllers"""
    
    # Initialize repositories
    user_repo = SQLiteUserRepository(db_path)
    room_repo = SQLiteRoomRepository(db_path) 
    artwork_repo = SQLiteArtworkRepository(db_path)
    
    # Initialize application services
    user_service = UserApplicationService(user_repo)
    room_service = RoomApplicationService(room_repo, artwork_repo)
    artwork_service = ArtworkApplicationService(artwork_repo, room_repo, frontend_url)
    
    # Create blueprints
    api_bp = Blueprint('api', __name__, url_prefix='/api')
    auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
    users_bp = Blueprint('users', __name__, url_prefix='/api/users')
    rooms_bp = Blueprint('rooms', __name__, url_prefix='/api/rooms')
    artworks_bp = Blueprint('artworks', __name__, url_prefix='/api/artworks')
    admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')
    
    # General API routes
    @api_bp.route('/health', methods=['GET'])
    def health():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'message': 'Museum API DDD is running',
            'version': '2.0.0-ddd',
            'architecture': 'Domain-Driven Design'
        })
    
    @api_bp.route('/info', methods=['GET'])
    def info():
        """API information endpoint"""
        return jsonify({
            'name': 'Museum Digital Platform API',
            'version': '2.0.0-ddd',
            'architecture': 'Domain-Driven Design',
            'layers': {
                'interface': 'REST API Controllers',
                'application': 'Use Cases & Application Services',
                'domain': 'Business Logic & Domain Services',
                'infrastructure': 'Data Access & External Services'
            },
            'endpoints': {
                'auth': '/api/auth/*',
                'users': '/api/users/*',
                'rooms': '/api/rooms/*',
                'artworks': '/api/artworks/*',
                'health': '/api/health',
                'info': '/api/info'
            }
        })
    
    # Authentication routes
    @auth_bp.route('/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return jsonify({'error': 'Username and password are required'}), 400
            
            # Authentification directe via le service domaine
            # Note: DTOs causent des problèmes de types, utilisation directe pour stabilité
            user = user_service._auth_service.authenticate(str(username), str(password))
            
            if user:
                # Générer token JWT
                import jwt
                import datetime
                payload = {
                    'sub': user.id,  # Flask-JWT-Extended utilise 'sub' comme identifiant
                    'user_id': user.id,
                    'username': user.username,
                    'role': user.role,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
                }
                # Utiliser la même clé que Flask-JWT-Extended
                from flask import current_app
                secret_key = current_app.config['JWT_SECRET_KEY']
                token = jwt.encode(payload, secret_key, algorithm='HS256')
                
                return jsonify({
                    'access_token': token,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email if user.email else "",
                        'role': user.role
                    }
                })
            else:
                return jsonify({'error': 'Invalid credentials'}), 401
                
        except Exception as e:
            return jsonify({'error': f'Authentication error: {str(e)}'}), 500
    
    @auth_bp.route('/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role', 'user')
            
            if not all([username, email, password]):
                return jsonify({'error': 'Username, email, and password are required'}), 400
            
            # Utiliser les DTOs pour l'inscription
            from ..application.dtos.user_dtos import RegisterRequest
            register_request = RegisterRequest(
                username=username, 
                email=email, 
                password=password, 
                role=role
            )
            
            auth_result = user_service.register_user(register_request)
            if auth_result.success and auth_result.user:
                return jsonify({
                    'user': {
                        'id': auth_result.user.id,
                        'username': auth_result.user.username,
                        'email': auth_result.user.email,
                        'role': auth_result.user.role
                    }
                }), 201
            else:
                return jsonify({'error': auth_result.message or 'Registration failed'}), 400
            
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # User routes
    @users_bp.route('/', methods=['GET'])
    @jwt_required()
    def get_users():
        try:
            current_user = user_service.get_user_by_id(get_jwt_identity())
            if not current_user or not current_user.is_admin():
                return jsonify({'error': 'Admin access required'}), 403
            
            users = user_service.get_all_users(current_user.id)
            return jsonify([
                {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'created_at': user.created_at.isoformat() if user.created_at else None
                }
                for user in users
            ])
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @users_bp.route('/<int:user_id>', methods=['GET'])
    @jwt_required()
    def get_user(user_id: int):
        try:
            current_user_id = get_jwt_identity()
            current_user = user_service.get_user_by_id(current_user_id)
            
            # Users can only access their own data unless they're admin
            if current_user_id != user_id and (not current_user or not current_user.is_admin()):
                return jsonify({'error': 'Access denied'}), 403
            
            user = user_service.get_user_by_id(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            return jsonify({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'created_at': user.created_at.isoformat() if user.created_at else None
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # Room routes
    @rooms_bp.route('/', methods=['GET'])
    def get_rooms():
        try:
            room_responses = room_service.get_all_rooms()
            language = request.args.get('lang', 'fr')
            
            result = []
            for room in room_responses:
                # Sélectionner la langue appropriée
                if language == 'en':
                    name = room.name_en
                    description = room.description_en
                elif language == 'wo':
                    name = room.name_wo  
                    description = room.description_wo
                else:  # français par défaut
                    name = room.name_fr
                    description = room.description_fr
                
                result.append({
                    'id': room.id,
                    'name': name,
                    'description': description,
                    'theme': room.theme,
                    'accessibility_level': room.accessibility_level,
                    'panorama_url': room.panorama_url,
                    'has_audio': room.has_audio,
                    'has_interactive': room.has_interactive,
                    'created_at': room.created_at.isoformat() if room.created_at else None
                })
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @rooms_bp.route('/<int:room_id>', methods=['GET'])
    def get_room(room_id: int):
        try:
            room = room_service.get_room_by_id(room_id)
            if not room:
                return jsonify({'error': 'Room not found'}), 404
            
            language = request.args.get('lang', 'fr')
            
            # Utiliser les champs du RoomResponse DTO
            name = getattr(room, f'name_{language}', room.name_fr)
            description = getattr(room, f'description_{language}', room.description_fr)
            
            return jsonify({
                'id': room.id,
                'name': name,
                'description': description,
                'theme': room.theme,
                'accessibility_level': room.accessibility_level,
                'panorama_url': room.panorama_url,
                'has_audio': room.has_audio,
                'has_interactive': room.has_interactive,
                'created_at': room.created_at.isoformat() if room.created_at else None
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @rooms_bp.route('/<int:room_id>', methods=['PUT'])
    @jwt_required()
    def update_room(room_id: int):
        """Met à jour une salle existante"""
        try:
            current_user = user_service.get_user_by_id(get_jwt_identity())
            if not current_user or not current_user.is_admin():
                return jsonify({'error': 'Admin access required'}), 403
            
            print(f"DEBUG: Updating room {room_id}")
            
            conn = get_connection()
            cur = conn.cursor()
            
            # Vérifier que la salle existe
            room_check = cur.execute("SELECT id, panorama_url FROM rooms WHERE id = ?", (room_id,)).fetchone()
            if not room_check:
                conn.close()
                return jsonify({'error': 'Room not found'}), 404
            
            current_panorama_url = room_check['panorama_url']
            
            # Gérer les données selon le type de contenu
            if request.content_type and 'multipart/form-data' in request.content_type:
                # FormData avec possibles fichiers
                data = request.form.to_dict()
                panorama_file = request.files.get('panorama_file')
                
                print(f"DEBUG: Form data received: {data}")
                
                # Traiter les booléens
                data['has_audio'] = data.get('has_audio', 'false').lower() == 'true'
                data['has_interactive'] = data.get('has_interactive', 'false').lower() == 'true'
                
                # Gérer l'upload du nouveau panorama si fourni
                panorama_url = current_panorama_url  # Garder l'ancien par défaut
                if panorama_file and panorama_file.filename:
                    # Supprimer l'ancien fichier panorama
                    if current_panorama_url:
                        old_panorama_path = current_panorama_url.lstrip('/')
                        if os.path.exists(old_panorama_path):
                            try:
                                os.remove(old_panorama_path)
                                print(f"DEBUG: Deleted old panorama: {old_panorama_path}")
                            except Exception as e:
                                print(f"DEBUG: Could not delete old panorama: {e}")
                    
                    # Sauvegarder le nouveau fichier
                    filename = f"panorama_{int(time.time())}_{panorama_file.filename}"
                    filename = filename.replace(' ', '_')
                    file_path = os.path.join(IMAGES_FOLDER, filename)
                    panorama_url = f"/static/images/{filename}"
                    panorama_file.save(file_path)
                    print(f"DEBUG: Saved new panorama: {panorama_url}")
                
            else:
                # Données JSON
                data = request.get_json()
                panorama_url = current_panorama_url
                print(f"DEBUG: JSON data received: {data}")
            
            # Champs requis pour la mise à jour
            required_fields = ['name_fr', 'description_fr', 'description_en', 'description_wo', 'theme', 'accessibility_level']
            missing_fields = [field for field in required_fields if field not in data or not data[field]]
            
            if missing_fields:
                conn.close()
                return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
            
            # Mettre à jour la salle
            cur.execute("""
                UPDATE rooms SET 
                    name_fr = ?, name_en = ?, name_wo = ?,
                    description_fr = ?, description_en = ?, description_wo = ?,
                    theme = ?, accessibility_level = ?, panorama_url = ?,
                    has_audio = ?, has_interactive = ?, hotspots = ?
                WHERE id = ?
            """, (
                data['name_fr'],
                data.get('name_en', data['name_fr']),
                data.get('name_wo', data['name_fr']),
                data['description_fr'],
                data['description_en'],
                data['description_wo'],
                data['theme'],
                data['accessibility_level'],
                panorama_url,
                data.get('has_audio', False),
                data.get('has_interactive', False),
                data.get('hotspots', '[]'),
                room_id
            ))
            
            conn.commit()
            conn.close()
            
            print(f"DEBUG: Successfully updated room {room_id}")
            
            return jsonify({
                'message': f'Room {room_id} updated successfully',
                'room_id': room_id,
                'panorama_url': panorama_url
            }), 200
            
        except Exception as e:
            print(f"DEBUG: Error updating room {room_id}: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    
    @rooms_bp.route('/<int:room_id>', methods=['DELETE'])
    @jwt_required()
    def delete_room(room_id: int):
        try:
            current_user = user_service.get_user_by_id(get_jwt_identity())
            if not current_user or not current_user.is_admin():
                return jsonify({'error': 'Admin access required'}), 403
            
            print(f"DEBUG: Attempting to delete room {room_id}")
            
            conn = get_connection()
            cur = conn.cursor()
            
            # 1. Vérifier que la salle existe
            room_check = cur.execute("SELECT id, panorama_url FROM rooms WHERE id = ?", (room_id,)).fetchone()
            if not room_check:
                conn.close()
                return jsonify({'error': 'Room not found'}), 404
            
            panorama_url = room_check['panorama_url']
            print(f"DEBUG: Room found, panorama_url: {panorama_url}")
            
            # 2. Compter les œuvres dans cette salle
            artworks_count = cur.execute("SELECT COUNT(*) as count FROM artworks WHERE room_id = ?", (room_id,)).fetchone()['count']
            print(f"DEBUG: Found {artworks_count} artworks in room {room_id}")
            
            # 3. Supprimer toutes les œuvres de cette salle
            if artworks_count > 0:
                cur.execute("DELETE FROM artworks WHERE room_id = ?", (room_id,))
                print(f"DEBUG: Deleted {artworks_count} artworks from room {room_id}")
            
            # 4. Supprimer la salle
            cur.execute("DELETE FROM rooms WHERE id = ?", (room_id,))
            
            conn.commit()
            conn.close()
            
            # 5. Supprimer les fichiers associés
            files_deleted = []
            
            # Supprimer le fichier panorama
            if panorama_url:
                panorama_path = panorama_url.lstrip('/')  # Enlever le / initial
                if os.path.exists(panorama_path):
                    try:
                        os.remove(panorama_path)
                        files_deleted.append(panorama_path)
                        print(f"DEBUG: Deleted panorama file: {panorama_path}")
                    except Exception as e:
                        print(f"DEBUG: Failed to delete panorama file {panorama_path}: {e}")
            
            # Supprimer le QR code
            qr_path = os.path.join(QR_FOLDER, f"room_{room_id}.png")
            if os.path.exists(qr_path):
                try:
                    os.remove(qr_path)
                    files_deleted.append(qr_path)
                    print(f"DEBUG: Deleted QR code: {qr_path}")
                except Exception as e:
                    print(f"DEBUG: Failed to delete QR code {qr_path}: {e}")
            
            print(f"DEBUG: Successfully deleted room {room_id}")
            
            return jsonify({
                'message': f'Room {room_id} deleted successfully',
                'deleted_artworks': artworks_count,
                'deleted_files': files_deleted
            }), 200
            
        except Exception as e:
            print(f"DEBUG: Error deleting room {room_id}: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    
    # @rooms_bp.route('/', methods=['POST'])
    # @jwt_required()
    # def create_room():
    #     print("DEBUG: create_room function called")
    #     try:
    #         current_user = user_service.get_user_by_id(get_jwt_identity())
    #         print(f"DEBUG: Current user: {current_user}")
    #         if not current_user or not current_user.is_admin():
    #             return jsonify({'error': 'Admin access required'}), 403
            
    #         # Gérer FormData, form-urlencoded ou JSON
    #         if request.content_type and ('multipart/form-data' in request.content_type or 
    #                                    'application/x-www-form-urlencoded' in request.content_type):
    #             # Données FormData (avec ou sans fichiers)
    #             data = request.form.to_dict()
    #             print(f"DEBUG: Form data received: {data}")
    #             print(f"DEBUG: Content-Type: {request.content_type}")
                
    #             # Traiter les booléens
    #             data['has_audio'] = data.get('has_audio', 'false').lower() == 'true'
    #             data['has_interactive'] = data.get('has_interactive', 'false').lower() == 'true'
                
    #             # Gérer le fichier panorama si présent
    #             panorama_file = request.files.get('panorama_file')
    #             if panorama_file and panorama_file.filename:
    #                 print(f"DEBUG: Panorama file received: {panorama_file.filename}")
    #                 # TODO: Traiter l'upload du fichier
    #                 data['panorama_url'] = None  # Pour l'instant
    #             else:
    #                 data['panorama_url'] = None
    #         else:
    #             # Données JSON
    #             data = request.get_json()
    #             print(f"DEBUG: JSON received: {data}")
            
    #         required_fields = ['name_fr', 'description_fr', 'description_en', 'description_wo', 
    #                          'theme', 'accessibility_level']
            
    #         if not all(field in data for field in required_fields):
    #             missing = [field for field in required_fields if field not in data]
    #             print(f"DEBUG: Missing fields: {missing}")
    #             return jsonify({'error': f'Missing required fields: {missing}'}), 400
            
    #         # Utiliser le service application avec le DTO
    #         from ..application.dtos.room_dtos import CreateRoomRequest
            
    #         create_request = CreateRoomRequest(
    #             name_fr=data['name_fr'],
    #             name_en=data.get('name_en', data['name_fr']),
    #             name_wo=data.get('name_wo', data['name_fr']),
    #             description_fr=data['description_fr'],
    #             description_en=data['description_en'],
    #             description_wo=data['description_wo'],
    #             theme=data['theme'],
    #             accessibility_level=data['accessibility_level'],
    #             panorama_url=data.get('panorama_url'),
    #             has_audio=data.get('has_audio', False),
    #             has_interactive=data.get('has_interactive', False)
    #         )
            
    #         print(f"DEBUG: Creating room with user role: {current_user.role}")
    #         print(f"DEBUG: Create request data: {create_request}")
            
    #         room_response = room_service.create_room(create_request, current_user.role)
            
    #         print(f"DEBUG: Room response: {room_response}")
            
    #         if not room_response:
    #             return jsonify({'error': 'Failed to create room'}), 500
            
    #         return jsonify({
    #             'id': room_response.id,
    #             'name': room_response.name_fr,
    #             'description': room_response.description_fr,
    #             'theme': room_response.theme,
    #             'accessibility_level': room_response.accessibility_level,
    #             'panorama_url': room_response.panorama_url,
    #             'has_audio': room_response.has_audio,
    #             'has_interactive': room_response.has_interactive,
    #             'created_at': room_response.created_at.isoformat() if room_response.created_at else None
    #         }), 201
            
    #     except ValueError as e:
    #         print(f"DEBUG: ValueError in create_room: {e}")
    #         return jsonify({'error': str(e)}), 400
    #     except Exception as e:
    #         import traceback
    #         print(f"DEBUG: Exception in create_room: {e}")
    #         print(f"DEBUG: Traceback: {traceback.format_exc()}")
    #         return jsonify({'error': str(e)}), 500
    
    @rooms_bp.route('/<int:room_id>/artworks', methods=['GET'])
    def get_artworks_by_room(room_id: int):
        """Get all artworks in a specific room"""
        try:
            artworks = artwork_service.get_artworks_by_room(room_id)
            language = request.args.get('lang', 'fr')
            
            return jsonify([artwork.to_dict(language) for artwork in artworks])
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # Artwork routes
    @artworks_bp.route('/', methods=['GET'])
    def get_artworks():
        try:
            room_id = request.args.get('room_id', type=int)
            category = request.args.get('category')
            popular = request.args.get('popular', type=bool)
            language = request.args.get('lang', 'fr')
            
            if room_id:
                artworks = artwork_service.get_artworks_by_room(room_id)
            elif category:
                artworks = artwork_service.get_artworks_by_category(category)
            elif popular:
                limit = request.args.get('limit', 10, type=int)
                artworks = artwork_service.get_popular_artworks(limit)
            else:
                artworks = artwork_service.get_all_artworks()
            
            return jsonify([artwork.to_dict(language) for artwork in artworks])
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @artworks_bp.route('/<int:artwork_id>', methods=['GET'])
    def get_artwork(artwork_id: int):
        try:
            artwork = artwork_service.view_artwork(artwork_id)
            if not artwork:
                return jsonify({'error': 'Artwork not found'}), 404
            
            language = request.args.get('lang', 'fr')
            return jsonify(artwork.to_dict(language))
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @artworks_bp.route('/', methods=['POST'])
    @jwt_required()
    def create_artwork():
        """Ajoute une nouvelle œuvre avec upload de fichiers multimédia"""
        try:
            current_user = user_service.get_user_by_id(get_jwt_identity())
            if not current_user or not current_user.is_admin():
                return jsonify({'error': 'Admin access required'}), 403
            
            print("DEBUG: create_artwork called")
            
            # Gérer FormData (avec fichiers) ou JSON
            if request.content_type and 'multipart/form-data' in request.content_type:
                # Données FormData (avec fichiers)
                data = request.form.to_dict()
                print(f"DEBUG: Form data received: {data}")
                
                # Traiter les fichiers uploadés
                image_file = request.files.get('image_file')
                audio_file = request.files.get('audio_file')
                video_file = request.files.get('video_file')
                
                image_url = None
                audio_url = None
                video_url = None
                
                # Upload image
                if image_file and image_file.filename:
                    filename = f"artwork_{int(time.time())}_{image_file.filename}"
                    filename = filename.replace(' ', '_')
                    file_path = os.path.join(IMAGES_FOLDER, filename)
                    image_url = f"/static/images/{filename}"
                    image_file.save(file_path)
                    print(f"DEBUG: Image saved: {image_url}")
                
                # Upload audio
                if audio_file and audio_file.filename:
                    filename = f"artwork_{int(time.time())}_{audio_file.filename}"
                    filename = filename.replace(' ', '_')
                    file_path = os.path.join(AUDIO_FOLDER, filename)
                    audio_url = f"/static/audios/{filename}"
                    audio_file.save(file_path)
                    print(f"DEBUG: Audio saved: {audio_url}")
                
                # Upload video
                if video_file and video_file.filename:
                    filename = f"artwork_{int(time.time())}_{video_file.filename}"
                    filename = filename.replace(' ', '_')
                    file_path = os.path.join(VIDEOS_FOLDER, filename)
                    video_url = f"/static/videos/{filename}"
                    video_file.save(file_path)
                    print(f"DEBUG: Video saved: {video_url}")
                
                # Mettre à jour les URLs dans les données
                data['image_url'] = image_url
                data['audio_url'] = audio_url
                data['video_url'] = video_url
                
            else:
                # Données JSON (fallback)
                data = request.get_json()
                print(f"DEBUG: JSON received: {data}")
            
            # Validation des champs requis
            required_fields = ['title', 'description_fr', 'description_en', 'description_wo',
                             'category', 'period', 'origin', 'room_id']
            
            missing_fields = [field for field in required_fields if field not in data or not data[field]]
            if missing_fields:
                return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
            
            # Validation du room_id
            try:
                room_id = int(data['room_id'])
            except (ValueError, TypeError):
                return jsonify({'error': 'Invalid room_id'}), 400
            
            # Vérifier que la salle existe
            conn = get_connection()
            cur = conn.cursor()
            room_check = cur.execute("SELECT id FROM rooms WHERE id = ?", (room_id,)).fetchone()
            if not room_check:
                conn.close()
                return jsonify({'error': 'Room not found'}), 404
            
            # Insérer l'œuvre directement en base
            cur.execute("""
                INSERT INTO artworks (title, description_fr, description_en, description_wo,
                                   category, period, origin, room_id, image_url, audio_url, 
                                   video_url, popularity, view_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data['title'],
                data['description_fr'],
                data['description_en'],
                data['description_wo'],
                data['category'],
                data['period'],
                data['origin'],
                room_id,
                data.get('image_url'),
                data.get('audio_url'),
                data.get('video_url'),
                int(data.get('popularity', 0)),
                0  # view_count initial
            ))
            
            artwork_id = cur.lastrowid
            conn.commit()
            
            # Récupérer l'œuvre créée pour la response
            artwork_data = cur.execute("""
                SELECT a.*, r.name_fr as room_name 
                FROM artworks a
                LEFT JOIN rooms r ON a.room_id = r.id
                WHERE a.id = ?
            """, (artwork_id,)).fetchone()
            
            conn.close()
            
            print(f"DEBUG: Artwork created with ID: {artwork_id}")
            
            # Générer le QR code pour l'œuvre
            artwork_url = f"{BASE_URL}/api/artworks/{artwork_id}"
            qr_path = os.path.join(QR_FOLDER, f"artwork_{artwork_id}.png")
            qr_img = qrcode.make(artwork_url)
            qr_img.save(qr_path)
            qr_code_url = f"/static/qrcodes/artwork_{artwork_id}.png"
            
            # Mettre à jour avec le QR code
            conn = get_connection()
            cur = conn.cursor()
            cur.execute("UPDATE artworks SET qr_code_url = ? WHERE id = ?", (qr_code_url, artwork_id))
            conn.commit()
            conn.close()
            
            return jsonify({
                'id': artwork_id,
                'title': artwork_data['title'],
                'description_fr': artwork_data['description_fr'],
                'category': artwork_data['category'],
                'period': artwork_data['period'],
                'origin': artwork_data['origin'],
                'room_id': artwork_data['room_id'],
                'room_name': artwork_data['room_name'],
                'image_url': artwork_data['image_url'],
                'audio_url': artwork_data['audio_url'],
                'video_url': artwork_data['video_url'],
                'qr_code_url': qr_code_url,
                'popularity': artwork_data['popularity'],
                'view_count': artwork_data['view_count'],
                'message': 'Œuvre ajoutée avec succès'
            }), 201
            
        except ValueError as e:
            print(f"DEBUG: ValueError in create_artwork: {e}")
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            print(f"DEBUG: Exception in create_artwork: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500

    @artworks_bp.route('/<int:artwork_id>', methods=['PUT'])
    @jwt_required()
    def update_artwork(artwork_id: int):
        """Met à jour une œuvre existante avec upload de fichiers multimédia"""
        try:
            current_user = user_service.get_user_by_id(get_jwt_identity())
            if not current_user or not current_user.is_admin():
                return jsonify({'error': 'Admin access required'}), 403
            
            print(f"DEBUG: update_artwork called for artwork {artwork_id}")
            
            conn = get_connection()
            cur = conn.cursor()
            
            # Vérifier que l'œuvre existe
            artwork_check = cur.execute("""
                SELECT id, image_url, audio_url, video_url, qr_code_url 
                FROM artworks WHERE id = ?
            """, (artwork_id,)).fetchone()
            
            if not artwork_check:
                conn.close()
                return jsonify({'error': 'Artwork not found'}), 404
            
            current_image_url = artwork_check['image_url']
            current_audio_url = artwork_check['audio_url']
            current_video_url = artwork_check['video_url']
            
            # Gérer FormData (avec fichiers) ou JSON
            if request.content_type and 'multipart/form-data' in request.content_type:
                # Données FormData avec possibles fichiers
                data = request.form.to_dict()
                print(f"DEBUG: Form data received for update: {data}")
                
                # Conserver les URLs existantes par défaut
                image_url = current_image_url
                audio_url = current_audio_url
                video_url = current_video_url
                
                # Traiter les nouveaux fichiers s'ils sont uploadés
                image_file = request.files.get('image_file')
                if image_file and image_file.filename:
                    print(f"DEBUG: New image file received: {image_file.filename}")
                    # Supprimer l'ancien fichier image s'il existe
                    if current_image_url:
                        old_image_path = os.path.join(".", current_image_url.lstrip('/'))
                        if os.path.exists(old_image_path):
                            os.remove(old_image_path)
                            print(f"DEBUG: Removed old image file: {old_image_path}")
                    
                    # Sauvegarder le nouveau fichier image
                    timestamp = int(time.time())
                    image_filename = f"artwork_{timestamp}_{image_file.filename}"
                    image_path = os.path.join(IMAGES_FOLDER, image_filename)
                    image_file.save(image_path)
                    image_url = f"/static/images/{image_filename}"
                    print(f"DEBUG: New image saved: {image_path}")
                
                audio_file = request.files.get('audio_file')
                if audio_file and audio_file.filename:
                    print(f"DEBUG: New audio file received: {audio_file.filename}")
                    # Supprimer l'ancien fichier audio s'il existe
                    if current_audio_url:
                        old_audio_path = os.path.join(".", current_audio_url.lstrip('/'))
                        if os.path.exists(old_audio_path):
                            os.remove(old_audio_path)
                            print(f"DEBUG: Removed old audio file: {old_audio_path}")
                    
                    # Sauvegarder le nouveau fichier audio
                    timestamp = int(time())
                    audio_filename = f"audio_{timestamp}_{audio_file.filename}"
                    audio_path = os.path.join(AUDIO_FOLDER, audio_filename)
                    audio_file.save(audio_path)
                    audio_url = f"/static/audios/{audio_filename}"
                    print(f"DEBUG: New audio saved: {audio_path}")
                
                video_file = request.files.get('video_file')
                if video_file and video_file.filename:
                    print(f"DEBUG: New video file received: {video_file.filename}")
                    # Supprimer l'ancien fichier vidéo s'il existe
                    if current_video_url:
                        old_video_path = os.path.join(".", current_video_url.lstrip('/'))
                        if os.path.exists(old_video_path):
                            os.remove(old_video_path)
                            print(f"DEBUG: Removed old video file: {old_video_path}")
                    
                    # Sauvegarder le nouveau fichier vidéo
                    timestamp = int(time())
                    video_filename = f"video_{timestamp}_{video_file.filename}"
                    video_path = os.path.join(VIDEOS_FOLDER, video_filename)
                    video_file.save(video_path)
                    video_url = f"/static/videos/{video_filename}"
                    print(f"DEBUG: New video saved: {video_path}")
                
                # Ajouter les URLs des fichiers aux données
                data['image_url'] = image_url
                data['audio_url'] = audio_url
                data['video_url'] = video_url
                
            else:
                # Données JSON
                data = request.get_json()
                print(f"DEBUG: JSON data received for update: {data}")
            
            # Validation des champs requis
            required_fields = ['title', 'description_fr', 'description_en', 'description_wo',
                             'category', 'period', 'origin', 'room_id']
            
            missing_fields = [field for field in required_fields if field not in data or not data[field]]
            if missing_fields:
                return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
            
            # Validation du room_id
            try:
                room_id = int(data['room_id'])
            except (ValueError, TypeError):
                return jsonify({'error': 'Invalid room_id'}), 400
            
            # Vérifier que la salle existe
            room_check = cur.execute("SELECT id FROM rooms WHERE id = ?", (room_id,)).fetchone()
            if not room_check:
                conn.close()
                return jsonify({'error': 'Room not found'}), 404
            
            # Mettre à jour l'œuvre
            cur.execute("""
                UPDATE artworks SET 
                    title = ?, description_fr = ?, description_en = ?, description_wo = ?,
                    category = ?, period = ?, origin = ?, room_id = ?, 
                    image_url = ?, audio_url = ?, video_url = ?, popularity = ?
                WHERE id = ?
            """, (
                data['title'],
                data['description_fr'],
                data['description_en'],
                data['description_wo'],
                data['category'],
                data['period'],
                data['origin'],
                room_id,
                data.get('image_url'),
                data.get('audio_url'),
                data.get('video_url'),
                int(data.get('popularity', 0)),
                artwork_id
            ))
            
            conn.commit()
            
            # Récupérer l'œuvre mise à jour pour la response
            artwork_data = cur.execute("""
                SELECT a.*, r.name_fr as room_name 
                FROM artworks a
                LEFT JOIN rooms r ON a.room_id = r.id
                WHERE a.id = ?
            """, (artwork_id,)).fetchone()
            
            conn.close()
            
            print(f"DEBUG: Artwork {artwork_id} updated successfully")
            
            return jsonify({
                'id': artwork_data['id'],
                'title': artwork_data['title'],
                'description_fr': artwork_data['description_fr'],
                'description_en': artwork_data['description_en'],
                'description_wo': artwork_data['description_wo'],
                'category': artwork_data['category'],
                'period': artwork_data['period'],
                'origin': artwork_data['origin'],
                'room_id': artwork_data['room_id'],
                'room_name': artwork_data['room_name'],
                'image_url': artwork_data['image_url'],
                'audio_url': artwork_data['audio_url'],
                'video_url': artwork_data['video_url'],
                'qr_code_url': artwork_data['qr_code_url'],
                'popularity': artwork_data['popularity'],
                'view_count': artwork_data['view_count'],
                'created_at': artwork_data['created_at']
            }), 200
            
        except ValueError as e:
            print(f"DEBUG: ValueError in update_artwork: {e}")
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            print(f"DEBUG: Exception in update_artwork: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500

    @artworks_bp.route('/<int:artwork_id>', methods=['DELETE'])
    @jwt_required()
    def delete_artwork(artwork_id: int):
        """Supprime une œuvre et tous ses fichiers associés"""
        try:
            current_user = user_service.get_user_by_id(get_jwt_identity())
            if not current_user or not current_user.is_admin():
                return jsonify({'error': 'Admin access required'}), 403
            
            print(f"DEBUG: delete_artwork called for artwork {artwork_id}")
            
            conn = get_connection()
            cur = conn.cursor()
            
            # Récupérer les informations de l'œuvre avant suppression
            artwork_data = cur.execute("""
                SELECT id, title, image_url, audio_url, video_url, qr_code_url 
                FROM artworks WHERE id = ?
            """, (artwork_id,)).fetchone()
            
            if not artwork_data:
                conn.close()
                return jsonify({'error': 'Artwork not found'}), 404
            
            print(f"DEBUG: Found artwork to delete: {artwork_data['title']}")
            
            # Supprimer l'œuvre de la base de données
            cur.execute("DELETE FROM artworks WHERE id = ?", (artwork_id,))
            conn.commit()
            conn.close()
            
            # Supprimer les fichiers associés
            files_deleted = []
            
            # Supprimer le fichier image
            if artwork_data['image_url']:
                image_path = os.path.join(".", artwork_data['image_url'].lstrip('/'))
                if os.path.exists(image_path):
                    try:
                        os.remove(image_path)
                        files_deleted.append(f"image: {image_path}")
                        print(f"DEBUG: Deleted image file: {image_path}")
                    except Exception as e:
                        print(f"DEBUG: Could not delete image file {image_path}: {e}")
            
            # Supprimer le fichier audio
            if artwork_data['audio_url']:
                audio_path = os.path.join(".", artwork_data['audio_url'].lstrip('/'))
                if os.path.exists(audio_path):
                    try:
                        os.remove(audio_path)
                        files_deleted.append(f"audio: {audio_path}")
                        print(f"DEBUG: Deleted audio file: {audio_path}")
                    except Exception as e:
                        print(f"DEBUG: Could not delete audio file {audio_path}: {e}")
            
            # Supprimer le fichier vidéo
            if artwork_data['video_url']:
                video_path = os.path.join(".", artwork_data['video_url'].lstrip('/'))
                if os.path.exists(video_path):
                    try:
                        os.remove(video_path)
                        files_deleted.append(f"video: {video_path}")
                        print(f"DEBUG: Deleted video file: {video_path}")
                    except Exception as e:
                        print(f"DEBUG: Could not delete video file {video_path}: {e}")
            
            # Supprimer le QR code
            if artwork_data['qr_code_url']:
                qr_path = os.path.join(".", artwork_data['qr_code_url'].lstrip('/'))
                if os.path.exists(qr_path):
                    try:
                        os.remove(qr_path)
                        files_deleted.append(f"qr_code: {qr_path}")
                        print(f"DEBUG: Deleted QR code file: {qr_path}")
                    except Exception as e:
                        print(f"DEBUG: Could not delete QR code file {qr_path}: {e}")
            
            print(f"DEBUG: Successfully deleted artwork {artwork_id}")
            
            return jsonify({
                'message': f'Artwork {artwork_id} deleted successfully',
                'artwork_title': artwork_data['title'],
                'files_deleted': files_deleted
            }), 200
            
        except Exception as e:
            print(f"DEBUG: Exception in delete_artwork: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    
    @artworks_bp.route('/search', methods=['GET'])
    def search_artworks():
        try:
            search_text = request.args.get('q', '')
            category = request.args.get('category')
            period = request.args.get('period')
            room_id = request.args.get('room_id', type=int)
            language = request.args.get('lang', 'fr')
            
            criteria = {}
            if search_text:
                criteria['search_text'] = search_text
            if category:
                criteria['category'] = category
            if period:
                criteria['period'] = period
            if room_id:
                criteria['room_id'] = room_id
            
            artworks = artwork_service.search_artworks(criteria)
            return jsonify([artwork.to_dict(language) for artwork in artworks])
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # Routes d'administration pour compatibilité frontend
    @admin_bp.route('/rooms', methods=['GET'])
    def admin_get_rooms():
        """Route de compatibilité: /api/admin/rooms -> /api/rooms/"""
        return get_rooms()
    
    @rooms_bp.route('/', methods=['POST'])
    @jwt_required()
    def create_room():
        print("DEBUG: create_room function called")
        try:
            current_user = user_service.get_user_by_id(get_jwt_identity())
            print(f"DEBUG: Current user: {current_user}")
            if not current_user or not current_user.is_admin():
                return jsonify({'error': 'Admin access required'}), 403
            
            # Gérer FormData, form-urlencoded ou JSON
            if request.content_type and ('multipart/form-data' in request.content_type or 
                                       'application/x-www-form-urlencoded' in request.content_type):
                # Données FormData (avec ou sans fichiers)
                data = request.form.to_dict()
                print(f"DEBUG: Form data received: {data}")
                print(f"DEBUG: Content-Type: {request.content_type}")
                
                # Traiter les booléens
                data['has_audio'] = data.get('has_audio', 'false').lower() == 'true'
                data['has_interactive'] = data.get('has_interactive', 'false').lower() == 'true'
                
                # Gérer le fichier panorama si présent
                panorama_file = request.files.get('panorama_file')
                if panorama_file and panorama_file.filename:
                    print(f"DEBUG: Panorama file received: {panorama_file.filename}")
                    # TODO: Traiter l'upload du fichier
                    data['panorama_url'] = None  # Pour l'instant
                else:
                    data['panorama_url'] = None
            else:
                # Données JSON
                data = request.get_json()
                print(f"DEBUG: JSON received: {data}")
            
            required_fields = ['name_fr', 'description_fr', 'description_en', 'description_wo', 
                             'theme', 'accessibility_level']
            
            if not all(field in data for field in required_fields):
                missing = [field for field in required_fields if field not in data]
                print(f"DEBUG: Missing fields: {missing}")
                return jsonify({'error': f'Missing required fields: {missing}'}), 400
            
            # Utiliser le service application avec le DTO
            from ..application.dtos.room_dtos import CreateRoomRequest
            
            create_request = CreateRoomRequest(
                name_fr=data['name_fr'],
                name_en=data.get('name_en', data['name_fr']),
                name_wo=data.get('name_wo', data['name_fr']),
                description_fr=data['description_fr'],
                description_en=data['description_en'],
                description_wo=data['description_wo'],
                theme=data['theme'],
                accessibility_level=data['accessibility_level'],
                panorama_url=data.get('panorama_url'),
                has_audio=data.get('has_audio', False),
                has_interactive=data.get('has_interactive', False)
            )
            
            print(f"DEBUG: Creating room with user role: {current_user.role}")
            print(f"DEBUG: Create request data: {create_request}")
            
            room_response = room_service.create_room(create_request, current_user.role)
            
            print(f"DEBUG: Room response: {room_response}")
            
            if not room_response:
                return jsonify({'error': 'Failed to create room'}), 500
            
            return jsonify({
                'id': room_response.id,
                'name': room_response.name_fr,
                'description': room_response.description_fr,
                'theme': room_response.theme,
                'accessibility_level': room_response.accessibility_level,
                'panorama_url': room_response.panorama_url,
                'has_audio': room_response.has_audio,
                'has_interactive': room_response.has_interactive,
                'created_at': room_response.created_at.isoformat() if room_response.created_at else None
            }), 201
            
        except ValueError as e:
            print(f"DEBUG: ValueError in create_room: {e}")
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            import traceback
            print(f"DEBUG: Exception in create_room: {e}")
            print(f"DEBUG: Traceback: {traceback.format_exc()}")
            return jsonify({'error': str(e)}), 500
    
    @jwt_required()
    def admin_add_room():
        """Ajoute une nouvelle salle (version admin avec upload de fichier panorama)"""
        
        # Vérifier les permissions admin
        try:
            current_user = user_service.get_user_by_id(get_jwt_identity())
            if not current_user or not current_user.is_admin():
                return jsonify({'error': 'Admin access required'}), 403
        except Exception as e:
            return jsonify({'error': 'Authentication error'}), 401
        
        # Récupérer les données du formulaire
        data = request.form.to_dict()
        
        # Récupérer le fichier panorama
        panorama_file = request.files.get('panorama_file')

        print(f"DEBUG: Received room form data: {data}")

        required_fields = [
            "name_fr", "name_en", "name_wo",
            "description_fr", "description_en", "description_wo",
            "theme", "accessibility_level"
        ]

        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Champ manquant ou vide : {field}"}), 400

        # Vérifier qu'un fichier panorama est fourni
        if not panorama_file or not panorama_file.filename:
            return jsonify({"error": "Fichier panorama requis"}), 400

        # Traiter l'upload du panorama
        panorama_url = None
        if panorama_file and panorama_file.filename:
            # Créer un nom de fichier sécurisé
            filename = f"panorama_{int(time.time())}_{panorama_file.filename}"
            filename = filename.replace(' ', '_')
            
            file_path = os.path.join(IMAGES_FOLDER, filename)
            panorama_url = f"/static/images/{filename}"
            
            # Sauvegarder le fichier
            panorama_file.save(file_path)

        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO rooms (name_fr, name_en, name_wo,
                            description_fr, description_en, description_wo,
                            panorama_url, hotspots, theme, has_audio, 
                            has_interactive, accessibility_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["name_fr"], data["name_en"], data["name_wo"],
            data["description_fr"], data["description_en"], data["description_wo"],
            panorama_url, data.get("hotspots", "[]"),
            data["theme"], bool(data.get("has_audio", False)),
            bool(data.get("has_interactive", False)), data["accessibility_level"]
        ))
        conn.commit()
        room_id = cur.lastrowid
        conn.close()

        # Génération du QR Code
        room_url = f"{BASE_URL}/api/rooms/{room_id}"
        qr_path = os.path.join(QR_FOLDER, f"room_{room_id}.png")
        qr_img = qrcode.make(room_url)
        qr_img.save(qr_path)

        return jsonify({
            "message": "Salle ajoutée avec succès",
            "room_id": room_id,
            "qr_code_url": f"/static/qrcodes/room_{room_id}.png"
        }), 201

    @admin_bp.route('/rooms', methods=['POST'])
    def admin_create_room():
        """Route de compatibilité: POST /api/admin/rooms -> POST /api/rooms/"""
        # return create_room()
        return admin_add_room()
    
    @admin_bp.route('/rooms/<int:room_id>', methods=['GET'])
    def admin_get_room(room_id):
        """Route de compatibilité: /api/admin/rooms/{id} -> /api/rooms/{id}"""
        return get_room(room_id)
    
    @admin_bp.route('/rooms/<int:room_id>', methods=['PUT'])
    def admin_update_room(room_id):
        """Route de compatibilité: PUT /api/admin/rooms/{id} -> PUT /api/rooms/{id}"""
        return update_room(room_id)
    
    @admin_bp.route('/rooms/<int:room_id>', methods=['DELETE'])
    def admin_delete_room(room_id):
        """Route de compatibilité: DELETE /api/admin/rooms/{id} -> DELETE /api/rooms/{id}"""
        return delete_room(room_id)
    
    @admin_bp.route('/artworks', methods=['GET'])
    def admin_get_artworks():
        """Route admin pour récupérer toutes les œuvres directement depuis la base"""
        try:
            conn = get_connection()
            cur = conn.cursor()
            
            # Récupérer toutes les œuvres avec les noms des salles
            artworks_data = cur.execute("""
                SELECT a.*, r.name_fr as room_name_fr
                FROM artworks a
                LEFT JOIN rooms r ON a.room_id = r.id
                ORDER BY a.id DESC
            """).fetchall()
            
            conn.close()
            
            # Convertir en dictionnaires pour JSON
            artworks = []
            for artwork in artworks_data:
                artworks.append({
                    'id': artwork['id'],
                    'title': artwork['title'],
                    'description_fr': artwork['description_fr'],
                    'description_en': artwork['description_en'],
                    'description_wo': artwork['description_wo'],
                    'category': artwork['category'],
                    'period': artwork['period'],
                    'origin': artwork['origin'],
                    'room_id': artwork['room_id'],
                    'room_name': artwork['room_name_fr'],
                    'image_url': artwork['image_url'],
                    'audio_url': artwork['audio_url'],
                    'video_url': artwork['video_url'],
                    'qr_code_url': artwork['qr_code_url'],
                    'popularity': artwork['popularity'],
                    'view_count': artwork['view_count'],
                    'created_at': artwork['created_at']
                })
            
            return jsonify(artworks)
            
        except Exception as e:
            print(f"DEBUG: Error in admin_get_artworks: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    
    @admin_bp.route('/artworks', methods=['POST'])
    def admin_create_artwork():
        """Route de compatibilité: POST /api/admin/artworks -> POST /api/artworks/"""
        return create_artwork()
    
    @admin_bp.route('/artworks/<int:artwork_id>', methods=['PUT'])
    def admin_update_artwork(artwork_id):
        """Route de compatibilité: PUT /api/admin/artworks/{id} -> PUT /api/artworks/{id}"""
        return update_artwork(artwork_id)
    
    @admin_bp.route('/artworks/<int:artwork_id>', methods=['DELETE'])
    def admin_delete_artwork(artwork_id):
        """Route de compatibilité: DELETE /api/admin/artworks/{id} -> DELETE /api/artworks/{id}"""
        return delete_artwork(artwork_id)
    
    @admin_bp.route('/stats', methods=['GET'])
    def admin_get_stats():
        """Récupère les statistiques complètes pour le dashboard admin"""
        nonlocal room_service
        try:
            stats = room_service.get_statistics()
            return jsonify(stats)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    return {
        'api': api_bp,
        'auth': auth_bp,
        'users': users_bp,
        'rooms': rooms_bp,
        'artworks': artworks_bp,
        'admin': admin_bp
    }