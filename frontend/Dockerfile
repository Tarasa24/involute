FROM node AS builder

COPY package.json package.json
RUN npm install
RUN npm audit fix

COPY . .
RUN npm run build

FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /dist /www/frontend
