"""
SQLite implementation of repository interfaces
"""
import sqlite3
from typing import List, Optional, Dict, Any
from datetime import datetime

from ...domain.entities.user import User
from ...domain.entities.room import Room, MultilingualText
from ...domain.entities.artwork import Artwork
from ...domain.repositories.repository_interfaces import UserRepository, RoomRepository, ArtworkRepository


class SQLiteUserRepository(UserRepository):
    """SQLite implementation of UserRepository"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def _get_connection(self) -> sqlite3.Connection:
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            
            if row:
                # Conversion sécurisée pour les colonnes optionnelles
                email = row['email'] if 'email' in row.keys() else None
                is_active = row['is_active'] if 'is_active' in row.keys() else True
                
                return User(
                    username=row['username'],
                    password_hash=row['password_hash'],
                    role=row['role'],
                    email=email,
                    is_active=is_active,
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
            return None
    
    def find_by_id(self, user_id: int) -> Optional[User]:
        """Alias for get_by_id for compatibility"""
        return self.get_by_id(user_id)
    
    def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
            row = cursor.fetchone()
            
            if row:
                # Conversion sécurisée pour les colonnes optionnelles
                email = row['email'] if 'email' in row.keys() else None
                is_active = row['is_active'] if 'is_active' in row.keys() else True
                
                return User(
                    username=row['username'],
                    password_hash=row['password_hash'],
                    role=row['role'],
                    email=email,
                    is_active=is_active,
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
            return None
    
    def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        # Note: La table users existante n'a pas de colonne email
        # Pour maintenir la compatibilité, on retourne None
        return None
    
    def save(self, user: User) -> User:
        """Save or update user"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            if user.id is None:
                # Insert new user (sans email car pas dans le schéma)
                cursor.execute("""
                    INSERT INTO users (username, password_hash, role, created_at)
                    VALUES (?, ?, ?, ?)
                """, (user.username, user.password_hash, user.role, 
                      user.created_at.isoformat() if user.created_at else datetime.now().isoformat()))
                
                user_id = cursor.lastrowid
                user._id = user_id
            else:
                # Update existing user (sans email)
                cursor.execute("""
                    UPDATE users 
                    SET username = ?, password_hash = ?, role = ?
                    WHERE id = ?
                """, (user.username, user.password_hash, user.role, user.id))
            
            conn.commit()
            return user
    
    def delete(self, user_id: int) -> bool:
        """Delete user by ID"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
            conn.commit()
            return cursor.rowcount > 0
    
    def get_all(self) -> List[User]:
        """Get all users"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users ORDER BY created_at DESC")
            rows = cursor.fetchall()
            
            return [
                User(
                    username=row['username'],
                    email="",  # Email pas disponible dans le schéma existant
                    password_hash=row['password_hash'],
                    role=row['role'],
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
                for row in rows
            ]


class SQLiteRoomRepository(RoomRepository):
    """SQLite implementation of RoomRepository"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def _get_connection(self) -> sqlite3.Connection:
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def get_by_id(self, room_id: int) -> Optional[Room]:
        """Get room by ID"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM rooms WHERE id = ?", (room_id,))
            row = cursor.fetchone()
            
            if row:
                name = MultilingualText(
                    fr=row['name_fr'] or "",
                    en=row['name_en'] or "",
                    wo=row['name_wo'] or ""
                )
                description = MultilingualText(
                    fr=row['description_fr'] or "",
                    en=row['description_en'] or "",
                    wo=row['description_wo'] or ""
                )
                accessibility_level = row['accessibility_level'] if 'accessibility_level' in row.keys() else 'facile'
                theme = row['theme'] if 'theme' in row.keys() else 'Art général'
                
                return Room(
                    name=name,
                    description=description,
                    theme=theme,
                    accessibility_level=accessibility_level,
                    panorama_url=row['panorama_url'] if 'panorama_url' in row.keys() else None,
                    hotspots=row['hotspots'] if 'hotspots' in row.keys() else "[]",
                    has_audio=bool(row['has_audio']) if 'has_audio' in row.keys() else False,
                    has_interactive=bool(row['has_interactive']) if 'has_interactive' in row.keys() else False,
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
            return None
    
    def get_all(self) -> List[Room]:
        """Get all rooms"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM rooms ORDER BY name_fr")
            rows = cursor.fetchall()
            
            return [
                Room(
                    name=MultilingualText(
                        fr=row['name_fr'] or "",
                        en=row['name_en'] or "",
                        wo=row['name_wo'] or ""
                    ),
                    description=MultilingualText(
                        fr=row['description_fr'] or "",
                        en=row['description_en'] or "",
                        wo=row['description_wo'] or ""
                    ),
                    theme=row['theme'] if 'theme' in row.keys() else 'Art général',
                    accessibility_level=row['accessibility_level'] if 'accessibility_level' in row.keys() else 'facile',
                    panorama_url=row['panorama_url'] if 'panorama_url' in row.keys() else None,
                    hotspots=row['hotspots'] if 'hotspots' in row.keys() else "[]",
                    has_audio=bool(row['has_audio']) if 'has_audio' in row.keys() else False,
                    has_interactive=bool(row['has_interactive']) if 'has_interactive' in row.keys() else False,
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
                for row in rows
            ]
    
    def save(self, room: Room) -> Room:
        """Save or update room"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            if room.id is None:
                # Insert new room - adapter au schéma existant
                cursor.execute("""
                    INSERT INTO rooms (name_fr, name_en, name_wo, description_fr, description_en, description_wo, 
                                     theme, accessibility_level, panorama_url, hotspots, has_audio, has_interactive, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (room.name.fr, room.name.en, room.name.wo,
                      room.description.fr, room.description.en, room.description.wo,
                      room.theme, room.accessibility_level, room.panorama_url, room.hotspots,
                      room.has_audio, room.has_interactive,
                      room.created_at.isoformat() if room.created_at else datetime.now().isoformat()))
                
                room_id = cursor.lastrowid
                room._id = room_id
            else:
                # Update existing room
                cursor.execute("""
                    UPDATE rooms 
                    SET name_fr = ?, name_en = ?, name_wo = ?, description_fr = ?, description_en = ?, description_wo = ?,
                        theme = ?, accessibility_level = ?, panorama_url = ?, hotspots = ?, has_audio = ?, has_interactive = ?
                    WHERE id = ?
                """, (room.name.fr, room.name.en, room.name.wo,
                      room.description.fr, room.description.en, room.description.wo,
                      room.theme, room.accessibility_level, room.panorama_url, room.hotspots,
                      room.has_audio, room.has_interactive, room.id))
            
            conn.commit()
            return room
    
    def delete(self, room_id: int) -> bool:
        """Delete room by ID"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM rooms WHERE id = ?", (room_id,))
            conn.commit()
            return cursor.rowcount > 0
    
    def search(self, criteria: Dict[str, Any]) -> List[Room]:
        """Search rooms by criteria"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            query = "SELECT * FROM rooms WHERE 1=1"
            params = []
            
            # Adapter les critères au schéma existant
            if 'accessibility_level' in criteria:
                query += " AND accessibility_level = ?"
                params.append(criteria['accessibility_level'])
            
            if 'theme' in criteria:
                query += " AND theme = ?"
                params.append(criteria['theme'])
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            return [
                Room(
                    name=MultilingualText(
                        fr=row['name_fr'] or "",
                        en=row['name_en'] or "",
                        wo=row['name_wo'] or ""
                    ),
                    description=MultilingualText(
                        fr=row['description_fr'] or "",
                        en=row['description_en'] or "",
                        wo=row['description_wo'] or ""
                    ),
                    theme=row['theme'] if 'theme' in row.keys() else 'Art général',
                    accessibility_level=row['accessibility_level'] if 'accessibility_level' in row.keys() else 'facile',
                    panorama_url=row['panorama_url'] if 'panorama_url' in row.keys() else None,
                    hotspots=row['hotspots'] if 'hotspots' in row.keys() else "[]",
                    has_audio=bool(row['has_audio']) if 'has_audio' in row.keys() else False,
                    has_interactive=bool(row['has_interactive']) if 'has_interactive' in row.keys() else False,
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
                for row in rows
            ]


class SQLiteArtworkRepository(ArtworkRepository):
    """SQLite implementation of ArtworkRepository"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def _get_connection(self) -> sqlite3.Connection:
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def get_by_id(self, artwork_id: int) -> Optional[Artwork]:
        """Get artwork by ID"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM artworks WHERE id = ?", (artwork_id,))
            row = cursor.fetchone()
            
            if row:
                description = MultilingualText(
                    fr=row['description_fr'],
                    en=row['description_en'],
                    wo=row['description_wo']
                )
                return Artwork(
                    title=row['title'],
                    description=description,
                    category=row['category'],
                    period=row['period'],
                    origin=row['origin'],
                    room_id=row['room_id'],
                    image_url=row['image_url'],
                    audio_url=row['audio_url'],
                    video_url=row['video_url'],
                    qr_code_url=row['qr_code_url'],
                    popularity=row['popularity'] or 0,
                    view_count=row['view_count'] or 0,
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
            return None
    
    def get_all(self) -> List[Artwork]:
        """Get all artworks"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM artworks ORDER BY title")
            rows = cursor.fetchall()
            
            return [
                Artwork(
                    title=row['title'],
                    description=MultilingualText(
                        fr=row['description_fr'],
                        en=row['description_en'],
                        wo=row['description_wo']
                    ),
                    category=row['category'],
                    period=row['period'],
                    origin=row['origin'],
                    room_id=row['room_id'],
                    image_url=row['image_url'],
                    audio_url=row['audio_url'],
                    video_url=row['video_url'],
                    qr_code_url=row['qr_code_url'],
                    popularity=row['popularity'] or 0,
                    view_count=row['view_count'] or 0,
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
                for row in rows
            ]
    
    def get_by_room_id(self, room_id: int) -> List[Artwork]:
        """Get all artworks in a specific room"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM artworks WHERE room_id = ? ORDER BY title", (room_id,))
            rows = cursor.fetchall()
            
            return [
                Artwork(
                    title=row['title'],
                    description=MultilingualText(
                        fr=row['description_fr'],
                        en=row['description_en'],
                        wo=row['description_wo']
                    ),
                    category=row['category'],
                    period=row['period'],
                    origin=row['origin'],
                    room_id=row['room_id'],
                    image_url=row['image_url'],
                    audio_url=row['audio_url'],
                    video_url=row['video_url'],
                    qr_code_url=row['qr_code_url'],
                    popularity=row['popularity'] or 0,
                    view_count=row['view_count'] or 0,
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
                for row in rows
            ]
    
    def get_by_category(self, category: str) -> List[Artwork]:
        """Get artworks by category"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM artworks WHERE category = ? ORDER BY title", (category,))
            rows = cursor.fetchall()
            
            return [
                Artwork(
                    title=row['title'],
                    description=MultilingualText(
                        fr=row['description_fr'],
                        en=row['description_en'],
                        wo=row['description_wo']
                    ),
                    category=row['category'],
                    period=row['period'],
                    origin=row['origin'],
                    room_id=row['room_id'],
                    image_url=row['image_url'],
                    audio_url=row['audio_url'],
                    video_url=row['video_url'],
                    qr_code_url=row['qr_code_url'],
                    popularity=row['popularity'] or 0,
                    view_count=row['view_count'] or 0,
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
                for row in rows
            ]
    
    def get_popular(self, limit: int = 10) -> List[Artwork]:
        """Get most popular artworks"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM artworks 
                ORDER BY popularity DESC, view_count DESC 
                LIMIT ?
            """, (limit,))
            rows = cursor.fetchall()
            
            return [
                Artwork(
                    title=row['title'],
                    description=MultilingualText(
                        fr=row['description_fr'],
                        en=row['description_en'],
                        wo=row['description_wo']
                    ),
                    category=row['category'],
                    period=row['period'],
                    origin=row['origin'],
                    room_id=row['room_id'],
                    image_url=row['image_url'],
                    audio_url=row['audio_url'],
                    video_url=row['video_url'],
                    qr_code_url=row['qr_code_url'],
                    popularity=row['popularity'] or 0,
                    view_count=row['view_count'] or 0,
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
                for row in rows
            ]
    
    def save(self, artwork: Artwork) -> Artwork:
        """Save or update artwork"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            if artwork.id is None:
                # Insert new artwork
                cursor.execute("""
                    INSERT INTO artworks (title, description_fr, description_en, description_wo,
                                        category, period, origin, room_id, image_url, audio_url,
                                        video_url, qr_code_url, popularity, view_count, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (artwork.title, artwork.description.fr, artwork.description.en, artwork.description.wo,
                      artwork.category, artwork.period, artwork.origin, artwork.room_id,
                      artwork.image_url, artwork.audio_url, artwork.video_url, artwork.qr_code_url,
                      artwork.popularity, artwork.view_count,
                      artwork.created_at.isoformat() if artwork.created_at else datetime.now().isoformat()))
                
                artwork_id = cursor.lastrowid
                artwork._id = artwork_id
            else:
                # Update existing artwork
                cursor.execute("""
                    UPDATE artworks 
                    SET title = ?, description_fr = ?, description_en = ?, description_wo = ?,
                        category = ?, period = ?, origin = ?, room_id = ?, image_url = ?,
                        audio_url = ?, video_url = ?, qr_code_url = ?, popularity = ?, view_count = ?
                    WHERE id = ?
                """, (artwork.title, artwork.description.fr, artwork.description.en, artwork.description.wo,
                      artwork.category, artwork.period, artwork.origin, artwork.room_id,
                      artwork.image_url, artwork.audio_url, artwork.video_url, artwork.qr_code_url,
                      artwork.popularity, artwork.view_count, artwork.id))
            
            conn.commit()
            return artwork
    
    def delete(self, artwork_id: int) -> bool:
        """Delete artwork by ID"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM artworks WHERE id = ?", (artwork_id,))
            conn.commit()
            return cursor.rowcount > 0
    
    def search(self, criteria: Dict[str, Any]) -> List[Artwork]:
        """Search artworks by criteria"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            query = "SELECT * FROM artworks WHERE 1=1"
            params = []
            
            if 'category' in criteria:
                query += " AND category = ?"
                params.append(criteria['category'])
            
            if 'period' in criteria:
                query += " AND period = ?"
                params.append(criteria['period'])
            
            if 'room_id' in criteria:
                query += " AND room_id = ?"
                params.append(criteria['room_id'])
            
            if 'search_text' in criteria:
                query += " AND (title LIKE ? OR description_fr LIKE ? OR description_en LIKE ?)"
                search_term = f"%{criteria['search_text']}%"
                params.extend([search_term, search_term, search_term])
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            return [
                Artwork(
                    title=row['title'],
                    description=MultilingualText(
                        fr=row['description_fr'],
                        en=row['description_en'],
                        wo=row['description_wo']
                    ),
                    category=row['category'],
                    period=row['period'],
                    origin=row['origin'],
                    room_id=row['room_id'],
                    image_url=row['image_url'],
                    audio_url=row['audio_url'],
                    video_url=row['video_url'],
                    qr_code_url=row['qr_code_url'],
                    popularity=row['popularity'] or 0,
                    view_count=row['view_count'] or 0,
                    id=row['id'],
                    created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None
                )
                for row in rows
            ]
    
    def increment_view_count(self, artwork_id: int) -> bool:
        """Increment view count for artwork"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE artworks 
                SET view_count = view_count + 1 
                WHERE id = ?
            """, (artwork_id,))
            conn.commit()
            return cursor.rowcount > 0