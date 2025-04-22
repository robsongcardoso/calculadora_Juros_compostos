export class TabelaResultados {
    constructor() {
        // Configurações da tabela
        this.config = {
            elementoId: 'tabela',
            itensPorPagina: 12,
            colunas: [
                { 
                    id: 'mes',
                    titulo: 'Mês'
                },
                { 
                    id: 'aporteMensal',
                    titulo: 'Aporte Mensal'
                },
                { 
                    id: 'aportesAcumulados',
                    titulo: 'Aportes Acumulados'
                },
                { 
                    id: 'rendimentoMensal',
                    titulo: 'Rendimento Mensal'
                },
                { 
                    id: 'rendimentoMensalInflacao',
                    titulo: 'Rendimento Mensal - Inflação'
                },
                { 
                    id: 'patrimonioAcumuladoJuros',
                    titulo: 'Patrimônio Acumulado + Juros'
                },
                { 
                    id: 'patrimonioAcumuladoInflacao',
                    titulo: 'Patrimônio Acumulado - Inflação'
                }
            ]
        };

        // Estado da tabela
        this.estado = {
            paginaAtual: 1,
            totalPaginas: 1,
            dados: [],
            taxaInflacaoMensal: 0
        };

        // Inicializa elementos do DOM de forma segura
        this.inicializarElementos();
        this.inicializarEventos();
        this.logEstado('Tabela inicializada');
    }

    inicializarElementos() {
        // Aguarda o DOM estar pronto
        const inicializacao = () => {
            const tabela = document.getElementById(this.config.elementoId);
            if (!tabela) {
                console.error(`Elemento com ID ${this.config.elementoId} não encontrado`);
                return;
            }

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

            // Verifica se tbody existe, se não, cria
            if (!this.elementos.tbody) {
                this.elementos.tbody = document.createElement('tbody');
                this.elementos.tabela.appendChild(this.elementos.tbody);
            }
        };

        // Se o DOM já estiver pronto, inicializa imediatamente
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            inicializacao();
        } else {
            // Caso contrário, aguarda o DOM estar pronto
            document.addEventListener('DOMContentLoaded', inicializacao);
        }
    }

    inicializarEventos() {
        if (!this.elementos.paginacao) return;

        const eventos = {
            'primeira': () => this.irParaPagina(1),
            'anterior': () => this.irParaPagina(this.estado.paginaAtual - 1),
            'proxima': () => this.irParaPagina(this.estado.paginaAtual + 1),
            'ultima': () => this.irParaPagina(this.estado.totalPaginas)
        };

        Object.entries(eventos).forEach(([tipo, acao]) => {
            const botao = this.elementos.paginacao[tipo];
            if (botao) {
                botao.addEventListener('click', () => {
                    if (!botao.disabled) {
                        acao();
                        this.renderizarTabela();
                    }
                });
            }
        });
    }

    calcularTaxaInflacaoMensal(taxaAnual) {
        // Converte taxa anual para mensal: (1 + taxa anual)^(1/12) - 1
        return Math.pow(1 + taxaAnual / 100, 1/12) - 1;
    }

    processarDadosOriginais(dados) {
        this.logInfo('Processando dados originais', dados);
        
        if (!dados || !dados.length) {
            this.logErro('Dados inválidos recebidos');
            return [];
        }

        return dados.map((item, index) => ({
            mes: index + 1,
            aporteMensal: item.aporteMensal,
            rendimentoMensal: item.rendimentoMensal,
            patrimonioAcumuladoJuros: item.patrimonioAcumuladoJuros,
            aportesAcumulados: item.aportesAcumulados
        }));
    }

    processarDados(dadosOriginais) {
        console.log('Processando dados:', dadosOriginais);
        
        if (!dadosOriginais || !dadosOriginais.length) {
            console.error('Dados inválidos recebidos em processarDados');
            return [];
        }

        try {
            const dadosProcessados = dadosOriginais.map((item, index) => {
                if (!item) {
                    console.error(`Item ${index} é nulo ou indefinido`);
                    return null;
                }

                console.log(`Processando item ${index}:`, item);

                // Garante valores padrão para campos ausentes
                const linha = {
                    mes: item.mes || index + 1,
                    aporteMensal: item.aporteMes || 0,
                    aportesAcumulados: item.totalInvestido || 0,
                    rendimentoMensal: item.rendimentoMes,  // Mantém undefined/NaN se não existir
                    rendimentoMensalInflacao: item.rendimentoReal || 0,
                    patrimonioAcumuladoJuros: item.montanteAcumulado || 0,
                    patrimonioAcumuladoInflacao: item.montanteAcumulado ? (item.montanteAcumulado - (item.rendimentoMes || 0)) : 0
                };

                console.log(`Linha ${index + 1} processada:`, linha);
                return linha;
            }).filter(item => item !== null);

            console.log('Dados processados finais:', dadosProcessados);
            return dadosProcessados;
        } catch (erro) {
            console.error('Erro ao processar dados:', erro);
            return [];
        }
    }

    atualizar(dados) {
        console.log('Dados recebidos em atualizar:', dados);
        
        // Validação mais detalhada dos dados
        if (!dados) {
            console.error('Nenhum dado recebido');
            return;
        }

        if (!Array.isArray(dados)) {
            console.error('Dados recebidos não são um array:', typeof dados);
            return;
        }

        if (dados.length === 0) {
            console.error('Array de dados está vazio');
            return;
        }

        // Verifica se o primeiro item tem os campos necessários
        const primeiroItem = dados[0];
        console.log('Primeiro item dos dados:', primeiroItem);

        // Processa os dados mesmo se alguns campos estiverem faltando
        this.estado.dados = this.processarDados(dados);
        console.log('Dados após processamento:', this.estado.dados);
        
        if (this.estado.dados && this.estado.dados.length > 0) {
            this.estado.totalPaginas = Math.ceil(this.estado.dados.length / this.config.itensPorPagina);
            this.estado.paginaAtual = 1;
            this.renderizarTabela();
            this.atualizarControlesPaginacao();
        } else {
            console.error('Nenhum dado processado para renderizar');
        }
    }

    renderizarTabela() {
        const tbody = this.elementos.tbody;
        if (!tbody) {
            console.error('Elemento tbody não encontrado');
            return;
        }

        tbody.innerHTML = '';
        const dadosPaginaAtual = this.obterDadosPaginaAtual(this.estado.dados);
        console.log('Dados a serem renderizados:', dadosPaginaAtual);

        if (!dadosPaginaAtual || dadosPaginaAtual.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = this.config.colunas.length;
            td.textContent = 'Nenhum dado disponível';
            td.className = 'text-center';
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        dadosPaginaAtual.forEach((linha, index) => {
            console.log(`Renderizando linha ${index + 1}:`, linha);
            
            const tr = document.createElement('tr');
            
            // Criando células na ordem correta
            const colunas = [
                `${linha.mes}º mês`,
                this.formatarMoeda(linha.aporteMensal),
                this.formatarMoeda(linha.aportesAcumulados),
                this.formatarValor(linha.rendimentoMensal),
                this.formatarMoeda(linha.rendimentoMensalInflacao),
                this.formatarMoeda(linha.patrimonioAcumuladoJuros),
                this.formatarMoeda(linha.patrimonioAcumuladoInflacao)
            ];

            colunas.forEach(valor => {
                const td = document.createElement('td');
                td.innerHTML = valor;
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        this.atualizarPaginacao(this.estado.dados.length);
    }

    formatarValor(valor) {
        if (valor === undefined || valor === null || isNaN(valor)) {
            return 'NaN';
        }
        return this.formatarMoeda(valor);
    }

    formatarMoeda(valor) {
        if (valor === undefined || valor === null || isNaN(valor)) {
            return 'R$ 0,00';
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    podeNavegar(tipo) {
        const { paginaAtual, totalPaginas } = this.estado;
        const regras = {
            'primeira': () => paginaAtual > 1,
            'anterior': () => paginaAtual > 1,
            'proxima': () => paginaAtual < totalPaginas,
            'ultima': () => paginaAtual < totalPaginas
        };
        return regras[tipo]?.() ?? false;
    }

    irParaPagina(numeroPagina) {
        this.estado.paginaAtual = Math.max(1, Math.min(numeroPagina, this.estado.totalPaginas));
        this.logInfo(`Navegando para página ${this.estado.paginaAtual}`);
    }

    atualizarControlesPaginacao() {
        const { paginaAtual, totalPaginas } = this.estado;
        const elementos = this.elementos.paginacao;
        
        if (!elementos) return;

        // Atualiza o estado dos botões
        if (elementos.primeira) {
            elementos.primeira.disabled = paginaAtual <= 1;
        }
        if (elementos.anterior) {
            elementos.anterior.disabled = paginaAtual <= 1;
        }
        if (elementos.proxima) {
            elementos.proxima.disabled = paginaAtual >= totalPaginas;
        }
        if (elementos.ultima) {
            elementos.ultima.disabled = paginaAtual >= totalPaginas;
        }
        if (elementos.atual) {
            elementos.atual.textContent = paginaAtual;
        }
    }

    logDebug(mensagem, dados = null) {
        console.debug(`[TabelaResultados] ${mensagem}`, dados || '');
    }

    logInfo(mensagem) {
        console.info(`[TabelaResultados] ${mensagem}`);
    }

    logErro(mensagem, erro = null) {
        console.error(`[TabelaResultados] ${mensagem}`, erro || '');
    }

    logEstado(contexto) {
        this.logDebug(`${contexto} - Estado atual:`, {
            paginaAtual: this.estado.paginaAtual,
            totalPaginas: this.estado.totalPaginas,
            totalRegistros: this.estado.dados.length,
            taxaInflacaoMensal: this.estado.taxaInflacaoMensal
        });
    }

    obterDadosPaginaAtual(dados) {
        if (!dados || !Array.isArray(dados)) return [];
        
        const inicio = (this.estado.paginaAtual - 1) * this.config.itensPorPagina;
        const fim = inicio + this.config.itensPorPagina;
        return dados.slice(inicio, fim);
    }

    atualizarPaginacao(totalRegistros) {
        const { paginaAtual } = this.estado;
        const { itensPorPagina } = this.config;
        
        // Calcula o total de páginas
        this.estado.totalPaginas = Math.ceil(totalRegistros / itensPorPagina);
        
        // Calcula o intervalo de registros sendo mostrados
        const inicio = ((paginaAtual - 1) * itensPorPagina) + 1;
        const fim = Math.min(inicio + itensPorPagina - 1, totalRegistros);
        
        // Atualiza os elementos de informação
        if (this.elementos.info.inicio) {
            this.elementos.info.inicio.textContent = inicio;
        }
        if (this.elementos.info.fim) {
            this.elementos.info.fim.textContent = fim;
        }
        if (this.elementos.info.total) {
            this.elementos.info.total.textContent = totalRegistros;
        }
        
        // Atualiza os botões de navegação
        this.atualizarControlesPaginacao();
    }
} 