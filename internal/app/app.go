package app

import (
	"database/sql"
	"log/slog"
	"net/http"

	"github.com/johnal95/aws-cdk-and-go/internal/api"
	"github.com/johnal95/aws-cdk-and-go/internal/store"
	"github.com/johnal95/aws-cdk-and-go/migrations"
)

type Application struct {
	Logger         *slog.Logger
	DB             *sql.DB
	ProductHandler *api.ProductHandler
}

func NewApplication(dbConfig *store.DatabaseConfig) (*Application, error) {
	logger := slog.Default()

	pgDB, err := store.Open(dbConfig)
	if err != nil {
		return nil, err
	}

	err = store.Migrate(pgDB, migrations.FS, ".")
	if err != nil {
		return nil, err
	}

	// stores
	productStore := store.NewPostgresProductStore(pgDB)

	// handlers
	productHandler := api.NewProductHandler(productStore)

	app := &Application{
		Logger:         logger,
		DB:             pgDB,
		ProductHandler: productHandler,
	}

	return app, nil
}

func (a *Application) HandleHealthCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(200)
	w.Write([]byte("HEALTHY"))
}
