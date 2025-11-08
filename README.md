# Museum Data Digitalization Platform

A comprehensive digital museum platform that enables visitors to explore museum collections through interactive maps, QR codes, multilingual content, and multimedia experiences. Built with modern web technologies and Domain-Driven Design architecture.

## 🌟 Features

### 🏛️ Museum Management
- **Interactive Museum Map**: Navigate through different rooms with visual layouts
- **Room Management**: Create, update, and manage museum rooms with panoramic views
- **Artwork Collection**: Comprehensive artwork database with multimedia support
- **QR Code Integration**: Automatic QR code generation for rooms and artworks

### 🌍 Multilingual Support
- **Three Languages**: French (fr), English (en), and Wolof (wo)
- **Dynamic Language Switching**: Real-time language changes without page reload
- **Complete Translations**: All content available in all supported languages

### 🎨 Multimedia Experience
- **Image Galleries**: High-quality artwork images with zoom capabilities
- **Audio Guides**: Embedded audio descriptions for artworks
- **Video Content**: Video presentations and documentaries
- **Panoramic Views**: 360° room views for immersive experience

### 👨‍💼 Admin Dashboard
- **Content Management**: Create, edit, and delete rooms and artworks
- **File Upload System**: Support for images, audio, and video files
- **Statistics Dashboard**: View popularity and engagement metrics
- **User Management**: Admin authentication and authorization

### 📱 Visitor Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Search Functionality**: Find artworks by title, category, or origin
- **Favorites System**: Save and track favorite artworks
- **Accessibility**: Multiple accessibility levels for different user needs

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Architecture**: Domain-Driven Design (DDD)
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local file system with organized structure
- **API**: RESTful API with CORS support

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Heroicons
- **Animation**: Framer Motion
- **QR Codes**: qrcode.react
- **360° Views**: react-pannellum
- **HTTP Client**: Axios

### Development & Deployment
- **Containerization**: Docker & Docker Compose
- **Environment Management**: dotenv
- **CORS**: Flask-CORS
- **Development Server**: Vite dev server

## 📁 Project Structure

```
museum-data-digitalization-platform/
├── .git/                           # Git repository
├── .gitignore                      # Git ignore rules
├── .specstory/                     # Project specifications
├── docker-compose.yml              # Docker services configuration
├── mcn_hackathon-1.pdf            # Project documentation
├── video1.mp4                      # Demo video
├── README.md                       # This file
│
├── backend/                        # Flask API server
│   ├── .env                       # Environment variables
│   ├── .env.example               # Environment template
│   ├── .gitignore                 # Backend-specific ignores
│   ├── app.py                     # Flask application factory
│   ├── database.py                # Database connection and utilities
│   ├── init_db.py                 # Database schema setup
│   ├── museum.db                  # SQLite database file
│   ├── requirements.txt           # Python dependencies
│   ├── Dockerfile                 # Docker configuration
│   ├── create_admin.py            # Admin user creation script
│   ├── debug_login.py             # Debug utilities
│   ├── query_db.py               # Database query utilities
│   ├── start_app.py              # Application startup script
│   ├── __pycache__/              # Python cache files
│   │
│   ├── src/                      # Source code (DDD Architecture)
│   │   ├── __init__.py
│   │   ├── domain/               # Domain entities and business logic
│   │   ├── application/          # Application services and DTOs
│   │   ├── infrastructure/       # Data access and external services
│   │   └── interfaces/           # Controllers and API endpoints
│   │
│   └── static/                   # Static file storage
│       ├── images/               # Artwork and room images
│       ├── audios/               # Audio guide files
│       ├── videos/               # Video content
│       └── qrcodes/              # Generated QR codes
│
└── museum-frontend/               # React frontend application
    ├── .env                      # Frontend environment variables
    ├── .env.example              # Frontend environment template
    ├── .gitignore                # Frontend-specific ignores
    ├── package.json              # Node.js dependencies and scripts
    ├── package-lock.json         # Dependency lock file
    ├── vite.config.js            # Vite configuration
    ├── tailwind.config.cjs       # Tailwind CSS configuration
    ├── postcss.config.js         # PostCSS configuration
    ├── eslint.config.js          # ESLint configuration
    ├── index.html                # HTML entry point
    ├── Dockerfile                # Docker configuration
    ├── nginx.conf                # Nginx configuration for production
    ├── dist/                     # Build output directory
    ├── node_modules/             # Node.js dependencies
    │
    ├── public/                   # Static assets
    │   └── vite.svg              # Vite logo
    │
    └── src/                      # Source code
        ├── App.jsx               # Main application component
        ├── App.css               # Global application styles
        ├── main.jsx              # Application entry point
        ├── index.css             # Global CSS styles
        │
        ├── assets/               # Static assets used in components
        │   └── react.svg         # React logo
        │
        ├── components/           # Reusable UI components
        │   ├── MuseumMap.jsx     # Interactive museum map
        │   ├── MuseumMap.css     # Map component styles
        │   └── layout/           # Layout components
        │
        ├── contexts/             # React contexts
        │   ├── AuthContext.jsx   # Authentication context
        │   └── LanguageContext.jsx # Language switching context
        │
        ├── pages/                # Application pages
        │   ├── HomePage.jsx      # Landing page
        │   ├── HomePage.css      # Home page styles
        │   ├── AboutPage.jsx     # About page
        │   ├── AboutPage.css     # About page styles
        │   ├── AboutPage.animations.css # About page animations
        │   ├── RoomsPage.jsx     # Rooms listing page
        │   ├── RoomsPage.css     # Rooms page styles
        │   ├── RoomDetailPage.jsx # Individual room details
        │   ├── RoomDetailPage.css # Room detail styles
        │   ├── RoomDetailPage.animations.css # Room detail animations
        │   ├── RoomDetailPage.extra.css # Extra room detail styles
        │   ├── ArtworksPage.jsx  # Artworks listing page
        │   ├── ArtworksPage.css  # Artworks page styles
        │   ├── ArtworksPageSimple.jsx # Simplified artworks view
        │   ├── ArtworkDetailPage.jsx # Individual artwork details
        │   ├── ArtworkDetailPage.css # Artwork detail styles
        │   └── SearchPage.jsx    # Search functionality
        │
        ├── services/             # API services
        │   └── api.js            # API client and endpoints
        │
        └── utils/                # Utility functions
            └── ScrollToTop.jsx   # Scroll management utility
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Docker (optional)

### Option 1: Local Development

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Start Flask server
python app.py
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd museum-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Option 2: Docker Deployment

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_PATH=museum.db

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production

# URLs
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# File Upload Settings
MAX_CONTENT_LENGTH=16777216  # 16MB
UPLOAD_EXTENSIONS=.jpg,.jpeg,.png,.gif,.mp3,.wav,.mp4,.mov
```

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Default Admin Account

The system creates a default admin account on first run:
- **Username**: `admin`
- **Password**: `museum2024`

⚠️ **Important**: Change this password in production!

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Public Endpoints
- `GET /api/rooms` - Get all museum rooms
- `GET /api/rooms/{id}` - Get specific room details
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/{id}` - Get specific artwork details

### Admin Endpoints (JWT Required)
- `GET /api/admin/rooms` - Get all rooms (admin view)
- `POST /api/admin/rooms` - Create new room
- `PUT /api/admin/rooms/{id}` - Update room
- `DELETE /api/admin/rooms/{id}` - Delete room
- `GET /api/admin/artworks` - Get all artworks (admin view)
- `POST /api/admin/artworks` - Create new artwork
- `PUT /api/admin/artworks/{id}` - Update artwork
- `DELETE /api/admin/artworks/{id}` - Delete artwork

### File Upload Support
All create/update endpoints support multipart/form-data for file uploads:
- Images: JPG, JPEG, PNG, GIF
- Audio: MP3, WAV
- Video: MP4, MOV

## 🎨 Features in Detail

### Room Management
- **Panoramic Views**: Upload 360° photos for immersive room exploration
- **Multilingual Descriptions**: Content in French, English, and Wolof
- **Accessibility Levels**: Beginner, Intermediate, Advanced
- **Interactive Features**: Audio guides and interactive elements
- **Theme Categories**: Ethnology, Textile Art, etc.

### Artwork Management
- **Rich Metadata**: Title, descriptions, category, period, origin
- **Multimedia Support**: Images, audio guides, video content
- **Popularity Tracking**: View counts and engagement metrics
- **QR Code Generation**: Automatic QR codes for mobile access
- **Room Association**: Link artworks to specific museum rooms

### User Experience
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Smooth Animations**: Framer Motion for engaging transitions
- **Intuitive Navigation**: Clear menu structure and breadcrumbs
- **Search & Filter**: Find content by various criteria
- **Language Persistence**: Remember user language preference

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin vs regular user permissions
- **CORS Configuration**: Secure cross-origin resource sharing
- **File Upload Validation**: Type and size restrictions
- **SQL Injection Protection**: Parameterized queries
- **Password Hashing**: Werkzeug secure password hashing

## 🌐 Deployment

### Production Considerations

1. **Environment Variables**: Set secure values for production
2. **Database**: Consider PostgreSQL for production
3. **File Storage**: Use cloud storage (AWS S3, etc.) for scalability
4. **HTTPS**: Enable SSL/TLS encryption
5. **Reverse Proxy**: Use Nginx for static file serving
6. **Monitoring**: Add logging and monitoring tools

### Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

### Code Style
- **Python**: Follow PEP 8 standards
- **JavaScript**: Use ESLint configuration
- **React**: Functional components with hooks
- **CSS**: Tailwind utility-first approach

### Architecture Principles
- **Domain-Driven Design**: Clear separation of concerns
- **Repository Pattern**: Abstract data access
- **Service Layer**: Business logic encapsulation
- **SOLID Principles**: Maintainable and extensible code

## 📊 Database Schema

### Users Table
- id, username, password_hash, role, created_at

### Rooms Table
- id, name_fr, name_en, name_wo, description_fr, description_en, description_wo
- theme, accessibility_level, has_audio, has_interactive
- panorama_url, qr_code_url, created_at

### Artworks Table
- id, room_id, title, description_fr, description_en, description_wo
- category, period, origin, popularity, view_count
- image_url, audio_url, video_url, qr_code_url, created_at

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Reinitialize database
   python init_db.py
   ```

2. **File Upload Errors**
   - Check file size limits
   - Verify file extensions
   - Ensure proper directory permissions

3. **CORS Issues**
   - Verify FRONTEND_URL in backend .env
   - Check API_BASE_URL in frontend .env

4. **Authentication Problems**
   - Clear browser localStorage
   - Check JWT_SECRET_KEY consistency
   - Verify token expiration settings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for museum digitalization and cultural preservation
- Inspired by modern web development best practices
- Designed with accessibility and multilingual support in mind
- Created with ❤️ for cultural heritage preservation

## 📞 Support

For support, questions, or contributions, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**Made with ❤️ for cultural heritage digitalization**