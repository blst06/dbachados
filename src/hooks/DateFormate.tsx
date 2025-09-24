
export const formatToInputDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
export const formateDateToPtBr = (date: string): string => {
  const parsedDate = new Date(date); // Presume que a string já está em formato UTC

  const day = String(parsedDate.getUTCDate()).padStart(2, '0');
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
  const year = parsedDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
};
export const formatCurrency = (value: string | number) => {
  try {
    if (value === undefined || value === null) {
      return 'R$ 0,00';
    }

    // Converte para string se for número
    const stringValue = typeof value === 'number' ? value.toString() : value;

    // Remove todos os caracteres não numéricos
    const onlyNumbers = stringValue.replace(/\D/g, '') || '0';

    // Converte para número e divide por 100 para obter os centavos
    const numberValue = parseFloat(onlyNumbers) / 100;

    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue);
  } catch (error) {
    console.error('Erro ao formatar moeda:', error);
    return 'R$ 0,00';
  }
};

export default { formatToInputDate, formateDateToPtBr, formatCurrency }

