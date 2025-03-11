-- Crear la base de datos
CREATE DATABASE TiendaDeRopa;
USE TiendaDeRopa;

-- Tabla: Categorías
CREATE TABLE Categorias (
    Categoria_ID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre_Categoria VARCHAR(50) NOT NULL
);

-- Tabla: Marcas
CREATE TABLE Marcas (
    Marca_ID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre_Marca VARCHAR(50) NOT NULL
);

-- Tabla: Productos (Items)
CREATE TABLE Items (
    ID_Item INT PRIMARY KEY AUTO_INCREMENT,
    Nombre_Item VARCHAR(100) NOT NULL,
    Precio_Item DECIMAL(10, 2) NOT NULL,
    Talla VARCHAR(10),
    Color VARCHAR(50),
    Categoria_ID INT,
    Marca_ID INT,
    FOREIGN KEY (Categoria_ID) REFERENCES Categorias(Categoria_ID),
    FOREIGN KEY (Marca_ID) REFERENCES Marcas(Marca_ID)
);

-- Tabla: Clientes
CREATE TABLE Clientes (
    Cliente_ID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre_Cliente VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    Teléfono VARCHAR(15),
    Dirección VARCHAR(200)
);

-- Tabla: Ventas
CREATE TABLE Ventas (
    ID_Venta INT PRIMARY KEY AUTO_INCREMENT,
    Fecha_Venta DATE NOT NULL,
    Total_Venta DECIMAL(10, 2) NOT NULL,
    Cliente_ID INT,
    FOREIGN KEY (Cliente_ID) REFERENCES Clientes(Cliente_ID)
);

-- Tabla: Detalle_Venta (para manejar la relación muchos a muchos entre Ventas y Items)
CREATE TABLE Detalle_Venta (
    ID_Detalle INT PRIMARY KEY AUTO_INCREMENT,
    ID_Venta INT,
    ID_Item INT,
    Cantidad_Vendida INT NOT NULL,
    Precio_Unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (ID_Venta) REFERENCES Ventas(ID_Venta),
    FOREIGN KEY (ID_Item) REFERENCES Items(ID_Item)
);

-- Tabla: Facturas
CREATE TABLE Facturas (
    ID_Factura INT PRIMARY KEY AUTO_INCREMENT,
    Fecha_Factura DATE NOT NULL,
    Total_Factura DECIMAL(10, 2) NOT NULL,
    ID_Venta INT,
    FOREIGN KEY (ID_Venta) REFERENCES Ventas(ID_Venta)
);

-- Insertar datos de ejemplo

-- Categorías
INSERT INTO Categorias (Nombre_Categoria) VALUES
('Camisetas'),
('Vestidos'),
('Pantalones'),
('Chaquetas');

-- Marcas
INSERT INTO Marcas (Nombre_Marca) VALUES
('Nike'),
('Zara'),
('Levi\'s');

-- Productos (Items)
INSERT INTO Items (Nombre_Item, Precio_Item, Talla, Color, Categoria_ID, Marca_ID) VALUES
('Camiseta básica', 25.00, 'M', 'Blanco', 1, 1),
('Vestido floral', 60.00, 'S', 'Rosa', 2, 2),
('Jeans slim', 45.00, 'L', 'Azul', 3, 3);

-- Clientes
INSERT INTO Clientes (Nombre_Cliente, Email, Teléfono, Dirección) VALUES
('Juan Pérez', 'juan@example.com', '555-1234', 'Calle Falsa 123'),
('María Gómez', 'maria@example.com', '555-5678', 'Avenida Siempre Viva');

-- Ventas
INSERT INTO Ventas (Fecha_Venta, Total_Venta, Cliente_ID) VALUES
('2023-10-01', 85.00, 1),
('2023-10-02', 120.00, 2);

-- Detalle_Venta
INSERT INTO Detalle_Venta (ID_Venta, ID_Item, Cantidad_Vendida, Precio_Unitario) VALUES
(1, 1, 2, 25.00),
(1, 3, 1, 45.00),
(2, 2, 1, 60.00);

-- Facturas
INSERT INTO Facturas (Fecha_Factura, Total_Factura, ID_Venta) VALUES
('2023-10-01', 85.00, 1),
('2023-10-02', 120.00, 2);
