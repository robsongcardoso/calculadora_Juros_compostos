import { Calculadora } from './components/Calculadora.js';

// Função para inicializar a aplicação
function inicializarAplicacao() {
    try {
        console.log('Iniciando a aplicação...');
        
        // Inicializa a calculadora
        const calculadora = new Calculadora();
        
        // Armazena a instância globalmente para debug
        window.calculadora = calculadora;
        
        console.log('Calculadora instanciada com sucesso!');
        console.log('Elementos do formulário:', {
            valorInicial: document.getElementById('valorInicial'),
            aporteMensal: document.getElementById('aporteMensal'),
            periodo: document.getElementById('periodo'),
            taxaJuros: document.getElementById('taxaJuros'),
            inflacao: document.getElementById('inflacao'),
            botaoCalcular: document.getElementById('calcular')
        });
        
    } catch (erro) {
        console.error('Erro ao inicializar a calculadora:', erro);
    }
}

// Aguarda o DOM estar completamente carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacao);
} else {
    inicializarAplicacao();
}