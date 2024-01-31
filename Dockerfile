FROM node:current-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV SERVER_PORT=3000
ENV MONGO_DB_CONNECTION=mongodb://host.docker.internal:27017/exercise-tracker
EXPOSE 3000
CMD ["node", "app.js"]