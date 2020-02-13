FROM keymetrics/pm2:8-stretch

USER root

WORKDIR /app

COPY . .

ENV API_BASE_PATH=/api
ENV API_URL=localhost:3001
ENV PROJECT=CHAT
ENV SWAGGER_URL_STATS=http://localhost:8986/swagger-stats/ui
ENV SWAGGER_ROUTE=/api-docs
ENV PORT=3001
ENV MDB_NAME=chat
ENV MDB_HOST=mongo
ENV MDB_PORT=27017
ENV JWT_PRIVATE_KEY=web-ch4t-s3rv3r
ENV JWT_EXPIRES_IN=3600
ENV CHANNEL_NAME_GENERAL=general
ENV NODE_ENV=production
ENV DEBUG=CHAT:*

RUN apt-get update && \ 
    apt-get install python3 -y && \
    npm install && \
    npm install -g @babel/cli && \
    npm run build

EXPOSE 3001

CMD [ "npm", "run", "start" ]