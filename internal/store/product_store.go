package store

import (
	"database/sql"
)

type ProductStore interface {
	FindAll() ([]Product, error)
	Create(p *Product) (*Product, error)
}

type PostgresProductStore struct {
	db *sql.DB
}

func NewPostgresProductStore(db *sql.DB) *PostgresProductStore {
	return &PostgresProductStore{
		db: db,
	}
}

func (s *PostgresProductStore) FindAll() ([]Product, error) {
	rows, err := s.db.Query(`
		SELECT
			id,
			name,
			description,
			created_at
		FROM products
	`)
	if err != nil {
		return nil, err
	}

	products := []Product{}

	for rows.Next() {
		var product Product
		err := rows.Scan(
			&product.ID,
			&product.Name,
			&product.Description,
			&product.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, product)
	}

	return products, nil
}

func (s *PostgresProductStore) Create(p *Product) (*Product, error) {
	err := s.db.QueryRow(`
		INSERT INTO products
		(name, description)
		VALUES
		($1, $2)
		RETURNING
		id, name, description, created_at
	`, p.Name, p.Description).Scan(
		&p.ID, &p.Name, &p.Description, &p.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return p, nil
}
