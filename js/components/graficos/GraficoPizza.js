import { formatarMoeda } from '../../utils/formatarMoeda.js';

export class GraficoPizza {
    constructor(containerId, tooltipId) {
        this.containerId = containerId;
        this.tooltipId = tooltipId;
    }

    desenhar(dados) {
        console.log('Dados recebidos para o gráfico de pizza:', dados);
        
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container do gráfico não encontrado:', this.containerId);
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth || 400;
        canvas.height = container.offsetHeight || 400;
        
        container.innerHTML = '';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const tooltip = document.getElementById(this.tooltipId);
        
        // Configurações do gráfico
        const centroX = canvas.width * 0.6; // Movido mais para a direita para dar espaço à legenda
        const centroY = canvas.height / 2;
        const raio = Math.max(50, Math.min(centroX * 0.8, centroY) - 80); // Ajustado para o novo centro
        
        // Calcular o total para percentuais (usar valores absolutos)
        const total = Math.abs(dados.principal || 0) + 
                     Math.abs(dados.aportes || 0) + 
                     Math.abs(dados.juros || 0);
        
        if (total <= 0) {
            // Se não houver dados válidos, mostrar mensagem
            ctx.fillStyle = '#6c757d';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Sem dados para exibir', centroX, centroY);
            return;
        }
        
        // Definir as fatias e cores
        const fatias = [
            { valor: Math.abs(dados.principal || 0), cor: '#0d6efd', nome: 'Capital Inicial' },
            { valor: Math.abs(dados.aportes || 0), cor: '#198754', nome: 'Aportes Mensais' },
            { valor: Math.abs(dados.juros || 0), cor: '#ffc107', nome: 'Juros Acumulados' }
        ].filter(fatia => fatia.valor > 0);
        
        // Título do gráfico
        ctx.fillStyle = '#212529';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Composição do Investimento', centroX, 25);
        
        // Desenhar o gráfico de pizza
        let anguloInicial = -Math.PI / 2; // Começar do topo
        
        fatias.forEach((fatia) => {
            const angulo = (fatia.valor / total) * 2 * Math.PI;
            
            // Desenhar a fatia
            ctx.beginPath();
            ctx.moveTo(centroX, centroY);
            ctx.arc(centroX, centroY, raio, anguloInicial, anguloInicial + angulo);
            ctx.closePath();
            
            // Preencher com gradiente
            const gradiente = ctx.createRadialGradient(
                centroX, centroY, 0,
                centroX, centroY, raio
            );
            gradiente.addColorStop(0, fatia.cor);
            gradiente.addColorStop(1, this.ajustarCor(fatia.cor, -20));
            ctx.fillStyle = gradiente;
            ctx.fill();
            
            // Adicionar borda
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Adicionar rótulo se a fatia for grande o suficiente
            const percentual = (fatia.valor / total * 100).toFixed(1);
            if (angulo > 0.2) {
                const anguloMedio = anguloInicial + angulo / 2;
                const distancia = raio * 0.7;
                const posX = centroX + Math.cos(anguloMedio) * distancia;
                const posY = centroY + Math.sin(anguloMedio) * distancia;
                
                ctx.fillStyle = 'white';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(percentual + '%', posX, posY);
            }
            
            anguloInicial += angulo;
        });
        
        // Adicionar legenda
        this.desenharLegenda(ctx, fatias, total, canvas.width - 20, canvas.height / 2);
        
        // Configurar tooltip
        this.configurarTooltip(canvas, ctx, fatias, total, centroX, centroY, raio, tooltip);
    }
    
    ajustarCor(cor, ajuste) {
        // Converter cor hex para RGB
        const r = parseInt(cor.slice(1,3), 16);
        const g = parseInt(cor.slice(3,5), 16);
        const b = parseInt(cor.slice(5,7), 16);
        
        // Ajustar valores
        const novoR = Math.max(0, Math.min(255, r + ajuste));
        const novoG = Math.max(0, Math.min(255, g + ajuste));
        const novoB = Math.max(0, Math.min(255, b + ajuste));
        
        // Converter de volta para hex
        return `#${novoR.toString(16).padStart(2,'0')}${novoG.toString(16).padStart(2,'0')}${novoB.toString(16).padStart(2,'0')}`;
    }
    
    desenharLegenda(ctx, fatias, total, larguraMaxima, centroY) {
        const legendaX = 20;
        let legendaY = centroY - ((fatias.length * 30) / 2); // Reduzido o espaço vertical pois teremos menos texto
        const alturaLinha = 30; // Ajustado o espaçamento entre linhas
        const larguraLegenda = 200; // Reduzida a largura da legenda
        
        // Fundo da legenda com mais padding
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        const paddingLegenda = 15;
        ctx.fillRect(
            legendaX - paddingLegenda,
            legendaY - paddingLegenda,
            larguraLegenda + (paddingLegenda * 2),
            (fatias.length * alturaLinha) + (paddingLegenda * 2)
        );
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            legendaX - paddingLegenda,
            legendaY - paddingLegenda,
            larguraLegenda + (paddingLegenda * 2),
            (fatias.length * alturaLinha) + (paddingLegenda * 2)
        );
        
        fatias.forEach((fatia) => {
            // Quadrado colorido
            ctx.fillStyle = fatia.cor;
            const tamanhoQuadrado = 16;
            ctx.fillRect(legendaX, legendaY + 7, tamanhoQuadrado, tamanhoQuadrado);
            
            // Texto com fonte maior e melhor espaçamento
            ctx.fillStyle = '#212529';
            const espacoAposQuadrado = 30;
            
            // Nome do item e percentual
            const percentual = (fatia.valor / total * 100).toFixed(1);
            ctx.font = '13px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(
                `${fatia.nome} (${percentual}%)`,
                legendaX + espacoAposQuadrado,
                legendaY + 20
            );
            
            legendaY += alturaLinha;
        });
    }
    
    configurarTooltip(canvas, ctx, fatias, total, centroX, centroY, raio, tooltip) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const dx = mouseX - centroX;
            const dy = mouseY - centroY;
            const distancia = Math.sqrt(dx * dx + dy * dy);
            
            if (distancia <= raio) {
                let angulo = Math.atan2(dy, dx);
                if (angulo < -Math.PI / 2) angulo += 2 * Math.PI;
                
                let anguloAcumulado = -Math.PI / 2;
                let fatiaEncontrada = null;
                
                for (const fatia of fatias) {
                    const anguloFatia = (fatia.valor / total) * 2 * Math.PI;
                    if (angulo >= anguloAcumulado && angulo <= anguloAcumulado + anguloFatia) {
                        fatiaEncontrada = fatia;
                        break;
                    }
                    anguloAcumulado += anguloFatia;
                }
                
                if (fatiaEncontrada) {
                    const percentual = (fatiaEncontrada.valor / total * 100).toFixed(1);
                    tooltip.style.display = 'block';
                    tooltip.style.left = (e.clientX + 15) + 'px';
                    tooltip.style.top = (e.clientY - 40) + 'px';
                    tooltip.innerHTML = `
                        <div style="font-weight: bold; margin-bottom: 4px;">${fatiaEncontrada.nome}</div>
                        <div style="font-size: 14px;">Valor: ${formatarMoeda(fatiaEncontrada.valor)}</div>
                        <div style="font-size: 14px;">Percentual: ${percentual}%</div>
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