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
    return Number(valorFormatado.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
}

export function formatarPorcentagem(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor / 100);
} 