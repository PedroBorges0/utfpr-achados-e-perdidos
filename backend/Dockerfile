# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Etapa de runtime
FROM node:20-alpine

WORKDIR /app

# Copia node_modules e arquivos da aplicação
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

EXPOSE 4000
CMD ["node", "server.js"]