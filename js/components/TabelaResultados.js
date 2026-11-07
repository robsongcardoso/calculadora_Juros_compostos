import { formatarMoeda } from '../utils/formatarMoeda.js';

export class TabelaResultados {
    constructor() {
        this.config = {
            elementoId: 'tabela',
            itensPorPagina: 12
        };

        this.estado = {
            paginaAtual: 1,
            totalPaginas: 1,
            dados: []
        };

        this.inicializarElementos();
        this.inicializarEventos();
    }

    inicializarElementos() {
        const tabela = document.getElementById(this.config.elementoId);
        if (!tabela) return;

        this.elementos = {
            tabela: tabela,
            tbody: tabela.querySelector('tbody'),
            paginacao: {
                primeira: document.getElementById('btn-primeira-pagina'),
                anterior: document.getElementById('btn-pagina-anterior'),
                atual: document.getElementById('btn-pagina-atual'),
                proxima: document.getElementById('btn-proxima-pagina'),
                ultima: document.getElementById('btn-ultima-pagina')
            },
            info: {
                inicio: document.getElementById('inicio-registros'),
                fim: document.getElementById('fim-registros'),
                total: document.getElementById('total-registros')
            }
        };

        if (!this.elementos.tbody) {
            this.elementos.tbody = document.createElement('tbody');
            this.elementos.tabela.appendChild(this.elementos.tbody);
        }
    }

    inicializarEventos() {
        if (!this.elementos || !this.elementos.paginacao) return;

        const { primeira, anterior, proxima, ultima } = this.elementos.paginacao;

        if (primeira) primeira.addEventListener('click', () => this.irParaPagina(1));
        if (anterior) anterior.addEventListener('click', () => this.irParaPagina(this.estado.paginaAtual - 1));
        if (proxima) proxima.addEventListener('click', () => this.irParaPagina(this.estado.paginaAtual + 1));
        if (ultima) ultima.addEventListener('click', () => this.irParaPagina(this.estado.totalPaginas));
    }

    atualizar(dados) {
        if (!Array.isArray(dados) || dados.length === 0) {
            this.estado.dados = [];
            this.estado.totalPaginas = 1;
            this.estado.paginaAtual = 1;
            this.renderizar();
            return;
        }

        this.estado.dados = dados;
        this.estado.totalPaginas = Math.ceil(dados.length / this.config.itensPorPagina) || 1;
        this.estado.paginaAtual = 1;
        this.renderizar();
    }

    irParaPagina(pagina) {
        if (pagina < 1 || pagina > this.estado.totalPaginas) return;
        this.estado.paginaAtual = pagina;
        this.renderizar();
    }

    renderizar() {
        if (!this.elementos || !this.elementos.tbody) {
            this.inicializarElementos();
            if (!this.elementos || !this.elementos.tbody) return;
        }

        const { dados, paginaAtual, totalPaginas } = this.estado;
        const itensPorPagina = this.config.itensPorPagina;

        this.elementos.tbody.innerHTML = '';

        if (dados.length === 0) {
            this.elementos.tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">Nenhum dado calculado</td></tr>`;
            this.atualizarControlesPaginacao(0, 0, 0);
            return;
        }

        const inicioIndex = (paginaAtual - 1) * itensPorPagina;
        const fimIndex = Math.min(inicioIndex + itensPorPagina, dados.length);
        const itensPagina = dados.slice(inicioIndex, fimIndex);

        const fragment = document.createDocumentFragment();

        itensPagina.forEach(item => {
            const tr = document.createElement('tr');
            const isAno = item.mes % 12 === 0;
            if (isAno) {
                tr.classList.add('table-primary', 'fw-semibold');
            }

            tr.innerHTML = `
                <td>${item.mes}${isAno ? ` <span class="badge bg-primary">Ano ${item.mes / 12}</span>` : ''}</td>
                <td>${formatarMoeda(item.aporteMes)}</td>
                <td>${formatarMoeda(item.totalInvestido)}</td>
                <td class="text-success">+ ${formatarMoeda(item.rendimentoMes)}</td>
                <td class="${item.rendimentoReal >= 0 ? 'text-primary' : 'text-danger'}">${item.rendimentoReal >= 0 ? '+' : ''} ${formatarMoeda(item.rendimentoReal)}</td>
                <td class="fw-bold">${formatarMoeda(item.montanteAcumulado)}</td>
                <td class="text-secondary">${formatarMoeda(item.patrimonioRealAjustado)}</td>
            `;
            fragment.appendChild(tr);
        });

        this.elementos.tbody.appendChild(fragment);
        this.atualizarControlesPaginacao(inicioIndex + 1, fimIndex, dados.length);
    }

    atualizarControlesPaginacao(inicio, fim, total) {
        const { paginacao, info } = this.elementos;

        if (info) {
            if (info.inicio) info.inicio.textContent = inicio;
            if (info.fim) info.fim.textContent = fim;
            if (info.total) info.total.textContent = total;
        }

        if (paginacao) {
            const { paginaAtual, totalPaginas } = this.estado;
            if (paginacao.atual) paginacao.atual.textContent = paginaAtual;
            if (paginacao.primeira) paginacao.primeira.disabled = paginaAtual <= 1;
            if (paginacao.anterior) paginacao.anterior.disabled = paginaAtual <= 1;
            if (paginacao.proxima) paginacao.proxima.disabled = paginaAtual >= totalPaginas;
            if (paginacao.ultima) paginacao.ultima.disabled = paginaAtual >= totalPaginas;
        }
    }
}
