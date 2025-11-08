import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getPlaceholder = () => {
    switch (language) {
      case 'en': return 'Search rooms and artworks...';
      case 'wo': return 'Seet këri ak jëf yi...';
      default: return 'Rechercher salles et œuvres...';
    }
  };

  const getMuseumName = () => {
    switch (language) {
      case 'en': return 'Virtual Museum';
      case 'wo': return 'Musée Virtuel';
      default: return 'Musée Virtuel';
    }
  };
  
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-museum-gold/20 backdrop-blur-md"
    >
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <motion.div 
            className="flex items-center space-x-2 md:space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gold-gradient rounded-lg flex items-center justify-center shadow-gold">
                <svg 
                  width="20" 
                  height="20" 
                  className="md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#0F0F0F" 
                  strokeWidth="2"
                >
                  <path d="M3 21h18"/>
                  <path d="M5 21V7l8-4v18"/>
                  <path d="M19 21V11l-6-4"/>
                </svg>
              </div>
              <h1 className="text-lg md:text-2xl font-heading font-bold text-gradient hidden sm:block">
                {getMuseumName()}
              </h1>
            </Link>
          </motion.div>

          {/* Search Bar */}
          <motion.form 
            className="hidden md:flex items-center max-w-md mx-4 flex-1"
            onSubmit={handleSearch}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <input
                type="text"
                className="w-full bg-museum-charcoal/80 border border-museum-gold/30 rounded-lg py-2 md:py-3 pl-10 md:pl-12 pr-4 text-sm md:text-base text-museum-cream placeholder-museum-beige/60 focus:outline-none focus:border-museum-gold focus:ring-2 focus:ring-museum-gold/50 transition-all duration-300"
                placeholder={getPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button 
                type="submit" 
                className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-museum-gold hover:text-museum-lightgold transition-colors duration-300"
              >
                <svg width="16" height="16" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-museum-beige/60 hover:text-museum-gold transition-colors duration-300"
                >
                  <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          </motion.form>

          {/* Navigation & Language Selector */}
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-sm lg:text-base text-museum-cream hover:text-museum-gold transition-colors duration-300 font-medium relative group"
              >
                {language === 'fr' ? 'Accueil' : language === 'en' ? 'Home' : 'Dalal'}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-museum-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/rooms" 
                className="text-sm lg:text-base text-museum-cream hover:text-museum-gold transition-colors duration-300 font-medium relative group"
              >
                {language === 'fr' ? 'Salles' : language === 'en' ? 'Rooms' : 'Këri yi'}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-museum-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/artworks" 
                className="text-sm lg:text-base text-museum-cream hover:text-museum-gold transition-colors duration-300 font-medium relative group"
              >
                {language === 'fr' ? 'Œuvres' : language === 'en' ? 'Artworks' : 'Jëf yi'}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-museum-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/about" 
                className="text-sm lg:text-base text-museum-cream hover:text-museum-gold transition-colors duration-300 font-medium relative group"
              >
                {language === 'fr' ? 'À propos' : language === 'en' ? 'About' : 'Mbiru'}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-museum-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Language Selector */}
            <motion.div 
              className="flex items-center bg-museum-charcoal/80 rounded-lg p-1 border border-museum-gold/20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {['fr', 'en', 'wo'].map((lang) => (
                <motion.button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded transition-all duration-300 ${
                    language === lang
                      ? 'bg-museum-gold text-museum-black shadow-gold'
                      : 'text-museum-cream hover:text-museum-gold hover:bg-museum-gold/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {lang.toUpperCase()}
                </motion.button>
              ))}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button 
              className="lg:hidden p-1 md:p-2 text-museum-gold hover:text-museum-lightgold transition-colors duration-300"
              onClick={toggleMobileMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <motion.form 
          className="md:hidden mt-4"
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="relative">
            <input
              type="text"
              className="w-full bg-museum-charcoal/80 border border-museum-gold/30 rounded-lg py-2 pl-10 pr-4 text-sm text-museum-cream placeholder-museum-beige/60 focus:outline-none focus:border-museum-gold focus:ring-2 focus:ring-museum-gold/50 transition-all duration-300"
              placeholder={getPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-museum-gold hover:text-museum-lightgold transition-colors duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </motion.form>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.nav 
            className="lg:hidden mt-4 bg-museum-charcoal/90 border border-museum-gold/20 rounded-lg backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-3">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 md:py-3 px-3 md:px-4 text-sm md:text-base text-museum-cream hover:text-museum-gold hover:bg-museum-gold/10 transition-all duration-300 font-medium rounded-lg"
              >
                {language === 'fr' ? 'Accueil' : language === 'en' ? 'Home' : 'Dalal'}
              </Link>
              <Link 
                to="/rooms" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 md:py-3 px-3 md:px-4 text-sm md:text-base text-museum-cream hover:text-museum-gold hover:bg-museum-gold/10 transition-all duration-300 font-medium rounded-lg"
              >
                {language === 'fr' ? 'Salles' : language === 'en' ? 'Rooms' : 'Këri yi'}
              </Link>
              <Link 
                to="/artworks" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 md:py-3 px-3 md:px-4 text-sm md:text-base text-museum-cream hover:text-museum-gold hover:bg-museum-gold/10 transition-all duration-300 font-medium rounded-lg"
              >
                {language === 'fr' ? 'Œuvres' : language === 'en' ? 'Artworks' : 'Jëf yi'}
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 md:py-3 px-3 md:px-4 text-sm md:text-base text-museum-cream hover:text-museum-gold hover:bg-museum-gold/10 transition-all duration-300 font-medium rounded-lg"
              >
                {language === 'fr' ? 'À propos' : language === 'en' ? 'About' : 'Mbiru'}
              </Link>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;