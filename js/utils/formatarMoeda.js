export function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor);
}

export function extrairValorNumerico(valorFormatado) {
    if (!valorFormatado) return 0;
    
    // Remove todos os caracteres exceto números, vírgula e ponto
    const apenasNumerosEPontuacao = valorFormatado.replace(/[^\d,.]/g, '');
    
    // Se tiver vírgula, assume que é o separador decimal
    if (apenasNumerosEPontuacao.includes(',')) {
        return parseFloat(apenasNumerosEPontuacao.replace(/\./g, '').replace(',', '.')) || 0;
    }
    
    // Se não tiver vírgula, assume que os pontos são separadores de milhar
    return parseFloat(apenasNumerosEPontuacao.replace(/\./g, '')) || 0;
}

export function formatarPorcentagem(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor / 100);
} 