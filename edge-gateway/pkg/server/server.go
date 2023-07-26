package server

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"golang.org/x/time/rate"

	// "github.com/labstack/echo/middleware"
	"github.com/labstack/echo/v4/middleware"

	"github.com/labstack/gommon/log"
)

type Server struct {
}

func (s *Server) Serve(port, redirectPort string, rateLimit int, secretKey string, insecureRoutes []string) {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))
	e.Logger.SetLevel(log.ERROR)
	e.Use(middleware.Logger())
	if secretKey != "" {
		e.Use(middleware.JWTWithConfig(middleware.JWTConfig{
			SigningKey: []byte(secretKey),

			Skipper: func(c echo.Context) bool {
				// Skip authentication for signup and login requests
				for _, route := range insecureRoutes {
					if c.Path() == route {
						return true
					}
				}
				e.Logger.Info("JWT Expired: ", c.Path())
				return false
			},
		}))
	}

	redirectHandler := func(c echo.Context) error {
		c.Redirect(301, fmt.Sprintf("http://localhost:%s%s", redirectPort, c.Path()))
		return nil
	}
	fmt.Println("rateLimit: ", rateLimit)
	if rateLimit != 0 {
		// e.Use(middleware.RateLimiterWithConfig(config))
		// i := 2
		e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(rate.Limit(rateLimit))))
	}

	e.POST("/", redirectHandler)
	e.GET("/", redirectHandler)
	e.PUT("/", redirectHandler)
	e.DELETE("/", redirectHandler)

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", port)))
}