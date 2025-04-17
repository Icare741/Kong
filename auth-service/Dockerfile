FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Attendre que la base de données soit prête
RUN apk add --no-cache postgresql-client
COPY wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

CMD ["/wait-for-postgres.sh", "auth-db", "5432", "node", "index.js"] 