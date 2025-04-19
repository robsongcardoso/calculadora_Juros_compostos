export function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

export function extrairValorNumerico(valor) {
    if (typeof valor === 'number') return valor;
    return Number(valor.replace(/[^\d,-]/g, '').replace(',', '.'));
} 