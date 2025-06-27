package main

import (
	"flag"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/johnal95/aws-cdk-and-go/internal/app"
	"github.com/johnal95/aws-cdk-and-go/internal/routes"
	"github.com/johnal95/aws-cdk-and-go/internal/store"
)

type ProgramArgs struct {
	Port     int
	DBConfig *store.DatabaseConfig
}

func getProgramArgs() *ProgramArgs {
	var port int
	flag.IntVar(&port, "port", 8080, "go server port")
	flag.Parse()

	dbConfig := store.DatabaseConfig{
		Database: os.Getenv("DB_NAME"),
		Hostname: os.Getenv("DB_HOSTNAME"),
		Username: os.Getenv("DB_USERNAME"),
		Password: os.Getenv("DB_PASSWORD"),
		Port:     os.Getenv("DB_PORT"),
	}

	return &ProgramArgs{
		Port:     port,
		DBConfig: &dbConfig,
	}
}

func main() {
	args := getProgramArgs()

	app, err := app.NewApplication(args.DBConfig)
	if err != nil {
		log.Fatal(err)
	}
	defer app.DB.Close()

	server := http.Server{
		Addr:    fmt.Sprintf(":%d", args.Port),
		Handler: routes.SetupRoutesHandler(app),
	}

	slog.Info(fmt.Sprintf("listening on %s", server.Addr))

	err = server.ListenAndServe()

	log.Fatal(err)
}
