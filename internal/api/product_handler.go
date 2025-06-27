package api

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/johnal95/aws-cdk-and-go/internal/store"
)

type ProductHandler struct {
	productStore store.ProductStore
}

func NewProductHandler(productStore store.ProductStore) *ProductHandler {
	return &ProductHandler{
		productStore: productStore,
	}
}

func (h *ProductHandler) HandleGetProducts(w http.ResponseWriter, r *http.Request) {
	products, err := h.productStore.FindAll()
	if err != nil {
		slog.Error(fmt.Sprintf("failed to get products: %v", err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	bytes, err := json.Marshal(products)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(bytes)
}

func (h *ProductHandler) HandleCreateProduct(w http.ResponseWriter, r *http.Request) {
	var product store.Product
	err := json.NewDecoder(r.Body).Decode(&product)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Internal Server Error"))
		return
	}
	newProduct, err := h.productStore.Create(&product)
	if err != nil {
		slog.Error(fmt.Sprintf("failed to get products: %v", err))
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}
	bytes, err := json.Marshal(newProduct)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(bytes)
}
