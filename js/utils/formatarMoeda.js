/**
 * Utilitários de formatação e parsing monetário e percentual
 */

export function formatarMoeda(valor) {
    if (valor === null || valor === undefined || isNaN(valor)) {
        valor = 0;
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor);
}

export function extrairValorNumerico(valor) {
    if (valor === null || valor === undefined) return 0;
    if (typeof valor === 'number') return isNaN(valor) ? 0 : valor;
    
    const str = String(valor).trim();
    if (!str) return 0;

    // Remove tudo exceto dígitos, vírgula, ponto e sinal negativo
    const limpo = str.replace(/[^\d,.-]/g, '');
    
    // Se tiver vírgula, assume que a vírgula é o separador decimal
    if (limpo.includes(',')) {
        return parseFloat(limpo.replace(/\./g, '').replace(',', '.')) || 0;
    }
    
    // Se tiver apenas pontos, e mais de um ou formato milhar
    return parseFloat(limpo) || 0;
}

export function formatarPorcentagem(valor, casasDecimais = 2) {
    if (valor === null || valor === undefined || isNaN(valor)) {
        valor = 0;
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: casasDecimais,
        maximumFractionDigits: casasDecimais
    }).format(valor / 100);
}
