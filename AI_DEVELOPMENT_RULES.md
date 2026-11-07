# Regras de Desenvolvimento e Arquitetura - Calculadora de Juros Compostos

Este documento define os padrões técnicos obrigatórios e o fluxo de desenvolvimento do projeto.

## 1. Diretrizes Primárias

1. **Preservação de Funcionalidade:** NUNCA desative ou remova funcionalidades essenciais sem substituir por implementação superior e compatível.
2. **Clean Code & Modularidade:**
   - Funções com responsabilidade única.
   - Código desacoplado e reutilizável em módulos ES6.
   - Variáveis e funções com nomenclatura semântica.
3. **Regra de Ouro da Documentação:**
   - **Toda alteração de código exige atualização imediata da documentação em `docs/`**, conforme o mapeamento abaixo:
     - `docs/ARCHITECTURE.md`: Alterações estruturais, inclusão/remoção de módulos e fluxo de eventos.
     - `docs/FINANCIAL_MATH.md`: Alterações nas fórmulas financeiras, taxas, Fisher, inflação e IR.
     - `docs/CHANGELOG.md`: Registro de todas as modificações, correções de bugs e novas funcionalidades.

## 2. Arquitetura Frontend

- **Tecnologia:** HTML5, CSS3, JavaScript ES6 puro (módulos nativos no navegador).
- **Componentes Visuais:** Bootstrap 5, Bootstrap Icons, Chart.js.
- **Máscaras e Entradas:** IMask.js para formatação monetária.
- **Estrutura de Pastas:**
```
├── css/
│   └── styles.css          # Estilização consolidada e responsiva
├── js/
│   ├── app.js              # Ponto de entrada e orquestração de eventos
│   ├── components/
│   │   ├── Calculadora.js      # Motor financeiro e gerenciador de estado da simulação
│   │   ├── TabelaResultados.js # Componente de tabela com paginação
│   │   └── graficos/
│   │       ├── GraficoLinha.js # Gráfico de evolução patrimonial (Chart.js)
│   │       └── GraficoPizza.js # Gráfico de distribuição do patrimônio (Chart.js)
│   └── utils/
│       └── formatarMoeda.js   # Formatações monetárias e numéricas
├── docs/                   # Documentação viva do projeto
└── index.html              # Interface do usuário
```

## 3. Padrões de Qualidade e Segurança

- Validação defensiva de inputs: tratar casos de valores nulos, zero, negativos e formatos com vírgula/ponto.
- Acessibilidade (a11y) e usabilidade (UX):
  - Manter valores visíveis sem efeitos agressivos de hover que ocultem informações.
  - Responsividade completa em dispositivos móveis.
  - Gráficos adaptáveis ao redimensionamento de janela e telas de alta densidade de pixels.
