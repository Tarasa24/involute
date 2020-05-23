FROM node AS builder

COPY package.json package.json
RUN npm install
RUN npm audit fix

COPY . .
RUN npm run build

FROM node

COPY /server/package.json /server/package.json
WORKDIR /server
RUN npm install
RUN npm audit fix

COPY /server /server
COPY --from=builder /dist /dist

CMD ["npm", "start"]
