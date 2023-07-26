Examples:

run with rate limit of 2 on port 8080 redirecting to 5173
```bash
go run main.go serve -r 5173 -p 8080 rateLimit --rate 2
```

run with jwt validation
```bash
go run main.go serve -r 5173 -p 8080 jwt -s "secret"
```

request with token
```bash
curl -H "Authorization: Bearer $(./token 88 secret)" localhost:8080
```

Run with rate limit and token
```bash

