


import sqlite3

DB_NAME = "museum.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def create_default_admin():
    """Crée un administrateur par défaut si aucun utilisateur n'existe"""
    from werkzeug.security import generate_password_hash
    
    conn = get_connection()
    cur = conn.cursor()
    
    # Vérifier s'il y a déjà des utilisateurs
    existing_users = cur.execute("SELECT COUNT(*) as count FROM users").fetchone()
    
    if existing_users['count'] == 0:
        # Créer un admin par défaut
        default_username = "admin"
        default_password = "museum2024"  # À changer en production !
        password_hash = generate_password_hash(default_password)
        
        cur.execute("""
            INSERT INTO users (username, password_hash, role)
            VALUES (?, ?, ?)
        """, (default_username, password_hash, "admin"))
        
        conn.commit()
        print(f"✅ Administrateur par défaut créé : {default_username} / {default_password}")
    
    conn.close()

def create_tables():
    conn = get_connection()
    cur = conn.cursor()

    # Table des salles
    cur.execute("""
    CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_fr TEXT,
        name_en TEXT,
        name_wo TEXT,
        description_fr TEXT,
        description_en TEXT,
        description_wo TEXT,
        panorama_url TEXT,
        hotspots TEXT,
        theme TEXT, -- "Histoire des civilisations", "Art sacré africain"
        has_audio BOOLEAN DEFAULT 0, -- 1 si audio guide disponible
        has_interactive BOOLEAN DEFAULT 0, -- 1 si panorama interactif
        accessibility_level TEXT, -- "facile", "modéré", "avancé"
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Pour "nouvelles"
    )
    """)

    # Table des œuvres
    cur.execute("""
    CREATE TABLE IF NOT EXISTS artworks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER,
        qr_code_url TEXT,
        title TEXT,
        description_fr TEXT,
        description_en TEXT,
        description_wo TEXT,
        image_url TEXT,
        audio_url TEXT,
        video_url TEXT,
        category TEXT, -- "Masque", "Sculpture", "Peinture", etc.
        period TEXT, -- "XXe siècle", "Moyen Âge", etc.
        origin TEXT, -- "Côte d’Ivoire", "Mali", etc.
        popularity INTEGER DEFAULT 0, -- Pour les œuvres populaires
        view_count INTEGER DEFAULT 0, -- Nombre de vues pour statistiques
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Pour "nouvelles"
        FOREIGN KEY (room_id) REFERENCES rooms(id)              
    )
    """)

    # Table des utilisateurs (admins)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()

# Fonctions utilitaires pour l'authentification
def get_user_by_username(username):
    """Récupère un utilisateur par son nom d'utilisateur"""
    conn = get_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()
    return user

def create_user(username, password_hash, role="admin"):
    """Crée un nouvel utilisateur"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO users (username, password_hash, role)
            VALUES (?, ?, ?)
        """, (username, password_hash, role))
        conn.commit()
        user_id = cur.lastrowid
        conn.close()
        return user_id
    except sqlite3.IntegrityError:
        conn.close()
        return None  # Nom d'utilisateur déjà existant

def get_user_by_id(user_id):
    """Récupère un utilisateur par son ID"""
    conn = get_connection()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return user
