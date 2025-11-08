import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchArtwork } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const ArtworkDetailPage = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const [artwork, setArtwork] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const loadArtworkData = async () => {
      try {
        setIsLoading(true);
        const artworkData = await fetchArtwork(id, language);
        console.log('detail pages oeuvre', artworkData)
        setArtwork(artworkData);
      } catch (err) {
        console.error(`Erreur lors du chargement de l'œuvre ${id}:`, err);
        setError(`Impossible de charger les détails de cette œuvre. Veuillez réessayer plus tard.`);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworkData();
  }, [id, language]);

  const handleAudioPlayPause = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const handleAudioTimeUpdate = (e) => {
    const progress = (e.target.currentTime / e.target.duration) * 100;
    setAudioProgress(progress);
    setCurrentTime(e.target.currentTime);
  };

  const handleAudioLoadedMetadata = (e) => {
    setAudioDuration(e.target.duration);
  };

  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
    setAudioProgress(0);
    setCurrentTime(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fonction pour télécharger l'image
  const handleDownloadImage = async () => {
    if (!artwork?.image_url) return;
    
    try {
      // Utiliser la route de téléchargement du backend avec le paramètre download=true
      const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}${artwork.image_url}?download=true`;
      
      // Créer un lien de téléchargement invisible
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${artwork.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      link.target = '_blank';
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Feedback utilisateur
      console.log('Téléchargement initié pour:', artwork.title);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement de l\'image');
    }
  };

  // Fonction pour partager l'œuvre
  const handleShareArtwork = async () => {
    if (!artwork) return;
    
    // const artworkUrl = `${window.location.origin}/artworks/${artwork.id}`;
    // Modifié pour utiliser l'URL du frontend définie dans l'environnement
    const artworkUrl = `${import.meta.env.VITE_FRONTEND_URL || window.location.origin}/artworks/${artwork.id}`;
    const shareData = {
      title: `${artwork.title} - Musée`,
      text: `Découvrez cette magnifique œuvre : ${artwork.title}`,
      url: artworkUrl
    };

    try {
      // Utiliser Web Share API si disponible (mobile principalement)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log('Partage réussi via Web Share API');
      } else if (navigator.clipboard) {
        // Fallback : copier l'URL dans le presse-papiers
        await navigator.clipboard.writeText(artworkUrl);
        
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="
            position: fixed; 
            top: 20px; 
            right: 20px; 
            background: #D4AF37; 
            color: #000; 
            padding: 12px 20px; 
            border-radius: 8px; 
            z-index: 9999;
            font-family: system-ui;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          ">
            ✓ Lien copié dans le presse-papiers !
          </div>
        `;
        document.body.appendChild(notification);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
        
      } else {
        // Fallback manuel si tout échoue
        const userInput = prompt(
          'Copiez ce lien pour partager l\'œuvre:', 
          artworkUrl
        );
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      
      // En cas d'erreur, proposer de copier manuellement
      const userInput = prompt(
        'Copiez ce lien pour partager l\'œuvre:', 
        artworkUrl
      );
    }
  };

  const getContent = () => {
    switch (language) {
      case 'en':
        return {
          loading: "Loading artwork...",
          error: "An error occurred",
          retry: "Try again",
          backToArtworks: "Back to artworks",
          audioGuide: "Audio Guide",
          noAudio: "No audio guide available for this artwork",
          play: "Play",
          pause: "Pause",
          video: "Video",
          watchVideo: "Watch video",
          noVideo: "No video available for this artwork",
          description: "Description",
          qrCode: "QR Code",
          scanQrCode: "Scan this code to view this artwork on your mobile device",
          downloadImage: "Download image",
          shareArtwork: "Share artwork",
          technicalInfo: "Technical information",
          relatedArtworks: "Related artworks"
        };
      case 'wo':
        return {
          loading: "Xeuy jëf bi...",
          error: "Jafe-jafe am na",
          retry: "Jéemal",
          backToArtworks: "Dellu ci jëf yi",
          audioGuide: "Jiitu ci dégg",
          noAudio: "Amul jiitu ci dégg ngir jëf bi",
          play: "Taal",
          pause: "Taxawal",
          video: "Nataal ju dox",
          watchVideo: "Xool nataal",
          noVideo: "Amul nataal ju dox ngir jëf bi",
          description: "Seetal",
          qrCode: "QR Code",
          scanQrCode: "Scanne code bi ngir gis jëf bi ci sa telefon",
          downloadImage: "Télécharge nataal",
          shareArtwork: "Waxale jëf bi",
          technicalInfo: "Xibaar bu teknik",
          relatedArtworks: "Jëf yu mel ci bii"
        };
      default:
        return {
          loading: "Chargement de l'œuvre d'art...",
          error: "Une erreur est survenue",
          retry: "Réessayer",
          backToArtworks: "Retour aux œuvres",
          audioGuide: "Guide audio",
          noAudio: "Aucun guide audio disponible pour cette œuvre",
          play: "Lecture",
          pause: "Pause",
          video: "Vidéo",
          watchVideo: "Regarder la vidéo",
          noVideo: "Aucune vidéo disponible pour cette œuvre",
          description: "Description",
          qrCode: "Code QR",
          scanQrCode: "Scannez ce code pour voir cette œuvre sur votre appareil mobile",
          downloadImage: "Télécharger l'image",
          shareArtwork: "Partager l'œuvre",
          technicalInfo: "Informations techniques",
          relatedArtworks: "Œuvres similaires"
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
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link 
          to="/artworks" 
          className="inline-flex items-center space-x-2 text-museum-gold hover:text-museum-lightgold transition-colors duration-300 group"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="group-hover:-translate-x-1 transition-transform duration-300"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="font-medium">{content.backToArtworks}</span>
        </Link>
      </motion.div>

      {/* Hero Section with Artwork Image */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-screen">
          {/* Left Side - Artwork Image */}
          <motion.div 
            className="relative h-96 lg:h-screen overflow-hidden"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <img 
              src={`${import.meta.env.VITE_API_BASE_URL}${artwork.image_url}`} 
              alt={artwork.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-overlay-dark opacity-20"></div>
            
            {/* Image Controls Overlay */}
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <div className="bg-glass rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {artwork.video_url && (
                      <motion.button
                        onClick={() => setShowVideo(!showVideo)}
                        className="flex items-center space-x-2 px-4 py-2 bg-museum-gold text-museum-black rounded-lg font-medium hover:bg-museum-lightgold transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5,3 19,12 5,21"/>
                        </svg>
                        <span>{content.watchVideo}</span>
                      </motion.button>
                    )}
                    
                    <motion.button
                      onClick={handleDownloadImage}
                      className="flex items-center space-x-2 px-4 py-2 bg-museum-charcoal border border-museum-gold text-museum-gold rounded-lg font-medium hover:bg-museum-gold hover:text-museum-black transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      <span>{content.downloadImage}</span>
                    </motion.button>
                  </div>
                  
                  {/* <motion.button
                    className="p-2 bg-museum-charcoal border border-museum-gold text-museum-gold rounded-lg hover:bg-museum-gold hover:text-museum-black transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </motion.button> */}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Artwork Details */}
          <motion.div 
            className="relative bg-museum-charcoal/50 backdrop-blur-sm"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="h-full flex flex-col justify-center p-8 lg:p-12">
              {/* Title Section */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gradient mb-4 leading-tight">
                  {artwork.title}
                </h1>
                <div className="w-20 h-1 bg-museum-gold rounded-full"></div>
              </motion.div>

              {/* Description Section */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <h3 className="text-xl font-heading font-semibold text-museum-gold mb-4">
                  {content.description}
                </h3>
                <p className="text-lg text-museum-beige/90 leading-relaxed">
                  {artwork.description}
                </p>
              </motion.div>

              {/* Audio Guide Section */}
              {artwork.audio_url && (
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <h3 className="text-xl font-heading font-semibold text-museum-gold mb-4">
                    {content.audioGuide}
                  </h3>
                  
                  <div className="bg-museum-charcoal/80 rounded-xl p-6 border border-museum-gold/20">
                    {/* Audio Controls */}
                    <div className="flex items-center space-x-4 mb-4">
                      <motion.button
                        onClick={handleAudioPlayPause}
                        className={`w-14 h-14 flex items-center justify-center rounded-full font-medium transition-all duration-300 ${
                          isAudioPlaying 
                            ? 'bg-museum-gold text-museum-black animate-pulse-gold' 
                            : 'bg-transparent border-2 border-museum-gold text-museum-gold hover:bg-museum-gold hover:text-museum-black'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {isAudioPlaying ? (
                            <>
                              <rect x="6" y="4" width="4" height="16" rx="2"/>
                              <rect x="14" y="4" width="4" height="16" rx="2"/>
                            </>
                          ) : (
                            <polygon points="5,3 19,12 5,21"/>
                          )}
                        </svg>
                      </motion.button>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm text-museum-beige/60 mb-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(audioDuration)}</span>
                        </div>
                        <div className="w-full bg-museum-black/50 rounded-full h-2">
                          <div 
                            className="h-2 bg-museum-gold rounded-full transition-all duration-300"
                            style={{ width: `${audioProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <audio
                      ref={audioRef}
                      src={`${import.meta.env.VITE_API_BASE_URL}${artwork.audio_url}`}
                      onTimeUpdate={handleAudioTimeUpdate}
                      onLoadedMetadata={handleAudioLoadedMetadata}
                      onEnded={handleAudioEnded}
                      className="hidden"
                    />
                  </div>
                </motion.div>
              )}

              {/* QR Code Section */}
              {artwork.qr_code_url && (
                <motion.div 
                  className="bg-museum-black/30 rounded-xl p-6 border border-museum-gold/20"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                >
                  <h3 className="text-xl font-heading font-semibold text-museum-gold mb-4">
                    {content.qrCode}
                  </h3>
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-museum-cream rounded-lg flex items-center justify-center shadow-elegant p-2">
                      <img 
                        src={`${import.meta.env.VITE_API_BASE_URL}${artwork.qr_code_url}`} 
                        alt={`QR Code pour ${artwork.title}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-museum-beige/80 text-sm leading-relaxed mb-3">
                        {content.scanQrCode}
                      </p>
                      <motion.button
                        onClick={handleShareArtwork}
                        className="text-museum-gold hover:text-museum-lightgold font-medium text-sm flex items-center space-x-2 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3"/>
                          <circle cx="6" cy="12" r="3"/>
                          <circle cx="18" cy="19" r="3"/>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                        <span>{content.shareArtwork}</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && artwork.video_url && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-museum-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideo(false)}
          >
            <motion.div 
              className="relative max-w-4xl w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowVideo(false)}
                className="absolute -top-12 right-0 text-museum-cream hover:text-museum-gold transition-colors duration-300"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <video 
                controls 
                autoPlay
                className="w-full rounded-xl shadow-museum"
              >
                <source src={`${import.meta.env.VITE_API_BASE_URL}${artwork.video_url}`} type="video/mp4" />
                {content.noVideo}
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtworkDetailPage;