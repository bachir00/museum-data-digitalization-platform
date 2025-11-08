#!/usr/bin/env python3
"""
Script d'initialisation de la base de données du musée avec authentification admin
"""

from database import get_connection, create_tables, create_default_admin

def init_data():
    """Initialise la base de données avec des données d'exemple"""
    print("🏛️  Initialisation de la base de données du musée...")
    
    print("📋 Création des tables...")
    create_tables()
    print("✅ Tables créées avec succès")
    
    print("👤 Création de l'administrateur par défaut...")
    create_default_admin()
    print("✅ Administrateur créé avec succès")
    
    # conn = get_connection()
    # cur = conn.cursor()

    # --- Exemple de salles ---
    rooms = [
        ("Salle des Masques", "Masks Room", "Kër Maske",
        "Salle dédiée aux masques traditionnels africains",
        "Room dedicated to African traditional masks",
        "Kër bu dëgg maske Afrik yi",
        "/static/images/p1.jpg",
        '[{"artwork_id": 1, "x": 0.4, "y": 0.5}, {"artwork_id": 2, "x": 0.7, "y": 0.4}]',
        "Art sacré africain",  # theme
        1,  # has_audio (True)
        1,  # has_interactive (True)
        "facile"
        # ✅ Retiré '05/05/2025' - SQLite utilisera CURRENT_TIMESTAMP automatiquement
        ),
        ("Salle des Masques", "Masks Room", "Kër Maske",
        "Salle dédiée aux masques traditionnels africains",
        "Room dedicated to African traditional masks",
        "Kër bu dëgg maske Afrik yi",
        "/static/images/p1.jpg",
        '[{"artwork_id": 1, "x": 0.4, "y": 0.5}, {"artwork_id": 2, "x": 0.7, "y": 0.4}]',
        "Art sacré africain",  # theme
        1,  # has_audio (True)
        1,  # has_interactive (True)
        "facile"
        # ✅ Retiré '05/05/2025' - SQLite utilisera CURRENT_TIMESTAMP automatiquement
        ),
        ("Salle des Masques", "Masks Room", "Kër Maske",
        "Salle dédiée aux masques traditionnels africains",
        "Room dedicated to African traditional masks",
        "Kër bu dëgg maske Afrik yi",
        "/static/images/p1.jpg",
        '[{"artwork_id": 1, "x": 0.4, "y": 0.5}, {"artwork_id": 2, "x": 0.7, "y": 0.4}]',
        "Art sacré africain",  # theme
        1,  # has_audio (True)
        1,  # has_interactive (True)
        "facile"
        # ✅ Retiré '05/05/2025' - SQLite utilisera CURRENT_TIMESTAMP automatiquement
        ),

       
    ]

    # cur.executemany("""
    # INSERT INTO rooms (
    #     name_fr, name_en, name_wo,
    #     description_fr, description_en, description_wo,
    #     panorama_url, hotspots, theme, has_audio, has_interactive, accessibility_level
    # ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    #     """, rooms)


    # --- Exemple d’œuvres ---
    artworks = [
        (
            1, 
         "/static/qrcodes/artwork_test_id.png", 
         "Masque Baoulé", 
         "Masque rituel de Côte d’Ivoire", 
         "Baoulé ritual mask from Ivory Coast", 
         "Baoulé jëf", 
         "/static/images/a1.jpg", 
         "/static/audios/audio1.mp3", 
         None, #video url         
        "Masque",              # category
        "XXe siècle",          # period
        "Côte d'Ivoire",       # origin
        85,                    # popularity
        245                    # view_count
     ),
        (
            1, 
         "/static/qrcodes/artwork_test_id.png", 
         "Masque Baoulé", 
         "Masque rituel de Côte d’Ivoire", 
         "Baoulé ritual mask from Ivory Coast", 
         "Baoulé jëf", 
         "/static/images/a1.jpg", 
         "/static/audios/audio1.mp3", 
         None, #video url         
        "Masque",              # category
        "XXe siècle",          # period
        "Côte d'Ivoire",       # origin
        85,                    # popularity
        245                    # view_count
     ),
        (
            1, 
         "/static/qrcodes/artwork_test_id.png", 
         "Masque Baoulé", 
         "Masque rituel de Côte d’Ivoire", 
         "Baoulé ritual mask from Ivory Coast", 
         "Baoulé jëf", 
         "/static/images/a1.jpg", 
         "/static/audios/audio1.mp3", 
         None, #video url         
        "Masque",              # category
        "XXe siècle",          # period
        "Côte d'Ivoire",       # origin
        85,                    # popularity
        245                    # view_count
     ),
        (
            1, 
         "/static/qrcodes/artwork_test_id.png", 
         "Masque Baoulé", 
         "Masque rituel de Côte d’Ivoire", 
         "Baoulé ritual mask from Ivory Coast", 
         "Baoulé jëf", 
         "/static/images/a1.jpg", 
         "/static/audios/audio1.mp3", 
         None, #video url         
        "Masque",              # category
        "XXe siècle",          # period
        "Côte d'Ivoire",       # origin
        85,                    # popularity
        245                    # view_count
     ),
        (
            1, 
         "/static/qrcodes/artwork_test_id.png", 
         "Masque Baoulé", 
         "Masque rituel de Côte d’Ivoire", 
         "Baoulé ritual mask from Ivory Coast", 
         "Baoulé jëf", 
         "/static/images/a1.jpg", 
         "/static/audios/audio1.mp3", 
         None, #video url         
        "Masque",              # category
        "XXe siècle",          # period
        "Côte d'Ivoire",       # origin
        85,                    # popularity
        245                    # view_count
     ),
    ]
 
    # cur.executemany("""
    # INSERT INTO artworks 
    # (room_id, qr_code_url, title, description_fr, description_en, description_wo, image_url, audio_url, video_url,
    # category, period, origin, popularity, view_count)
    # VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    # """, artworks)

    # conn.commit()
    # conn.close()
    print("✅ Base de données initialisée avec succès !")

if __name__ == "__main__":
    init_data()
