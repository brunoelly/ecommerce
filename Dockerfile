FROM node:18-slim

WORKDIR /home/node/customer-crud

COPY package*.json ./

RUN apt-get update && apt-get install -y \
    sqlite3 libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/* \
    && npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]