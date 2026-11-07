# Calculadora de Juros Compostos

Uma aplicação web interativa e precisa para simulação de investimentos com juros compostos, ganho real com desconto de inflação e estimativa de Imposto de Renda. Desenvolvida em HTML5, CSS3 e JavaScript modular (ES6+).

## 🚀 Funcionalidades

- **Juros Compostos com Aportes Mensais:** Permite simulações com valor inicial isolado, aportes contínuos ou ambos.
- **Inflação & Poder de Compra Real:** Cálculo preciso da rentabilidade real através da Equação de Fisher.
- **Tributação (Imposto de Renda):** Suporte à Tabela Regressiva da Renda Fixa (22,5% a 15%), alíquota fixa ou investimentos isentos (LCI/LCA).
- **Dashboard de Métricas:** Resumo completo com montante bruto, montante líquido, juros acumulados, rentabilidades e projeção de renda passiva mensal.
- **Gráficos Interativos (Chart.js):**
  - Gráfico de linha com evolução do total investido, montante acumulado e patrimônio real deflacionado.
  - Gráfico de rosca (*doughnut*) com a distribuição entre capital inicial, aportes e juros.
- **Tabela Mês a Mês Paginada:** Detalhamento do crescimento do patrimônio com destaque para fechamentos anuais.
- **Experiência de Uso (UX/UI):** Interface limpa, responsiva para smartphones e computadores, preenchimento instantâneo de exemplo e limpeza de formulário.

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3** (com Bootstrap 5 e Bootstrap Icons)
- **JavaScript Moderno (ES6 Modules)**
- **Chart.js** para renderização gráfica responsiva
- **IMask.js** para máscaras monetárias

## 💻 Como Executar Localmente

Como a aplicação é 100% *client-side* baseada em módulos ES6, basta servi-la em qualquer servidor web local:

### Opção 1: Via Python
```bash
python server.py
```
Acesse em seu navegador: [http://localhost:8000](http://localhost:8000)

### Opção 2: Extensão Live Server (VS Code / Antigravity)
Clique com o botão direito no arquivo `index.html` e selecione **Open with Live Server**.

## 📖 Documentação do Projeto

- [Regras de Desenvolvimento](AI_DEVELOPMENT_RULES.md)
- [Arquitetura de Software](docs/ARCHITECTURE.md)
- [Matemática Financeira e Fórmulas](docs/FINANCIAL_MATH.md)
- [Histórico de Alterações (Changelog)](docs/CHANGELOG.md)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
