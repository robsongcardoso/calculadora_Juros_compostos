import { formatarMoeda, formatarPorcentagem } from '../utils/formatarMoeda.js';
import { GraficoLinha } from './graficos/GraficoLinha.js';
import { GraficoPizza } from './graficos/GraficoPizza.js';
import { TabelaResultados } from './TabelaResultados.js';

export class Calculadora {
    constructor() {
        this.graficoLinha = new GraficoLinha('graficoLinha-container');
        this.graficoPizza = new GraficoPizza('graficoPizza-container');
        this.tabela = new TabelaResultados();
        this.ultimoResultado = null;

        this.configurarTabs();
    }

    configurarTabs() {
        const tabs = document.querySelectorAll('.nav-link');
        tabs.forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                const targetId = tab.getAttribute('data-bs-target');
                if (this.ultimoResultado) {
                    if (targetId === '#graficoLinha') {
                        this.graficoLinha.desenhar(this.ultimoResultado.dadosTabela);
                    } else if (targetId === '#graficoPizza') {
                        this.graficoPizza.desenhar(this.ultimoResultado.dadosPizza);
                    }
                }
            });
        });
    }

    calcular(params) {
        const {
            valorInicial = 0,
            aporteMensal = 0,
            periodo = 1,
            tipoPeriodo = 'anos',
            taxaJuros = 0,
            tipoTaxaJuros = 'anual',
            inflacao = 0,
            tipoIR = 'regressivo'
        } = params;

        // Converter período para meses
        const totalMeses = tipoPeriodo === 'anos' ? Math.round(periodo * 12) : Math.round(periodo);

        // Converter taxa de juros para mensal equivalente composta
        const taxaJurosDecimal = taxaJuros / 100;
        const iMensal = tipoTaxaJuros === 'anual'
            ? Math.pow(1 + taxaJurosDecimal, 1 / 12) - 1
            : taxaJurosDecimal;

        // Converter inflação anual para mensal equivalente composta
        const taxaInflacaoDecimal = inflacao / 100;
        const inflacaoMensal = Math.pow(1 + taxaInflacaoDecimal, 1 / 12) - 1;

        // Taxa real mensal pela Equação de Fisher: (1 + i) / (1 + inflação) - 1
        const taxaRealMensal = (1 + iMensal) / (1 + inflacaoMensal) - 1;

        // Determina alíquota de IR
        let aliquotaIR = 0;
        if (tipoIR === 'regressivo') {
            if (totalMeses <= 6) aliquotaIR = 0.225;
            else if (totalMeses <= 12) aliquotaIR = 0.20;
            else if (totalMeses <= 24) aliquotaIR = 0.175;
            else aliquotaIR = 0.15;
        } else if (tipoIR === 'fixo_15') {
            aliquotaIR = 0.15;
        } else if (tipoIR === 'isento') {
            aliquotaIR = 0;
        }

        let montante = valorInicial;
        let totalInvestido = valorInicial;
        const dadosTabela = [];

        for (let mes = 1; mes <= totalMeses; mes++) {
            // Aporte mensal adicionado no início de cada mês
            const aporteDesteMes = aporteMensal;
            totalInvestido += aporteDesteMes;
            const baseRendimento = montante + aporteDesteMes;

            // Rendimento do mês
            const rendimentoMes = baseRendimento * iMensal;
            montante = baseRendimento + rendimentoMes;

            // Rendimento real do mês (ganho de poder de compra real)
            const rendimentoReal = baseRendimento * taxaRealMensal;

            // Fator de inflação acumulada até o mês
            const fatorInflacaoMes = Math.pow(1 + inflacaoMensal, mes);
            const patrimonioRealAjustado = montante / fatorInflacaoMes;

            dadosTabela.push({
                mes,
                aporteMes: aporteDesteMes,
                totalInvestido,
                rendimentoMes,
                rendimentoReal,
                montanteAcumulado: montante,
                patrimonioRealAjustado
            });
        }

        const montanteTotal = montante;
        const totalAportes = totalInvestido - valorInicial;
        const jurosTotais = Math.max(0, montanteTotal - totalInvestido);

        // Imposto de Renda
        const impostoRenda = jurosTotais * aliquotaIR;
        const montanteLiquido = montanteTotal - impostoRenda;
        const jurosLiquidos = jurosTotais - impostoRenda;

        // Fator de inflação total no período
        const fatorInflacaoTotal = Math.pow(1 + inflacaoMensal, totalMeses);
        const montanteAjustadoInflacao = montanteTotal / fatorInflacaoTotal;

        // Rentabilidades acumuladas
        const rentabilidadeNominal = totalInvestido > 0 ? (jurosTotais / totalInvestido) * 100 : 0;
        const rentabilidadeReal = totalInvestido > 0
            ? (((1 + rentabilidadeNominal / 100) / fatorInflacaoTotal) - 1) * 100
            : 0;

        // Estimativa de renda passiva mensal
        const rendaPassivaBruta = montanteTotal * iMensal;
        const rendaPassivaLiquida = montanteLiquido * Math.max(0, taxaRealMensal);

        const dadosPizza = {
            principal: valorInicial,
            aportes: totalAportes,
            juros: jurosTotais
        };

        const resultado = {
            valorInicial,
            totalAportes,
            totalInvestido,
            montanteTotal,
            montanteLiquido,
            jurosTotais,
            jurosLiquidos,
            impostoRenda,
            aliquotaIR,
            rentabilidadeNominal,
            rentabilidadeReal,
            montanteAjustadoInflacao,
            rendaPassivaBruta,
            rendaPassivaLiquida,
            totalMeses,
            dadosTabela,
            dadosPizza
        };

        this.ultimoResultado = resultado;
        return resultado;
    }

    atualizarInterface(resultados) {
        this.ultimoResultado = resultados;

        // Exibe o card de resultados e esconde explicação
        const explicacao = document.getElementById('explicacao');
        const resultadoContainer = document.getElementById('resultado');
        if (explicacao) explicacao.style.display = 'none';
        if (resultadoContainer) resultadoContainer.style.display = 'block';

        // Atualiza textos
        const setTexto = (id, valor) => {
            const el = document.getElementById(id);
            if (el) el.textContent = valor;
        };

        setTexto('resumo-investido', formatarMoeda(resultados.totalInvestido));
        setTexto('resumo-montante', formatarMoeda(resultados.montanteTotal));
        setTexto('resumo-montante-liquido', formatarMoeda(resultados.montanteLiquido));
        setTexto('resumo-juros-brutos', formatarMoeda(resultados.jurosTotais));
        setTexto('resumo-imposto-renda', `- ${formatarMoeda(resultados.impostoRenda)} (${(resultados.aliquotaIR * 100).toFixed(1)}%)`);
        setTexto('resumo-rentabilidade', formatarPorcentagem(resultados.rentabilidadeNominal));
        setTexto('resumo-rentabilidade-real', formatarPorcentagem(resultados.rentabilidadeReal));
        setTexto('resumo-renda-passiva-bruta', formatarMoeda(resultados.rendaPassivaBruta));
        setTexto('resumo-renda-passiva-liquida', formatarMoeda(resultados.rendaPassivaLiquida));
        setTexto('resumo-poder-compra', formatarMoeda(resultados.montanteAjustadoInflacao));

        // Atualiza componentes visuais
        this.graficoLinha.desenhar(resultados.dadosTabela);
        this.graficoPizza.desenhar(resultados.dadosPizza);
        this.tabela.atualizar(resultados.dadosTabela);
    }
}
