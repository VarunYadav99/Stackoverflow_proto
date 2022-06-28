FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY index.js ./
COPY ./src ./src/
RUN npm install
ENTRYPOINT [ "node", "index.js" ]