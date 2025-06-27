-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS products (
    id          INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,
    created_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    name        TEXT NOT NULL,
    description TEXT,

    PRIMARY KEY ("id")
)
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE products;
-- +goose StatementEnd
