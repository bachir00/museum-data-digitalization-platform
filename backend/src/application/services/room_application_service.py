"""
Room Application Service - Use Cases for Room Management
"""
from typing import Optional, List

from ..dtos.room_dtos import (
    CreateRoomRequest, UpdateRoomRequest, RoomSearchRequest, RoomResponse
)
from ...domain.entities.room import Room
from ...domain.repositories.repository_interfaces import RoomRepository, ArtworkRepository


class RoomApplicationService:
    """
    Service applicatif pour les cas d'usage des salles
    Orchestre les opérations métier via les repositories du domaine
    """
    
    def __init__(self, room_repository: RoomRepository, artwork_repository: ArtworkRepository):
        self._room_repository = room_repository
        self._artwork_repository = artwork_repository
    
    def get_all_rooms(self, include_artwork_count: bool = False) -> List[RoomResponse]:
        """
        Use Case: Récupération de toutes les salles
        
        Args:
            include_artwork_count: Inclure le nombre d'œuvres par salle
            
        Returns:
            Liste des salles avec informations enrichies
        """
        try:
            rooms = self._room_repository.get_all()
            responses = []
            
            for room in rooms:
                artwork_count = None
                if include_artwork_count:
                    artworks = self._artwork_repository.get_by_room_id(room.id)
                    artwork_count = len(artworks)
                
                responses.append(RoomResponse.from_entity(room, artwork_count))
            
            return responses
        except Exception:
            return []
    
    def get_room_details(self, room_id: int, include_artwork_count: bool = False) -> Optional[RoomResponse]:
        """
        Use Case: Récupération des détails d'une salle
        
        Args:
            room_id: ID de la salle
            include_artwork_count: Inclure le nombre d'œuvres
            
        Returns:
            Détails de la salle ou None si non trouvée
        """
        try:
            room = self._room_repository.get_by_id(room_id)
            if not room:
                return None
            
            artwork_count = None
            if include_artwork_count:
                artworks = self._artwork_repository.get_by_room_id(room_id)
                artwork_count = len(artworks)
            
            return RoomResponse.from_entity(room, artwork_count)
        except Exception:
            return None
    
    def get_room_by_id(self, room_id: int) -> Optional[RoomResponse]:
        """Alias pour get_room_details pour compatibilité avec le controller"""
        return self.get_room_details(room_id, include_artwork_count=False)
    
    def create_room(self, request: CreateRoomRequest, requesting_user_role: str) -> Optional[RoomResponse]:
        """
        Use Case: Création d'une nouvelle salle (admin uniquement)
        
        Args:
            request: Données de création
            requesting_user_role: Rôle de l'utilisateur demandeur
            
        Returns:
            Salle créée ou None si erreur
        """
        try:
            # Vérifier permissions admin
            if requesting_user_role != "admin":
                return None
            
            # Valider les données d'entrée
            validation_error = self._validate_create_room_request(request)
            if validation_error:
                return None
            
            # Créer la salle via l'entité domaine
            room = Room.create(
                name_fr=request.name_fr,
                name_en=request.name_en,
                name_wo=request.name_wo,
                description_fr=request.description_fr,
                description_en=request.description_en,
                description_wo=request.description_wo,
                theme=request.theme,
                accessibility_level=self._map_accessibility_level(request.accessibility_level),
                panorama_url=request.panorama_url,
                has_audio=request.has_audio,
                has_interactive=request.has_interactive
            )
            
            # Sauvegarder via le repository
            saved_room = self._room_repository.save(room)
            
            return RoomResponse.from_entity(saved_room) if saved_room else None
            
        except Exception as e:
            print(f"Error creating room: {e}")
            return None
    
    def update_room(self, request: UpdateRoomRequest, requesting_user_role: str) -> Optional[RoomResponse]:
        """
        Use Case: Mise à jour d'une salle (admin uniquement)
        
        Args:
            request: Données de mise à jour
            requesting_user_role: Rôle de l'utilisateur demandeur
            
        Returns:
            Salle mise à jour ou None si erreur
        """
        try:
            # Vérifier permissions admin
            if requesting_user_role != "admin":
                return None
            
            # Récupérer la salle existante
            room = self._room_repository.get_by_id(request.room_id)
            if not room:
                return None
            
            # Mettre à jour les champs modifiés
            if request.theme is not None:
                room.set_theme(request.theme)
            
            if request.accessibility_level is not None:
                room.set_accessibility_level(request.accessibility_level)
            
            if request.panorama_url is not None:
                room.set_panorama_url(request.panorama_url)
            
            if request.has_audio is not None:
                room.set_audio_availability(request.has_audio)
            
            if request.has_interactive is not None:
                room.set_interactive_availability(request.has_interactive)
            
            # Sauvegarder via le repository
            updated_room = self._room_repository.save(room)
            
            return RoomResponse.from_entity(updated_room) if updated_room else None
            
        except Exception:
            return None
    
    def search_rooms(self, request: RoomSearchRequest) -> List[RoomResponse]:
        """
        Use Case: Recherche de salles selon des critères
        
        Args:
            request: Critères de recherche
            
        Returns:
            Liste des salles correspondantes
        """
        try:
            # Construire les critères de recherche
            criteria = {}
            
            if request.theme:
                criteria['theme'] = request.theme
            
            if request.accessibility_level:
                criteria['accessibility_level'] = request.accessibility_level
            
            if request.has_audio is not None:
                criteria['has_audio'] = request.has_audio
            
            if request.has_interactive is not None:
                criteria['has_interactive'] = request.has_interactive
            
            # Rechercher via le repository
            rooms = self._room_repository.search(criteria)
            
            return [RoomResponse.from_entity(room) for room in rooms]
            
        except Exception:
            return []
    
    def get_available_themes(self) -> List[str]:
        """
        Use Case: Récupération des thèmes disponibles
        
        Returns:
            Liste des thèmes uniques
        """
        try:
            rooms = self._room_repository.get_all()
            themes = list(set(room.theme for room in rooms if room.theme))
            return sorted(themes)
        except Exception:
            return []
    
    def get_accessibility_levels(self) -> List[str]:
        """
        Use Case: Récupération des niveaux d'accessibilité disponibles
        
        Returns:
            Liste des niveaux d'accessibilité
        """
        return ["low", "medium", "high", "full"]
    
    def get_room_statistics(self) -> dict:
        """
        Use Case: Récupération des statistiques des salles
        
        Returns:
            Statistiques générales des salles
        """
        try:
            rooms = self._room_repository.get_all()
            
            total_rooms = len(rooms)
            rooms_with_audio = sum(1 for room in rooms if room.has_audio)
            rooms_with_interactive = sum(1 for room in rooms if room.has_interactive)
            themes = list(set(room.theme for room in rooms if room.theme))
            
            return {
                "total_rooms": total_rooms,
                "rooms_with_audio": rooms_with_audio,
                "rooms_with_interactive": rooms_with_interactive,
                "available_themes": themes,
                "audio_percentage": (rooms_with_audio / total_rooms * 100) if total_rooms > 0 else 0,
                "interactive_percentage": (rooms_with_interactive / total_rooms * 100) if total_rooms > 0 else 0
            }
        except Exception:
            return {}
    
    def _validate_create_room_request(self, request: CreateRoomRequest) -> Optional[str]:
        """Valider les données de création de salle"""
        if not request.name_fr or not request.name_fr.strip():
            return "Le nom français est requis"
        
        if not request.name_en or not request.name_en.strip():
            return "Le nom anglais est requis"
        
        if not request.name_wo or not request.name_wo.strip():
            return "Le nom wolof est requis"
        
        if not request.description_fr or not request.description_fr.strip():
            return "La description française est requise"
        
        if not request.theme or not request.theme.strip():
            return "Le thème est requis"
        
        if request.accessibility_level not in ["low", "medium", "high", "full"]:
            return "Niveau d'accessibilité invalide"
        
        return None
    
    def _map_accessibility_level(self, level: str) -> str:
        """Map accessibility levels to domain constants"""
        from ...domain.entities.room import RoomAccessibility
        
        mapping = {
            # API levels (English)
            "low": RoomAccessibility.EASY,
            "medium": RoomAccessibility.MODERATE, 
            "high": RoomAccessibility.ADVANCED,
            "full": RoomAccessibility.ADVANCED,
            # Frontend levels (French - from AdminRoomsPage.jsx)
            "facile": RoomAccessibility.EASY,
            "modéré": RoomAccessibility.MODERATE,
            "avancé": RoomAccessibility.ADVANCED
        }
        return mapping.get(level, RoomAccessibility.MODERATE)
    
    def get_statistics(self) -> dict:
        """
        Use Case: Récupération des statistiques complètes pour le dashboard admin
        
        Returns:
            Dictionnaire avec toutes les statistiques
        """
        try:
            # Récupérer toutes les données
            rooms = self._room_repository.get_all()
            artworks = self._artwork_repository.get_all()
            
            # Statistiques de base
            total_rooms = len(rooms)
            total_artworks = len(artworks)
            
            # Statistiques des salles
            audio_rooms = len([r for r in rooms if r.has_audio])
            interactive_rooms = len([r for r in rooms if r.has_interactive])
            
            # Statistiques des œuvres avec multimédias  
            artworks_with_image = len([a for a in artworks if a.image_url])
            artworks_with_audio = len([a for a in artworks if a.audio_url])
            artworks_with_video = len([a for a in artworks if a.video_url])
            
            # Statistiques par catégorie
            categories = {}
            for artwork in artworks:
                if artwork.category:
                    categories[artwork.category] = categories.get(artwork.category, 0) + 1
            categories_list = [{"category": k, "count": v} for k, v in sorted(categories.items(), key=lambda x: x[1], reverse=True)]
            
            # Statistiques par période
            periods = {}
            for artwork in artworks:
                if artwork.period:
                    periods[artwork.period] = periods.get(artwork.period, 0) + 1
            periods_list = [{"period": k, "count": v} for k, v in sorted(periods.items(), key=lambda x: x[1], reverse=True)]
            
            # Statistiques par origine (top 5)
            origins = {}
            for artwork in artworks:
                if artwork.origin:
                    origins[artwork.origin] = origins.get(artwork.origin, 0) + 1
            origins_sorted = sorted(origins.items(), key=lambda x: x[1], reverse=True)[:5]
            origins_list = [{"origin": k, "count": v} for k, v in origins_sorted]
            
            # Statistiques par thème des salles
            room_themes = {}
            for room in rooms:
                if room.theme:
                    room_themes[room.theme] = room_themes.get(room.theme, 0) + 1
            room_themes_list = [{"theme": k, "count": v} for k, v in sorted(room_themes.items(), key=lambda x: x[1], reverse=True)]
            
            # Popularité moyenne
            popularities = [a.popularity for a in artworks if a.popularity and a.popularity > 0]
            avg_popularity = sum(popularities) / len(popularities) if popularities else 0
            
            # Top 5 œuvres les plus populaires
            top_artworks = sorted([a for a in artworks if a.popularity and a.popularity > 0], 
                                key=lambda x: x.popularity, reverse=True)[:5]
            top_artworks_list = []
            for artwork in top_artworks:
                room = self._room_repository.get_by_id(artwork.room_id)
                top_artworks_list.append({
                    "title": artwork.title,
                    "popularity": artwork.popularity,
                    "room_name": room.name.fr if room else "Salle inconnue"
                })
            
            return {
                'overview': {
                    'total_rooms': total_rooms,
                    'total_artworks': total_artworks,
                    'audio_rooms': audio_rooms,
                    'interactive_rooms': interactive_rooms,
                    'recent_artworks': 0,
                    'recent_rooms': 0,
                    'avg_popularity': round(avg_popularity, 1) if avg_popularity else 0
                },
                'artworks': {
                    'with_image': artworks_with_image,
                    'with_audio': artworks_with_audio,
                    'with_video': artworks_with_video,
                    'by_category': categories_list,
                    'by_period': periods_list,
                    'by_origin': origins_list,
                    'top_popular': top_artworks_list
                },
                'rooms': {
                    'by_theme': room_themes_list,
                    'with_audio': audio_rooms,
                    'with_interactive': interactive_rooms
                }
            }
            

        except Exception as e:
            return {}