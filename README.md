<center>
<img align="left" src="https://tarasa24.github.io/involute/img/logo.dce2310b.webp">
<h1>iNvolute homepage</h1>
Presentation of contracted work of mine for, as of now disbanded, czech esports team - iNvolute.
</center>
</br>

---

> README také dostupné v [Češtině 🇨🇿](https://github.com/Tarasa24/involute/blob/master/README.cz.md)

## Table of contents

- [General info](#general-info)
- [Demo website](#demo-website)
- [Technologies](#technologies)
  - [General overview](#General-overview)
  - [Frontend](#Frontend)
  - [Backend](#Backend)
  - [Auth server](#Auth-server)
  - [Dashboard frontend](#Dashboard-frontend)
  - [Dashboard backend](#Dashboard-backend)
  - [Static files server](#Static-files-server)
  - [Misc](#Misc)

## General info

Project consists of **Vue website** designed as an internet presentation of the team as well as news and media homepage regarding the team's activities. 
Data displayed are fetched from Express.js **REST API** that is pulling the data from **mongoDB database**.
Accompanying the website is fully fledged custom **CMS (Content Management System)** for manipulating the data as well as managing user accounts.
Authentication for accessing the CMS is done through standard username and password-hash checking and reinforced through the use of **2FA otp** (one-time password) mechanism.
Authorization is then handled through the use of **JWT** and keeping track of the issued tokens server-side for potential need to revoke them.

*Logos, promotional video and in part the public facing website design were supplied by the customer.*

## [Demo website](https://tarasa24.github.io/involute/)

For the sake of presentation I've prepared **static version** of both the public website as well as the CMS. API calls are spoofed static JSON files.
CMS isn't connected to any backend so don't expect any functionality.

## Technologies

### General overview
Project is structured around **microservices**.
Each microservice runs as only single **Docker** container, as this project wasn't expected to handle extensive loads.
But if needed horizontal scaling can be easily achieved through orchestration tools such as Kubernetes.

Facing the public internet is instance of **Nginx** (or in this case OpenResty), 
that handles basic requests as well as authentication through the help of internal requests to auth service.
Logs produced by the Nginx service are processed using GoAccess and produced visualisation is thereafter shown in the dashboard.

### Frontend
 - [Vue](https://vuejs.org/) | [Sass](https://sass-lang.com/)
 - [Leaflet](https://leafletjs.com/)
 
### Backend
 - [Express.js](https://expressjs.com/)
 - [mongodb-driver](https://github.com/mongodb/node-mongodb-native)
 - [yup](https://github.com/jquense/yup)

### Auth Server
 - [Express.js](https://expressjs.com/)
 - [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
 - [speakeasyjs](https://github.com/speakeasyjs/speakeasy)
 - [bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)
 - [mongodb-driver](https://github.com/mongodb/node-mongodb-native)

### Dashboard frontend
 - [Vue](https://vuejs.org/) | [Sass](https://sass-lang.com/)
 - [Quilljs](https://quilljs.com/)
 - [socket.io](https://socket.io/)

### Dashboard backend
 - [Express.js](https://expressjs.com/)
 - [mongodb-driver](https://github.com/mongodb/node-mongodb-native)
 - [socket.io](https://socket.io/)

### Static files server
 - [Express.js](https://expressjs.com/)
 - [Express-fileupload](https://github.com/richardgirges/express-fileupload)
 - [node-cron](https://github.com/kelektiv/node-cron)

### Misc
 - [MongoDB](https://www.mongodb.com/)
 - [Nginx](https://nginx.org/en/) / [OpenResty](https://openresty.org/en/)
 - [GoAccess](https://goaccess.io/)
 - [Docker & Docker-compose](https://www.docker.com/)
 
 
