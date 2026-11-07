import { Calculadora } from './components/Calculadora.js';
import { extrairValorNumerico } from './utils/formatarMoeda.js';

function inicializarAplicacao() {
    try {
        const calculadora = new Calculadora();
        window.calculadora = calculadora;

        // Configuração do IMask para campos monetários (permite 0 ou superior)
        const mascaras = {};
        const configMascaraMonetaria = {
            mask: 'R$ num',
            blocks: {
                num: {
                    mask: Number,
                    thousandsSeparator: '.',
                    radix: ',',
                    scale: 2,
                    padFractionalZeros: true,
                    normalizeZeros: true,
                    min: 0,
                    max: 999999999.99
                }
            }
        };

        ['valorInicial', 'aporteMensal'].forEach(id => {
            const el = document.getElementById(id);
            if (el && typeof IMask !== 'undefined') {
                mascaras[id] = IMask(el, configMascaraMonetaria);
                el.addEventListener('input', () => el.classList.remove('is-invalid'));
            }
        });

        const campoPeriodo = document.getElementById('periodo');
        const campoTipoPeriodo = document.getElementById('tipoPeriodo');
        const campoTaxaJuros = document.getElementById('taxaJuros');
        const campoTipoTaxa = document.getElementById('tipoTaxaJuros');
        const campoInflacao = document.getElementById('inflacao');
        const campoTipoIR = document.getElementById('tipoIR');

        [campoPeriodo, campoTaxaJuros, campoInflacao].forEach(el => {
            if (el) el.addEventListener('input', () => el.classList.remove('is-invalid'));
        });

        function validarCampos() {
            let valido = true;

            const valorInicial = mascaras['valorInicial'] 
                ? parseFloat(mascaras['valorInicial'].unmaskedValue) || 0 
                : extrairValorNumerico(document.getElementById('valorInicial').value);

            const aporteMensal = mascaras['aporteMensal'] 
                ? parseFloat(mascaras['aporteMensal'].unmaskedValue) || 0 
                : extrairValorNumerico(document.getElementById('aporteMensal').value);

            const periodo = parseInt(campoPeriodo.value, 10);
            const tipoPeriodo = campoTipoPeriodo.value;
            const taxaJuros = parseFloat(campoTaxaJuros.value);
            const inflacao = parseFloat(campoInflacao.value);

            // Validação de investimento mínimo (pelo menos um deve ser maior que zero)
            if (valorInicial < 0 || isNaN(valorInicial)) {
                document.getElementById('valorInicial').classList.add('is-invalid');
                valido = false;
            }

            if (aporteMensal < 0 || isNaN(aporteMensal)) {
                document.getElementById('aporteMensal').classList.add('is-invalid');
                valido = false;
            }

            if (valorInicial === 0 && aporteMensal === 0) {
                document.getElementById('valorInicial').classList.add('is-invalid');
                document.getElementById('aporteMensal').classList.add('is-invalid');
                valido = false;
            }

            // Validação do período
            if (!periodo || periodo <= 0 || isNaN(periodo)) {
                campoPeriodo.classList.add('is-invalid');
                valido = false;
            } else if (tipoPeriodo === 'anos' && periodo > 120) {
                campoPeriodo.classList.add('is-invalid');
                valido = false;
            } else if (tipoPeriodo === 'meses' && periodo > 1440) {
                campoPeriodo.classList.add('is-invalid');
                valido = false;
            }

            // Validação da taxa de juros (permite qualquer taxa numérica)
            if (isNaN(taxaJuros)) {
                campoTaxaJuros.classList.add('is-invalid');
                valido = false;
            }

            // Validação da inflação (permite zero ou maior)
            if (isNaN(inflacao) || inflacao < 0) {
                campoInflacao.classList.add('is-invalid');
                valido = false;
            }

            return valido;
        }

        function executarCalculo() {
            if (!validarCampos()) return;

            const valorInicial = mascaras['valorInicial'] 
                ? parseFloat(mascaras['valorInicial'].unmaskedValue) || 0 
                : extrairValorNumerico(document.getElementById('valorInicial').value);

            const aporteMensal = mascaras['aporteMensal'] 
                ? parseFloat(mascaras['aporteMensal'].unmaskedValue) || 0 
                : extrairValorNumerico(document.getElementById('aporteMensal').value);

            const periodo = parseInt(campoPeriodo.value, 10);
            const tipoPeriodo = campoTipoPeriodo.value;
            const taxaJuros = parseFloat(campoTaxaJuros.value) || 0;
            const tipoTaxaJuros = campoTipoTaxa.value;
            const inflacao = parseFloat(campoInflacao.value) || 0;
            const tipoIR = campoTipoIR.value;

            const resultados = calculadora.calcular({
                valorInicial,
                aporteMensal,
                periodo,
                tipoPeriodo,
                taxaJuros,
                tipoTaxaJuros,
                inflacao,
                tipoIR
            });

            calculadora.atualizarInterface(resultados);
        }

        function preencherExemplo() {
            if (mascaras['valorInicial']) mascaras['valorInicial'].value = '500000'; // R$ 5.000,00
            if (mascaras['aporteMensal']) mascaras['aporteMensal'].value = '50000';  // R$ 500,00

            campoTaxaJuros.value = '10.5';
            campoTipoTaxa.value = 'anual';
            campoInflacao.value = '4.0';
            campoPeriodo.value = '5';
            campoTipoPeriodo.value = 'anos';
            campoTipoIR.value = 'regressivo';

            ['valorInicial', 'aporteMensal', 'periodo', 'taxaJuros', 'inflacao'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('is-invalid');
            });

            executarCalculo();
        }

        function limparCampos() {
            if (mascaras['valorInicial']) mascaras['valorInicial'].value = '';
            if (mascaras['aporteMensal']) mascaras['aporteMensal'].value = '';

            campoTaxaJuros.value = '';
            campoInflacao.value = '';
            campoPeriodo.value = '';

            ['valorInicial', 'aporteMensal', 'periodo', 'taxaJuros', 'inflacao'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('is-invalid');
            });

            document.getElementById('explicacao').style.display = 'block';
            document.getElementById('resultado').style.display = 'none';
        }

        // Eventos dos botões
        const btnCalcular = document.getElementById('calcular');
        const btnExemplo = document.getElementById('btn-exemplo');
        const btnLimpar = document.getElementById('btn-limpar');

        if (btnCalcular) btnCalcular.addEventListener('click', executarCalculo);
        if (btnExemplo) btnExemplo.addEventListener('click', preencherExemplo);
        if (btnLimpar) btnLimpar.addEventListener('click', limparCampos);

        // Preenche com exemplo e calcula na inicialização para experiência imediata
        preencherExemplo();

    } catch (err) {
        console.error('Falha ao inicializar calculadora:', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacao);
} else {
    inicializarAplicacao();
}
