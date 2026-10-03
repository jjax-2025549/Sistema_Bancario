-- =====================================================================
-- Datos ficticios (Sistema Bancario academico). Ejecutar DESPUES de 01_estructura.sql
-- =====================================================================
USE sistema_bancario;

-- ------------------------- Datos ficticios ---------------------------
-- Contraseñas ficticias: admin -> Admin123 | cajero1 -> Cajero123 (bcrypt)
INSERT INTO usuario (username, password_hash, nombre, rol) VALUES
('admin',   '$2b$10$1KxlLFR7FFKRBgqNilss4u2WwZ1G7TkJBa0Y/sRIRIWthUyVV3lwG', 'Administrador Ficticio', 'ADMIN'),
('cajero1', '$2b$10$OBH8hDj1CSNDeeEeIjZtSe1OP5u1mi49ApsocsvDJPtCFL9ZgeIz6', 'Cajero Ficticio Uno',    'CAJERO');

INSERT INTO tipo_cuenta (nombre, descripcion) VALUES
('Ahorro',    'Cuenta de ahorro personal ficticia'),
('Monetaria', 'Cuenta monetaria ficticia'),
('Nómina',    'Cuenta de nómina ficticia');

INSERT INTO cliente (nombre, apellido, dpi, email, telefono, direccion) VALUES
('Ana',    'Ficticia Lopez',  '1000000000001', 'ana@ejemplo.test',    '50211110001', 'Zona 1, Ciudad de Guatemala'),
('Bruno',  'Ficticio Perez',  '1000000000002', 'bruno@ejemplo.test',  '50211110002', 'Zona 10, Ciudad de Guatemala'),
('Carla',  'Ficticia Gomez',  '1000000000003', 'carla@ejemplo.test',  '50211110003', 'Mixco, Guatemala');

INSERT INTO cuenta (numero, cliente_id, tipo_cuenta_id, saldo, estado) VALUES
('100-0000001', 1, 1, 1500.00, 'ACTIVA'),
('100-0000002', 2, 2, 800.00,  'ACTIVA'),
('100-0000003', 3, 3, 250.00,  'INACTIVA');

INSERT INTO movimiento (cuenta_id, tipo, monto, saldo_resultante, descripcion, usuario_id) VALUES
(1, 'DEPOSITO', 1500.00, 1500.00, 'Depósito inicial ficticio', 1),
(2, 'DEPOSITO', 800.00,  800.00,  'Depósito inicial ficticio', 1),
(3, 'DEPOSITO', 250.00,  250.00,  'Depósito inicial ficticio', 1);
