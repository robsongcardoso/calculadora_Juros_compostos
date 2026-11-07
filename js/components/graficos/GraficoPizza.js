import { formatarMoeda, formatarPorcentagem } from '../../utils/formatarMoeda.js';

export class GraficoPizza {
    constructor(containerId) {
        this.containerId = containerId;
        this.chart = null;
    }

    desenhar(dados) {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container do gráfico de pizza não encontrado:', this.containerId);
            return;
        }

        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);

        const principal = Math.max(0, dados.principal || 0);
        const aportes = Math.max(0, dados.aportes || 0);
        const juros = Math.max(0, dados.juros || 0);

        const total = principal + aportes + juros;
        if (total <= 0) {
            container.innerHTML = '<div class="alert alert-info text-center m-4">Sem dados para exibir na distribuição.</div>';
            return;
        }

        const labels = ['Capital Inicial', 'Aportes Mensais', 'Juros Acumulados'];
        const data = [principal, aportes, juros];
        const cores = ['#0d6efd', '#198754', '#ffc107'];
        const hoverCores = ['#0b5ed7', '#157347', '#ffca2c'];

        if (typeof Chart === 'undefined') {
            console.error('Chart.js não carregado');
            return;
        }

        this.chart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: cores,
                        hoverBackgroundColor: hoverCores,
                        borderWidth: 2,
                        borderColor: '#ffffff',
                        hoverOffset: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: "'Segoe UI', sans-serif", size: 12, weight: '500' },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 37, 41, 0.95)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const valor = context.parsed;
                                const pct = (valor / total) * 100;
                                return ` ${context.label}: ${formatarMoeda(valor)} (${formatarPorcentagem(pct)})`;
                            }
                        }
                    }
                },
                cutout: '62%'
            }
        });
    }

    atualizar(dados) {
        this.desenhar(dados);
    }
}
