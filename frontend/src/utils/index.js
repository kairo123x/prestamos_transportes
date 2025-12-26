const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const FormatFechaCorta = (fechaISO) => {
  return new Date(fechaISO).toLocaleDateString('es-PE', { timeZone: 'UTC' });
};

const getStatusPrestamo = (esAprobado, esDevuelto, confirmaDevolucion=false) => {
  console.log(confirmaDevolucion);
  
  if(esAprobado && esDevuelto && confirmaDevolucion)
    return 'DEVUELTO';
  if(esAprobado && esDevuelto)
    return 'DEVOLUCIÓN POR CONFIRMAR';
  else if(esAprobado && !esDevuelto) 
    return 'EN PRÉSTAMO';
  else 
    return 'PENDIENTE DE APROBACIÓN';
};

const getStatusPrestamoStyle = (esAprobado, esDevuelto, confirmaDevolucion=false) => {
  if(esAprobado && esDevuelto && confirmaDevolucion)
    return "success"; // amarillo
  if (esAprobado && esDevuelto)
    return "warning"; // verde
  else if (esAprobado && !esDevuelto)
    return "primary"; // amarillo
  else
    return "info"; // azul
};

export { formatDate, FormatFechaCorta, getStatusPrestamo, getStatusPrestamoStyle };