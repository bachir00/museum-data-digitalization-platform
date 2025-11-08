import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { searchContent } from '../services/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { language, getTranslation } = useLanguage();
  const [results, setResults] = useState({ rooms: [], artworks: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    }
  }, [query, language]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchContent(query, language);
      setResults(data);
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTexts = () => {
    switch (language) {
      case 'en':
        return {
          title: 'Search Results',
          searchFor: 'Search results for',
          noResults: 'No results found',
          rooms: 'Rooms',
          artworks: 'Artworks',
          viewRoom: 'View Room',
          viewArtwork: 'View Artwork',
          inRoom: 'in'
        };
      case 'wo':
        return {
          title: 'Seet yi am',
          searchFor: 'Seet yi am ci',
          noResults: 'Amul seet',
          rooms: 'Këri yi',
          artworks: 'Jëf yi',
          viewRoom: 'Gis kër',
          viewArtwork: 'Gis jëf',
          inRoom: 'ci'
        };
      default:
        return {
          title: 'Résultats de recherche',
          searchFor: 'Résultats de recherche pour',
          noResults: 'Aucun résultat trouvé',
          rooms: 'Salles',
          artworks: 'Œuvres',
          viewRoom: 'Voir la salle',
          viewArtwork: 'Voir l\'œuvre',
          inRoom: 'dans'
        };
    }
  };

  const texts = getTexts();

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-museum-gradient"
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-museum-gold mb-4"></div>
          <p className="text-museum-beige text-lg">
            {getTranslation('searching', 'Recherche en cours...')}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-museum-gradient py-8"
    >
      <div className="container mx-auto px-4">
        {/* En-tête avec titre et requête */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-museum-gold mb-4">
            {texts.title}
          </h1>
          
          {query && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-black/30 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto border border-museum-gold/20"
            >
              <p className="text-museum-beige text-lg">
                {texts.searchFor} 
                <span className="text-museum-gold font-semibold mx-2">"{query}"</span>
                <span className="text-museum-beige/70">
                  ({results.total} résultat{results.total !== 1 ? 's' : ''})
                </span>
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Messages d'erreur */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-8 text-center"
          >
            <p className="text-red-200">{error}</p>
          </motion.div>
        )}

        {/* Aucun résultat */}
        {!loading && !error && results.total === 0 && query && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 opacity-50">
              <svg className="w-full h-full text-museum-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xl text-museum-beige/70">{texts.noResults}</p>
            <p className="text-museum-beige/50 mt-2">
              {getTranslation('searchHint', 'Essayez avec des mots-clés différents')}
            </p>
          </motion.div>
        )}

        {/* Résultats des salles */}
        <AnimatePresence>
          {results.rooms.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-serif text-museum-gold mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {texts.rooms} ({results.rooms.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.rooms.map((room, index) => (
                  <motion.div
                    key={`room-${room.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group"
                  >
                    <Link to={`/rooms/${room.id}`}>
                      <div className="card-museum group-hover:scale-105 transition-all duration-500">
                        <div className="relative overflow-hidden aspect-video">
                          <img 
                            src={`${import.meta.env.VITE_API_BASE_URL}${room.panorama_url}`} 
                            alt={room.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-serif text-museum-gold mb-2 group-hover:text-museum-gold/80 transition-colors">
                            {room.name}
                          </h3>
                          <p className="text-museum-beige/80 text-sm mb-4 line-clamp-2">
                            {room.description}
                          </p>
                          <span className="inline-flex items-center text-museum-gold text-sm hover:text-museum-gold/80 transition-colors">
                            {texts.viewRoom}
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Résultats des œuvres */}
        <AnimatePresence>
          {results.artworks.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-serif text-museum-gold mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {texts.artworks} ({results.artworks.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.artworks.map((artwork, index) => (
                  <motion.div
                    key={`artwork-${artwork.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group"
                  >
                    <Link to={`/artworks/${artwork.id}`}>
                      <div className="card-museum group-hover:scale-105 transition-all duration-500">
                        <div className="relative overflow-hidden aspect-[3/4]">
                          <img 
                            src={`${import.meta.env.VITE_API_BASE_URL}${artwork.image_url}`} 
                            alt={artwork.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-serif text-museum-gold mb-2 group-hover:text-museum-gold/80 transition-colors">
                            {artwork.title}
                          </h3>
                          <p className="text-museum-beige/80 text-sm mb-3 line-clamp-2">
                            {artwork.description}
                          </p>
                          <p className="text-museum-beige/60 text-xs mb-4 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {texts.inRoom} 
                            <Link 
                              to={`/rooms/${artwork.room_id}`} 
                              className="text-museum-gold hover:text-museum-gold/80 ml-1 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {artwork.room_name}
                            </Link>
                          </p>
                          <span className="inline-flex items-center text-museum-gold text-sm hover:text-museum-gold/80 transition-colors">
                            {texts.viewArtwork}
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchPage;