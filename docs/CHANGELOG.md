# Registro de Alterações (Changelog)

Todas as modificações relevantes implementadas no projeto estão documentadas abaixo.

---

## [2.0.0] - 2026-11-07

### 🚀 Novas Funcionalidades
- **Cálculo de Imposto de Renda (IR):**
  - Implementada opção de Tabela Regressiva da Renda Fixa (22,5% a 15%), alíquota fixa (15%) e investimentos isentos (LCI, LCA, Poupança).
  - Adicionado cálculo automático do imposto retido e do montante líquido final.
- **Botões de Ação Rápida:**
  - Botão **Exemplo** para carregar valores recomendados e ver o resultado imediatamente.
  - Botão **Limpar** para redefinir campos e restaurar o estado inicial.
- **Gráficos com Chart.js 4+:**
  - Migração de Canvas 2D manual para a biblioteca Chart.js.
  - Gráfico de linha responsivo com curvas suaves e tooltips monetários.
  - Gráfico de distribuição (*doughnut*) com proporção de capital, aportes e rendimento.
- **Rigor Matemático (Equação de Fisher):**
  - Adoção da fórmula exata de Fisher para descontar inflação em substituição à aproximação linear.
  - Cálculo de patrimônio real deflacionado em valores de hoje.

### 🐛 Correções de Bugs
- **Permissão de Aporte Zero e Inflação Zero:** Corrigido bug no `app.js` onde `!aporteMensal` e `!inflacao` impediam cálculos com valores iguais a zero.
- **Eliminação de Conflito de Eventos:** Removidos ouvintes de clique e máscaras duplicadas que competiam entre `app.js` e `Calculadora.js`.
- **Correção de Retorno `undefined`:** O método `Calculadora.calcular()` agora retorna o payload estruturado com todos os dados calculados, eliminando erros silenciosos no console.
- **Correção da Linha do Tempo de Aportes:** Corrigido o cálculo do primeiro mês quando o usuário iniciava com valor inicial zero e aporte mensal.

### 🎨 Experiência do Usuário (UX) & Design (UI)
- **Eliminação do Anti-Pattern de Hover:** Removido o efeito de transição que ocultava os valores monetários ao passar o mouse.
- **Hierarquia Visual e Paleta Moderna:**
  - Redução de cores conflitantes em prol de uma interface limpa, elegante e profissional.
  - Card de **Montante Líquido Final** destacado em gradiente azul.
- **Responsividade Aprimorada:** Otimização para visualização em smartphones e tablets.

### 🧹 Limpeza de Código
- Exclusão do arquivo não utilizado `js/utils/formatters.js`.
- Centralização de todo o CSS em `css/styles.css` e remoção da tag `<style>` inline do `index.html`.
- Criação das diretrizes `AI_DEVELOPMENT_RULES.md` e pasta `docs/`.
