import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { language } = useLanguage();

  const getContent = () => {
    switch (language) {
      case 'en':
        return {
          title: 'Virtual Museum',
          description: 'Explore our collection of African art and culture in virtual immersion.',
          quickLinks: 'Quick Links',
          home: 'Home',
          rooms: 'Exhibition Rooms',
          artworks: 'Artworks',
          about: 'About',
          contact: 'Contact',
          followUs: 'Follow Us',
          rights: 'All rights reserved.',
        };
      case 'wo':
        return {
          title: 'Musée Virtuel',
          description: 'Gëstu nu ñu gëm collection bu jëf ak kultur Afrik ci immersion virtuelle.',
          quickLinks: 'Lëpp gu gaw',
          home: 'Dalal',
          rooms: 'Këri yu exposition',
          artworks: 'Jëf yi',
          about: 'Mbiru',
          contact: 'Jokkoo',
          followUs: 'Tëral nu',
          rights: 'Yëpp droit yi daal na.',
        };
      default:
        return {
          title: 'Musée Virtuel',
          description: 'Explorez notre collection d\'art et de culture africaine en immersion virtuelle.',
          quickLinks: 'Liens rapides',
          home: 'Accueil',
          rooms: 'Salles d\'exposition',
          artworks: 'Œuvres d\'art',
          about: 'À propos',
          contact: 'Contact',
          followUs: 'Suivez-nous',
          rights: 'Tous droits réservés.',
        };
    }
  };

  const content = getContent();

  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      href: '#'
    },
    {
      name: 'Twitter',
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      href: '#'
    },
    {
      name: 'Instagram',
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.435-3.396-1.153-.535-.405-.535-1.224 0-1.629.948-.718 2.099-1.153 3.396-1.153s2.448.435 3.396 1.153c.535.405.535 1.224 0 1.629-.948.718-2.099 1.153-3.396 1.153zm7.085 0c-1.297 0-2.448-.435-3.396-1.153-.535-.405-.535-1.224 0-1.629.948-.718 2.099-1.153 3.396-1.153s2.448.435 3.396 1.153c.535.405.535 1.224 0 1.629-.948.718-2.099 1.153-3.396 1.153z"/>
        </svg>
      ),
      href: '#'
    },
    {
      name: 'YouTube',
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      href: '#'
    }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-museum-black border-t border-museum-gold/20 mt-20"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gold-gradient rounded-lg flex items-center justify-center shadow-gold">
                <svg 
                  width="24" 
                  height="24" 
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
              <h3 className="text-xl font-heading font-bold text-gradient">
                {content.title}
              </h3>
            </div>
            <p className="text-museum-beige/80 leading-relaxed">
              {content.description}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-heading font-semibold text-museum-gold">
              {content.quickLinks}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-museum-beige/80 hover:text-museum-gold transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-museum-gold transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                  {content.home}
                </Link>
              </li>
              <li>
                <Link 
                  to="/rooms" 
                  className="text-museum-beige/80 hover:text-museum-gold transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-museum-gold transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                  {content.rooms}
                </Link>
              </li>
              <li>
                <Link 
                  to="/artworks" 
                  className="text-museum-beige/80 hover:text-museum-gold transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-museum-gold transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                  {content.artworks}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-museum-beige/80 hover:text-museum-gold transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-museum-gold transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                  {content.about}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-heading font-semibold text-museum-gold">
              {content.contact}
            </h4>
            <div className="space-y-2 text-museum-beige/80">
              <p className="flex items-center space-x-2">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>123 Rue du Musée, Dakar, Sénégal</span>
              </p>
              <p className="flex items-center space-x-2">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>info@mcn.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>+221 XX XXX XX XX</span>
              </p>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-heading font-semibold text-museum-gold">
              {content.followUs}
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-museum-charcoal border border-museum-gold/20 rounded-lg flex items-center justify-center text-museum-beige hover:text-museum-gold hover:border-museum-gold/50 hover:bg-museum-gold/10 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-museum-gold/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-museum-beige/60 text-sm">
            &copy; {new Date().getFullYear()} {content.title}. {content.rights}
          </p>
          <div className="flex items-center space-x-1 text-museum-beige/60 text-sm">
            <span>Made with</span>
            <motion.svg 
              width="16" 
              height="16" 
              fill="#D4AF37" 
              viewBox="0 0 24 24"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </motion.svg>
            <span>for African Culture</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;