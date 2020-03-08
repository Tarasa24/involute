FROM alpine/git AS git

RUN git clone https://github.com/SkyLothar/lua-resty-jwt.git /lua-resty-jwt
RUN git clone https://github.com/openresty/lua-resty-string.git /lua-resty-string
RUN git clone https://github.com/jkeys089/lua-resty-hmac.git /lua-resty-hmac

FROM openresty/openresty

COPY --from=git /lua-resty-jwt /lua-resty-jwt
COPY --from=git /lua-resty-string /lua-resty-string
COPY --from=git /lua-resty-hmac /lua-resty-hmac

COPY ./bearer.lua /bearer.lua
ARG jwtSecret
RUN sed -i "s/<jwtSecret>/$(echo $jwtSecret)/g" bearer.lua
