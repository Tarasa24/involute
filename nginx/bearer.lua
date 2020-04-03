local jwt = require "resty.jwt"

local token = ngx.var.cookie_Authorization

if token == nil then
    ngx.status = 401
    ngx.exit(401)
end

local validators = require "resty.jwt-validators"
local claim_spec = {
    exp = validators.is_not_expired(),
    ip = validators.equals_any_of({ngx.var.remote_addr, "<missing X-Real-IP header>", "false"})
}

local jwt_obj = jwt:verify("<jwtSecret>", token, claim_spec)
if not jwt_obj["verified"] then
    ngx.status = 401
    ngx.log(ngx.WARN, jwt_obj.reason)
    ngx.exit(401)
end
