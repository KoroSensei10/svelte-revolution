#!/bin/bash

# Mise à jour du système
echo "Mise à jour des paquets..."
sudo apt update && sudo apt upgrade -y

# Installation des dépendances Docker et Nginx
echo "Installation de Docker, Docker Compose et Nginx..."
sudo apt install -y docker.io docker-compose nginx

# Activation de Docker et Nginx
echo "Activation de Docker et Nginx..."
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl enable nginx
sudo systemctl start nginx

# # Création du fichier .env.production
# echo "Création du fichier .env.production..."
# cat <<EOL > .env.production
# DB_URL=https://db.canard.cc
# PUBLIC_DB_URL=https://db.canard.cc
# EOL

# Configuration de Nginx
echo "Configuration de Nginx..."
sudo tee /etc/nginx/sites-available/docker.canard.cc > /dev/null <<EOL
server {
    listen 80;
    server_name docker.canard.cc;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL

sudo ln -s /etc/nginx/sites-available/docker.canard.cc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Installation de Certbot pour SSL
echo "Installation de Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Obtention et installation du certificat SSL
echo "Obtention et installation du certificat SSL..."
sudo certbot --nginx -d docker.canard.cc --non-interactive --agree-tos -m mathisjung02@gmail.com

# Lancement de l'application avec Docker Compose
echo "Lancement de l'application avec Docker Compose..."
sudo docker-compose up -d --build

sudo systemctl reload nginx

echo "Déploiement terminé avec succès !"
