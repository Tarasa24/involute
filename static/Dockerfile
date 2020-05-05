FROM node

WORKDIR /static

COPY package.json package.json
RUN npm install && npm audit fix

COPY . .

CMD ["npm", "start"]