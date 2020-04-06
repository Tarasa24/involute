FROM node

COPY package.json package.json
RUN npm install
RUN npm i -g history-server

COPY . .
RUN npm run build
RUN npm audit fix

CMD ["history-server", "dist", "-p", "80"]
