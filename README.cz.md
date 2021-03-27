<center>
<img align="left" src="https://tarasa24.github.io/involute/img/logo.dce2310b.webp">
<h1>Domovská stránka iNvolute</h1>
Prezentace mého projektu pro nyní rozpuštěný český esportový tým - iNvolute.
</center>
</br>

---

> README also available in [English 🇬🇧](https://github.com/Tarasa24/involute/blob/master/README.md)

## Obsah

- [Obecné informace](#Obecné-informace)
- [Demo stránka](#Demo-stránka)
- [Technologie](#Technologie)
  - [Obecný přehled](#Obecný-přehled)
  - [Frontend](#Frontend)
  - [Backend](#Backend)
  - [Auth server](#Auth-server)
  - [Dashboard frontend](#Dashboard-frontend)
  - [Dashboard backend](#Dashboard-backend)
  - [Statický souborový server](#Statický-souborový-server)
  - [Další](#Další)

## Obecné informace

Projekt se skládá z **Vue** webu navrženého jako internetová prezentace týmu a jako domovská stránka zpráv a médií týkající se jeho aktivit.
Zobrazené údaje jsou načteny z Express.js **REST API**, které získává data z **databáze mongoDB**.
Doprovázející web je vlastní plnohodnotný **CMS (Content Management System)** pro manipulaci s daty i správu uživatelských účtů.
Ověřování pro přístup do CMS se provádí pomocí standardní kontroly uživatelského jména a hashe hesla a je posíleno pomocí **dvoufázového ověřovacího mechanismu** otp (one-time-password).
Autorizace se poté provádí pomocí **JWT**. Vydané tokeny jsou sledovány na straně serveru pro potenciální potřebu je zrušit.

*Loga, propagační video a částečně i design pro veřený web dodal zákazník.*

## [Demo stránka](https://tarasa24.github.io/involute/)

V zájmu prezentace jsem připravil **statickou verzi** jak veřejného webu, tak CMS. API cally jsou statické a falešné JSON soubory.
CMS není připojen k žádnému backendu, takže neočekávejte jeho funkčnost.

## Technologie

### Obecný přehled
Projekt je strukturován okolo **microservices**.
Každá mikroslužba běží pouze jako jediný **Docker** kontejner, protože se od tohoto projektu neočekávalo, že by měl kdy zvládat velká zatížení.
V případě potřeby však lze horizontálního škálování snadno dosáhnout pomocí nástrojů pro orchestraci, jako je Kubernetes.

Veřejnému internetu čelí instance **Nginx** (nebo v tomto případě OpenResty),
která zpracovává základní požadavky i autentizaci pomocí interních požadavků na službu auth.
Logy vytvořené službou Nginx jsou zpracovány pomocí GoAccess a vytvořená vizualizace je poté zobrazena v dashboardu.

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
