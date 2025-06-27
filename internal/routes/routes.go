package routes

import (
	"net/http"

	"github.com/johnal95/aws-cdk-and-go/internal/app"
)

func SetupRoutesHandler(app *app.Application) http.Handler {
	h := http.NewServeMux()

	h.HandleFunc("GET /health-check", app.HandleHealthCheck)

	h.HandleFunc("GET /products", app.ProductHandler.HandleGetProducts)
	h.HandleFunc("POST /products", app.ProductHandler.HandleCreateProduct)

	return h
}
