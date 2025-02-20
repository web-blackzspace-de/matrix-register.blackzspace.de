# Node.js Basis-Image verwenden
FROM node:20-alpine

# Arbeitsverzeichnis im Container erstellen
WORKDIR /app

# package.json und package-lock.json kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# App-Code kopieren
COPY . .

# Port freigeben
EXPOSE 3000

# Startbefehl
CMD ["node", "server.js"]
