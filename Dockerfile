FROM ghcr.io/puppeteer/puppeteer:latest as base

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable

FROM base as deps
WORKDIR /usr/src/app

COPY --chown=pptruser:pptruser package*.json ./
RUN npm ci

FROM deps as build

COPY --chown=pptruser:pptruser . .
RUN npm run build

FROM base as final

WORKDIR /app

COPY --from=build /usr/src/app/dist ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json

CMD ["node", "index.js"]