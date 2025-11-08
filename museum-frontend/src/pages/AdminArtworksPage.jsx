import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    PhotoIcon,
    XMarkIcon,
    SpeakerWaveIcon,
    VideoCameraIcon,
    QrCodeIcon
} from '@heroicons/react/24/outline';

const AdminArtworksPage = () => {
    const { authenticatedFetch } = useAuth();
    const [artworks, setArtworks] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingArtwork, setEditingArtwork] = useState(null);
    const [formData, setFormData] = useState({
        room_id: '',
        title: '',
        description_fr: '',
        description_en: '',
        description_wo: '',
        category: '',
        period: '',
        origin: '',
        popularity: 0,
        image_file: null,
        audio_file: null,
        video_file: null
    });

    // États pour les fichiers uploadés
    const [uploadedFiles, setUploadedFiles] = useState({
        image: null,
        audio: null,
        video: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [artworksResponse, roomsResponse] = await Promise.all([
                authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/artworks`),
                authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/rooms`)
            ]);
            
            const artworksData = await artworksResponse.json();
            const roomsData = await roomsResponse.json();
            
            setArtworks(artworksData);
            setRooms(roomsData);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation supplémentaire côté client
        if (!formData.room_id || formData.room_id === '') {
            alert('Veuillez sélectionner une salle');
            return;
        }
        
        if (!formData.title.trim()) {
            alert('Veuillez saisir un titre');
            return;
        }
        
        if (!formData.category) {
            alert('Veuillez sélectionner une catégorie');
            return;
        }
        
        if (!formData.period) {
            alert('Veuillez sélectionner une période');
            return;
        }
        
        if (!formData.origin) {
            alert('Veuillez sélectionner une origine');
            return;
        }
        
        setLoading(true);

        try {
            const url = editingArtwork 
                ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/artworks/${editingArtwork.id}`
                : `${import.meta.env.VITE_API_BASE_URL}/api/admin/artworks`;
            
            const method = editingArtwork ? 'PUT' : 'POST';

            // Créer FormData pour gérer les fichiers
            const formDataToSend = new FormData();
            
            // Ajouter les champs texte
            Object.keys(formData).forEach(key => {
                if (key !== 'image_file' && key !== 'audio_file' && key !== 'video_file') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Ajouter les fichiers s'ils existent
            if (formData.image_file) {
                formDataToSend.append('image_file', formData.image_file);
            }
            if (formData.audio_file) {
                formDataToSend.append('audio_file', formData.audio_file);
            }
            if (formData.video_file) {
                formDataToSend.append('video_file', formData.video_file);
            }

            // Pour FormData, on ne peut pas utiliser authenticatedFetch car il force Content-Type
            // On doit utiliser fetch directement avec juste le token d'autorisation
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
                },
                body: formDataToSend
            });

            if (response.ok) {
                await fetchData();
                resetForm();
                setShowModal(false);
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.error || 'Erreur inconnue'}`);
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (artworkId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
            return;
        }

        try {
            const response = await authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/artworks/${artworkId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchData();
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.error || 'Erreur inconnue'}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const handleEdit = (artwork) => {
        setEditingArtwork(artwork);
        setFormData({
            room_id: artwork.room_id || '',
            title: artwork.title || '',
            description_fr: artwork.description_fr || '',
            description_en: artwork.description_en || '',
            description_wo: artwork.description_wo || '',
            category: artwork.category || '',
            period: artwork.period || '',
            origin: artwork.origin || '',
            popularity: artwork.popularity || 0,
            image_file: null,
            audio_file: null,
            video_file: null
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingArtwork(null);
        setFormData({
            room_id: '',
            title: '',
            description_fr: '',
            description_en: '',
            description_wo: '',
            category: '',
            period: '',
            origin: '',
            popularity: 0,
            image_file: null,
            audio_file: null,
            video_file: null
        });
        setUploadedFiles({
            image: null,
            audio: null,
            video: null
        });
    };

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.files[0]
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const getRoomName = (roomId) => {
        const room = rooms.find(r => r.id === roomId);
        return room ? (room.name_fr || room.name) : 'Salle inconnue';
    };

    if (loading && artworks.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-white">Chargement des œuvres...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Gestion des œuvres</h1>
                        <p className="text-gray-400">Gérez les œuvres d'art du musée</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Ajouter une œuvre
                    </button>
                </div>

                {/* Artworks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {artworks.map((artwork) => (
                        <div key={artwork.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                            {/* Artwork Image */}
                            <div className="h-48 bg-gray-700 flex items-center justify-center relative">
                                {artwork.image_url ? (
                                    <img 
                                        src={`${import.meta.env.VITE_API_BASE_URL}${artwork.image_url}`} 
                                        alt={artwork.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}

                                {/* Media indicators */}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {artwork.audio_url && (
                                        <div className="bg-blue-600 p-1 rounded">
                                            <SpeakerWaveIcon className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                    {artwork.video_url && (
                                        <div className="bg-red-600 p-1 rounded">
                                            <VideoCameraIcon className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Artwork Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white mb-1">{artwork.title}</h3>
                                <p className="text-yellow-400 text-sm mb-2">{getRoomName(artwork.room_id)}</p>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{artwork.description_fr}</p>
                                
                                {/* Actions */}
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(artwork)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                                            title="Modifier"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(artwork.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                                            title="Supprimer"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                        {artwork.qr_code_url && (
                                            <a
                                                href={`${import.meta.env.VITE_API_BASE_URL}${artwork.qr_code_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors"
                                                title="QR Code"
                                            >
                                                <QrCodeIcon className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">ID: {artwork.id}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {artworks.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <PhotoIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Aucune œuvre</h3>
                        <p className="text-gray-400 mb-4">Commencez par ajouter votre première œuvre d'art</p>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg"
                        >
                            Ajouter une œuvre
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">
                                {editingArtwork ? 'Modifier l\'œuvre' : 'Ajouter une œuvre'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Salle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Salle <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="room_id"
                                    value={formData.room_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="" disabled>Sélectionnez une salle</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.name_fr || room.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Titre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Titre <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>

                            {/* Descriptions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Description (Français) <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    name="description_fr"
                                    value={formData.description_fr}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Description (Anglais) <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    name="description_en"
                                    value={formData.description_en}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Description (Wolof) <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    name="description_wo"
                                    value={formData.description_wo}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>

                            {/* Nouveaux champs */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Catégorie <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="" disabled>Sélectionnez une catégorie</option>
                                        <option value="Masque">Masque</option>
                                        <option value="Sculpture">Sculpture</option>
                                        <option value="Peinture">Peinture</option>
                                        <option value="Bijou">Bijou</option>
                                        <option value="Textile">Textile</option>
                                        <option value="Poterie">Poterie</option>
                                        <option value="Instrument">Instrument</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Période <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="period"
                                        value={formData.period}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="" disabled>Sélectionnez une période</option>
                                        <option value="Préhistorique">Préhistorique</option>
                                        <option value="Antique">Antique</option>
                                        <option value="Moyen Âge">Moyen Âge</option>
                                        <option value="XVe siècle">XVe siècle</option>
                                        <option value="XVIe siècle">XVIe siècle</option>
                                        <option value="XVIIe siècle">XVIIe siècle</option>
                                        <option value="XVIIIe siècle">XVIIIe siècle</option>
                                        <option value="XIXe siècle">XIXe siècle</option>
                                        <option value="XXe siècle">XXe siècle</option>
                                        <option value="Contemporain">Contemporain</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Origine <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="origin"
                                        value={formData.origin}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="" disabled>Sélectionnez une origine</option>
                                        <option value="Sénégal">Sénégal</option>
                                        <option value="Mali">Mali</option>
                                        <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                                        <option value="Bénin">Bénin</option>
                                        <option value="Ghana">Ghana</option>
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="Burkina Faso">Burkina Faso</option>
                                        <option value="Cameroun">Cameroun</option>
                                        <option value="République démocratique du Congo">République démocratique du Congo</option>
                                        <option value="Égypte">Égypte</option>
                                        <option value="Éthiopie">Éthiopie</option>
                                        <option value="Afrique du Sud">Afrique du Sud</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>
                            </div>

                            {/* Popularité */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Popularité (0-100)
                                </label>
                                <input
                                    type="number"
                                    name="popularity"
                                    value={formData.popularity}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>

                            {/* Upload de fichiers */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-300 border-b border-gray-600 pb-2">
                                    Fichiers multimédias
                                </h3>
                                
                                {/* Upload Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Image (JPG, PNG, WEBP)
                                    </label>
                                    <input
                                        type="file"
                                        name="image_file"
                                        onChange={handleChange}
                                        accept="image/*"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                                    />
                                    {formData.image_file && (
                                        <p className="text-sm text-green-400 mt-1">
                                            Fichier sélectionné: {formData.image_file.name}
                                        </p>
                                    )}
                                </div>

                                {/* Upload Audio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Audio (MP3, WAV, OGG)
                                    </label>
                                    <input
                                        type="file"
                                        name="audio_file"
                                        onChange={handleChange}
                                        accept="audio/*"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                    />
                                    {formData.audio_file && (
                                        <p className="text-sm text-green-400 mt-1">
                                            Fichier sélectionné: {formData.audio_file.name}
                                        </p>
                                    )}
                                </div>

                                {/* Upload Vidéo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Vidéo (MP4, AVI, MOV)
                                    </label>
                                    <input
                                        type="file"
                                        name="video_file"
                                        onChange={handleChange}
                                        accept="video/*"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-red-600 file:text-white hover:file:bg-red-700"
                                    />
                                    {formData.video_file && (
                                        <p className="text-sm text-green-400 mt-1">
                                            Fichier sélectionné: {formData.video_file.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Sauvegarde...' : (editingArtwork ? 'Mettre à jour' : 'Créer')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminArtworksPage;