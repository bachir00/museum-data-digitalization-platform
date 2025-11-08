import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import MuseumMap from '../components/MuseumMap';

const AboutPage = () => {
  const { language, getTranslation } = useLanguage();

  // Contenu traduit
  const content = {
    fr: {
      title: "À propos du Musée",
      subtitle: "Une expérience culturelle unique",
      intro: "Bienvenue au musée d'art et de culture africaine, un espace dédié à la préservation et à la célébration du riche patrimoine artistique du continent africain.",
      history: {
        title: "Notre Histoire",
        content: "Fondé en 2015, notre musée est né de la passion d'un groupe de collectionneurs et d'historiens de l'art déterminés à créer un espace où l'art africain pourrait être apprécié dans toute sa splendeur. Au fil des années, notre collection s'est enrichie grâce à de généreux dons et à des acquisitions minutieusement sélectionnées.",
      },
      mission: {
        title: "Notre Mission",
        content: "Notre mission est de préserver, d'interpréter et de présenter l'art et la culture africaine dans toute leur diversité. Nous nous efforçons de créer un dialogue entre les traditions artistiques africaines et le monde contemporain, en offrant un espace d'apprentissage, de réflexion et d'inspiration.",
      },
      collection: {
        title: "Notre Collection",
        content: "Notre collection comprend des milliers d'œuvres d'art provenant de différentes régions d'Afrique, couvrant des siècles d'histoire et de traditions artistiques. Des masques rituels aux sculptures contemporaines, notre collection témoigne de la richesse et de la diversité de l'expression artistique africaine.",
        highlights: "Points forts de la collection:",
        items: [
          "Masques cérémoniels d'Afrique de l'Ouest",
          "Sculptures en bois traditionnelles",
          "Art contemporain africain",
          "Textiles et vêtements traditionnels",
          "Instruments de musique et objets du quotidien"
        ]
      },
      visit: {
        title: "Planifiez Votre Visite",
        hours: "Heures d'ouverture:",
        schedule: "Du mardi au dimanche: 10h00 - 18h00\nFermé le lundi",
        address: "123 Avenue de l'Art, Dakar, Sénégal",
        contact: "Contact: info@museeafricain.org | +221 33 123 4567"
      },
      team: {
        title: "Notre Équipe",
        director: "Directrice: Dr. Aminata Diop",
        curator: "Conservateur en chef: Dr. Ousmane Mbaye",
        education: "Responsable Éducation: Mme Fatou Sow"
      }
    },
    en: {
      title: "About the Museum",
      subtitle: "A unique cultural experience",
      intro: "Welcome to the Museum of African Art and Culture, a space dedicated to preserving and celebrating the rich artistic heritage of the African continent.",
      history: {
        title: "Our History",
        content: "Founded in 2015, our museum was born from the passion of a group of collectors and art historians determined to create a space where African art could be appreciated in all its splendor. Over the years, our collection has been enriched through generous donations and carefully selected acquisitions.",
      },
      mission: {
        title: "Our Mission",
        content: "Our mission is to preserve, interpret, and present African art and culture in all their diversity. We strive to create a dialogue between African artistic traditions and the contemporary world, offering a space for learning, reflection, and inspiration.",
      },
      collection: {
        title: "Our Collection",
        content: "Our collection includes thousands of artworks from different regions of Africa, covering centuries of history and artistic traditions. From ritual masks to contemporary sculptures, our collection testifies to the richness and diversity of African artistic expression.",
        highlights: "Collection highlights:",
        items: [
          "Ceremonial masks from West Africa",
          "Traditional wooden sculptures",
          "Contemporary African art",
          "Traditional textiles and clothing",
          "Musical instruments and everyday objects"
        ]
      },
      visit: {
        title: "Plan Your Visit",
        hours: "Opening Hours:",
        schedule: "Tuesday to Sunday: 10:00 AM - 6:00 PM\nClosed on Mondays",
        address: "123 Art Avenue, Dakar, Senegal",
        contact: "Contact: info@africanmuseum.org | +221 33 123 4567"
      },
      team: {
        title: "Our Team",
        director: "Director: Dr. Aminata Diop",
        curator: "Chief Curator: Dr. Ousmane Mbaye",
        education: "Education Manager: Mrs. Fatou Sow"
      }
    },
    wo: {
      title: "Ci Mbiru Musée bi",
      subtitle: "Beneen xalaat bu xees ci sunu cosaan",
      intro: "Dalal jamm ci Musée bu Cosaan ak Aada yu Afrik, benn béréb bu ñuy sàmm te di wuyusi cosaan ak aada yu rafet yu gox Afrik gi.",
      history: {
        title: "Sunu Jaar-jaar",
        content: "Bi nu tàmbali ci at mi 2015, sunu musée jóge na ci xalaat ak nameel ñu mbootaay yu dajee nit ñu xam-xam ci wàllu Cosaan, ngir defar ab béréb fu ñuy mëna wonee cosaan Afrik ci lépp lu mu am. Ci at yi di weesu, sunu denc gëna yokku ci loxo yu baaxe ak lu nu fay.",
      },
      mission: {
        title: "Sunu Yónnent",
        content: "Sunu yónnent mooy sàmm, tekki, ak wone cosaan ak aada yu Afrik ci seen lépp lu boole. Danuy jéema am diisoo ci diggante cosaan aada yi Afrik ak jamono sunu tey, di jox béréb bu ñuy jàngee, xalaat, ak am kàttan.",
      },
      collection: {
        title: "Sunu Denc",
        content: "Sunu denc am na ay junniy jëf yu jóge ci béréb yu bari ci Afrik, di wone ay jamono yu bari ak aada yu xarañ. Li dale ci maske yi ñuy jaamoo ba ci jëf yu tey yi, sunu denc di seedee li cosaan ak aada Afrik am.",
        highlights: "Li gënë xarañ ci denc bi:",
        items: [
          "Maske yu Afrik Sowwu yi",
          "Natal yu garab cosaan yi",
          "Jëf yi tey yi",
          "Malaan ak yére cosaan yi",
          "Jumtukaay yi ngir xalam ak jumtukaay yi ñuy jëfandikoo bes bu nekk"
        ]
      },
      visit: {
        title: "Tëral sa Gan",
        hours: "Waxtu yi nu ubbi:",
        schedule: "Li jóge Talaata ba Dibéer: 10:00 - 18:00\nUbbiñu Altine",
        address: "123 Mbedd Cosaan, Dakar, Senegal",
        contact: "Jokkoo: info@museeafricain.org | +221 33 123 4567"
      },
      team: {
        title: "Sunu Ekip",
        director: "Njiit: Dr. Aminata Diop",
        curator: "Kiy toppatoo Cosaan yi: Dr. Ousmane Mbaye",
        education: "Kiy toppatoo Njàng mi: Sokhna Fatou Sow"
      }
    }
  };

  // Récupération du contenu selon la langue
  const t = content[language];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-museum-gradient"
    >
      {/* Hero section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[50vh] md:h-[70vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background avec effet parallax */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-museum-dark/80 to-black"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-museum-gold/10 to-museum-ochre/10"></div>
        </div>
        
        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-museum-gold/30 rounded-full"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
            />
          ))}
        </div>

        {/* Contenu hero */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-3 md:px-4">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl lg:text-7xl font-serif text-museum-gold mb-4 md:mb-6"
          >
            {t.title}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl lg:text-2xl text-museum-beige font-light"
          >
            {t.subtitle}
          </motion.p>
        </div>
      </motion.section>

      <div className="container mx-auto px-3 md:px-4 py-12 md:py-16">
        {/* Introduction */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12 md:mb-20"
        >
          <p className="text-lg md:text-xl text-museum-beige/90 leading-relaxed max-w-3xl mx-auto">
            {t.intro}
          </p>
        </motion.section>

        {/* Histoire et Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20">
          <motion.section 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-museum"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-serif text-museum-gold mb-4 md:mb-6 flex items-center">
                <svg className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t.history.title}
              </h2>
              <p className="text-sm md:text-base text-museum-beige/80 leading-relaxed">
                {t.history.content}
              </p>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-museum"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-serif text-museum-gold mb-4 md:mb-6 flex items-center">
                <svg className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t.mission.title}
              </h2>
              <p className="text-sm md:text-base text-museum-beige/80 leading-relaxed">
                {t.mission.content}
              </p>
            </div>
          </motion.section>
        </div>

        {/* Collection */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <div className="card-museum h-full">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-serif text-museum-gold mb-4 md:mb-6 flex items-center">
                    <svg className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {t.collection.title}
                  </h2>
                  <p className="text-sm md:text-base text-museum-beige/80 leading-relaxed mb-4 md:mb-6">
                    {t.collection.content}
                  </p>
                  <p className="text-museum-gold font-semibold mb-3 md:mb-4 text-sm md:text-base">
                    {t.collection.highlights}
                  </p>
                  <ul className="space-y-2">
                    {t.collection.items.map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-sm md:text-base text-museum-beige/80"
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-museum-gold mr-2 md:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Galerie d'images */}
            <div className="grid grid-cols-2 gap-4">
              {['art1.jpg', 'art2.jpg', 'art3.jpg', 'art4.jpg'].map((img, index) => (
                <motion.div
                  key={img}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-lg aspect-square group cursor-pointer"
                >
                  <img 
                    src={`${import.meta.env.VITE_API_BASE_URL}/static/images/${img}`}
                    alt={`Collection ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Plan du musée */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="card-museum">
            <div className="p-8">
              <h2 className="text-3xl font-serif text-museum-gold mb-6 text-center">
                {getTranslation('museumMap', 'Visitez le Musée')}
              </h2>
              <MuseumMap language={language} />
            </div>
          </div>
        </motion.section>

        {/* Informations pratiques et équipe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <motion.section 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-museum"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-serif text-museum-gold mb-4 md:mb-6 flex items-center">
                <svg className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t.visit.title}
              </h2>
              
              <div className="space-y-3 md:space-y-4">
                <div>
                  <p className="font-semibold text-museum-gold mb-1 md:mb-2 text-sm md:text-base">{t.visit.hours}</p>
                  <p className="text-sm md:text-base text-museum-beige/80 whitespace-pre-line">{t.visit.schedule}</p>
                </div>
                
                <div className="pt-3 md:pt-4 border-t border-museum-gold/20">
                  <p className="text-sm md:text-base text-museum-beige/80 flex items-start">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-museum-gold mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t.visit.address}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm md:text-base text-museum-beige/80 flex items-start">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-museum-gold mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {t.visit.contact}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-museum"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-serif text-museum-gold mb-4 md:mb-6 flex items-center">
                <svg className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t.team.title}
              </h2>
              
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center p-3 md:p-4 bg-black/20 rounded-lg">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-museum-gold/20 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-museum-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm md:text-base text-museum-beige/80">{t.team.director}</p>
                </div>
                
                <div className="flex items-center p-3 md:p-4 bg-black/20 rounded-lg">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-museum-gold/20 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-museum-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm md:text-base text-museum-beige/80">{t.team.curator}</p>
                </div>
                
                <div className="flex items-center p-3 md:p-4 bg-black/20 rounded-lg">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-museum-gold/20 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-museum-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm md:text-base text-museum-beige/80">{t.team.education}</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage;