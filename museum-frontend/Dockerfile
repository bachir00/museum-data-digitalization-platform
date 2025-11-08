# Étape 1 : Build de l'app React
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
# RUN npm install
COPY . .
# RUN npm install 
RUN npm install --legacy-peer-deps

RUN npm run build
# Étape 2 : Serveur Nginx pour les fichiers statiques
FROM nginx:alpine

# Supprimer la config par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier ta config nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d

# Copier les fichiers build de React dans le dossier servi par Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
