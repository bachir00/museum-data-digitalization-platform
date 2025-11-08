import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchRooms } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

// CSS pour la scrollbar personnalisée
const customScrollbarStyle = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #D4AF37, #F4E4BC);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #F4E4BC, #D4AF37);
  }
`;

// Injecter le style dans le document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = customScrollbarStyle;
  if (!document.head.querySelector('style[data-custom-scrollbar]')) {
    styleSheet.setAttribute('data-custom-scrollbar', 'true');
    document.head.appendChild(styleSheet);
  }
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    theme: '',
    accessibility_level: '',
    has_audio: '',
    has_interactive: '',
    sortBy: 'id' // id, theme, created_at
  });
  
  // États pour les dropdowns personnalisés
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const { language } = useLanguage();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRooms();
        setRooms(data);
      } catch (err) {
        console.error("Erreur lors du chargement des salles:", err);
        setError("Impossible de charger les salles du musée. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, []);

  // Fonctions pour obtenir les options de filtres uniques
  const getUniqueValues = (field) => {
    return [...new Set(rooms.map(room => room[field]).filter(Boolean))].sort();
  };

  const resetFilters = () => {
    setFilters({
      theme: '',
      accessibility_level: '',
      has_audio: '',
      has_interactive: '',
      sortBy: 'id'
    });
    setSearchTerm('');
  };

  // Composant CustomSelect pour un dropdown élégant
  const CustomSelect = ({ value, onChange, options, placeholder, icon, name }) => {
    const isOpen = openDropdown === name;
    
    const toggleDropdown = () => {
      setOpenDropdown(isOpen ? null : name);
    };
    
    const selectOption = (optionValue) => {
      onChange(optionValue);
      setOpenDropdown(null);
    };

    // Fermer le dropdown si on clique ailleurs
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!event.target.closest(`[data-dropdown="${name}"]`)) {
          setOpenDropdown(null);
        }
      };
      
      if (isOpen) {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
      }
    }, [isOpen, name]);

    const selectedOption = options.find(opt => opt.value === value);
    
    return (
      <div className="relative" data-dropdown={name}>
        <motion.button
          type="button"
          onClick={toggleDropdown}
          className={`w-full px-4 py-3 bg-gradient-to-br from-museum-charcoal/50 to-museum-black/50 
                     backdrop-blur-sm border rounded-xl text-left
                     text-museum-beige text-sm font-medium
                     focus:outline-none transition-all duration-300 cursor-pointer
                     shadow-inner flex items-center justify-between
                     ${isOpen 
                       ? 'border-museum-gold ring-2 ring-museum-gold/20 shadow-lg shadow-museum-gold/10' 
                       : 'border-museum-gold/30 hover:border-museum-gold/50 hover:shadow-lg hover:shadow-museum-gold/10'
                     }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span className="flex items-center">
            {icon}
            <span className={value ? 'text-museum-beige' : 'text-museum-beige/60'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <motion.svg 
            className="w-4 h-4 text-museum-gold/60 ml-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-gray-800/95 to-gray-900/95 
                         backdrop-blur-xl border border-museum-gold/20 rounded-xl shadow-2xl shadow-museum-black/50 
                         z-[9999] overflow-hidden"
              style={{ zIndex: 9999 }}
            >
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => selectOption(option.value)}
                    className={`w-full px-4 py-3 text-left text-sm transition-all duration-200 
                               flex items-center space-x-3 border-b border-museum-gold/15 last:border-b-0
                               ${value === option.value 
                                 ? 'bg-museum-gold/20 text-museum-gold font-medium' 
                                 : 'text-museum-beige hover:bg-museum-gold/10 hover:text-museum-gold'
                               }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 4 }}
                  >
                    {option.icon && <span className="text-lg">{option.icon}</span>}
                    <span className="flex-1">{option.label}</span>
                    {value === option.value && (
                      <motion.svg 
                        className="w-4 h-4 text-museum-gold" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const getContent = () => {
    switch (language) {
      case 'en':
        return {
          title: "Exhibition Rooms",
          subtitle: "Discover our galleries and immerse yourself in African art and culture",
          loading: "Loading exhibition rooms...",
          error: "An error occurred",
          retry: "Try again",
          explore: "Explore",
          noRooms: "No exhibition rooms are currently available.",
          searchPlaceholder: "Search rooms...",
          roomsCount: "rooms available"
        };
      case 'wo':
        return {
          title: "Kër yi",
          subtitle: "Xam sunuy galerie yi ak dugg ci jëf ak aada Afrik",
          loading: "Xeuy kër yi...",
          error: "Jafe-jafe am na",
          retry: "Jéemal",
          explore: "Seetal",
          noRooms: "Amul kër yu am leegi.",
          searchPlaceholder: "Seet kër...",
          roomsCount: "kër yi am"
        };
      default:
        return {
          title: "Salles d'exposition",
          subtitle: "Découvrez nos galeries et plongez dans l'art et la culture africaine",
          loading: "Chargement des salles d'exposition...",
          error: "Une erreur est survenue",
          retry: "Réessayer",
          explore: "Explorer",
          noRooms: "Aucune salle d'exposition n'est disponible pour le moment.",
          searchPlaceholder: "Rechercher dans les salles...",
          roomsCount: "salles disponibles"
        };
    }
  };

  const content = getContent();

  // Filtrer les salles selon le terme de recherche et les filtres
  const getFilteredRooms = () => {
    let filtered = [...rooms];

    // Filtre par terme de recherche
    if (searchTerm.trim()) {
      filtered = filtered.filter(room =>
        room[`name_${language}`]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room[`description_${language}`]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par thème
    if (filters.theme) {
      filtered = filtered.filter(room => room.theme === filters.theme);
    }

    // Filtre par niveau d'accessibilité
    if (filters.accessibility_level) {
      filtered = filtered.filter(room => room.accessibility_level === filters.accessibility_level);
    }

    // Filtre par audio guide
    if (filters.has_audio) {
      const hasAudio = filters.has_audio === 'true';
      filtered = filtered.filter(room => Boolean(room.has_audio) === hasAudio);
    }

    // Filtre par interactivité
    if (filters.has_interactive) {
      const hasInteractive = filters.has_interactive === 'true';
      filtered = filtered.filter(room => Boolean(room.has_interactive) === hasInteractive);
    }

    // Tri des résultats
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'theme':
          return (a.theme || '').localeCompare(b.theme || '');
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'id':
        default:
          return a.id - b.id;
      }
    });

    return filtered;
  };

  const filteredRooms = getFilteredRooms();

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

  if (rooms.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl text-museum-beige">{content.noRooms}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-gradient mb-6">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl text-museum-beige/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              {content.subtitle}
            </p>

            {/* Search Bar */}
            <motion.div 
              className="max-w-md mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder={content.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-museum-charcoal/80 border border-museum-gold/30 rounded-lg py-4 pl-12 pr-4 text-museum-cream placeholder-museum-beige/60 focus:outline-none focus:border-museum-gold focus:ring-2 focus:ring-museum-gold/50 transition-all duration-300"
                />
                <svg 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-museum-gold"
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </motion.div>

            {/* Results Counter */}
            <motion.p 
              className="text-museum-beige/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {filteredRooms.length} {content.roomsCount}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Section des filtres */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12 relative z-50"
          >
            <div className="bg-black/20 backdrop-blur-sm border border-museum-gold/20 rounded-2xl p-6 relative z-50">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-serif text-museum-gold flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {language === 'fr' ? 'Filtres' : language === 'en' ? 'Filters' : 'Yomba'}
                </h3>
                
                <motion.button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm bg-museum-gold/10 hover:bg-museum-gold/20 text-museum-gold 
                           border border-museum-gold/30 rounded-lg transition-all duration-300 
                           flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{language === 'fr' ? 'Réinitialiser' : language === 'en' ? 'Reset' : 'Jottali'}</span>
                </motion.button>
              </div>

              {/* Filtres en grille responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {/* Filtre par thème */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-museum-gold flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {language === 'fr' ? 'Thème' : language === 'en' ? 'Theme' : 'Kéneen'}
                  </label>
                  <CustomSelect
                    name="theme"
                    value={filters.theme}
                    onChange={(value) => setFilters(prev => ({ ...prev, theme: value }))}
                    placeholder={language === 'fr' ? 'Tous thèmes' : language === 'en' ? 'All themes' : 'Kéneen yépp'}
                    icon={<span className="mr-2">🎨</span>}
                    options={[
                      { value: '', label: language === 'fr' ? 'Tous thèmes' : language === 'en' ? 'All themes' : 'Kéneen yépp', icon: '🎨' },
                      ...getUniqueValues('theme').map(theme => ({
                        value: theme,
                        label: theme,
                        icon: theme.includes('Histoire') ? '📜' : 
                              theme.includes('Art sacré') ? '🙏' : 
                              theme.includes('Culture') ? '🌍' : '🏛️'
                      }))
                    ]}
                  />
                </div>

                {/* Filtre par accessibilité */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-museum-gold flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {language === 'fr' ? 'Accessibilité' : language === 'en' ? 'Accessibility' : 'Jëfandikoo'}
                  </label>
                  <CustomSelect
                    name="accessibility"
                    value={filters.accessibility_level}
                    onChange={(value) => setFilters(prev => ({ ...prev, accessibility_level: value }))}
                    placeholder={language === 'fr' ? 'Tous niveaux' : language === 'en' ? 'All levels' : 'Nianal yépp'}
                    icon={<span className="mr-2">♿</span>}
                    options={[
                      { value: '', label: language === 'fr' ? 'Tous niveaux' : language === 'en' ? 'All levels' : 'Nianal yépp', icon: '♿' },
                      ...getUniqueValues('accessibility_level').map(level => ({
                        value: level,
                        label: level,
                        icon: level === 'facile' ? '🟢' : level === 'modéré' ? '🟡' : '🔴'
                      }))
                    ]}
                  />
                </div>

                {/* Filtre par audio guide */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-museum-gold flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    {language === 'fr' ? 'Audio Guide' : language === 'en' ? 'Audio Guide' : 'Xol bi'}
                  </label>
                  <CustomSelect
                    name="audio"
                    value={filters.has_audio}
                    onChange={(value) => setFilters(prev => ({ ...prev, has_audio: value }))}
                    placeholder={language === 'fr' ? 'Toutes salles' : language === 'en' ? 'All rooms' : 'Kër yépp'}
                    icon={<span className="mr-2">🔊</span>}
                    options={[
                      { value: '', label: language === 'fr' ? 'Toutes salles' : language === 'en' ? 'All rooms' : 'Kër yépp', icon: '🔊' },
                      { value: 'true', label: language === 'fr' ? 'Avec audio guide' : language === 'en' ? 'With audio guide' : 'Ak xol bi', icon: '🎧' },
                      { value: 'false', label: language === 'fr' ? 'Sans audio guide' : language === 'en' ? 'Without audio guide' : 'Amul xol', icon: '🔇' }
                    ]}
                  />
                </div>

                {/* Filtre par interactivité */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-museum-gold flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    {language === 'fr' ? 'Interactivité' : language === 'en' ? 'Interactive' : 'Jëfandikoo'}
                  </label>
                  <CustomSelect
                    name="interactive"
                    value={filters.has_interactive}
                    onChange={(value) => setFilters(prev => ({ ...prev, has_interactive: value }))}
                    placeholder={language === 'fr' ? 'Toutes salles' : language === 'en' ? 'All rooms' : 'Kër yépp'}
                    icon={<span className="mr-2">🎮</span>}
                    options={[
                      { value: '', label: language === 'fr' ? 'Toutes salles' : language === 'en' ? 'All rooms' : 'Kër yépp', icon: '🎮' },
                      { value: 'true', label: language === 'fr' ? 'Panorama interactif' : language === 'en' ? 'Interactive panorama' : 'Panorama bu jëfandikoo', icon: '🌐' },
                      { value: 'false', label: language === 'fr' ? 'Panorama simple' : language === 'en' ? 'Simple panorama' : 'Panorama bu yarr', icon: '📷' }
                    ]}
                  />
                </div>

                {/* Tri */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-museum-gold flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    {language === 'fr' ? 'Trier par' : language === 'en' ? 'Sort by' : 'Jëme ci'}
                  </label>
                  <CustomSelect
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                    placeholder={language === 'fr' ? 'Numéro (1-N)' : language === 'en' ? 'Number (1-N)' : 'Nimero (1-N)'}
                    icon={<span className="mr-2">🔢</span>}
                    options={[
                      { value: 'id', label: language === 'fr' ? 'Numéro (1-N)' : language === 'en' ? 'Number (1-N)' : 'Nimero (1-N)', icon: '🔢' },
                      { value: 'theme', label: language === 'fr' ? 'Par thème' : language === 'en' ? 'By theme' : 'Ci kéneen', icon: '🎨' },
                      { value: 'created_at', label: language === 'fr' ? 'Plus récentes' : language === 'en' ? 'Most recent' : 'Yi gën-gën', icon: '🆕' }
                    ]}
                  />
                </div>
              </div>

              {/* Indicateurs de filtres actifs */}
              {(filters.theme || filters.accessibility_level || filters.has_audio || filters.has_interactive || searchTerm) && (
                <div className="mt-4 pt-4 border-t border-museum-gold/20">
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <span className="inline-flex items-center px-3 py-1 bg-museum-gold/20 text-museum-gold 
                                     text-xs rounded-full border border-museum-gold/30">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        "{searchTerm}"
                      </span>
                    )}
                    {filters.theme && (
                      <span className="inline-flex items-center px-3 py-1 bg-museum-gold/20 text-museum-gold 
                                     text-xs rounded-full border border-museum-gold/30">
                        🎨 {filters.theme}
                      </span>
                    )}
                    {filters.accessibility_level && (
                      <span className="inline-flex items-center px-3 py-1 bg-museum-gold/20 text-museum-gold 
                                     text-xs rounded-full border border-museum-gold/30">
                        ♿ {filters.accessibility_level}
                      </span>
                    )}
                    {filters.has_audio && (
                      <span className="inline-flex items-center px-3 py-1 bg-museum-gold/20 text-museum-gold 
                                     text-xs rounded-full border border-museum-gold/30">
                        🎧 {filters.has_audio === 'true' ? (language === 'fr' ? 'Avec audio' : language === 'en' ? 'With audio' : 'Ak xol') : (language === 'fr' ? 'Sans audio' : language === 'en' ? 'No audio' : 'Amul xol')}
                      </span>
                    )}
                    {filters.has_interactive && (
                      <span className="inline-flex items-center px-3 py-1 bg-museum-gold/20 text-museum-gold 
                                     text-xs rounded-full border border-museum-gold/30">
                        🌐 {filters.has_interactive === 'true' ? (language === 'fr' ? 'Interactif' : language === 'en' ? 'Interactive' : 'Bu jëfandikoo') : (language === 'fr' ? 'Simple' : language === 'en' ? 'Simple' : 'Bu yarr')}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Link to={`/rooms/${room.id}`}>
                  <div className="card-museum overflow-hidden h-full">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={`${import.meta.env.VITE_API_BASE_URL}${room.panorama_url}`} 
                        alt={room[`name_${language}`]} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-overlay-dark opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                      
                      {/* Overlay avec bouton d'exploration */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.div
                          className="bg-museum-gold text-museum-black px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-gold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>{content.explore}</span>
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
                            <path d="m9 18 6-6-6-6"/>
                          </svg>
                        </motion.div>
                      </div>

                      {/* Badge avec numéro de salle */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-museum-gold text-museum-black px-3 py-1 rounded-full text-sm font-bold shadow-gold">
                          #{room.id}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-2xl font-heading font-bold text-museum-cream mb-3 group-hover:text-museum-gold transition-colors duration-300">
                        {room[`name_${language}`]}
                      </h2>
                      <p className="text-museum-beige/80 leading-relaxed mb-4">
                        {room[`description_${language}`]?.length > 150 
                          ? `${room[`description_${language}`].substring(0, 150)}...`
                          : room[`description_${language}`]
                        }
                      </p>

                      {/* Features */}
                      <div className="flex items-center justify-between pt-4 border-t border-museum-gold/20">
                        <div className="flex items-center space-x-4 text-sm text-museum-beige/60">
                          <div className="flex items-center space-x-1">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span>360°</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                            <span>Audio</span>
                          </div>
                        </div>
                        
                        <motion.div 
                          className="text-museum-gold group-hover:translate-x-1 transition-transform duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m9 18 6-6-6-6"/>
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredRooms.length === 0 && searchTerm && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-heading text-museum-gold mb-4">
                {language === 'fr' ? 'Aucun résultat trouvé' : 
                 language === 'en' ? 'No results found' : 
                 'Amul ko gëm'}
              </h3>
              <p className="text-museum-beige/60 mb-6">
                {language === 'fr' ? `Aucune salle ne correspond à "${searchTerm}"` : 
                 language === 'en' ? `No rooms match "${searchTerm}"` : 
                 `Amul kër yu mel "${searchTerm}"`}
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="btn-museum-outline"
              >
                {language === 'fr' ? 'Effacer la recherche' : 
                 language === 'en' ? 'Clear search' : 
                 'Jottali seet'}
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RoomsPage;