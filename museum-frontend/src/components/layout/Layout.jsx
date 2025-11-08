import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <Fragment>
      <div className="min-h-screen bg-museum-gradient text-museum-cream">
        <Header />
        
        {/* Main Content avec padding pour le header fixe */}
        <AnimatePresence mode="wait">
          <motion.main 
            className="pt-24 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        
        <Footer />
      </div>
      
      {/* Particules d'ambiance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-museum-gold/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-museum-gold/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-museum-gold/15 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-60 right-10 w-1 h-1 bg-museum-gold/25 rounded-full animate-pulse delay-1500"></div>
      </div>
    </Fragment>
  );
};

export default Layout;