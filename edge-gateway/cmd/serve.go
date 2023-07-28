/*
Copyright © 2023 Casey Wylie cmwylie19@defenseunicorns.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package cmd

import (
	"fmt"

	"github.com/cmwylie19/pepr-proxy/edge-gateway/pkg/server"
	"github.com/spf13/cobra"
)

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "serve the edge-gateway",
	Long: `Serves the edge-gateway with jwt validation 
and rate-limiting.

Examples:
  edge-gateway serve --redirect-port 8080 --port 3333 
  edge-gateway serve -r 5173 -p 8080 jwt -s "secret" rateLimit --rate 2
`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("serve called")
		server := server.Server{}

		fmt.Printf("Running server\nport %s\nredirectPort %s\nrateLimit %d\nsecretKey %s\ninsecureRoutes %s", DefaultPort, DefaultRedirectPort, rateLimit, secretKey, insecureRoutes)
		server.Serve(DefaultPort, DefaultRedirectPort, rateLimit, secretKey, insecureRoutes)
	},
}
var (
	// DefaultPort is the default port to run the edge-gateway.
	DefaultPort = "3050"
	// DefaultRedirectPort is the default port to redirect requests.
	DefaultRedirectPort = "80"
	// rateLimit is the number of requests per minute.
	rateLimit = 0
	// secretKey is the secret key for JWT validation.
	secretKey = ""
	// insecureRoutes are routes that do not require JWT validation.
	insecureRoutes = []string{}
	// loginURL is the URL to redirect users to for login.
)

func init() {
	rootCmd.AddCommand(serveCmd)
	serveCmd.PersistentFlags().StringVarP(&DefaultRedirectPort, "redirect-port", "r", "80", "(optional) Port to route requests.")
	serveCmd.PersistentFlags().StringVarP(&DefaultPort, "port", "p", "3050", "(optional) Port to run the edge-gateway.")
	serveCmd.PersistentFlags().IntVarP(&rateLimit, "rate", "", 0, "Requests per minute. 0 means none")
	serveCmd.PersistentFlags().StringVarP(&secretKey, "secret-key", "s", "", "Secret key for JWT validation. No secret means no JWT validation.")
	serveCmd.PersistentFlags().StringSliceVarP(&insecureRoutes, "insecure-routes", "i", []string{}, "Routes that do not require JWT validation.")

}
