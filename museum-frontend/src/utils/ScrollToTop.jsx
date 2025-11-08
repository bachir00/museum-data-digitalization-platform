import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Ce composant réinitialise la position de défilement à chaque changement de page
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;