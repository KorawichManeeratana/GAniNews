FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

ENV NODE_OPTIONS=--dns-result-order=ipv4first

EXPOSE 3000
CMD ["npm", "run", "dev"]
