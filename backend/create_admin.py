"""
Créer un utilisateur admin avec mot de passe connu
"""
import sqlite3
from werkzeug.security import generate_password_hash
from datetime import datetime

# Supprimer l'ancien admin et créer un nouveau
def create_admin():
    conn = sqlite3.connect('museum.db')
    cursor = conn.cursor()
    
    # Supprimer l'ancien admin
    cursor.execute("DELETE FROM users WHERE username = 'admin'")
    
    # Créer le nouveau admin avec mot de passe "admin"
    password_hash = generate_password_hash("admin")
    created_at = datetime.now().isoformat()
    
    cursor.execute("""
        INSERT INTO users (username, password_hash, role, created_at)
        VALUES (?, ?, ?, ?)
    """, ("admin", password_hash, "admin", created_at))
    
    conn.commit()
    conn.close()
    
    print("✅ Utilisateur admin créé avec mot de passe 'admin'")

if __name__ == "__main__":
    create_admin()