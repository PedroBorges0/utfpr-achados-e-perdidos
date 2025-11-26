# ---- STAGE 1: Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copia somente package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto (mas não sobrescreve node_modules)
COPY . .

# Build do projeto Next.js
RUN npm run build

# ---- STAGE 2: Runner ----
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copia apenas o necessário para rodar
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npm", "start"]