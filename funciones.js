// funciones.js

/**
 * Convierte una fecha del formato "aaaa/mm/dd" al formato "dd/mm/aaaa".
 * @param {string} dateStr - La fecha en formato "aaaa/mm/dd".
 * @returns {string} La fecha formateada en "dd/mm/aaaa". Si el formato no es válido, retorna la fecha original.
 */
export const formatDate = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };
  
  // Aquí podrás añadir más funciones utilitarias según sea necesario.
  