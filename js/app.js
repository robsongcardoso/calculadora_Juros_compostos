import { Calculadora } from './components/Calculadora.js';
import { TabelaResultados } from './components/TabelaResultados.js';

// Função para inicializar a aplicação
function inicializarAplicacao() {
    try {
        console.log('Iniciando a aplicação...');
        
        // Inicializa a calculadora e a tabela
        const calculadora = new Calculadora();
        const tabela = new TabelaResultados();
        
        // Armazena a instância globalmente para debug
        window.calculadora = calculadora;
        
        // Configura o evento de cálculo
        document.getElementById('calcular').addEventListener('click', () => {
            const valorInicial = parseFloat(document.getElementById('valorInicial').value) || 0;
            const aporteMensal = parseFloat(document.getElementById('aporteMensal').value) || 0;
            const periodo = parseInt(document.getElementById('periodo').value) || 0;
            const taxaJuros = parseFloat(document.getElementById('taxaJuros').value) || 0;
            const inflacao = parseFloat(document.getElementById('inflacao').value) || 0;
            const tipoTaxaJuros = document.getElementById('tipoTaxaJuros').value;
            const tipoPeriodo = document.getElementById('tipoPeriodo').value;

            // Valida os dados
            if (!valorInicial && !aporteMensal) {
                alert('Informe pelo menos o valor inicial ou o aporte mensal');
                return;
            }
            if (!periodo) {
                alert('Informe o período');
                return;
            }
            if (!taxaJuros) {
                alert('Informe a taxa de juros');
                return;
            }

            try {
                // Calcula os resultados
                const resultados = calculadora.calcular({
                    valorInicial,
                    aporteMensal,
                    periodo,
                    taxaJuros,
                    tipoTaxaJuros,
                    tipoPeriodo,
                    inflacao
                });

                console.log('Resultados calculados:', resultados);

                // Atualiza a tabela com os resultados
                tabela.atualizar(resultados, inflacao);
                
                // Mostra a seção de resultados
                document.getElementById('explicacao').style.display = 'none';
                document.getElementById('resultado').style.display = 'block';
            } catch (erro) {
                console.error('Erro ao calcular:', erro);
                alert('Erro ao calcular. Verifique os valores informados.');
            }
        });
        
        console.log('Aplicação iniciada com sucesso!');
        
    } catch (erro) {
        console.error('Erro ao inicializar a aplicação:', erro);
    }
}

// Aguarda o DOM estar completamente carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacao);
} else {
    inicializarAplicacao();
}