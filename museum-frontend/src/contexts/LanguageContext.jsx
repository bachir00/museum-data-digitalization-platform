import { createContext, useState, useContext } from 'react';

// Création du contexte
const LanguageContext = createContext();

// Provider du contexte
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr'); // fr par défaut

  // Fonction pour changer la langue
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  // Fonction utilitaire pour les traductions (fallback)
  const getTranslation = (key, fallback) => {
    return fallback; // Pour l'instant retourne toujours le fallback
  };

  // Valeur du contexte
  const value = {
    language,
    changeLanguage,
    getTranslation,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte facilement
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage doit être utilisé à l\'intérieur d\'un LanguageProvider');
  }
  return context;
};