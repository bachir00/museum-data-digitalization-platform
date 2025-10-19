# 🏛️ Interactive Museum Experience Platform

An immersive digital museum platform that brings African cultural heritage to life through interactive exhibits, multilingual support, and QR code integration.

![Museum Platform](https://img.shields.io/badge/Platform-Museum%20Experience-gold)
![Frontend](https://img.shields.io/badge/Frontend-React%2018-blue)
![Backend](https://img.shields.io/badge/Backend-Flask%20Python-green)
![Database](https://img.shields.io/badge/Database-SQLite-orange)
![Mobile](https://img.shields.io/badge/Mobile-Responsive-purple)

## 🌟 Features

### 🎨 **Interactive Exhibition Rooms**
- **360° Panoramic Views** of museum rooms
- **Dynamic Artwork Exploration** with detailed information
- **Horizontal Carousel Navigation** through artworks
- **Immersive Visual Experience** with smooth animations

### 🗣️ **Multilingual Support**
- **French (Français)** - Default language
- **English** - International accessibility
- **Wolof** - Local Senegalese language
- **Dynamic Content Translation** across all interfaces

### 📱 **QR Code Integration**
- **Automatic QR Code Generation** for each artwork
- **Direct Navigation** to artwork details via QR scanning
- **Mobile-First Experience** for on-site visitors
- **Downloadable QR Codes** for print materials

### 🎵 **Rich Media Content**
- **Audio Guides** with multi-language narration
- **High-Quality Images** with zoom capabilities
- **Video Content** for enhanced storytelling
- **Interactive Media Player** with custom controls

### 📊 **Administrative Dashboard**
- **Content Management System** for museum staff
- **Room & Artwork CRUD Operations**
- **File Upload Management** (images, audio, video)
- **Real-time Statistics** and analytics
- **User Authentication** with JWT security

### 📱 **Mobile-Responsive Design**
- **Progressive Web App** functionality
- **Touch-Optimized Navigation**
- **Adaptive Layouts** for all screen sizes
- **Offline-Ready** capabilities

## 🏗️ Architecture

### Frontend (React + Vite)
```
museum-frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── layout/          # Header, Footer, Layout
│   │   └── MuseumMap.jsx    # Interactive museum map
│   ├── contexts/            # React context providers
│   │   ├── AuthContext.jsx  # Authentication management
│   │   └── LanguageContext.jsx # Multi-language support
│   ├── pages/               # Main application pages
│   │   ├── HomePage.jsx     # Landing page
│   │   ├── RoomsPage.jsx    # Exhibition rooms list
│   │   ├── RoomDetailPage.jsx # Individual room view
│   │   ├── ArtworkDetailPage.jsx # Artwork details
│   │   ├── AdminDashboard.jsx # Admin overview
│   │   └── Admin*.jsx       # Admin management pages
│   ├── services/            # API communication
│   └── utils/               # Helper functions
└── public/                  # Static assets
```

### Backend (Flask Python)
```
backend/
├── app.py                   # Main Flask application
├── database.py              # Database models & operations
├── init_db.py               # Database initialization
├── requirements.txt         # Python dependencies
├── static/                  # Media files storage
│   ├── images/             # Artwork images
│   ├── audios/             # Audio guide files
│   ├── videos/             # Video content
│   └── qrcodes/            # Generated QR codes
└── .env                     # Environment configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.8+)
- **Git**

### 1. Clone the Repository
```bash

git clone https://github.com/bachir00/museum-data-digitalization-platform.git
cd museum-data-digitalization-platform
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python init_db.py

# Start the server
python app.py
```

### 3. Frontend Setup
```bash
cd museum-frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your API base URL

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
BASE_URL=http://127.0.0.1:5000
FRONTEND_URL=http://127.0.0.1:3000
FLASK_ENV=development
FLASK_DEBUG=True

# Security
JWT_SECRET_KEY=your-super-secret-key

# Database
DATABASE_PATH=museum.db

# File Storage
STATIC_FOLDER=static
QR_FOLDER=static/qrcodes
IMAGES_FOLDER=static/images
AUDIO_FOLDER=static/audios
VIDEOS_FOLDER=static/videos
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

## 🔐 Authentication

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `museum2024`

> ⚠️ **Security Note**: Change the default password in production!

## 📱 API Documentation

### Public Endpoints
```http
GET /api/rooms                    # List all rooms
GET /api/rooms/{id}               # Get room details
GET /api/rooms/{id}/artworks      # Get room artworks
GET /api/artworks/{id}            # Get artwork details
GET /api/artworks                 # List all artworks
GET /api/search?q={query}         # Search rooms & artworks
```

### Admin Endpoints (Requires Authentication)
```http
POST /api/login                   # Admin authentication
GET /api/admin/stats              # Dashboard statistics
GET /api/admin/rooms              # Manage rooms
POST /api/admin/rooms             # Create room
PUT /api/admin/rooms/{id}         # Update room
DELETE /api/admin/rooms/{id}      # Delete room
GET /api/admin/artworks           # Manage artworks
POST /api/admin/artworks          # Create artwork
PUT /api/admin/artworks/{id}      # Update artwork
DELETE /api/admin/artworks/{id}   # Delete artwork
```

### File Upload Support
- **Images**: JPG, PNG, GIF (max 10MB)
- **Audio**: MP3, WAV (max 50MB)
- **Video**: MP4, WebM (max 100MB)
- **Panoramas**: 360° images for room views

## 🌐 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Manual Deployment

#### Backend (Production)
```bash
# Use a production WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Frontend (Production)
```bash
# Build for production
npm run build

# Serve with a web server (nginx, apache, etc.)
# Or use a static hosting service
```

## 🛠️ Development

### Code Structure
- **Component-based architecture** with React hooks
- **RESTful API design** with Flask
- **Responsive design** with Tailwind CSS
- **Modern animations** with Framer Motion
- **Type safety** with PropTypes
- **Code splitting** for optimal performance

### Development Commands
```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
python app.py        # Start Flask development server
python init_db.py    # Reset database
```

## 🎨 Design System

### Color Palette
- **Museum Gold**: `#D4AF37` - Primary accent color
- **Museum Cream**: `#F4E4BC` - Secondary accent
- **Museum Charcoal**: `#2C2C2C` - Dark backgrounds
- **Museum Beige**: `#E6D7C3` - Light text
- **Museum Black**: `#0F0F0F` - Deep backgrounds

### Typography
- **Headings**: Lora (serif) - Elegant and readable
- **Body Text**: Poppins (sans-serif) - Modern and clean
- **UI Elements**: Inter (sans-serif) - Functional and clear

## 🌟 Key Features in Detail

### QR Code System
Each artwork automatically generates a QR code that:
- Points directly to the artwork's detail page
- Works offline once the page is cached
- Provides instant access for museum visitors
- Can be printed and placed near physical exhibits

### Multilingual Experience
The platform supports seamless language switching:
- Content dynamically updates based on user selection
- Search functionality works across all languages
- Administrative interface supports content in multiple languages
- Future-ready for additional language additions

### Mobile-First Design
Optimized for mobile museum visitors:
- Touch-friendly navigation
- Responsive image galleries
- Adaptive text sizing
- Optimized for various screen sizes
- Progressive Web App capabilities

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation for API changes
- Ensure mobile responsiveness
- Test across different languages



## 🙏 Acknowledgments

- **African Cultural Heritage** inspiration
- **React Community** for excellent documentation
- **Flask Community** for robust web framework
- **Tailwind CSS** for beautiful styling system
- **Framer Motion** for smooth animations
- **Heroicons** for beautiful icons

**Built with ❤️ for preserving and sharing African cultural heritage**
