# Plano de Implementação: Melhorias nos Simuladores

Este documento detalha o plano de ação para implementar as melhorias solicitadas na página de simuladores do site da Sol Contábil.

## Fase 1: Análise e Planejamento (Concluída)

- [x] Análise dos requisitos do usuário.
- [x] Análise do código existente (`simuladores/index.html`).
- [x] Definição da arquitetura da solução: separar a lógica em arquivos JavaScript dedicados (`simuladores.js` e `calculos.js`).

## Fase 2: Desenvolvimento do Backend e Lógica de Cálculo

1.  **Criar `calculos.js`:**
    *   Implementar todas as funções de cálculo de impostos com base nos parâmetros de 2026 fornecidos.
    *   Função para calcular IRPF (tabela progressiva).
    *   Função para calcular INSS (autônomo e PJ).
    *   Função para calcular Simples Nacional (Anexo III com Fator R).
    *   Função para calcular a economia entre PF e PJ.
    *   Função para estimar o imposto no regime mais vantajoso (Simples Nacional vs. Lucro Presumido).

2.  **Criar `simuladores.js`:**
    *   Desenvolver a lógica para os dois novos simuladores ("Economia Tributária" e "PF vs. PJ").
    *   Cada função de simulador receberá os inputs do formulário, chamará as funções de `calculos.js` e retornará o resultado estruturado.

## Fase 3: Desenvolvimento do Frontend e Integração

1.  **Refatorar `simuladores/index.html`:**
    *   Linkar os novos arquivos `calculos.js` and `simuladores.js`.
    *   **Melhoria 1 (Fluxo Invertido):**
        *   Remover os campos de contato (nome, e-mail, whatsapp) da etapa inicial dos 4 simuladores existentes.
        *   Criar uma nova seção de "resultado" para cada simulador, que ficará oculta inicialmente.
        *   Modificar o JavaScript existente para, ao clicar em "Simular", exibir a seção de resultado com os dados calculados.
        *   Adicionar o box de captura de lead opcional abaixo de cada resultado.
    *   **Melhoria 2 (Novos Simuladores):**
        *   Adicionar duas novas abas (`sim-tab`) para os simuladores "Economia Tributária" e "PF vs. PJ".
        *   Criar os painéis (`sim-panel`) correspondentes com os formulários (campos de input) para cada novo simulador.
        *   Criar as seções de resultado para os novos simuladores, incluindo tabelas e cards para exibir os dados, conforme o layout solicitado.
        *   Adicionar o aviso legal em todos os simuladores.

2.  **Estilização (CSS):**
    *   Garantir que os novos elementos sigam a identidade visual do site (cores, fontes, sombras).
    *   Aplicar a cor verde para os resultados de economia.
    *   Garantir a responsividade para dispositivos móveis.

## Fase 4: Revisão, Testes e Deploy

1.  **Testes Funcionais:**
    *   Testar todos os 6 simuladores com diferentes valores de entrada.
    *   Verificar se os cálculos estão corretos.
    *   Testar o fluxo invertido e a captura de leads.
    *   Verificar o link do WhatsApp.
2.  **Testes de Responsividade:**
    *   Verificar o layout em diferentes tamanhos de tela.
3.  **Deploy:**
    *   Fazer o commit e push das alterações para o repositório no GitHub para acionar o deploy no Vercel.

## Fase 5: Apresentação

- Apresentar as melhorias implementadas ao usuário.
