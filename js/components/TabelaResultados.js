import { formatarMoeda } from '../utils/formatarMoeda.js';

export class TabelaResultados {
    constructor() {
        this.tabela = document.getElementById('tabela');
        this.tbody = this.tabela.querySelector('tbody');
        this.configurarPaginacao();
    }

    configurarPaginacao() {
        this.itensPorPagina = 12;
        this.paginaAtual = 1;
        this.totalPaginas = 1;
        this.dados = [];

        // Configurar eventos dos botões de paginação
        document.getElementById('btn-primeira-pagina').addEventListener('click', () => {
            this.paginaAtual = 1;
            this.renderizarTabela();
            this.atualizarPaginacao();
        });

        document.getElementById('btn-pagina-anterior').addEventListener('click', () => {
            if (this.paginaAtual > 1) {
                this.paginaAtual--;
                this.renderizarTabela();
                this.atualizarPaginacao();
            }
        });

        document.getElementById('btn-proxima-pagina').addEventListener('click', () => {
            if (this.paginaAtual < this.totalPaginas) {
                this.paginaAtual++;
                this.renderizarTabela();
                this.atualizarPaginacao();
            }
        });

        document.getElementById('btn-ultima-pagina').addEventListener('click', () => {
            this.paginaAtual = this.totalPaginas;
            this.renderizarTabela();
            this.atualizarPaginacao();
        });
    }

    atualizar(dados) {
        console.log('Atualizando tabela com dados:', dados);
        this.dados = dados;
        this.totalPaginas = Math.ceil(dados.length / this.itensPorPagina);
        this.paginaAtual = 1;
        this.renderizarTabela();
        this.atualizarPaginacao();
    }

    renderizarTabela() {
        this.tbody.innerHTML = '';
        const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        const dadosPagina = this.dados.slice(inicio, fim);

        dadosPagina.forEach(dado => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${dado.mes}º mês</td>
                <td>${formatarMoeda(dado.aporteMes)}</td>
                <td>${formatarMoeda(dado.rendimentoMes)}</td>
                <td>${formatarMoeda(dado.rendimentoAcumulado)}</td>
                <td>${formatarMoeda(dado.montanteAcumulado)}</td>
                <td>${formatarMoeda(dado.totalInvestido)}</td>
            `;
            this.tbody.appendChild(tr);
        });

        // Atualizar informações de paginação
        document.getElementById('inicio-registros').textContent = inicio + 1;
        document.getElementById('fim-registros').textContent = Math.min(fim, this.dados.length);
        document.getElementById('total-registros').textContent = this.dados.length;
    }

    atualizarPaginacao() {
        // Atualizar estado dos botões
        document.getElementById('btn-primeira-pagina').disabled = this.paginaAtual === 1;
        document.getElementById('btn-pagina-anterior').disabled = this.paginaAtual === 1;
        document.getElementById('btn-proxima-pagina').disabled = this.paginaAtual === this.totalPaginas;
        document.getElementById('btn-ultima-pagina').disabled = this.paginaAtual === this.totalPaginas;
        
        // Atualizar número da página atual
        document.getElementById('btn-pagina-atual').textContent = this.paginaAtual;
    }
} 