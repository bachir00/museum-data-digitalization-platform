import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
    BuildingOfficeIcon, 
    PhotoIcon, 
    EyeIcon,
    PlusIcon,
    ChartBarIcon,
    SpeakerWaveIcon,
    VideoCameraIcon,
    MusicalNoteIcon,
    GlobeAltIcon,
    TrophyIcon,
    ClockIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const { authenticatedFetch, user } = useAuth();
    const [stats, setStats] = useState({
        overview: {
            total_rooms: 0,
            total_artworks: 0,
            audio_rooms: 0,
            interactive_rooms: 0,
            recent_artworks: 0,
            recent_rooms: 0,
            avg_popularity: 0
        },
        artworks: {
            with_image: 0,
            with_audio: 0,
            with_video: 0,
            by_category: [],
            by_period: [],
            by_origin: [],
            top_popular: []
        },
        rooms: {
            by_theme: [],
            with_audio: 0,
            with_interactive: 0
        },
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`);
                const data = await response.json();
                
                setStats({
                    ...data,
                    loading: false
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques:', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, [authenticatedFetch]);

    const quickActions = [
        {
            name: 'Ajouter une salle',
            href: '/admin/rooms',
            icon: PlusIcon,
            description: 'Créer une nouvelle salle d\'exposition',
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            name: 'Ajouter une œuvre',
            href: '/admin/artworks',
            icon: PlusIcon,
            description: 'Ajouter une nouvelle œuvre d\'art',
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            name: 'Voir le site public',
            href: '/',
            icon: EyeIcon,
            description: 'Visiter le site public du musée',
            color: 'bg-purple-600 hover:bg-purple-700'
        }
    ];

    const statCards = [
        {
            name: 'Salles d\'exposition',
            value: stats.loading ? '...' : stats.overview.total_rooms,
            icon: BuildingOfficeIcon,
            color: 'bg-yellow-500',
            href: '/admin/rooms'
        },
        {
            name: 'Œuvres d\'art',
            value: stats.loading ? '...' : stats.overview.total_artworks,
            icon: PhotoIcon,
            color: 'bg-blue-500',
            href: '/admin/artworks'
        },
        {
            name: 'Salles avec audio',
            value: stats.loading ? '...' : stats.overview.audio_rooms,
            icon: SpeakerWaveIcon,
            color: 'bg-purple-500',
            href: '/admin/rooms'
        },
        {
            name: 'Popularité moyenne',
            value: stats.loading ? '...' : `${stats.overview.avg_popularity}/100`,
            icon: TrophyIcon,
            color: 'bg-green-500',
            href: '/admin/artworks'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Tableau de bord
                    </h1>
                    <p className="text-gray-400">
                        Bienvenue, {user?.username}. Gérez votre musée digital depuis ce panneau d'administration.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat) => (
                        <Link
                            key={stat.name}
                            to={stat.href}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-200"
                        >
                            <div className="flex items-center">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Statistiques détaillées */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Statistiques des œuvres */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <PhotoIcon className="h-5 w-5 mr-2" />
                            Statistiques des œuvres
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Multimédia */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="bg-yellow-600 p-2 rounded-lg inline-block mb-2">
                                        <PhotoIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-400">Avec images</p>
                                    <p className="text-lg font-bold text-white">
                                        {stats.loading ? '...' : stats.artworks.with_image}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-blue-600 p-2 rounded-lg inline-block mb-2">
                                        <SpeakerWaveIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-400">Avec audio</p>
                                    <p className="text-lg font-bold text-white">
                                        {stats.loading ? '...' : stats.artworks.with_audio}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-red-600 p-2 rounded-lg inline-block mb-2">
                                        <VideoCameraIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-400">Avec vidéo</p>
                                    <p className="text-lg font-bold text-white">
                                        {stats.loading ? '...' : stats.artworks.with_video}
                                    </p>
                                </div>
                            </div>

                            {/* Top catégories */}
                            {!stats.loading && stats.artworks.by_category.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-2">Top catégories</h4>
                                    <div className="space-y-2">
                                        {stats.artworks.by_category.slice(0, 3).map((cat) => (
                                            <div key={cat.category} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-300">{cat.category}</span>
                                                <span className="bg-gray-700 px-2 py-1 rounded text-xs font-medium text-gray-300">
                                                    {cat.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Statistiques des salles */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                            Statistiques des salles
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Options */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="bg-purple-600 p-2 rounded-lg inline-block mb-2">
                                        <MusicalNoteIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-400">Audio guide</p>
                                    <p className="text-lg font-bold text-white">
                                        {stats.loading ? '...' : stats.rooms.with_audio}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-cyan-600 p-2 rounded-lg inline-block mb-2">
                                        <SparklesIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-400">Interactives</p>
                                    <p className="text-lg font-bold text-white">
                                        {stats.loading ? '...' : stats.rooms.with_interactive}
                                    </p>
                                </div>
                            </div>

                            {/* Thèmes */}
                            {!stats.loading && stats.rooms.by_theme.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-2">Thèmes populaires</h4>
                                    <div className="space-y-2">
                                        {stats.rooms.by_theme.slice(0, 3).map((theme) => (
                                            <div key={theme.theme} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-300">{theme.theme}</span>
                                                <span className="bg-gray-700 px-2 py-1 rounded text-xs font-medium text-gray-300">
                                                    {theme.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Activité récente et Top œuvres */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Activité récente */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <ClockIcon className="h-5 w-5 mr-2" />
                            Activité récente (30 jours)
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                                <div className="flex items-center">
                                    <PhotoIcon className="h-4 w-4 text-blue-400 mr-2" />
                                    <span className="text-sm text-gray-300">Nouvelles œuvres</span>
                                </div>
                                <span className="bg-blue-600 px-2 py-1 rounded text-xs font-medium text-white">
                                    {stats.loading ? '...' : stats.overview.recent_artworks}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                                <div className="flex items-center">
                                    <BuildingOfficeIcon className="h-4 w-4 text-yellow-400 mr-2" />
                                    <span className="text-sm text-gray-300">Nouvelles salles</span>
                                </div>
                                <span className="bg-yellow-600 px-2 py-1 rounded text-xs font-medium text-white">
                                    {stats.loading ? '...' : stats.overview.recent_rooms}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Top œuvres populaires */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <TrophyIcon className="h-5 w-5 mr-2" />
                            Œuvres les plus populaires
                        </h3>
                        
                        {!stats.loading && stats.artworks.top_popular.length > 0 ? (
                            <div className="space-y-3">
                                {stats.artworks.top_popular.map((artwork, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded">
                                        <div>
                                            <p className="text-sm font-medium text-white truncate">
                                                {artwork.title}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {artwork.room_name}
                                            </p>
                                        </div>
                                        <span className="bg-green-600 px-2 py-1 rounded text-xs font-medium text-white">
                                            {artwork.popularity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-400">
                                    {stats.loading ? 'Chargement...' : 'Aucune œuvre avec popularité définie'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Actions rapides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.name}
                                to={action.href}
                                className={`${action.color} text-white rounded-lg p-6 transition-colors duration-200 group`}
                            >
                                <div className="flex items-center mb-3">
                                    <action.icon className="h-6 w-6 mr-3" />
                                    <h3 className="text-lg font-semibold">{action.name}</h3>
                                </div>
                                <p className="text-sm opacity-90">{action.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <GlobeAltIcon className="h-5 w-5 mr-2" />
                        Répartition géographique
                    </h2>
                    
                    {!stats.loading && stats.artworks.by_origin.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.artworks.by_origin.map((origin) => (
                                <div key={origin.origin} className="bg-gray-700 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium text-white">{origin.origin}</h4>
                                        <span className="bg-blue-600 px-2 py-1 rounded text-xs font-medium text-white">
                                            {origin.count}
                                        </span>
                                    </div>
                                    <div className="mt-2 bg-gray-600 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full" 
                                            style={{ 
                                                width: `${(origin.count / stats.overview.total_artworks) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {((origin.count / stats.overview.total_artworks) * 100).toFixed(1)}% du total
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <GlobeAltIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">
                                {stats.loading ? 'Chargement des statistiques...' : 'Aucune donnée géographique disponible'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;