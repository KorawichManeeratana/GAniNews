FROM node:20-alpine

WORKDIR /app

# copy package.json และ install deps
COPY package*.json ./
RUN npm install

# copy code
COPY . .

# generate prisma client
RUN npx prisma generate

# build Next.js production
RUN npm run build

EXPOSE 3000

# run production server
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]