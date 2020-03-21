FROM node

COPY package.json package.json
RUN npm install
RUN npm i -g history-server

COPY . .
RUN npm run build


CMD ["history-server", "dist", "-p", "80"]
