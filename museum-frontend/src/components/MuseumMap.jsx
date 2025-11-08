import React, { useState } from 'react';
import './MuseumMap.css';

const MuseumMap = ({ language }) => {
  const [activeRoom, setActiveRoom] = useState(null);
  
  const translations = {
    title: {
      fr: "Visite des salles",
      en: "Museum Map",
      wo: "Natalu Musée bi"
    },
    clickRoom: {
      fr: "Cliquez sur une salle pour plus d'informations",
      en: "Click on a room for more information",
      wo: "Clikal ci kër bi ngir am xibaar yu gëna bari"
    },
    rooms: {
      room1: {
        fr: "Salle des Masques",
        en: "Masks Room",
        wo: "Kër Maske"
      },
      room2: {
        fr: "Salle des Sculptures",
        en: "Sculpture Room",
        wo: "Kër Loxo"
      },
      room3: {
        fr: "Galerie Principale",
        en: "Main Gallery",
        wo: "Kër bu Mag"
      }
    },
    descriptions: {
      room1: {
        fr: "Salle dédiée aux masques traditionnels africains",
        en: "Room dedicated to African traditional masks",
        wo: "Kër bu dëgg maske Afrik yi"
      },
      room2: {
        fr: "Sculptures en bois et bronze d'Afrique de l'Ouest",
        en: "Wood and bronze sculptures from West Africa",
        wo: "Loxo ak naaj bu nekk Afrik Sowwu ji"
      },
      room3: {
        fr: "Expositions temporaires et œuvres majeures",
        en: "Temporary exhibitions and major artworks",
        wo: "Woneg yu yées ak jëf yu mag"
      }
    }
  };

  return (
    <div className="museum-map-container">
      <h2 className="map-title text-lg md:text-xl lg:text-2xl font-heading font-bold text-museum-gold mb-3 md:mb-4">
        {translations.title[language]}
      </h2>
      <p className="map-instruction text-sm md:text-base text-museum-beige/80 mb-4 md:mb-6">
        {translations.clickRoom[language]}
      </p>
      
      <div className="museum-map">
        <div className="map-room room1" 
             onClick={() => setActiveRoom('room1')}
             data-active={activeRoom === 'room1'}>
          <span>1</span>
        </div>
        <div className="map-room room2" 
             onClick={() => setActiveRoom('room2')}
             data-active={activeRoom === 'room2'}>
          <span>2</span>
        </div>
        <div className="map-room room3" 
             onClick={() => setActiveRoom('room3')}
             data-active={activeRoom === 'room3'}>
          <span>3</span>
        </div>
        <div className="map-corridor horizontal-corridor-1"></div>
        <div className="map-corridor vertical-corridor-1"></div>
        <div className="map-entrance">
          <span>Entrée</span>
        </div>
      </div>
      
      {activeRoom && (
        <div className="room-info">
          <h3 className="text-lg md:text-xl font-heading font-bold text-museum-gold mb-2 md:mb-3">
            {translations.rooms[activeRoom][language]}
          </h3>
          <p className="text-sm md:text-base text-museum-beige/80 mb-3 md:mb-4">
            {translations.descriptions[activeRoom][language]}
          </p>
          <a href={`/rooms/${activeRoom === 'room1' ? '1' : activeRoom === 'room2' ? '2' : '3'}`} 
             className="visit-room-btn inline-block px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-museum-gold text-museum-black rounded-lg hover:bg-museum-lightgold transition-colors duration-300">
            {language === 'fr' ? 'Visiter cette salle' : language === 'en' ? 'Visit this room' : 'Seetal kër bi'}
          </a>
        </div>
      )}
    </div>
  );
};

export default MuseumMap;