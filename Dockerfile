FROM alpine:latest

RUN apk --no-cache add nodejs npm

WORKDIR /cofee-app

RUN apk --no-cache add git && git clone https://github.com/Valchy/distributed-systems-and-cloud.git

RUN npm install

EXPOSE 4444

CMD ["node", "index.js"]
