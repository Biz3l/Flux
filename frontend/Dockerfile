# Dockerfile para o frontend React (Create React App)

# etapa de build
FROM node:18-alpine AS build
WORKDIR /app

# copia arquivos de dependências e instala
COPY package.json package-lock.json* ./
RUN npm install --production

# copia o restante do código e constrói
COPY . ./
RUN npm run build

# etapa de produção
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# expõe porta 3000 (Nginx escutará aqui)
EXPOSE 3000

# start do nginx
CMD ["nginx", "-g", "daemon off;"]
