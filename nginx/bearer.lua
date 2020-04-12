if ngx.var.cookie_Authorization == nil then
	ngx.status = 401
  ngx.exit(401)
  return
end

local http = require "resty.http"
local httpc = http.new()
local res, err = httpc:request_uri("http://auth:300/validateJWT", {
	method = "POST",
	headers = {
		["Cookie"] = "Authorization=" .. ngx.var.cookie_Authorization,
		["X-Real-IP"] = ngx.var.remote_addr
	}
})

if not res then
	ngx.say("failed to request: ", err)
  return
end

if res.status ~= 204 then
	ngx.status = 401
  ngx.exit(401)
end
