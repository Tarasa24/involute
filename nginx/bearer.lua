if ngx.var.cookie_Authorization == nil then
	ngx.status = 401
  ngx.exit(401)
  return
end

local http = require "resty.http"
local httpc = http.new()
local res, err = httpc:request_uri("http://127.0.0.1/api/auth/validateJWT", {
	method = "POST",
	headers = {
		["Cookie"] = "Authorization=" .. ngx.var.cookie_Authorization
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
