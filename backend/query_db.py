import sqlite3
from prettytable import PrettyTable  # pour un affichage clair et aligné

# Connexion à la base SQLite
conn = sqlite3.connect("museum.db")

# Pour afficher les résultats sous forme de dictionnaire
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# ✅ Exemple : afficher les 2 premières salles
# cursor.execute("DELETE  FROM artworks  where id in (8, 7, 6, 5, 4, 3, 2, 1);")
cursor.execute("SELECT * from users;")
rows = cursor.fetchall()

print("🏛️  Aperçu des utilisateurs (users) :\n")

if not rows:
    print("⚠️  Aucun utilisateur trouvé dans la base.")
else:
    # Créer un tableau lisible
    table = PrettyTable()
    table.field_names = rows[0].keys()  # noms des colonnes

    for row in rows:
        table.add_row([row[k] for k in row.keys()])

    print(table)

# Fermeture de la connexion
conn.close()
