FROM node:18-alpine

WORKDIR /app

# Instalar nodemon globalmente para desarrollo
RUN npm install -g nodemon

# Crear directorios
RUN mkdir -p /app/backend /app/frontend

# Copiar package files del backend
COPY package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copiar código fuente del backend
COPY . .

# El frontend se montará como volumen

EXPOSE 3000

# Usar nodemon para hot reload en desarrollo
CMD ["npm", "run", "dev"]