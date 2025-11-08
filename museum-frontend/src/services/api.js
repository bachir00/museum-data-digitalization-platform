import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

// Configuration de base d'axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchRooms = async (lang = 'fr') => {
  try {
    const response = await api.get('/rooms');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des salles:', error);
    throw error;
  }
};

export const fetchRoom = async (roomId, lang = 'fr') => {
  try {
    const response = await api.get(`/rooms/${roomId}?lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la salle ${roomId}:`, error);
    throw error;
  }
};

export const fetchArtworksByRoom = async (roomId) => {
  try {
    const response = await api.get(`/rooms/${roomId}/artworks`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des œuvres de la salle ${roomId}:`, error);
    throw error;
  }
};

export const fetchArtwork = async (artworkId, lang = 'fr') => {
  try {
    const response = await api.get(`/artworks/${artworkId}?lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'œuvre ${artworkId}:`, error);
    throw error;
  }
};

// Fonction de recherche
export const searchContent = async (query, lang = 'fr') => {
  try {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}&lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    throw error;
  }
};

// Méthode pour récupérer toutes les œuvres du musée
export const fetchAllArtworks = async (lang = 'fr') => {
  try {
    const response = await api.get(`/artworks?lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les œuvres:', error);
    throw error;
  }
};