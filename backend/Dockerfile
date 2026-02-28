# backend/Dockerfile
FROM node:20

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código (incluindo prisma/)
COPY . .

# Copiar e dar permissão ao entrypoint
RUN chmod +x ./entrypoint.sh

# Expõe a porta que o app vai rodar
EXPOSE 3001

# Executar entrypoint que faz migrações e depois inicia a app
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "src/app.js"]