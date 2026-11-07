import { formatarMoeda } from '../../utils/formatarMoeda.js';

export class GraficoLinha {
    constructor(containerId) {
        this.containerId = containerId;
        this.chart = null;
    }

    desenhar(dados) {
        if (!dados || !dados.length) {
            console.warn('Sem dados para renderizar no gráfico de linha');
            return;
        }

        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container do gráfico não encontrado:', this.containerId);
            return;
        }

        // Destrói instância anterior se existir
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);

        const labels = dados.map(d => {
            if (d.mes % 12 === 0) {
                return `Ano ${d.mes / 12} (Mês ${d.mes})`;
            }
            return `Mês ${d.mes}`;
        });

        const totalInvestido = dados.map(d => d.totalInvestido);
        const montanteTotal = dados.map(d => d.montanteAcumulado);
        const montanteReal = dados.map(d => d.patrimonioRealAjustado !== undefined ? d.patrimonioRealAjustado : d.montanteAcumulado);

        // Se Chart.js estiver disponível globalmente
        if (typeof Chart === 'undefined') {
            console.error('Chart.js não carregado');
            container.innerHTML = '<div class="alert alert-warning text-center">Biblioteca de gráficos indisponível.</div>';
            return;
        }

        this.chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Total Acumulado (Bruto)',
                        data: montanteTotal,
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13, 110, 253, 0.12)',
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.25,
                        pointRadius: dados.length > 48 ? 0 : 3,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Total Investido (Aportes)',
                        data: totalInvestido,
                        borderColor: '#198754',
                        backgroundColor: 'rgba(25, 135, 84, 0.05)',
                        borderWidth: 2,
                        borderDash: [5, 4],
                        fill: false,
                        tension: 0.1,
                        pointRadius: dados.length > 48 ? 0 : 2,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'Poder de Compra Real (Após Inflação)',
                        data: montanteReal,
                        borderColor: '#e9a800',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.25,
                        pointRadius: dados.length > 48 ? 0 : 2,
                        pointHoverRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: "'Segoe UI', sans-serif", size: 12, weight: '500' },
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 37, 41, 0.95)',
                        padding: 12,
                        titleFont: { size: 13, weight: 'bold' },
                        bodyFont: { size: 12 },
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.dataset.label}: ${formatarMoeda(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return formatarMoeda(value);
                            },
                            font: { size: 11 }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 12,
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

    atualizar(dados) {
        this.desenhar(dados);
    }
}
