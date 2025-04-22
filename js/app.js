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
        const mascarasMonetarias = {};
        
        camposMonetarios.forEach(id => {
            const element = document.getElementById(id);
            const mascara = IMask(element, {
                mask: 'R$ num',
                blocks: {
                    num: {
                        mask: Number,
                        thousandsSeparator: '.',
                        radix: ',',
                        scale: 2,
                        padFractionalZeros: true,
                        normalizeZeros: true,
                        min: 0.01
                    }
                }
            });
            
            // Armazena a máscara para uso posterior
            mascarasMonetarias[id] = mascara;
            
            // Adiciona evento de validação
            element.addEventListener('change', () => {
                const valor = mascara.unmaskedValue;
                if (id === 'valorInicial') {
                    // Valor inicial precisa ser maior que zero
                    if (!valor || parseFloat(valor) <= 0) {
                        element.classList.add('is-invalid');
                    } else {
                        element.classList.remove('is-invalid');
                    }
                } else {
                    // Aporte mensal pode ser zero ou maior
                    if (!valor || parseFloat(valor) < 0) {
                        element.classList.add('is-invalid');
                    } else {
                        element.classList.remove('is-invalid');
                    }
                }
            });
        });

        // Adiciona validação para campos numéricos
        ['taxaJuros', 'inflacao', 'periodo'].forEach(id => {
            const element = document.getElementById(id);
            
            // Previne entrada de caracteres não numéricos
            element.addEventListener('keypress', (e) => {
                // Permite números, ponto decimal, sinal negativo e teclas de controle
                if (!/[\d.-]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                }
                
                // Previne múltiplos pontos decimais
                if (e.key === '.' && element.value.includes('.')) {
                    e.preventDefault();
                }

                // Permite sinal negativo apenas no início
                if (e.key === '-' && element.value !== '') {
                    e.preventDefault();
                }
            });
            
            // Limpa caracteres inválidos no evento paste
            element.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text');
                const sanitized = text.replace(/[^\d.-]/g, '');
                if (sanitized) {
                    element.value = sanitized;
                }
            });

            element.addEventListener('change', (e) => {
                if (id === 'periodo') {
                    // Para o período, mantém a validação de maior que zero
                    const value = parseInt(e.target.value);
                    if (!value || value <= 0) {
                        e.target.classList.add('is-invalid');
                    } else {
                        e.target.classList.remove('is-invalid');
                    }
                } else {
                    // Para taxa de juros e inflação, permite valores maiores ou iguais a zero
                    const value = parseFloat(e.target.value);
                    if (isNaN(value)) {
                        e.target.classList.add('is-invalid');
                    } else {
                        e.target.classList.remove('is-invalid');
                    }
                }
            });
        });

        // Configura validação do período baseado no tipo
        const periodoCampo = document.getElementById('periodo');
        const tipoPeriodoCampo = document.getElementById('tipoPeriodo');
        
        function validarPeriodo() {
            const valor = parseInt(periodoCampo.value);
            const tipo = tipoPeriodoCampo.value;
            
            if (!valor || valor <= 0) {
                periodoCampo.classList.add('is-invalid');
                return false;
            }
            
            if (tipo === 'anos' && valor > 120) {
                periodoCampo.classList.add('is-invalid');
                return false;
            }
            
            if (tipo === 'meses' && valor > 1440) {
                periodoCampo.classList.add('is-invalid');
                return false;
            }
            
            periodoCampo.classList.remove('is-invalid');
            return true;
        }
        
        periodoCampo.addEventListener('change', validarPeriodo);
        tipoPeriodoCampo.addEventListener('change', validarPeriodo);
        
        // Configura o evento de cálculo
        document.getElementById('calcular').addEventListener('click', () => {
            try {
                // Converte os valores para número
                const valorInicial = parseFloat(mascarasMonetarias['valorInicial'].unmaskedValue) || 0;
                const aporteMensal = parseFloat(mascarasMonetarias['aporteMensal'].unmaskedValue) || 0;
                const periodo = parseInt(document.getElementById('periodo').value);
                const taxaJuros = parseFloat(document.getElementById('taxaJuros').value);
                const inflacao = parseFloat(document.getElementById('inflacao').value);
                const tipoTaxaJuros = document.getElementById('tipoTaxaJuros').value;
                const tipoPeriodo = document.getElementById('tipoPeriodo').value;

                // Validação dos valores
                let temErro = false;

                // Validação dos campos monetários
                if (!valorInicial || valorInicial <= 0) {
                    document.getElementById('valorInicial').classList.add('is-invalid');
                    temErro = true;
                }
                
                if (!aporteMensal || aporteMensal < 0) {
                    document.getElementById('aporteMensal').classList.add('is-invalid');
                    temErro = true;
                }
                
                // Validação do período
                if (!validarPeriodo()) {
                    temErro = true;
                }
                
                // Validação dos percentuais
                if (!taxaJuros || taxaJuros <= 0) {
                    document.getElementById('taxaJuros').classList.add('is-invalid');
                    temErro = true;
                }
                
                if (!inflacao || inflacao <= 0) {
                    document.getElementById('inflacao').classList.add('is-invalid');
                    temErro = true;
                }

                if (temErro) {
                    return;
                }

                // Remove classes de validação
                ['valorInicial', 'aporteMensal', 'periodo', 'taxaJuros', 'inflacao'].forEach(id => {
                    document.getElementById(id).classList.remove('is-invalid');
                });

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