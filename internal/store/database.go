package store

import (
	"database/sql"
	"fmt"
	"io/fs"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

type DatabaseConfig struct {
	Database string
	Hostname string
	Username string
	Password string
	Port     string
}

func Open(c *DatabaseConfig) (*sql.DB, error) {
	pgDB, err := sql.Open("pgx",
		fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
			c.Username, c.Password, c.Hostname, c.Port, c.Database))
	if err != nil {
		return nil, err
	}
	return pgDB, nil
}

func Migrate(db *sql.DB, migrationsFS fs.FS, dir string) error {
	goose.SetBaseFS(migrationsFS)
	defer func() {
		goose.SetBaseFS(nil)
	}()

	err := goose.SetDialect("postgres")
	if err != nil {
		return err
	}

	return goose.Up(db, dir)
}
