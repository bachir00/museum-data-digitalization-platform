import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    EyeIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const AdminRoomsPage = () => {
    const { authenticatedFetch } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        name_fr: '',
        name_en: '',
        name_wo: '',
        description_fr: '',
        description_en: '',
        description_wo: '',
        panorama_file: null,
        hotspots: '[]',
        theme: '',
        has_audio: false,
        has_interactive: false,
        accessibility_level: ''
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/rooms`);
            const data = await response.json();
            console.log('Fetched rooms:', data);
            setRooms(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des salles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingRoom 
                ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/rooms/${editingRoom.id}`
                : `${import.meta.env.VITE_API_BASE_URL}/api/admin/rooms`;
            
            const method = editingRoom ? 'PUT' : 'POST';

            // Créer FormData pour gérer les fichiers
            const formDataToSend = new FormData();
            
            // Ajouter les champs texte
            Object.keys(formData).forEach(key => {
                if (key !== 'panorama_file') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Ajouter le fichier panorama s'il existe
            if (formData.panorama_file) {
                formDataToSend.append('panorama_file', formData.panorama_file);
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
                await fetchRooms();
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

    const handleDelete = async (roomId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette salle ? Toutes les œuvres associées seront également supprimées.')) {
            return;
        }

        try {
            const response = await authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/rooms/${roomId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchRooms();
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.error || 'Erreur inconnue'}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setFormData({
            name_fr: room.name_fr || '',
            name_en: room.name_en || '',
            name_wo: room.name_wo || '',
            description_fr: room.description_fr || '',
            description_en: room.description_en || '',
            description_wo: room.description_wo || '',
            panorama_file: null, // Ne peut pas pré-remplir un fichier
            hotspots: room.hotspots || '[]',
            theme: room.theme || '',
            has_audio: room.has_audio || false,
            has_interactive: room.has_interactive || false,
            accessibility_level: room.accessibility_level || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingRoom(null);
        setFormData({
            name_fr: '',
            name_en: '',
            name_wo: '',
            description_fr: '',
            description_en: '',
            description_wo: '',
            panorama_file: null,
            hotspots: '[]',
            theme: '',
            has_audio: false,
            has_interactive: false,
            accessibility_level: ''
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'file' ? e.target.files[0] : value
        });
    };

    if (loading && rooms.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-white">Chargement des salles...</p>
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
                        <h1 className="text-3xl font-bold text-white mb-2">Gestion des salles</h1>
                        <p className="text-gray-400">Gérez les salles d'exposition du musée</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Ajouter une salle
                    </button>
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                            {/* Room Image */}
                            <div className="h-48 bg-gray-700 flex items-center justify-center">
                                {room.panorama_url ? (
                                    <img 
                                        src={`${import.meta.env.VITE_API_BASE_URL}${room.panorama_url}`} 
                                        alt={room.name_fr}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                            </div>

                            {/* Room Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white mb-1">{room.name_fr}</h3>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {room.theme && (
                                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                            {room.theme}
                                        </span>
                                    )}
                                    {room.accessibility_level && (
                                        <span className={`text-white text-xs px-2 py-1 rounded ${
                                            room.accessibility_level === 'facile' ? 'bg-green-600' :
                                            room.accessibility_level === 'modéré' ? 'bg-yellow-600' : 'bg-red-600'
                                        }`}>
                                            {room.accessibility_level}
                                        </span>
                                    )}
                                    {room.has_audio && (
                                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                            🎵 Audio
                                        </span>
                                    )}
                                    {room.has_interactive && (
                                        <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded">
                                            🎯 Interactif
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{room.description_fr}</p>
                                
                                {/* Actions */}
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(room)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                                            title="Modifier"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(room.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                                            title="Supprimer"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <span className="text-xs text-gray-500">ID: {room.id}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {rooms.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <EyeIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Aucune salle</h3>
                        <p className="text-gray-400 mb-4">Commencez par créer votre première salle d'exposition</p>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg"
                        >
                            Créer une salle
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
                                {editingRoom ? 'Modifier la salle' : 'Ajouter une salle'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Nom */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Nom (Français) *
                                    </label>
                                    <input
                                        type="text"
                                        name="name_fr"
                                        value={formData.name_fr}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Nom (Anglais) *
                                    </label>
                                    <input
                                        type="text"
                                        name="name_en"
                                        value={formData.name_en}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Nom (Wolof) *
                                    </label>
                                    <input
                                        type="text"
                                        name="name_wo"
                                        value={formData.name_wo}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Description (Français) *
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
                                    Description (Anglais) *
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
                                    Description (Wolof) *
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

                            {/* Upload Panorama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Image Panorama <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="file"
                                    name="panorama_file"
                                    onChange={handleChange}
                                    accept="image/*"
                                    required={!editingRoom} // Requis seulement pour création
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                                />
                                {formData.panorama_file && (
                                    <p className="text-sm text-green-400 mt-1">
                                        Fichier sélectionné: {formData.panorama_file.name}
                                    </p>
                                )}
                                {editingRoom && (
                                    <p className="text-sm text-gray-400 mt-1">
                                        Laissez vide pour conserver l'image actuelle
                                    </p>
                                )}
                            </div>

                            {/* Hotspots */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Hotspots (JSON)
                                </label>
                                <textarea
                                    name="hotspots"
                                    value={formData.hotspots}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder={'[{"x": 0.5, "y": 0.5, "text": "Point d\'intérêt"}]'}
                                />
                            </div>

                            {/* Nouveaux champs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Thème <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="theme"
                                        value={formData.theme}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="" disabled>Sélectionnez un thème</option>
                                        <option value="Histoire des civilisations">Histoire des civilisations</option>
                                        <option value="Art sacré africain">Art sacré africain</option>
                                        <option value="Art contemporain">Art contemporain</option>
                                        <option value="Traditions et coutumes">Traditions et coutumes</option>
                                        <option value="Archéologie">Archéologie</option>
                                        <option value="Ethnologie">Ethnologie</option>
                                        <option value="Art textile">Art textile</option>
                                        <option value="Musique et instruments">Musique et instruments</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Niveau d'accessibilité <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="accessibility_level"
                                        value={formData.accessibility_level}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="" disabled>Sélectionnez un niveau</option>
                                        <option value="facile">Facile</option>
                                        <option value="modéré">Modéré</option>
                                        <option value="avancé">Avancé</option>
                                    </select>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-300 border-b border-gray-600 pb-2">
                                    Options disponibles
                                </h3>
                                
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="has_audio"
                                        name="has_audio"
                                        checked={formData.has_audio}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2"
                                    />
                                    <label htmlFor="has_audio" className="ml-2 text-sm text-gray-300">
                                        Audio guide disponible
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="has_interactive"
                                        name="has_interactive"
                                        checked={formData.has_interactive}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2"
                                    />
                                    <label htmlFor="has_interactive" className="ml-2 text-sm text-gray-300">
                                        Panorama interactif
                                    </label>
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
                                    {loading ? 'Sauvegarde...' : (editingRoom ? 'Mettre à jour' : 'Créer')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRoomsPage;