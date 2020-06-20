FROM alpine:edge
RUN apk add --no-cache \
    wget \
    tar \
    make \
    build-base \
    gettext-dev \
    libmaxminddb-dev \
    ncurses-dev

RUN wget https://web.archive.org/web/20191227182209if_/https://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz 
RUN mkdir /usr/share/GeoLite2-City && tar -xzvf GeoLite2-City.tar.gz -C /usr/share/GeoLite2-City

RUN wget https://tar.goaccess.io/goaccess-1.4.tar.gz && tar -xzvf goaccess-1.4.tar.gz 
RUN cd goaccess-1.4/ && ./configure --prefix="" --enable-utf8 --enable-geoip=mmdb && make && make DESTDIR=/ install

RUN mkdir -p /goaccess/www/goaccess && touch /goaccess/www/goaccess/index.html
ENTRYPOINT ["/bin/goaccess"]
