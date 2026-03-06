# Guia de Integração - Assistente Tributário Sol Contábil

## O que foi criado

Um **Assistente Tributário com IA** completo para o site da Sol Contábil, composto por:

1. **Backend com IA** (hospedado separadamente) — processa as conversas, armazena leads e configurações
2. **Widget de chat** — aparece no canto inferior direito de qualquer página do site
3. **Painel de administração** — visualiza leads, conversas e configura integrações

---

## Estrutura do Sistema

```
sol-contabil-chatbot/   ← Backend + Frontend do chatbot (deploy separado)
sol-contabil/           ← Site estático (já existente)
  └── chatbot-embed.html ← Script de integração (copiar para o site)
```

---

## Como Integrar ao Site

### Passo 1: Fazer deploy do backend

O backend do chatbot precisa ser hospedado (ex: Vercel, Railway, Render).
Após o deploy, você terá uma URL como: `https://sol-chatbot.vercel.app`

### Passo 2: Configurar a URL no script

No arquivo `chatbot-embed.html`, localize a linha:
```javascript
var API_URL = 'https://SEU-BACKEND-URL';
```
Substitua pela URL real do seu backend.

### Passo 3: Adicionar ao site

Copie todo o conteúdo do arquivo `chatbot-embed.html` e cole **antes do `</body>`** em cada página HTML do site.

Exemplo no `index.html`:
```html
    <!-- ... resto do conteúdo ... -->
    
    <!-- CHATBOT WIDGET -->
    <!-- Cole aqui o conteúdo do chatbot-embed.html -->
    
  </body>
</html>
```

---

## Painel de Administração

Acesse: `https://SEU-BACKEND-URL/admin`

No painel você pode:
- Ver todos os leads capturados
- Visualizar nome, WhatsApp, email e interesse de cada lead
- Clicar para abrir WhatsApp direto com o lead
- Configurar integrações (WhatsApp, Email, Google Sheets)

---

## Configurações Parametrizadas

No painel admin, configure:

| Configuração | Descrição |
|---|---|
| `whatsapp_number` | Número para receber leads (ex: 5519982003732) |
| `email_leads` | Email para notificações de novos leads |
| `google_sheet_id` | ID da planilha Google Sheets |
| `chatbot_enabled` | `true` para ativo, `false` para desativar |

---

## Funcionalidades do Assistente

- ✅ Mensagem de boas-vindas automática após 3 segundos
- ✅ Botões de ação rápida (Abrir empresa, Trocar contador, etc.)
- ✅ Respostas com IA treinada em contabilidade brasileira
- ✅ Fluxo de qualificação (atividade, cidade, faturamento)
- ✅ Captura automática de leads (nome, WhatsApp, email)
- ✅ Formulário de contato manual
- ✅ Indicador de digitação animado
- ✅ Histórico de conversa salvo por sessão
- ✅ Design responsivo (mobile e desktop)
- ✅ Cores da Sol Contábil (azul #0ea5e9, escuro #1a2a4a)

---

## Temas que o Assistente Domina

- Abertura de empresa (CNPJ, tipo societário, regime tributário)
- MEI — limite de faturamento, obrigações, declaração anual
- Simples Nacional — anexos, alíquotas, faixas
- Lucro Presumido e Lucro Real
- Planejamento tributário
- Troca de contador
- Profissionais liberais e freelancers
- Startups e empresas de tecnologia

---

## Custo Estimado de Operação

| Volume de conversas | Custo estimado/mês |
|---|---|
| Até 200 conversas | R$ 30-80 |
| Até 500 conversas | R$ 80-150 |
| Até 1000 conversas | R$ 150-300 |

*Valores baseados no consumo da API de IA (OpenAI/Gemini)*
