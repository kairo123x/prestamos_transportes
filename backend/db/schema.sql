CREATE TABLE MaterialesAsignados (
	idMaterialAsignado INT PRIMARY KEY IDENTITY(1,1),
	dni VARCHAR(8),
	codEmpresa VARCHAR(2),
	tipoProducto VARCHAR(6),
	codProducto VARCHAR(30),
	descripcionProducto VARCHAR(255),
	cantidad INT NOT NULL,
	fechaAsignada DATE NOT NULL
)

CREATE TABLE PrestamoMateriales (
	idPrestamo INT PRIMARY KEY IDENTITY(1,1),
	dniPrestador VARCHAR(8),
	dniRecepcionador VARCHAR(8),
	codEmpresa VARCHAR(2),
	tipoProducto VARCHAR(6),
	codProducto VARCHAR(30),
	prestamoAprobado BIT,
	prestamoDevuelto BIT,
	cantidad INT,
	fechaPrestamo DATE
)

CREATE PROCEDURE RECOVER_MATERIALES_ASIGNADOS 
	@dni VARCHAR(8)
AS
BEGIN
	SELECT * FROM MaterialesAsignados M INNER JOIN RRHH_TRABAJADORES R ON R.TRAB_DNI=M.dni WHERE R.TRAB_ESTADO dni=@dni
END