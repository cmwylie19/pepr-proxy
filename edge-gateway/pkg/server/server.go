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

func (s *Server) Serve(port, redirectPort string, rateLimit int, secretKey string) {
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
		}))
	}

	redirectHandler := func(c echo.Context) error {
		c.Redirect(http.StatusFound, fmt.Sprintf("http://localhost:%s%s", redirectPort, c.Path()))
		return nil
	}

	fmt.Println("rateLimit: ", rateLimit)
	if rateLimit != 0 {
		e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(rate.Limit(rateLimit))))
	}

	e.POST("/", redirectHandler)
	e.GET("/", redirectHandler)
	e.PUT("/", redirectHandler)
	e.DELETE("/", redirectHandler)

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", port)))
}
