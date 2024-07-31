FROM node:20 as builder
WORKDIR /usr/api

COPY package.json ./
COPY package-lock.json ./
COPY src ./src

RUN npm install
RUN npm run build

FROM node:21-alpine
WORKDIR /usr/api

COPY --from=builder /usr/api/dist ./dist
COPY .env ./
COPY prisma ./prisma
COPY package.json ./

RUN npm install --production
ENV NODE_ENV=production

EXPOSE 5000

CMD [ "node", "./dist/server.js" ]
