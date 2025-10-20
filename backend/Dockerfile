# Imagen base
FROM node:18-alpine

# Carpeta de trabajo principal
WORKDIR /app/backend

# Instalar nodemon globalmente para desarrollo
RUN npm install -g nodemon

# Copiar archivos de dependencias e instalarlas
COPY package*.json ./
RUN npm install

# Copiar el resto del backend
COPY . ./

# Exponer el puerto del servidor
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "dev"]
