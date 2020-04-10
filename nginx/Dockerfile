FROM alpine/git AS git

RUN git clone https://github.com/ledgetech/lua-resty-http.git /lua-resty-http

FROM openresty/openresty

COPY --from=git /lua-resty-http /lua-resty-http
