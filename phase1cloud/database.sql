create database products_database;

--\c into products_database

CREATE TABLE products (
    id SERIAL PRIMARY KEY,         
    title VARCHAR(255) NOT NULL,    
    img VARCHAR(255),              
    price DECIMAL(10, 2)  NULL,  
    quantity INT DEFAULT 0          
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    products JSONB NOT NULL,  -- Stores the array of product objects
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending'  -- Status with default as 'Pending'
);
