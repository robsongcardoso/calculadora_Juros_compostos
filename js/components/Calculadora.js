import { formatarMoeda, extrairValorNumerico, formatarPorcentagem } from '../utils/formatarMoeda.js';
import { GraficoLinha } from './graficos/GraficoLinha.js';
import { GraficoPizza } from './graficos/GraficoPizza.js';
import { TabelaResultados } from './TabelaResultados.js';

export class Calculadora {
    constructor() {
        console.log('Construindo a calculadora...');
        
        // Elementos do DOM
        this.botaoCalcular = document.getElementById('calcular');
        console.log('Botão calcular:', this.botaoCalcular);
        
        // Componentes visuais
        this.graficoLinha = new GraficoLinha('graficoLinha-container', 'tooltip-linha');
        this.graficoPizza = new GraficoPizza('graficoPizza-container', 'tooltip-pizza');
        this.tabela = new TabelaResultados();
        
        // Campos obrigatórios
        this.camposObrigatorios = ['valorInicial', 'aporteMensal', 'taxaJuros', 'periodo', 'inflacao'];
        
        // Inicializar a calculadora
        this.inicializar();
    }

    inicializar() {
        console.log('Inicializando a calculadora...');
        
        if (!this.botaoCalcular) {
            console.error('Botão calcular não encontrado!');
            return;
        }

        // Configurar campos monetários
        this.configurarCamposMonetarios();
        
        // Configurar validação dos campos
        this.configurarValidacaoCampos();
        
        // Configurar evento do botão calcular
        this.botaoCalcular.addEventListener('click', (e) => {
            console.log('Botão calcular clicado!');
            e.preventDefault();
            if (this.validarFormulario()) {
                console.log('Formulário válido, iniciando cálculos...');
                this.calcular();
            } else {
                console.log('Formulário inválido!');
            }
        });
        
        // Configurar tabs
        this.configurarTabs();
        
        console.log('Calculadora inicializada com sucesso!');
    }

    configurarValidacaoCampos() {
        const validarCampos = () => {
            let todosPreenchidos = true;
            this.camposObrigatorios.forEach(campo => {
                const elemento = document.getElementById(campo);
                if (!elemento || !elemento.value.trim()) {
                    todosPreenchidos = false;
                }
            });
            this.botaoCalcular.disabled = !todosPreenchidos;
        };

        // Validar campos quando houver mudança
        this.camposObrigatorios.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento) {
                elemento.addEventListener('input', () => {
                    elemento.classList.remove('is-invalid');
                    validarCampos();
                });
                elemento.addEventListener('change', validarCampos);
            }
        });

        // Validação inicial
        validarCampos();
    }

    validarFormulario() {
        let isValido = true;

        this.camposObrigatorios.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (!elemento) return;

            let valor;
            if (campo === 'valorInicial' || campo === 'aporteMensal') {
                valor = extrairValorNumerico(elemento.value);
            } else {
                valor = Number(elemento.value);
            }

            if (valor === null || isNaN(valor) || valor < 0) {
                elemento.classList.add('is-invalid');
                isValido = false;
            } else {
                elemento.classList.remove('is-invalid');
            }
        });

        return isValido;
    }

    configurarCamposMonetarios() {
        const camposMonetarios = ['valorInicial', 'aporteMensal'];
        
        camposMonetarios.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (!elemento) return;
            
            // Eventos de foco e blur
            elemento.addEventListener('focus', function() {
                const valor = extrairValorNumerico(this.value);
                this.value = valor > 0 ? valor : '';
                this.classList.remove('is-invalid');
            });
            
            elemento.addEventListener('blur', function() {
                if (this.value.trim()) {
                    const valor = extrairValorNumerico(this.value) || 0;
                    this.value = formatarMoeda(valor);
                }
            });
        });
    }

    configurarTabs() {
        const tabs = document.querySelectorAll('.nav-link');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remover active de todas as tabs e conteúdos
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => {
                    p.classList.remove('show', 'active');
                });
                
                // Ativar tab e conteúdo clicados
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-bs-target');
                const targetPane = document.querySelector(targetId);
                targetPane.classList.add('show', 'active');
                
                // Atualizar gráficos se necessário
                if (this.dadosCalculados) {
                    const isGraficoTab = ['graficoLinha', 'graficoPizza'].includes(targetId.substring(1));
                    if (isGraficoTab) {
                        this.atualizarGraficos(this.dadosCalculados);
                    }
                }
            });
        });
    }

    calcular() {
        // Esconder a explicação
        const explicacao = document.getElementById('explicacao');
        if (explicacao) explicacao.style.display = 'none';

        // Mostrar a seção de resultados
        const resultado = document.getElementById('resultado');
        if (resultado) resultado.style.display = 'block';

        // Obter dados de entrada
        const dados = this.obterDadosEntrada();
        
        // Realizar cálculos
        const resultados = this.realizarCalculos(dados);
        
        // Atualizar interface com os resultados
        this.atualizarInterface(resultados);
        
        // Armazenar dados calculados para uso posterior
        this.dadosCalculados = resultados;
        
        // Ativar e mostrar a aba do dashboard
        const dashboardTab = document.querySelector('#dashboard-tab');
        if (dashboardTab) {
            dashboardTab.click();
        }
    }

    obterDadosEntrada() {
        const valorInicial = extrairValorNumerico(document.getElementById('valorInicial').value) || 0;
        const aporteMensal = extrairValorNumerico(document.getElementById('aporteMensal').value) || 0;
        const periodo = parseInt(document.getElementById('periodo').value) || 0;
        const taxaJuros = parseFloat(document.getElementById('taxaJuros').value) || 0;
        const inflacao = parseFloat(document.getElementById('inflacao').value) || 0;
        
        // Converter período para meses se necessário
        const periodoMeses = document.getElementById('tipoPeriodo').value === 'anos' 
            ? periodo * 12 
            : periodo;
        
        // Converter taxa para mensal se necessário
        const taxaMensal = document.getElementById('tipoTaxaJuros').value === 'anual'
            ? Math.pow(1 + (taxaJuros / 100), 1/12) - 1
            : taxaJuros / 100;

        return {
            valorInicial,
            aporteMensal,
            periodo: periodoMeses,
            taxaJuros: taxaMensal * 100, // Convertendo de volta para percentual
            taxaInflacao: inflacao
        };
    }

    realizarCalculos(dadosEntrada) {
        const {
            valorInicial,
            aporteMensal,
            periodo,
            taxaJuros,
            taxaInflacao
        } = dadosEntrada;

        console.log('Dados de entrada:', dadosEntrada);

        let montanteAtual = valorInicial;
        let totalInvestido = valorInicial;
        const resultadosMensais = [];

        // Converter inflação anual para mensal
        const inflacaoMensal = Math.pow(1 + taxaInflacao/100, 1/12) - 1;

        // Calcular resultados mês a mês
        for (let mes = 1; mes <= periodo; mes++) {
            // Adicionar aporte mensal (exceto no primeiro mês)
            if (mes > 1) {
                montanteAtual += aporteMensal;
                totalInvestido += aporteMensal;
            }

            // Calcular rendimentos do mês
            const rendimentoMes = montanteAtual * (taxaJuros / 100);
            
            // Calcular rendimento real (descontando inflação)
            const rendimentoReal = montanteAtual * ((taxaJuros/100) - inflacaoMensal);
            
            montanteAtual += rendimentoMes;

            // Registrar resultados do mês
            resultadosMensais.push({
                mes,
                montanteAcumulado: montanteAtual,
                aporteMes: mes === 1 ? valorInicial : aporteMensal,
                rendimentoMes,
                rendimentoReal,
                totalInvestido: totalInvestido,
                percentualJuros: ((montanteAtual - totalInvestido) / totalInvestido) * 100
            });
        }

        // Calcular totais e métricas finais
        const montanteTotal = montanteAtual;
        const jurosTotais = montanteTotal - totalInvestido;
        
        // Calcular rentabilidade nominal e real
        const rentabilidade = (jurosTotais / totalInvestido) * 100;
        const rentabilidadeReal = (((1 + rentabilidade/100) / (1 + taxaInflacao/100)) - 1) * 100;
        
        // Calcular renda passiva
        const rendaPassivaBruta = montanteTotal * (taxaJuros / 100);
        const rendaPassivaLiquida = rendaPassivaBruta / (1 + inflacaoMensal);
        
        // Calcular juros reais totais (descontando inflação)
        const jurosTotaisReais = jurosTotais / (1 + taxaInflacao/100);

        console.log('Resultados calculados:', {
            montanteTotal,
            jurosTotais,
            jurosTotaisReais,
            totalInvestido,
            rentabilidade,
            rentabilidadeReal,
            rendaPassivaBruta,
            rendaPassivaLiquida
        });

        return {
            montanteTotal,
            jurosTotais,
            jurosTotaisReais,
            totalInvestido,
            rentabilidade,
            rentabilidadeReal,
            rendaPassivaBruta,
            rendaPassivaLiquida,
            tempoTotal: periodo,
            taxaJuros,
            taxaInflacao,
            dadosGrafico: resultadosMensais,
            dadosTabela: resultadosMensais
        };
    }

    atualizarInterface(resultados) {
        // Esconder explicação e mostrar resultados
        const explicacao = document.getElementById('explicacao');
        const resultado = document.getElementById('resultado');
        
        if (explicacao) explicacao.style.display = 'none';
        if (resultado) resultado.style.display = 'block';

        // Atualizar campos de resultado no dashboard
        const atualizarCampo = (id, valor, formatador = formatarMoeda) => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.textContent = formatador(valor);
            }
        };

        // Atualizar todos os campos do dashboard
        atualizarCampo('resumo-investido', resultados.totalInvestido);
        atualizarCampo('resumo-montante', resultados.montanteTotal);
        atualizarCampo('resumo-juros-brutos', resultados.jurosTotais);
        atualizarCampo('resumo-juros-reais', resultados.jurosTotaisReais);
        atualizarCampo('resumo-rentabilidade', resultados.rentabilidade, formatarPorcentagem);
        atualizarCampo('resumo-rentabilidade-real', resultados.rentabilidadeReal, formatarPorcentagem);
        atualizarCampo('resumo-renda-passiva-bruta', resultados.rendaPassivaBruta);
        atualizarCampo('resumo-renda-passiva-liquida', resultados.rendaPassivaLiquida);

        try {
            // Atualizar gráficos
            if (this.graficoLinha) {
                this.graficoLinha.atualizar(resultados.dadosGrafico);
            }
            
            if (this.graficoPizza) {
                this.graficoPizza.atualizar(resultados.dadosGrafico);
            }

            // Atualizar tabela de resultados
            if (this.tabela) {
                this.tabela.atualizar(resultados.dadosTabela);
            }
        } catch (erro) {
            console.error('Erro ao atualizar componentes visuais:', erro);
        }
    }

    atualizarGraficos(dados) {
        // Atualizar gráfico de linha
        this.graficoLinha.atualizar(dados);
        
        // Atualizar gráfico de pizza
        this.graficoPizza.atualizar(dados);
    }
} 