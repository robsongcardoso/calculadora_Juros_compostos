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

        // Configura máscaras para campos monetários
        const camposMonetarios = ['valorInicial', 'aporteMensal'];
        camposMonetarios.forEach(id => {
            const element = document.getElementById(id);
            IMask(element, {
                mask: 'R$ num',
                blocks: {
                    num: {
                        mask: Number,
                        thousandsSeparator: '.',
                        radix: ',',
                        scale: 2,
                        padFractionalZeros: true,
                        normalizeZeros: true,
                        min: 0
                    }
                }
            });
        });
        
        // Configura o evento de cálculo
        document.getElementById('calcular').addEventListener('click', () => {
            try {
                // Obtém os valores dos campos
                const valorInicialMask = IMask.createMask({
                    mask: 'R$ num',
                    blocks: {
                        num: {
                            mask: Number,
                            thousandsSeparator: '.',
                            radix: ',',
                            scale: 2
                        }
                    }
                });
                
                // Converte os valores para número
                const valorInicial = valorInicialMask.resolve(document.getElementById('valorInicial').value) || 0;
                const aporteMensal = valorInicialMask.resolve(document.getElementById('aporteMensal').value) || 0;
                const periodo = parseInt(document.getElementById('periodo').value) || 0;
                const taxaJuros = parseFloat(document.getElementById('taxaJuros').value) || 0;
                const inflacao = parseFloat(document.getElementById('inflacao').value) || 0;
                const tipoTaxaJuros = document.getElementById('tipoTaxaJuros').value;
                const tipoPeriodo = document.getElementById('tipoPeriodo').value;

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