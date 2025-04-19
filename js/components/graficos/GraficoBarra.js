import { formatarMoeda } from '../../utils/formatarMoeda.js';

export class GraficoBarra {
    constructor(containerId, tooltipId) {
        this.containerId = containerId;
        this.tooltipId = tooltipId;
    }

    atualizar(dados) {
        console.log('Atualizando gráfico de barras com dados:', dados);
        this.desenhar(dados);
    }

    desenhar(dados) {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container do gráfico não encontrado:', this.containerId);
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        container.innerHTML = '';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const tooltip = document.getElementById(this.tooltipId);
        
        // Encontrar valor máximo para escala
        const maxValor = Math.max(...dados.map(d => d.montanteAcumulado));
        const escalaY = (canvas.height - 60) / maxValor;
        
        // Configurar estilo
        ctx.strokeStyle = '#0d6efd';
        ctx.lineWidth = 2;
        
        // Desenhar eixos
        ctx.beginPath();
        ctx.moveTo(50, 10);
        ctx.lineTo(50, canvas.height - 30);
        ctx.lineTo(canvas.width - 20, canvas.height - 30);
        ctx.stroke();
        
        // Desenhar linhas de grade e valores do eixo Y
        const numLinhas = 5;
        for (let i = 0; i <= numLinhas; i++) {
            const y = canvas.height - 30 - (i * (canvas.height - 40) / numLinhas);
            const valor = (maxValor * i / numLinhas);
            
            ctx.beginPath();
            ctx.strokeStyle = '#e9ecef';
            ctx.moveTo(50, y);
            ctx.lineTo(canvas.width - 20, y);
            ctx.stroke();
            
            ctx.fillStyle = '#6c757d';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(formatarMoeda(valor), 45, y + 4);
        }
        
        // Desenhar barras
        const larguraBarra = Math.min(40, (canvas.width - 70) / dados.length - 10);
        const escalaX = (canvas.width - 70) / (dados.length);
        
        dados.forEach((dado, index) => {
            const x = 50 + (index * escalaX);
            const altura = dado.montanteAcumulado * escalaY;
            const y = canvas.height - 30 - altura;
            
            // Criar gradiente para a barra
            const gradiente = ctx.createLinearGradient(x, y, x, canvas.height - 30);
            gradiente.addColorStop(0, '#0d6efd');
            gradiente.addColorStop(1, '#0dcaf0');
            
            // Desenhar barra
            ctx.fillStyle = gradiente;
            ctx.fillRect(x, y, larguraBarra, altura);
            
            // Desenhar borda da barra
            ctx.strokeStyle = '#0d6efd';
            ctx.strokeRect(x, y, larguraBarra, altura);
        });
        
        // Adicionar eventos para tooltip
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (x > 50 && x < canvas.width - 20 && y > 10 && y < canvas.height - 30) {
                const indice = Math.floor((x - 50) / escalaX);
                if (indice >= 0 && indice < dados.length) {
                    const dado = dados[indice];
                    tooltip.style.display = 'block';
                    tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
                    tooltip.style.top = (e.clientY - rect.top - 30) + 'px';
                    tooltip.innerHTML = `
                        <div class="fw-bold">${dado.mes}º mês</div>
                        <div>Montante: ${formatarMoeda(dado.montanteAcumulado)}</div>
                        <div>Rendimento: ${formatarMoeda(dado.rendimentoMes)}</div>
                        <div>Total Investido: ${formatarMoeda(dado.totalInvestido)}</div>
                    `;
                }
            } else {
                tooltip.style.display = 'none';
            }
        });
        
        canvas.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });
    }
} 