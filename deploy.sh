#!/bin/bash

# Mise à jour du système
echo "Mise à jour des paquets..."
sudo apt update && sudo apt upgrade -y

# Installation des dépendances Docker
echo "Installation de Docker et Docker Compose..."
sudo apt install -y docker.io docker-compose

# Activation de Docker
echo "Activation de Docker..."
sudo systemctl enable docker
sudo systemctl start docker

# Création du fichier .env.production
echo "Création du fichier .env.production..."
cat <<EOL > .env.production
DB_URL=https://babel-test.canard.cc
PUBLIC_DB_URL=https://babel-test.canard.cc
EOL

# Lancement de l'application avec Docker Compose
echo "Lancement de l'application avec Docker Compose..."
sudo docker-compose up -d

echo "Déploiement terminé avec succès !"
