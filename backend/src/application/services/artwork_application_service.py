"""
Artwork Application Service - Use Cases for Artwork Management
"""
from typing import Optional, List

from ..dtos.artwork_dtos import (
    CreateArtworkRequest, UpdateArtworkRequest, ArtworkSearchRequest,
    ViewArtworkRequest, ArtworkResponse, PopularArtworksRequest
)
from ...domain.entities.artwork import Artwork
from ...domain.repositories.repository_interfaces import ArtworkRepository, RoomRepository
from ...domain.services.qr_code_service import QRCodeService


class ArtworkApplicationService:
    """
    Service applicatif pour les cas d'usage des œuvres d'art
    Orchestre les opérations métier via les services et repositories du domaine
    """
    
    def __init__(self, artwork_repository: ArtworkRepository, room_repository: RoomRepository, frontend_url: str):
        self._artwork_repository = artwork_repository
        self._room_repository = room_repository
        self._qr_service = QRCodeService()
        self._frontend_url = frontend_url
    
    def get_all_artworks(self, include_room_names: bool = False) -> List[ArtworkResponse]:
        """
        Use Case: Récupération de toutes les œuvres
        
        Args:
            include_room_names: Inclure les noms des salles
            
        Returns:
            Liste des œuvres avec informations enrichies
        """
        try:
            artworks = self._artwork_repository.get_all()
            responses = []
            
            for artwork in artworks:
                room_name = None
                if include_room_names:
                    room = self._room_repository.get_by_id(artwork.room_id)
                    room_name = room.name_fr if room else None
                
                responses.append(ArtworkResponse.from_entity(artwork, room_name))
            
            return responses
        except Exception:
            return []
    
    def view_artwork(self, request: ViewArtworkRequest) -> Optional[ArtworkResponse]:
        """
        Use Case: Consultation d'une œuvre (avec incrémentation des vues)
        
        Args:
            request: Demande de consultation
            
        Returns:
            Détails de l'œuvre ou None si non trouvée
        """
        try:
            # Récupérer l'œuvre
            artwork = self._artwork_repository.get_by_id(request.artwork_id)
            if not artwork:
                return None
            
            # Incrémenter le compteur de vues si demandé
            if request.increment_views:
                self._artwork_repository.increment_view_count(request.artwork_id)
                # Recharger l'œuvre avec le nouveau compteur
                artwork = self._artwork_repository.get_by_id(request.artwork_id)
            
            # Enrichir avec le nom de la salle
            room = self._room_repository.get_by_id(artwork.room_id)
            room_name = room.name_fr if room else None
            
            return ArtworkResponse.from_entity(artwork, room_name)
            
        except Exception:
            return None
    
    def get_artworks_by_room(self, room_id: int, include_room_name: bool = False) -> List[ArtworkResponse]:
        """
        Use Case: Récupération des œuvres d'une salle
        
        Args:
            room_id: ID de la salle
            include_room_name: Inclure le nom de la salle
            
        Returns:
            Liste des œuvres de la salle
        """
        try:
            artworks = self._artwork_repository.get_by_room_id(room_id)
            
            room_name = None
            if include_room_name and artworks:
                room = self._room_repository.get_by_id(room_id)
                room_name = room.name_fr if room else None
            
            return [ArtworkResponse.from_entity(artwork, room_name) for artwork in artworks]
            
        except Exception:
            return []
    
    def create_artwork(self, request: CreateArtworkRequest, requesting_user_role: str) -> Optional[ArtworkResponse]:
        """
        Use Case: Création d'une nouvelle œuvre (admin uniquement)
        
        Args:
            request: Données de création
            requesting_user_role: Rôle de l'utilisateur demandeur
            
        Returns:
            Œuvre créée ou None si erreur
        """
        try:
            # Vérifier permissions admin
            if requesting_user_role != "admin":
                return None
            
            # Valider les données d'entrée
            validation_error = self._validate_create_artwork_request(request)
            if validation_error:
                return None
            
            # Vérifier que la salle existe
            room = self._room_repository.get_by_id(request.room_id)
            if not room:
                return None
            
            # Créer l'œuvre via l'entité domaine
            artwork = Artwork.create(
                title=request.title,
                description_fr=request.description_fr,
                description_en=request.description_en,
                description_wo=request.description_wo,
                category=request.category,
                period=request.period,
                origin=request.origin,
                room_id=request.room_id,
                image_url=request.image_url,
                audio_url=request.audio_url,
                video_url=request.video_url
            )
            
            # Sauvegarder pour obtenir l'ID
            saved_artwork = self._artwork_repository.save(artwork)
            
            # Générer le QR code
            if saved_artwork and saved_artwork.id:
                qr_code_data = self._qr_service.generate_qr_code_for_artwork(
                    saved_artwork.id,
                    self._frontend_url
                )
                saved_artwork.set_qr_code(qr_code_data)
                # Sauvegarder à nouveau avec le QR code
                saved_artwork = self._artwork_repository.save(saved_artwork)
            
            return ArtworkResponse.from_entity(saved_artwork, room.name_fr) if saved_artwork else None
            
        except Exception:
            return None
    
    def update_artwork(self, request: UpdateArtworkRequest, requesting_user_role: str) -> Optional[ArtworkResponse]:
        """
        Use Case: Mise à jour d'une œuvre (admin uniquement)
        
        Args:
            request: Données de mise à jour
            requesting_user_role: Rôle de l'utilisateur demandeur
            
        Returns:
            Œuvre mise à jour ou None si erreur
        """
        try:
            # Vérifier permissions admin
            if requesting_user_role != "admin":
                return None
            
            # Récupérer l'œuvre existante
            artwork = self._artwork_repository.get_by_id(request.artwork_id)
            if not artwork:
                return None
            
            # Mettre à jour les champs modifiés
            if request.room_id is not None:
                # Vérifier que la nouvelle salle existe
                room = self._room_repository.get_by_id(request.room_id)
                if room:
                    artwork.move_to_room(request.room_id)
            
            if request.popularity is not None:
                artwork.set_popularity(request.popularity)
            
            if request.image_url is not None:
                artwork.set_image_url(request.image_url)
            
            if request.audio_url is not None:
                artwork.set_audio_url(request.audio_url)
            
            if request.video_url is not None:
                artwork.set_video_url(request.video_url)
            
            # Sauvegarder via le repository
            updated_artwork = self._artwork_repository.save(artwork)
            
            # Enrichir avec le nom de la salle
            room = self._room_repository.get_by_id(updated_artwork.room_id)
            room_name = room.name_fr if room else None
            
            return ArtworkResponse.from_entity(updated_artwork, room_name) if updated_artwork else None
            
        except Exception:
            return None
    
    def search_artworks(self, request: ArtworkSearchRequest) -> List[ArtworkResponse]:
        """
        Use Case: Recherche d'œuvres selon des critères
        
        Args:
            request: Critères de recherche
            
        Returns:
            Liste des œuvres correspondantes
        """
        try:
            # Construire les critères de recherche
            criteria = {}
            
            if request.query:
                criteria['query'] = request.query
            
            if request.category:
                criteria['category'] = request.category
            
            if request.period:
                criteria['period'] = request.period
            
            if request.origin:
                criteria['origin'] = request.origin
            
            if request.room_id:
                criteria['room_id'] = request.room_id
            
            # Rechercher via le repository
            artworks = self._artwork_repository.search(criteria)
            
            # Limiter les résultats si demandé
            if request.limit and request.limit > 0:
                artworks = artworks[:request.limit]
            
            # Enrichir avec les noms des salles
            responses = []
            for artwork in artworks:
                room = self._room_repository.get_by_id(artwork.room_id)
                room_name = room.name_fr if room else None
                responses.append(ArtworkResponse.from_entity(artwork, room_name))
            
            return responses
            
        except Exception:
            return []
    
    def get_popular_artworks(self, limit_or_request) -> List[ArtworkResponse]:
        """
        Use Case: Récupération des œuvres populaires
        
        Args:
            limit_or_request: Soit un entier (limite) soit un PopularArtworksRequest
            
        Returns:
            Liste des œuvres populaires
        """
        try:
            # Support des deux types d'appels pour compatibilité contrôleur
            if isinstance(limit_or_request, int):
                limit = limit_or_request
                category = None
            else:
                # C'est un PopularArtworksRequest
                limit = limit_or_request.limit
                category = getattr(limit_or_request, 'category', None)
            
            artworks = self._artwork_repository.get_popular(limit)
            
            # Filtrer par catégorie si demandé
            if category:
                artworks = [a for a in artworks if a.category == category]
            
            # Enrichir avec les noms des salles
            responses = []
            for artwork in artworks:
                room = self._room_repository.get_by_id(artwork.room_id)
                room_name = room.name_fr if room else None
                responses.append(ArtworkResponse.from_entity(artwork, room_name))
            
            return responses
            
        except Exception:
            return []
    
    def get_artworks_by_category(self, category: str) -> List[ArtworkResponse]:
        """
        Use Case: Récupération des œuvres par catégorie (alias pour la recherche)
        
        Args:
            category: Catégorie à filtrer
            
        Returns:
            Liste des œuvres de cette catégorie
        """
        from ..dtos.artwork_dtos import ArtworkSearchRequest
        request = ArtworkSearchRequest(category=category)
        return self.search_artworks(request)
    
    def get_artwork_categories(self) -> List[str]:
        """
        Use Case: Récupération des catégories d'œuvres disponibles
        
        Returns:
            Liste des catégories uniques
        """
        try:
            artworks = self._artwork_repository.get_all()
            categories = list(set(artwork.category for artwork in artworks if artwork.category))
            return sorted(categories)
        except Exception:
            return []
    
    def get_artwork_statistics(self) -> dict:
        """
        Use Case: Récupération des statistiques des œuvres
        
        Returns:
            Statistiques générales des œuvres
        """
        try:
            artworks = self._artwork_repository.get_all()
            
            total_artworks = len(artworks)
            total_views = sum(artwork.view_count for artwork in artworks)
            categories = list(set(artwork.category for artwork in artworks if artwork.category))
            periods = list(set(artwork.period for artwork in artworks if artwork.period))
            
            # Œuvre la plus populaire
            most_popular = max(artworks, key=lambda a: a.view_count) if artworks else None
            
            return {
                "total_artworks": total_artworks,
                "total_views": total_views,
                "average_views": total_views / total_artworks if total_artworks > 0 else 0,
                "categories": categories,
                "periods": periods,
                "most_popular_artwork": {
                    "id": most_popular.id,
                    "title": most_popular.title,
                    "views": most_popular.view_count
                } if most_popular else None
            }
        except Exception:
            return {}
    
    def _validate_create_artwork_request(self, request: CreateArtworkRequest) -> Optional[str]:
        """Valider les données de création d'œuvre"""
        if not request.title or not request.title.strip():
            return "Le titre est requis"
        
        if not request.description_fr or not request.description_fr.strip():
            return "La description française est requise"
        
        if not request.category or not request.category.strip():
            return "La catégorie est requise"
        
        if not request.period or not request.period.strip():
            return "La période est requise"
        
        if not request.origin or not request.origin.strip():
            return "L'origine est requise"
        
        if request.room_id <= 0:
            return "ID de salle invalide"
        
        return None