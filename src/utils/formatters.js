export const formatarData = (dataArray) => {
  if (!dataArray) return "-";
  
  
  if (Array.isArray(dataArray)) {
      const [ano, mes, dia, hora, min] = dataArray;
     
      return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano} ${String(hora).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  }
  
  
  return new Date(dataArray).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
  });
};