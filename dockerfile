FROM node:18.8.0
WORKDIR /src
COPY . .
RUN npm install
EXPOSE 8000
CMD npm start
