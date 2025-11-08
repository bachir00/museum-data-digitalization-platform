import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchRooms, fetchArtworksByRoom } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const roomsData = await fetchRooms();
        setRooms(roomsData);
        
        if (roomsData.length > 0) {
          const artworksPromises = roomsData.slice(0, 3).map(room => 
            fetchArtworksByRoom(room.id)
          );
          const artworksResults = await Promise.all(artworksPromises);
          const allArtworks = artworksResults.flat();
          setFeaturedArtworks(allArtworks);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données du musée. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const getContent = () => {
    switch (language) {
      case 'en':
        return {
          heroTitle: "Discover African Art and Culture",
          heroSubtitle: "Explore exceptional artworks and immerse yourself in a virtual experience",
          startTour: "Start the tour",
          bestPicks: "Best picks of the day",
          exploredRooms: "Exhibition Rooms",
          seeAllRooms: "See all rooms",
          notableArtworks: "Notable artworks",
          seeAllArtworks: "See all artworks",
          immersiveExp: "An immersive experience",
          immersiveDesc: "Explore our 360° rooms and discover our collections as if you were there",
          virtualTours: "Virtual tours",
          virtualToursDesc: "Navigate our exhibition rooms in 360°",
          audioGuides: "Audio guides",
          audioGuidesDesc: "Listen to artwork descriptions",
          multilingual: "Multilingual",
          multilingualDesc: "Content available in French, English and Wolof",
          loading: "Loading museum experience...",
          error: "An error occurred",
          tryAgain: "Try again"
        };
      case 'wo':
        return {
          heroTitle: "Xam Art ak Aada Afrik",
          heroSubtitle: "Seetal jëf yu rafet yi te dugg ci am xam-xam bu dëgër",
          startTour: "Tàmbali wër",
          bestPicks: "Tànn yi ci bës bi",
          exploredRooms: "Kër yi",
          seeAllRooms: "Xool kër yëpp",
          notableArtworks: "Jëf yu rafet",
          seeAllArtworks: "Xool jëf yëpp",
          immersiveExp: "Am xam-xam bu dëgër",
          immersiveDesc: "Seetal sunuy kër yi 360° ak sunuy ndàkk ni nga fa nekke",
          virtualTours: "Wër bu virtual",
          virtualToursDesc: "Dox ci sunuy kër yi ci 360°",
          audioGuides: "Ndiimantal dégg",
          audioGuidesDesc: "Déglul tekki jëf yi",
          multilingual: "Làkk yu bari",
          multilingualDesc: "Am na ci faraañse, angale ak wolof",
          loading: "Xeuy musée bi...",
          error: "Jafe-jafe am na",
          tryAgain: "Jéemal"
        };
      default:
        return {
          heroTitle: "Découvrez l'Art et la Culture Africaine",
          heroSubtitle: "Explorez des œuvres exceptionnelles et plongez dans une expérience virtuelle immersive",
          startTour: "Commencer la visite",
          bestPicks: "Les meilleurs choix du jour",
          exploredRooms: "Salles d'exposition",
          seeAllRooms: "Voir toutes les salles",
          notableArtworks: "Œuvres remarquables",
          seeAllArtworks: "Voir toutes les œuvres",
          immersiveExp: "Une expérience immersive",
          immersiveDesc: "Explorez nos salles en 360° et découvrez nos collections comme si vous y étiez",
          virtualTours: "Visites virtuelles",
          virtualToursDesc: "Parcourez nos salles d'exposition en 360°",
          audioGuides: "Audio guides",
          audioGuidesDesc: "Écoutez les descriptions des œuvres",
          multilingual: "Multilingue",
          multilingualDesc: "Contenus disponibles en français, anglais et wolof",
          loading: "Chargement de l'expérience muséale...",
          error: "Une erreur est survenue",
          tryAgain: "Réessayer"
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
            {content.tryAgain}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background avec image panoramique */}
        <div className="absolute inset-0 z-0">
          {rooms[0] && (
            <div className="relative w-full h-full">
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL}${rooms[0].panorama_url}`}
                alt="Museum panorama"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-overlay-dark"></div>
            </div>
          )}
        </div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-3 md:px-4"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1 
            className="text-3xl md:text-5xl lg:text-7xl font-heading font-bold mb-4 md:mb-6 text-gradient leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {content.heroTitle}
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-museum-beige mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {content.heroSubtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/rooms" className="btn-museum text-base md:text-lg px-6 md:px-8 py-3 md:py-4 inline-flex items-center space-x-2 md:space-x-3 group">
              <span>{content.startTour}</span>
              <svg 
                width="20" 
                height="20" 
                className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex flex-col items-center text-museum-beige/60">
            <span className="text-xs md:text-sm font-medium mb-1 md:mb-2">Scroll</span>
            <motion.svg 
              width="20" 
              height="20" 
              className="md:w-6 md:h-6"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path d="m7 13 5 5 5-5"/>
              <path d="m7 6 5 5 5-5"/>
            </motion.svg>
          </div>
        </motion.div>
      </section>

      {/* Best Picks Section */}
      <section className="py-12 md:py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gradient mb-4 md:mb-6">
            {content.bestPicks}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArtworks.slice(0, 3).map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group"
            >
              <Link to={`/artworks/${artwork.id}`} className="block">
                <div className="card-museum overflow-hidden h-96 relative">
                  <div className="absolute inset-0">
                    <img 
                      src={`${import.meta.env.VITE_API_BASE_URL}${artwork.image_url}`}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-overlay-dark opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  </div>
                  <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-bold text-museum-cream mb-2 group-hover:text-museum-gold transition-colors duration-300">
                      {artwork.title}
                    </h3>
                    <p className="text-sm md:text-base text-museum-beige/80 leading-relaxed">
                      {artwork[`description_${language}`]?.substring(0, 120)}...
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-12 md:py-20 bg-museum-charcoal/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gradient">
              {content.exploredRooms}
            </h2>
            <Link 
              to="/rooms" 
              className="btn-museum-outline group flex items-center space-x-1 md:space-x-2 text-sm md:text-base px-3 md:px-4 py-2 md:py-3"
            >
              <span>{content.seeAllRooms}</span>
              <svg 
                width="16" 
                height="16" 
                className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.slice(0, 3).map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="group"
              >
                <Link to={`/rooms/${room.id}`} className="block">
                  <div className="card-museum overflow-hidden">
                    <div className="h-64 relative overflow-hidden">
                      <img 
                        src={`${import.meta.env.VITE_API_BASE_URL}${room.panorama_url}`}
                        alt={room.name_fr}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-overlay-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-bold text-museum-cream mb-2 md:mb-3 group-hover:text-museum-gold transition-colors duration-300">
                        {room[`name_${language}`]}
                      </h3>
                      <p className="text-sm md:text-base text-museum-beige/80 leading-relaxed">
                        {room[`description_${language}`]?.substring(0, 150)}...
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notable Artworks Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gradient">
              {content.notableArtworks}
            </h2>
            <Link 
              to="/artworks" 
              className="btn-museum-outline group flex items-center space-x-1 md:space-x-2 text-sm md:text-base px-3 md:px-4 py-2 md:py-3"
            >
              <span>{content.seeAllArtworks}</span>
              <svg 
                width="16" 
                height="16" 
                className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          </motion.div>

          <div className="overflow-x-auto pb-4">
            <motion.div 
              className="flex space-x-6 w-max"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              {featuredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -15, transition: { duration: 0.3 } }}
                  className="group flex-shrink-0 w-64 md:w-80"
                >
                  <Link to={`/artworks/${artwork.id}`} className="block">
                    <div className="card-museum overflow-hidden">
                      <div className="h-48 md:h-64 relative overflow-hidden">
                        <img 
                          src={`${import.meta.env.VITE_API_BASE_URL}${artwork.image_url}`}
                          alt={artwork.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-heading font-bold text-museum-cream mb-1 md:mb-2 group-hover:text-museum-gold transition-colors duration-300">
                          {artwork.title}
                        </h3>
                        <p className="text-museum-beige/80 text-xs md:text-sm leading-relaxed">
                          {artwork[`description_${language}`]?.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-12 md:py-20 bg-museum-charcoal/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gradient mb-4 md:mb-6">
              {content.immersiveExp}
            </h2>
            <p className="text-lg md:text-xl text-museum-beige/80 max-w-3xl mx-auto leading-relaxed">
              {content.immersiveDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: content.virtualTours,
                description: content.virtualToursDesc
              },
              {
                icon: "🎧",
                title: content.audioGuides,
                description: content.audioGuidesDesc
              },
              {
                icon: "🌍",
                title: content.multilingual,
                description: content.multilingualDesc
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="text-center p-6 md:p-8 card-museum"
              >
                <motion.div 
                  className="text-4xl md:text-6xl mb-4 md:mb-6"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg md:text-2xl font-heading font-bold text-museum-gold mb-3 md:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-museum-beige/80 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;