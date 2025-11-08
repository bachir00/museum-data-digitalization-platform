import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ArtworksPage from './pages/ArtworksPage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import AboutPage from './pages/AboutPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import SearchPage from './pages/SearchPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoomsPage from './pages/AdminRoomsPage';
import AdminArtworksPage from './pages/AdminArtworksPage';
import ScrollToTop from './utils/ScrollToTop';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="artworks" element={<ArtworksPage />} />
              <Route path="artworks/:id" element={<ArtworkDetailPage />} />
              <Route path="rooms" element={<RoomsPage />} />
              <Route path="rooms/:id" element={<RoomDetailPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="about" element={<AboutPage />} />
            </Route>

            {/* Route de connexion admin */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Routes admin protégées */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="rooms" element={<AdminRoomsPage />} />
              <Route path="artworks" element={<AdminArtworksPage />} />
              <Route index element={<AdminDashboard />} />
            </Route>

            {/* Page non trouvée */}
            <Route path="*" element={<div className="not-found">Page non trouvée</div>} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
