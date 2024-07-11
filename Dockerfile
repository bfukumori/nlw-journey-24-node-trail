FROM node:alpine

WORKDIR /home/app/api

COPY prisma ./prisma/
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run prisma:generate

CMD ["npm", "run", "dev"]