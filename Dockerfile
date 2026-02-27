# Estágio 1: Build
FROM node:20-alpine AS build
# Instalamos dependências necessárias para o Prisma e Sharp (se usares)
RUN apk add --no-cache openssl openssl-dev libc6-compat
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Estágio 2: Produção (Imagem Final Leve)
FROM node:20-alpine
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app
ENV NODE_ENV=production

# Copiamos apenas o essencial do build
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

EXPOSE 3002

# Comando de arranque resiliente
CMD ["sh", "-c", "npx prisma generate && node dist/main.js || node dist/src/main.js"]