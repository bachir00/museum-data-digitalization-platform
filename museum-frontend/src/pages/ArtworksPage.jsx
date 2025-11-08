import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllArtworks } from '../services/api';
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

const ArtworksPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    category: '',
    period: '',
    origin: '',
    room_id: '',
    sortBy: 'title' // title, popularity, view_count, created_at
  });
  
  // États pour les dropdowns personnalisés
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const { language, getTranslation } = useLanguage();

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllArtworks(language);
        setArtworks(data || []);
        setFilteredArtworks(data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des œuvres:", err);
        setError("Impossible de charger les œuvres d'art. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworks();
  }, [language]);

  // Filtre les œuvres selon le terme de recherche et les filtres
  useEffect(() => {
    let filtered = [...artworks];

    // Filtre par terme de recherche
    if (searchTerm.trim()) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork[`description_${language}`]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (filters.category) {
      filtered = filtered.filter(artwork => artwork.category === filters.category);
    }

    // Filtre par période
    if (filters.period) {
      filtered = filtered.filter(artwork => artwork.period === filters.period);
    }

    // Filtre par origine
    if (filters.origin) {
      filtered = filtered.filter(artwork => artwork.origin === filters.origin);
    }

    // Filtre par salle
    if (filters.room_id) {
      filtered = filtered.filter(artwork => artwork.room_id === parseInt(filters.room_id));
    }

    // Tri des résultats
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'view_count':
          return (b.view_count || 0) - (a.view_count || 0);
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredArtworks(filtered);
  }, [searchTerm, artworks, language, filters]);

  // Fonctions pour obtenir les options de filtres uniques
  const getUniqueValues = (field) => {
    return [...new Set(artworks.map(artwork => artwork[field]).filter(Boolean))].sort();
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      period: '',
      origin: '',
      room_id: '',
      sortBy: 'title'
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
              className="absolute top-full left-0 right-0 mt-1  bg-gradient-to-br from-gray-800/95 to-gray-900/95 
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

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-museum-gradient"
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-museum-gold mb-4"></div>
          <p className="text-museum-beige text-lg">
            {getTranslation('loadingArtworks', 'Chargement des œuvres...')}
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-museum-gradient"
      >
        <div className="text-center bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-museum-gold/20">
          <h2 className="text-2xl font-serif text-museum-gold mb-4">Une erreur est survenue</h2>
          <p className="text-museum-beige mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-museum"
          >
            Réessayer
          </button>
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
        {/* En-tête avec recherche */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-museum-gold mb-4">
            {getTranslation('artworksTitle', 'Collection d\'Œuvres')}
          </h1>
          <p className="text-xl text-museum-beige/90 mb-8 max-w-2xl mx-auto">
            {getTranslation('artworksSubtitle', 'Découvrez notre collection exceptionnelle d\'art africain')}
          </p>

          {/* Barre de recherche élégante */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder={getTranslation('searchPlaceholder', 'Rechercher une œuvre...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 bg-black/30 backdrop-blur-sm border border-museum-gold/30 
                       rounded-full text-museum-beige placeholder-museum-beige/60
                       focus:outline-none focus:border-museum-gold focus:ring-2 focus:ring-museum-gold/20
                       transition-all duration-300"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-museum-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Compteur de résultats */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-museum-beige/70 mt-4"
          >
            {filteredArtworks.length} {getTranslation('artworksFound', 'œuvre(s) trouvée(s)')}
          </motion.p>
        </motion.div>

        {/* Section des filtres */}
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
                {getTranslation('filters', 'Filtres')}
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
                <span>{getTranslation('resetFilters', 'Réinitialiser')}</span>
              </motion.button>
            </div>

            {/* Filtres en grille responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Filtre par catégorie */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-museum-gold flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {getTranslation('filterCategory', 'Catégorie')}
                </label>
                <CustomSelect
                  name="category"
                  value={filters.category}
                  onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                  placeholder={getTranslation('allCategories', 'Toutes catégories')}
                  icon={<span className="mr-2">📂</span>}
                  options={[
                    { value: '', label: getTranslation('allCategories', 'Toutes catégories'), icon: '🎨' },
                    ...getUniqueValues('category').map(category => ({
                      value: category,
                      label: category,
                      icon: category.includes('Masque') ? '🎭' : 
                            category.includes('Sculpture') ? '🗿' : 
                            category.includes('Peinture') ? '🖼️' : 
                            category.includes('Bijou') ? '💍' : '🎨'
                    }))
                  ]}
                />
              </div>

              {/* Filtre par période */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-museum-gold flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {getTranslation('filterPeriod', 'Période')}
                </label>
                <CustomSelect
                  name="period"
                  value={filters.period}
                  onChange={(value) => setFilters(prev => ({ ...prev, period: value }))}
                  placeholder={getTranslation('allPeriods', 'Toutes périodes')}
                  icon={<span className="mr-2">📅</span>}
                  options={[
                    { value: '', label: getTranslation('allPeriods', 'Toutes périodes'), icon: '📅' },
                    ...getUniqueValues('period').map(period => ({
                      value: period,
                      label: period,
                      icon: period.includes('XX') ? '🏛️' : 
                            period.includes('XIX') ? '⚱️' : 
                            period.includes('contemporain') ? '🎯' : '📜'
                    }))
                  ]}
                />
              </div>

              {/* Filtre par origine */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-museum-gold flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {getTranslation('filterOrigin', 'Origine')}
                </label>
                <CustomSelect
                  name="origin"
                  value={filters.origin}
                  onChange={(value) => setFilters(prev => ({ ...prev, origin: value }))}
                  placeholder={getTranslation('allOrigins', 'Toutes origines')}
                  icon={<span className="mr-2">🌍</span>}
                  options={[
                    { value: '', label: getTranslation('allOrigins', 'Toutes origines'), icon: '🌍' },
                    ...getUniqueValues('origin').map(origin => ({
                      value: origin,
                      label: origin,
                      icon: origin.includes('Sénégal') ? '🇸🇳' : 
                            origin.includes('Mali') ? '🇲🇱' : 
                            origin.includes('Côte') ? '🇨🇮' : 
                            origin.includes('Bénin') ? '🇧🇯' : 
                            origin.includes('Égypte') ? '🇪🇬' : '🌍'
                    }))
                  ]}
                />
              </div>

              {/* Filtre par salle */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-museum-gold flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {getTranslation('filterRoom', 'Salle')}
                </label>
                <CustomSelect
                  name="room"
                  value={filters.room_id}
                  onChange={(value) => setFilters(prev => ({ ...prev, room_id: value }))}
                  placeholder={getTranslation('allRooms', 'Toutes salles')}
                  icon={<span className="mr-2">🏛️</span>}
                  options={[
                    { value: '', label: getTranslation('allRooms', 'Toutes salles'), icon: '🏛️' },
                    ...[...new Set(artworks.map(artwork => artwork.room_id).filter(Boolean))]
                      .sort((a, b) => a - b)
                      .map(roomId => ({
                        value: roomId.toString(),
                        label: getTranslation(`room_${roomId}`, `Salle ${roomId}`),
                        icon: '🏺'
                      }))
                  ]}
                />
              </div>

              {/* Tri */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-museum-gold flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                  {getTranslation('sortBy', 'Trier par')}
                </label>
                <CustomSelect
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                  placeholder={getTranslation('sortTitle', 'Nom (A-Z)')}
                  icon={<span className="mr-2">🔤</span>}
                  options={[
                    { value: 'title', label: getTranslation('sortTitle', 'Nom (A-Z)'), icon: '🔤' },
                    { value: 'popularity', label: getTranslation('sortPopularity', 'Popularité'), icon: '⭐' },
                    { value: 'view_count', label: getTranslation('sortViews', 'Plus consultées'), icon: '👁️' },
                    { value: 'created_at', label: getTranslation('sortNewest', 'Plus récentes'), icon: '🆕' }
                  ]}
                />
              </div>
            </div>

            {/* Indicateurs de filtres actifs */}
            {(filters.category || filters.period || filters.origin || filters.room_id || searchTerm) && (
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
                  {filters.category && (
                    <span className="inline-flex items-center px-3 py-1 bg-museum-gold/20 text-museum-gold 
                                   text-xs rounded-full border border-museum-gold/30">
                      📂 {filters.category}
                    </span>
                  )}
                  {filters.period && (
                    <span className="inline-flex items-center px-3 py-1 bg-museum-gold/20 text-museum-gold 
                                   text-xs rounded-full border border-museum-gold/30">
                      📅 {filters.period}
                    </span>
                  )}
                  {filters.origin && (
                    <span className="inline-flex items-center px-3 py-1 bg-museum-gold/20 text-museum-gold 
                                   text-xs rounded-full border border-museum-gold/30">
                      🌍 {filters.origin}
                    </span>
                  )}
                  {filters.room_id && (
                    <span className="inline-flex items-center px-3 py-1 bg-museum-gold/20 text-museum-gold 
                                   text-xs rounded-full border border-museum-gold/30">
                      🏛️ Salle {filters.room_id}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Grille des œuvres */}
        <AnimatePresence mode="wait">
          {filteredArtworks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <p className="text-xl text-museum-beige/70">
                {getTranslation('noArtworks', 'Aucune œuvre trouvée pour cette recherche')}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative z-10"
                >
                  <Link to={`/artworks/${artwork.id}`}>
                    <div className="card-museum group-hover:scale-105 transition-all duration-500 overflow-hidden relative z-10">
                      {/* Image de l'œuvre */}
                      <div className="relative overflow-hidden aspect-[3/4]">
                        <img 
                          src={`${import.meta.env.VITE_API_BASE_URL}${artwork.image_url}`} 
                          alt={artwork.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        
                        {/* Overlay au survol */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-museum-beige text-sm line-clamp-3">
                              {artwork[`description_${language}`]?.substring(0, 120)}...
                            </p>
                          </div>
                        </div>

                        {/* Icône de vue */}
                        <div className="absolute top-4 right-4 w-10 h-10 bg-museum-gold/90 rounded-full 
                                      flex items-center justify-center opacity-0 group-hover:opacity-100 
                                      transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="p-6">
                        <h3 className="text-xl font-serif text-museum-gold mb-2 group-hover:text-museum-gold/80 transition-colors">
                          {artwork.title}
                        </h3>
                        {artwork.artist && (
                          <p className="text-museum-beige/70 text-sm">
                            {artwork.artist}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ArtworksPage;