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

export { formatDate, FormatFechaCorta }