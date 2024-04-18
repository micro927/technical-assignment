FROM node:20-alpine

ARG PORT

# Create app directory
RUN mkdir -p /user/src/app
WORKDIR /user/src/app

COPY package*.json /user/src/app/
COPY . /user/src/app/
COPY .env.production /user/src/app/.env

RUN npm install
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
