# Matemática Financeira e Fórmulas da Calculadora

Este documento detalha o embasamento matemático e as equações financeiras aplicadas no projeto.

---

## 1. Conversão de Taxas (Composição Mensal)

Para transformar uma taxa anual nominal informada pelo usuário em sua taxa mensal equivalente:

$$i_{mensal} = (1 + i_{anual})^{1/12} - 1$$

Caso o usuário já informe a taxa mensal, utiliza-se a proporção direta:
$$i_{mensal} = \frac{\text{taxa mensal}}{100}$$

---

## 2. Juros Compostos com Aportes Periódicos

A cada mês $m \in \{1, \dots, N\}$, sendo $N$ o total de meses da simulação:

1. **Aporte do Mês:**
   $$\text{Total Investido}_m = \text{Total Investido}_{m-1} + \text{Aporte Mensal}$$

2. **Base de Rendimento (Aporte no início do mês):**
   $$\text{Base}_m = \text{Montante}_{m-1} + \text{Aporte Mensal}$$

3. **Rendimento do Mês:**
   $$\text{Rendimento}_m = \text{Base}_m \times i_{mensal}$$

4. **Novo Saldo Acumulado:**
   $$\text{Montante}_m = \text{Base}_m + \text{Rendimento}_m$$

---

## 3. Inflação e Rendimento Real (Equação de Fisher)

A taxa real mensal de juros $r_{mensal}$ desconta a taxa de inflação mensal $\pi_{mensal}$ de acordo com a formulação estrita de Irving Fisher:

$$1 + i_{mensal} = (1 + r_{mensal})(1 + \pi_{mensal})$$

Isolando a taxa real:

$$r_{mensal} = \frac{1 + i_{mensal}}{1 + \pi_{mensal}} - 1$$

### Poder de Compra Deflacionado
O patrimônio real corrigido pelo efeito da inflação acumulada no mês $m$ é expresso por:

$$\text{Poder de Compra}_m = \frac{\text{Montante}_m}{(1 + \pi_{mensal})^m}$$

### Rentabilidade Real Acumulada no Período
$$\text{Rentabilidade Real} = \left[ \frac{1 + \frac{\text{Rentabilidade Nominal}}{100}}{(1 + \pi_{mensal})^N} - 1 \right] \times 100$$

---

## 4. Tributação (Imposto de Renda)

O Imposto de Renda incide exclusivamente sobre o rendimento bruto acumulado:

$$\text{Juros Totais} = \max(0, \text{Montante Final} - \text{Total Investido})$$
$$\text{Imposto Devido} = \text{Juros Totais} \times \text{Alíquota}$$
$$\text{Montante Líquido} = \text{Montante Final} - \text{Imposto Devido}$$

### Tabela Regressiva da Renda Fixa (Brasil)
- **Até 180 dias ($\le$ 6 meses):** 22,5%
- **De 181 a 360 dias (7 a 12 meses):** 20,0%
- **De 361 a 720 dias (13 a 24 meses):** 17,5%
- **Acima de 720 dias (> 24 meses):** 15,0%
- **Isento (LCI, LCA, CRI, CRA, Poupança):** 0,0%
- **Alíquota Fixa:** 15,0%

---

## 5. Projeção de Renda Passiva Mensal

Calcula-se a estimativa de retirada que o patrimônio final acumulado é capaz de gerar mensalmente:

- **Renda Passiva Bruta Mensal:**
  $$\text{Renda Bruta} = \text{Montante Final} \times i_{mensal}$$

- **Renda Passiva Real / Líquida Mensal:**
  Estimativa da retirada mensal após o desconto de impostos mantendo o poder de compra do capital principal intacto:
  $$\text{Renda Real} = \text{Montante Líquido} \times \max(0, r_{mensal})$$
