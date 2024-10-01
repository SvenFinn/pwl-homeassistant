FROM ghcr.io/puppeteer/puppeteer:latest AS base

WORKDIR /app

FROM base AS deps

COPY --chown=pptruser:pptruser package*.json ./
RUN npm ci --omit-dev --loglevel=info

FROM base AS build

COPY --chown=pptruser:pptruser . .
RUN npm ci --loglevel=info; \ 
    npm run build;

FROM base AS final

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

CMD ["node", "index.js"]