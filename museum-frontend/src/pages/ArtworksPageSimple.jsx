import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllArtworks } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const ArtworksPageSimple = () => {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Test simple - Chargement des œuvres, langue:', language);
        const data = await fetchAllArtworks(language);
        console.log('✅ Test simple - Œuvres récupérées:', data);
        setArtworks(data || []);
      } catch (err) {
        console.error("❌ Test simple - Erreur:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworks();
  }, [language]);

  console.log('🎨 État actuel:', { isLoading, error, artworks: artworks.length });

  if (isLoading) {
    return (
      <div style={{ padding: '20px', background: '#0F0F0F', color: '#D4AF37', minHeight: '100vh' }}>
        <h1>Chargement des œuvres...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', background: '#0F0F0F', color: '#ff6b6b', minHeight: '100vh' }}>
        <h1>Erreur: {error}</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#0F0F0F', color: '#F5F5DC', minHeight: '100vh' }}>
      <h1 style={{ color: '#D4AF37', marginBottom: '20px' }}>
        Collection d'Œuvres (Test Simple)
      </h1>
      <p>Nombre d'œuvres trouvées: {artworks.length}</p>
      
      {artworks.length === 0 ? (
        <div style={{ color: '#ff6b6b', padding: '20px' }}>
          <p>Aucune œuvre trouvée!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {artworks.map((artwork) => (
            <div key={artwork.id} style={{ 
              background: '#1A1A1A', 
              border: '1px solid #D4AF37', 
              borderRadius: '8px', 
              padding: '15px' 
            }}>
              <h3 style={{ color: '#D4AF37', marginBottom: '10px' }}>
                {artwork.title}
              </h3>
              <p style={{ color: '#F5F5DC', marginBottom: '10px' }}>
                {artwork.description}
              </p>
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL}${artwork.image_url}`}
                alt={artwork.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <Link 
                to={`/artworks/${artwork.id}`}
                style={{ 
                  display: 'inline-block',
                  marginTop: '10px',
                  padding: '8px 16px',
                  background: '#D4AF37',
                  color: '#0F0F0F',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                Voir détails
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtworksPageSimple;