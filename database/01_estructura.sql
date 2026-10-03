-- =====================================================================
-- Sistema Bancario académico - Julian Jax - Taller 2
-- Estructura: tablas, claves primarias, foraneas e indices (MySQL 8)
-- =====================================================================
CREATE DATABASE IF NOT EXISTS sistema_bancario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_bancario;

DROP TABLE IF EXISTS movimiento;
DROP TABLE IF EXISTS transferencia;
DROP TABLE IF EXISTS cuenta;
DROP TABLE IF EXISTS tipo_cuenta;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS cliente;

CREATE TABLE cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  apellido VARCHAR(80) NOT NULL,
  dpi VARCHAR(13) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  telefono VARCHAR(15) NOT NULL,
  direccion VARCHAR(160) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(40) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  rol ENUM('ADMIN','CAJERO') NOT NULL DEFAULT 'CAJERO',
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE tipo_cuenta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL UNIQUE,
  descripcion VARCHAR(120) NULL
) ENGINE=InnoDB;

CREATE TABLE cuenta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(20) NOT NULL UNIQUE,
  cliente_id INT NOT NULL,
  tipo_cuenta_id INT NOT NULL,
  saldo DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  estado ENUM('ACTIVA','INACTIVA') NOT NULL DEFAULT 'ACTIVA',
  creada_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_saldo CHECK (saldo >= 0),
  CONSTRAINT fk_cuenta_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id),
  CONSTRAINT fk_cuenta_tipo FOREIGN KEY (tipo_cuenta_id) REFERENCES tipo_cuenta(id)
) ENGINE=InnoDB;

CREATE TABLE transferencia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cuenta_origen_id INT NOT NULL,
  cuenta_destino_id INT NOT NULL,
  monto DECIMAL(14,2) NOT NULL,
  descripcion VARCHAR(160) NULL,
  usuario_id INT NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_transf_monto CHECK (monto > 0),
  CONSTRAINT chk_transf_distintas CHECK (cuenta_origen_id <> cuenta_destino_id),
  CONSTRAINT fk_transf_origen FOREIGN KEY (cuenta_origen_id) REFERENCES cuenta(id),
  CONSTRAINT fk_transf_destino FOREIGN KEY (cuenta_destino_id) REFERENCES cuenta(id),
  CONSTRAINT fk_transf_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB;

CREATE TABLE movimiento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cuenta_id INT NOT NULL,
  tipo ENUM('DEPOSITO','RETIRO','TRANSFERENCIA_ENVIADA','TRANSFERENCIA_RECIBIDA') NOT NULL,
  monto DECIMAL(14,2) NOT NULL,
  saldo_resultante DECIMAL(14,2) NOT NULL,
  cuenta_relacionada_id INT NULL,
  transferencia_id INT NULL,
  descripcion VARCHAR(160) NULL,
  usuario_id INT NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_mov_monto CHECK (monto > 0),
  CONSTRAINT fk_mov_cuenta FOREIGN KEY (cuenta_id) REFERENCES cuenta(id),
  CONSTRAINT fk_mov_relacionada FOREIGN KEY (cuenta_relacionada_id) REFERENCES cuenta(id),
  CONSTRAINT fk_mov_transferencia FOREIGN KEY (transferencia_id) REFERENCES transferencia(id),
  CONSTRAINT fk_mov_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB;

CREATE INDEX idx_mov_cuenta_fecha ON movimiento (cuenta_id, fecha);
CREATE INDEX idx_cuenta_cliente ON cuenta (cliente_id);
