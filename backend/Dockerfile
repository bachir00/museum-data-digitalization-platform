# --- Image de base Python ---
FROM python:3.10-slim

# --- Définir le répertoire de travail ---
WORKDIR /app

# --- Copier les fichiers ---
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# --- Exposer le port Flask ---
EXPOSE 5000

# --- Commande de lancement ---
CMD ["python", "app.py",  "--host=0.0.0.0"]
