import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchRoom, fetchArtworksByRoom } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const RoomDetailPage = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const [room, setRoom] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [viewMode, setViewMode] = useState('room'); // 'room' ou 'artwork'
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    const loadRoomData = async () => {
      try {
        setIsLoading(true);
        
        const roomData = await fetchRoom(id, language);
        console.log(roomData);
        setRoom(roomData);
        
        if (roomData && roomData.panorama_url) {
          setMainImageUrl(`${import.meta.env.VITE_API_BASE_URL}${roomData.panorama_url}`);
        }
        
        const artworksData = await fetchArtworksByRoom(id);
        console.log(artworksData);
        setArtworks(artworksData);
      } catch (err) {
        console.error(`Erreur lors du chargement des données de la salle ${id}:`, err);
        setError("Impossible de charger les détails de cette salle. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRoomData();
  }, [id, language]);

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
    setViewMode('artwork');
    setMainImageUrl(`${import.meta.env.VITE_API_BASE_URL}${artwork.image_url}`);
  };

  const handleBackToRoomView = () => {
    setSelectedArtwork(null);
    setViewMode('room');
    if (room && room.panorama_url) {
      setMainImageUrl(`${import.meta.env.VITE_API_BASE_URL}${room.panorama_url}`);
    }
  };

  const getContent = () => {
    switch (language) {
      case 'en':
        return {
          loading: "Loading exhibition room...",
          error: "An error occurred",
          retry: "Try again",
          backToRooms: "Back to rooms",
          showRoom: "View room",
          artworks: "Artworks",
          audioGuide: "Audio Guide",
          noAudio: "Your browser does not support the audio element.",
          exploreArtwork: "Explore artwork",
          roomView: "Room view",
          artworkView: "Artwork view",
          downloadQR: "Download QR Code",
          shareRoom: "Share room"
        };
      case 'wo':
        return {
          loading: "Xeuy kër bi...",
          error: "Jafe-jafe am na",
          retry: "Jéemal",
          backToRooms: "Dellu ci këri yi",
          showRoom: "Xool kër bi",
          artworks: "Jëf yi",
          audioGuide: "Deglu Jiit Wi",
          noAudio: "Sa joowukaay mënul jël baat bi.",
          exploreArtwork: "Seetal jëf bi",
          roomView: "Xool kër bi",
          artworkView: "Xool jëf bi",
          downloadQR: "Télécharge QR Code",
          shareRoom: "Waxale kër bi"
        };
      default:
        return {
          loading: "Chargement de la salle d'exposition...",
          error: "Une erreur est survenue",
          retry: "Réessayer",
          backToRooms: "Retour aux salles",
          showRoom: "Voir la salle",
          artworks: "Œuvres",
          audioGuide: "Guide audio",
          noAudio: "Votre navigateur ne supporte pas l'élément audio.",
          exploreArtwork: "Explorer l'œuvre",
          roomView: "Vue de la salle",
          artworkView: "Vue de l'œuvre",
          downloadQR: "Télécharger QR Code",
          shareRoom: "Partager la salle"
        };
    }
  };

  const content = getContent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-museum-gold/30 border-t-museum-gold rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-museum-beige font-medium">{content.loading}</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-heading text-museum-gold mb-4">{content.error}</h2>
          <p className="text-museum-beige mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-museum"
          >
            {content.retry}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <motion.div 
        className="container mx-auto px-3 py-4 md:px-4 md:py-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link 
          to="/rooms" 
          className="inline-flex items-center space-x-1 md:space-x-2 text-museum-gold hover:text-museum-lightgold transition-colors duration-300 group text-sm md:text-base"
        >
          <svg 
            width="16" 
            height="16" 
            md:width="20"
            md:height="20"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="group-hover:-translate-x-1 transition-transform duration-300"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="font-medium">{content.backToRooms}</span>
        </Link>
      </motion.div>

      {/* Main Display Section */}
      <section className="relative">
        {/* Main Image */}
        <div className="relative h-96 md:h-[70vh] overflow-hidden">
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img 
              src={mainImageUrl} 
              alt={selectedArtwork ? selectedArtwork.title : room?.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-overlay-dark opacity-30"></div>
          </motion.div>

          {/* Info Overlay */}
          <motion.div 
            className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 z-10"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-glass rounded-xl p-3 md:p-6 max-w-2xl">
              <h1 className="text-xl md:text-3xl lg:text-4xl font-heading font-bold text-gradient mb-2 md:mb-3">
                {selectedArtwork ? selectedArtwork.title : room?.name}
              </h1>
              
              {/* Description - caché sur mobile, visible sur desktop */}
              <p className="hidden md:block text-museum-beige/90 leading-relaxed mb-4">
                {selectedArtwork ? selectedArtwork.description : room?.description}
              </p>
              
              {/* Description condensée sur mobile */}
              <p className="md:hidden text-museum-beige/90 text-sm leading-relaxed mb-3 line-clamp-2">
                {selectedArtwork ? selectedArtwork.description : room?.description}
              </p>
              
              {/* Stats */}
              <div className="flex items-center space-x-3 md:space-x-6 text-xs md:text-sm">
                <div className="flex items-center space-x-1 md:space-x-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-museum-gold rounded-full"></div>
                  <span className="text-museum-cream">
                    {selectedArtwork ? 'Œuvre d\'art' : `${artworks.length} ${content.artworks}`}
                  </span>
                </div>
                <div className="flex items-center space-x-1 md:space-x-2">
                  <svg width="12" height="12" md:width="16" md:height="16" fill="currentColor" viewBox="0 0 24 24" className="text-museum-gold">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-museum-cream">
                    {selectedArtwork ? 'Détail' : '360° View'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back to Room Button (when viewing artwork) */}
          {selectedArtwork && (
            <motion.button
              onClick={handleBackToRoomView}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 bg-glass hover:bg-museum-gold hover:text-museum-black text-museum-gold px-2 py-1 md:px-4 md:py-2 rounded-lg transition-all duration-300 flex items-center space-x-1 md:space-x-2 text-sm md:text-base"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <svg width="12" height="12" md:width="16" md:height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span className="hidden md:inline">{content.showRoom}</span>
              <span className="md:hidden">Salle</span>
            </motion.button>
          )}

          {/* Horizontal Artworks Carousel - Bottom Overlay */}
          {artworks.length > 0 && (
            <motion.div 
              className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 z-10"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-glass rounded-xl p-2 md:p-4">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <h3 className="text-sm md:text-lg font-heading font-bold text-museum-gold">
                    {content.artworks} ({artworks.length})
                  </h3>
                  <button
                    onClick={handleBackToRoomView}
                    className={`px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm transition-all duration-300 ${
                      !selectedArtwork 
                        ? 'bg-museum-gold text-museum-black' 
                        : 'text-museum-gold hover:bg-museum-gold/20'
                    }`}
                  >
                    <span className="hidden md:inline">Vue de la salle</span>
                    <span className="md:hidden">Salle</span>
                  </button>
                </div>
                
                {/* Scrollable Artworks */}
                <div className="flex space-x-2 md:space-x-3 overflow-x-auto pb-1 md:pb-2 scrollbar-hide">
                  {artworks.map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      className={`flex-none w-24 md:w-40 cursor-pointer transition-all duration-300 ${
                        selectedArtwork?.id === artwork.id 
                          ? 'ring-1 md:ring-2 ring-museum-gold shadow-gold' 
                          : 'hover:shadow-lg'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleArtworkClick(artwork)}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="bg-museum-charcoal rounded-lg overflow-hidden">
                        <div className="relative h-16 md:h-24 overflow-hidden">
                          <img 
                            src={`${import.meta.env.VITE_API_BASE_URL}${artwork.image_url}`} 
                            alt={artwork.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          {selectedArtwork?.id === artwork.id && (
                            <div className="absolute inset-0 bg-museum-gold/20 flex items-center justify-center">
                              <div className="w-4 h-4 md:w-6 md:h-6 bg-museum-gold rounded-full flex items-center justify-center">
                                <svg width="8" height="8" md:width="12" md:height="12" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2">
                                  <polyline points="20,6 9,17 4,12"/>
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-1.5 md:p-2">
                          <h4 className="text-museum-cream font-semibold text-xs md:text-xs mb-1 truncate">
                            {artwork.title}
                          </h4>
                          {artwork.audio_url && (
                            <div className="flex items-center space-x-1 text-museum-gold text-xs">
                              <svg width="8" height="8" md:width="10" md:height="10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                              </svg>
                              <span className="hidden md:inline">Audio</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Audio Player Section - Bottom Separate */}
        {selectedArtwork?.audio_url && (
          <motion.div 
            className="bg-museum-charcoal/50 border-t border-museum-gold/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="container mx-auto px-3 py-4 md:px-4 md:py-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-lg md:text-xl font-heading font-bold text-museum-gold">
                  {content.audioGuide}
                </h3>
                <div className="text-xs md:text-sm text-museum-cream opacity-70 truncate max-w-32 md:max-w-none">
                  {selectedArtwork.title}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
                <motion.button
                  onClick={() => setAudioPlaying(!audioPlaying)}
                  className={`flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium transition-all duration-300 text-sm md:text-base w-full md:w-auto justify-center md:justify-start ${
                    audioPlaying 
                      ? 'bg-museum-gold text-museum-black animate-pulse-gold shadow-gold' 
                      : 'bg-museum-charcoal border border-museum-gold text-museum-gold hover:bg-museum-gold hover:text-museum-black'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="20" height="20" md:width="24" md:height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {audioPlaying ? (
                      <>
                        <rect x="6" y="4" width="4" height="16" rx="2"/>
                        <rect x="14" y="4" width="4" height="16" rx="2"/>
                      </>
                    ) : (
                      <polygon points="5,3 19,12 5,21"/>
                    )}
                  </svg>
                  <span>{audioPlaying ? 'Pause' : 'Lecture'}</span>
                </motion.button>
                
                <audio 
                  controls 
                  className="w-full md:flex-1 h-10 md:h-12 rounded-lg"
                  onPlay={() => setAudioPlaying(true)}
                  onPause={() => setAudioPlaying(false)}
                  onEnded={() => setAudioPlaying(false)}
                >
                  <source src={`${import.meta.env.VITE_API_BASE_URL}${selectedArtwork.audio_url}`} type="audio/mpeg" />
                  {content.noAudio}
                </audio>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* QR Code & Sharing Section */} 
    </div>
  );
};

export default RoomDetailPage;