const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// ============================================================
// CLUSTERS DE CONTEÚDO
// Cada cluster tem 1 página PILAR + vários SATÉLITES
// O script gera em sequência: pilar primeiro, depois satélites
// Quando termina um cluster, começa o próximo automaticamente
// ============================================================
const CLUSTERS = [

  {
    id: 'abertura-empresa-limeira',
    pilar: {
      tema: "Guia Completo para Abrir Empresa em Limeira SP em 2026",
      descricao: "Página pilar sobre abertura de empresas em Limeira — cobre todos os aspectos"
    },
    satelites: [
      "Como abrir MEI em Limeira SP: passo a passo 2026",
      "Como abrir LTDA em Limeira SP: documentos e custos",
      "Como abrir SLU em Limeira SP: sociedade unipessoal",
      "Documentos necessários para abrir empresa em Limeira",
      "Quanto custa abrir empresa em Limeira SP em 2026",
      "Alvará de funcionamento em Limeira: como obter",
      "Inscrição municipal em Limeira: guia completo",
      "Abertura de empresa para médicos em Limeira SP",
      "Abertura de empresa para dentistas em Limeira SP",
      "Abertura de empresa para advogados em Limeira SP",
      "Abertura de empresa para engenheiros em Limeira SP",
      "Abertura de empresa para psicólogos em Limeira SP",
    ]
  },

  {
    id: 'mei-completo',
    pilar: {
      tema: "Guia Completo do MEI em 2026: Tudo que Você Precisa Saber",
      descricao: "Página pilar sobre MEI — do cadastro à transição para ME"
    },
    satelites: [
      "Como abrir MEI online em 2026: passo a passo",
      "DAS MEI 2026: como pagar e evitar multas",
      "MEI pode ter funcionário? Regras e limites em 2026",
      "Limite de faturamento do MEI 2026: o que fazer ao ultrapassar",
      "MEI pode emitir nota fiscal? Guia completo 2026",
      "INSS MEI 2026: aposentadoria e benefícios do microempreendedor",
      "Declaração anual do MEI: como fazer o DASN 2026",
      "MEI inadimplente: como regularizar em 2026",
      "Como cancelar o MEI: passo a passo completo",
      "Quando migrar do MEI para ME ou LTDA",
      "MEI pode ter CNPJ de outro tipo? Tire suas dúvidas",
    ]
  },

  {
    id: 'planejamento-tributario',
    pilar: {
      tema: "Planejamento Tributário para Pequenas Empresas em 2026",
      descricao: "Página pilar sobre planejamento tributário — como pagar menos impostos legalmente"
    },
    satelites: [
      "Simples Nacional 2026: tabelas, alíquotas e como calcular",
      "Lucro Presumido 2026: vantagens e quando vale a pena",
      "Lucro Real 2026: quem é obrigado e como funciona",
      "Como escolher o melhor regime tributário para sua empresa",
      "Como reduzir impostos legalmente em 2026",
      "IRPJ 2026: tudo sobre o Imposto de Renda Pessoa Jurídica",
      "CSLL 2026: o que é e como calcular",
      "PIS e COFINS 2026: guia para pequenas empresas",
      "ISS 2026: o que é e quem deve pagar",
      "ICMS 2026: guia para empresas em São Paulo",
      "Substituição tributária SP: guia completo 2026",
      "Como fazer planejamento tributário anual para sua empresa",
    ]
  },

  {
    id: 'folha-pagamento-rh',
    pilar: {
      tema: "Guia Completo de Folha de Pagamento e RH para Empresas em 2026",
      descricao: "Página pilar sobre gestão de RH e folha de pagamento"
    },
    satelites: [
      "Como registrar funcionário corretamente em 2026",
      "Como calcular salário líquido e descontos em 2026",
      "13 salário 2026: como calcular e quando pagar",
      "Férias 2026: cálculo, regras e obrigações do empregador",
      "FGTS 2026: tudo sobre depósito, saque e multa",
      "Rescisão trabalhista 2026: tipos e como calcular",
      "Horas extras 2026: como calcular e registrar",
      "Vale transporte 2026: regras e obrigações",
      "eSocial 2026: guia completo para pequenas empresas",
      "Pró-labore 2026: o que é, como calcular e tributar",
      "INSS patronal 2026: como calcular e pagar",
      "CLT ou PJ: qual contratar em 2026?",
    ]
  },

  {
    id: 'contabilidade-nichos',
    pilar: {
      tema: "Contabilidade Especializada por Segmento: Guia Completo 2026",
      descricao: "Página pilar sobre contabilidade para diferentes nichos profissionais"
    },
    satelites: [
      "Contabilidade para médicos em Limeira SP: guia 2026",
      "Contabilidade para dentistas em Limeira SP: guia 2026",
      "Contabilidade para advogados em Limeira SP: guia 2026",
      "Contabilidade para engenheiros em Limeira SP: guia 2026",
      "Contabilidade para psicólogos: como reduzir impostos",
      "Contabilidade para restaurantes e bares em Limeira",
      "Contabilidade para clínicas de estética em Limeira",
      "Contabilidade para academias e personal trainers",
      "Contabilidade para e-commerce: guia completo 2026",
      "Contabilidade para influenciadores digitais 2026",
      "Contabilidade para transportadores autônomos 2026",
      "Contabilidade para construtoras em Limeira SP",
    ]
  },

  {
    id: 'gestao-financeira',
    pilar: {
      tema: "Gestão Financeira para Pequenas Empresas: Guia Completo 2026",
      descricao: "Página pilar sobre gestão financeira empresarial"
    },
    satelites: [
      "Como fazer fluxo de caixa para pequenas empresas",
      "DRE: como montar e interpretar o demonstrativo de resultados",
      "Balanço patrimonial: o que é e como interpretar",
      "Como separar finanças pessoais das empresariais",
      "Capital de giro: o que é e como calcular",
      "Como precificar produtos e serviços corretamente",
      "Ponto de equilíbrio: como calcular para sua empresa",
      "Como fazer orçamento empresarial anual",
      "Indicadores financeiros essenciais para pequenas empresas",
      "Como reduzir custos sem demitir funcionários",
      "Como se preparar para conseguir crédito empresarial",
    ]
  },

  {
    id: 'obrigacoes-fiscais',
    pilar: {
      tema: "Obrigações Fiscais e Contábeis das Empresas em 2026",
      descricao: "Página pilar sobre todas as obrigações que empresas precisam cumprir"
    },
    satelites: [
      "Calendário fiscal 2026: todas as obrigações e prazos",
      "SPED Contábil 2026: o que é e como entregar",
      "SPED Fiscal 2026: guia completo para empresas",
      "DCTF 2026: o que é e como declarar",
      "ECF 2026: Escrituração Contábil Fiscal passo a passo",
      "EFD Contribuições 2026: guia completo",
      "Nota fiscal eletrônica: como emitir passo a passo",
      "Certidão negativa de débitos: como obter e para que serve",
      "CNPJ irregular: como regularizar em 2026",
      "Malha fina empresarial: como evitar e o que fazer",
      "Multas fiscais: como evitar as mais comuns em 2026",
    ]
  },

  {
    id: 'trocar-contador',
    pilar: {
      tema: "Como Trocar de Contador com Segurança: Guia Completo 2026",
      descricao: "Página pilar sobre troca de contador e escolha do profissional ideal"
    },
    satelites: [
      "Como trocar de contador em Limeira SP sem problemas",
      "O que perguntar antes de contratar um contador",
      "Contabilidade online vs escritório presencial: qual escolher",
      "Quanto custa um contador para pequenas empresas em 2026",
      "CRC: como verificar se seu contador é regularizado",
      "Documentos que você deve exigir do seu contador",
      "Sinais de que você precisa trocar de contador",
      "Como escolher o melhor contador para MEI em 2026",
      "Contador para startup: o que considerar na escolha",
      "Contabilidade consultiva: o que é e por que contratar",
    ]
  },

];

// ============================================================
// TEMAS SAZONAIS - Prioridade em meses específicos
// ============================================================
const TEMAS_SAZONAIS = {
  '03': [
    "Declaração do Imposto de Renda 2026: guia completo",
    "IR 2026: deduções que você pode usar para pagar menos imposto",
    "Malha fina: como evitar e o que fazer se cair",
  ],
  '04': [
    "Prazo do Imposto de Renda 2026: como não perder e evitar multas",
    "Restituição do IR 2026: quando receber e como consultar",
  ],
  '11': [
    "13 salário primeira parcela 2026: como calcular e pagar",
    "Planejamento de fim de ano para sua empresa: checklist fiscal",
  ],
  '12': [
    "Fechamento fiscal 2026: o que sua empresa precisa fazer",
    "13 salário segunda parcela 2026: prazo e como calcular",
    "Planejamento tributário 2027: como começar agora",
  ],
};

// ============================================================
// CONFIGURAÇÕES DO SITE
// ============================================================
const CONFIG = {
  empresa: "Sol Contábil LTDA",
  cidade: "Limeira",
  whatsapp: "5519982003732",
  siteUrl: "https://solcontabil.com.br",
  logoPath: "../assets/logo-sol-contabil.png",
  gaId: "G-6CQ0PHLW5Y",
  autor: {
    nome: "Rodolfo Assunção",
    crc: "CRC-1SP353033/O-5",
    titulo: "Contador | Especialista em Contabilidade para Pequenas Empresas",
    bio: "Bacharel em Ciências Contábeis com mais de 12 anos de experiência no mercado financeiro. Pós-graduado em Gestão de Big Data e Business Analytics. Responsável técnico da Sol Contábil, especializado em contabilidade estratégica para pequenas empresas em Limeira e região.",
    foto: "/assets/rodolfo-assuncao.jpg",
    paginaUrl: "/responsavel-tecnico",
  }
};

// ============================================================
// SELECIONA O PRÓXIMO POST A GERAR
// Lógica: percorre os clusters em ordem, pilar primeiro,
// depois satélites. Pula posts já existentes.
// ============================================================
function selecionarProximoPost() {
  const gerarSlug = t => t.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').substring(0, 60);

  for (const cluster of CLUSTERS) {
    // Verifica pilar
    const slugPilar = gerarSlug(cluster.pilar.tema);
    if (!fs.existsSync(`blog/${slugPilar}.html`)) {
      return {
        tema: cluster.pilar.tema,
        tipo: 'pilar',
        clusterId: cluster.id,
        clusterTema: cluster.pilar.tema,
        linksPilar: null,
        linksSatelites: cluster.satelites.map(s => ({
          tema: s,
          slug: gerarSlug(s)
        }))
      };
    }

    // Verifica satélites
    for (const satelite of cluster.satelites) {
      const slugSatelite = gerarSlug(satelite);
      if (!fs.existsSync(`blog/${slugSatelite}.html`)) {
        return {
          tema: satelite,
          tipo: 'satelite',
          clusterId: cluster.id,
          clusterTema: cluster.pilar.tema,
          slugPilar: slugPilar,
          linksSatelites: cluster.satelites
            .filter(s => s !== satelite)
            .filter(s => fs.existsSync(`blog/${gerarSlug(s)}.html`))
            .map(s => ({ tema: s, slug: gerarSlug(s) }))
        };
      }
    }
  }

  // Todos os clusters completos — volta ao início
  return {
    tema: CLUSTERS[0].pilar.tema,
    tipo: 'pilar',
    clusterId: CLUSTERS[0].id,
    clusterTema: CLUSTERS[0].pilar.tema,
  };
}

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================
async function main() {
  const client = new Anthropic();
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const dataISO = hoje.toISOString().split('T')[0];

  // Verifica tema sazonal primeiro
  let temaInfo = null;
  const sazonais = TEMAS_SAZONAIS[mes];
  if (sazonais) {
    const diaDoMes = hoje.getDate();
    if (diaDoMes <= sazonais.length) {
      const temaSazonal = sazonais[diaDoMes - 1];
      const slugSazonal = temaSazonal.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').substring(0,60);
      if (!fs.existsSync(`blog/${slugSazonal}.html`)) {
        temaInfo = { tema: temaSazonal, tipo: 'sazonal', clusterTema: null };
      }
    }
  }

  // Se não há sazonal, seleciona próximo do cluster
  if (!temaInfo) {
    temaInfo = selecionarProximoPost();
  }

  const { tema, tipo, clusterTema, slugPilar, linksSatelites } = temaInfo;

  console.log(`📝 Gerando post [${tipo}]: "${tema}"`);
  if (clusterTema) console.log(`🗂️  Cluster: "${clusterTema}"`);

  // Gera o slug
  const slug = tema.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').substring(0, 60);

  // Monta contexto de links do cluster para o prompt
  let contextoCluster = '';
  if (tipo === 'satelite' && slugPilar) {
    contextoCluster += `\nEste artigo faz parte do cluster "${clusterTema}".`;
    contextoCluster += `\nPÁGINA PILAR DO CLUSTER (link obrigatório no texto): /blog/${slugPilar}`;
  }
  if (tipo === 'pilar') {
    contextoCluster += `\nEste é o artigo PILAR do cluster. Deve ser abrangente e mencionar os subtemas que serão aprofundados em artigos relacionados.`;
  }
  if (linksSatelites && linksSatelites.length > 0) {
    contextoCluster += `\nARTIGOS RELACIONADOS DO CLUSTER (inclua links naturalmente quando relevante):\n`;
    contextoCluster += linksSatelites.map(l => `- /blog/${l.slug} → "${l.tema}"`).join('\n');
  }

  // Posts existentes para links internos gerais
  const postsExistentes = obterPostsExistentes();
  const linksGerais = postsExistentes.length > 0
    ? `\nOUTROS POSTS DO BLOG (use 1-2 quando relevante):\n` +
      postsExistentes.slice(0, 5).map(p => `- /blog/${p.slug} → "${p.titulo}"`).join('\n')
    : '';

  // ============================================================
  // PROMPT
  // ============================================================
  const prompt = `Você é um contador especialista em SEO com profundo conhecimento da legislação brasileira atualizada em 2026. Crie um artigo de blog COMPLETO em português brasileiro sobre o tema: "${tema}"

O artigo deve ser para o escritório de contabilidade "${CONFIG.empresa}" localizado em ${CONFIG.cidade}-SP.
${contextoCluster}
${linksGerais}

REGRAS OBRIGATÓRIAS:
- Use SEMPRE informações atualizadas de 2026
- NUNCA mencione EIRELI (extinta em 2021) — use SLU no lugar
- Tipos válidos em 2026: MEI, ME, EPP, LTDA, SLU, SA, Empresário Individual
- Simples Nacional 2026: limite de R$ 4,8 milhões/ano
- MEI 2026: limite de R$ 81 mil/ano
- Se mencionar ano, use sempre 2026
- ${tipo === 'pilar' ? 'Como página PILAR, seja abrangente (1500-2000 palavras) e cubra todos os aspectos do tema' : 'Como página SATÉLITE, seja específico e aprofundado (1200-1500 palavras)'}

ESTRUTURA OBRIGATÓRIA (retorne APENAS JSON válido, sem markdown):
{
  "titulo": "Título otimizado com palavra-chave principal (máx 60 chars). Se mencionar ano, use 2026.",
  "metaDescription": "Meta description atraente com palavra-chave (máx 160 chars)",
  "heroSubtitle": "Subtítulo curto e impactante (máx 100 chars)",
  "keywords": "palavra1, palavra2, palavra3, palavra4, palavra5",
  "tempoLeitura": "X min",
  "conteudo": "HTML completo com sections, h2, h3, p, ul, ol. Use classes Tailwind: section class='mb-8', h2 class='text-2xl font-bold mb-4', h3 class='text-xl font-semibold mb-3', p class='mb-4 leading-relaxed', ul class='list-disc list-inside ml-4 mb-4 leading-relaxed'. Inclua introdução, explicação detalhada, passo a passo, FAQ com 3-4 perguntas, conclusão. Mencione ${CONFIG.empresa} e ${CONFIG.cidade} naturalmente.",
  "ctaTexto": "Texto do botão CTA"
}`;

  let resultado;
  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    });
    const textoResposta = msg.content[0].text;
    const jsonLimpo = textoResposta.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    resultado = JSON.parse(jsonLimpo);
  } catch (err) {
    console.error('Erro ao chamar Claude API:', err);
    process.exit(1);
  }

  console.log(`✅ Conteúdo gerado: "${resultado.titulo}"`);

  const tempoLeitura = resultado.tempoLeitura || '6 min';

  // Badge do tipo de post
  const badgeTipo = tipo === 'pilar'
    ? `<span class="inline-block bg-sol-gold text-sol-dark text-xs font-bold px-3 py-1 rounded-full mb-4">📚 Guia Completo</span>`
    : tipo === 'sazonal'
    ? `<span class="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">🗓️ Conteúdo da Semana</span>`
    : `<span class="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">🔍 Artigo Especializado</span>`;

  // Link para pilar (se for satélite)
  const linkPilar = (tipo === 'satelite' && slugPilar && fs.existsSync(`blog/${slugPilar}.html`))
    ? `<div class="bg-blue-50 border-l-4 border-sol-blue p-4 mb-8 rounded-r-lg">
        <p class="text-sm font-semibold text-sol-blue mb-1">📚 Parte do Guia Completo</p>
        <a href="/blog/${slugPilar}" class="text-sol-dark font-bold hover:text-sol-blue transition-colors">
          ${clusterTema} →
        </a>
      </div>`
    : '';

  // ============================================================
  // HTML DO POST
  // ============================================================
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resultado.titulo} - ${CONFIG.empresa}</title>
  <meta name="description" content="${resultado.metaDescription}">
  <meta name="keywords" content="${resultado.keywords}">
  <meta property="og:title" content="${resultado.titulo}">
  <meta property="og:description" content="${resultado.metaDescription}">
  <meta property="og:url" content="${CONFIG.siteUrl}/blog/${slug}">
  <meta property="og:type" content="article">
  <link rel="canonical" href="${CONFIG.siteUrl}/blog/${slug}">
  <meta name="robots" content="index, follow">
  <meta name="author" content="${CONFIG.autor.nome}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: { extend: { colors: { 'sol-blue': '#1a6fc4', 'sol-dark': '#0A2540', 'sol-gold': '#f5a623' } } }
    }
  </script>

  <script async src="https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${CONFIG.gaId}');
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${resultado.titulo}",
    "description": "${resultado.metaDescription}",
    "url": "${CONFIG.siteUrl}/blog/${slug}",
    "datePublished": "${dataISO}",
    "dateModified": "${dataISO}",
    "author": {
      "@type": "Person",
      "name": "${CONFIG.autor.nome}",
      "identifier": "${CONFIG.autor.crc}",
      "jobTitle": "Contador",
      "url": "${CONFIG.siteUrl}${CONFIG.autor.paginaUrl}",
      "worksFor": { "@type": "Organization", "name": "${CONFIG.empresa}", "url": "${CONFIG.siteUrl}" }
    },
    "publisher": {
      "@type": "Organization",
      "name": "${CONFIG.empresa}",
      "url": "${CONFIG.siteUrl}",
      "logo": { "@type": "ImageObject", "url": "${CONFIG.siteUrl}/assets/logo-sol-contabil.png" }
    }
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": "${CONFIG.siteUrl}" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "${CONFIG.siteUrl}/blog" },
      { "@type": "ListItem", "position": 3, "name": "${resultado.titulo}", "item": "${CONFIG.siteUrl}/blog/${slug}" }
    ]
  }
  </script>

  <style>
    body { font-family: 'Inter', sans-serif; color: #333; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Montserrat', sans-serif; color: #0A2540; }
    .whatsapp-float { position: fixed; bottom: 28px; right: 28px; z-index: 9999; }
    .whatsapp-float a { display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; background: #25D366; border-radius: 50%; box-shadow: 0 4px 20px rgba(37,211,102,0.45); transition: transform 0.2s; }
    .whatsapp-float a:hover { transform: scale(1.12); }
    .hero-bg { background: linear-gradient(135deg, #0A2540 0%, #1a3a5c 50%, #0d2e50 100%); }
  </style>
</head>
<body class="bg-gray-50">

  <header class="bg-white shadow-md fixed w-full z-50">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
      <a href="/" class="flex items-center">
        <img src="${CONFIG.logoPath}" alt="${CONFIG.empresa} Logo" class="h-10">
      </a>
      <ul class="hidden md:flex space-x-6">
        <li><a href="/" class="text-sol-dark hover:text-sol-blue font-semibold">Início</a></li>
        <li><a href="/blog" class="text-sol-dark hover:text-sol-blue font-semibold">Blog</a></li>
        <li><a href="/simuladores" class="text-sol-dark hover:text-sol-blue font-semibold">Simuladores</a></li>
        <li><a href="/#contato" class="text-sol-dark hover:text-sol-blue font-semibold">Contato</a></li>
      </ul>
    </nav>
  </header>

  <section class="hero-bg text-white py-20 mt-16">
    <div class="container mx-auto px-4 text-center">
      ${badgeTipo}
      <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-4">${resultado.titulo}</h1>
      <p class="text-xl md:text-2xl font-light mb-6">${resultado.heroSubtitle}</p>
      <div class="flex items-center justify-center gap-4 text-sm text-white/70 flex-wrap">
        <span>📅 ${dataFormatada}</span>
        <span>•</span>
        <span>⏱️ ${tempoLeitura} de leitura</span>
        <span>•</span>
        <a href="${CONFIG.autor.paginaUrl}" class="text-white/90 hover:text-white underline">${CONFIG.autor.nome}</a>
      </div>
    </div>
  </section>

  <div class="container mx-auto px-4 py-3 max-w-4xl">
    <nav class="text-sm text-gray-500">
      <a href="/" class="hover:text-sol-blue">Início</a>
      <span class="mx-2">›</span>
      <a href="/blog" class="hover:text-sol-blue">Blog</a>
      <span class="mx-2">›</span>
      <span class="text-gray-700">${resultado.titulo}</span>
    </nav>
  </div>

  <main class="container mx-auto px-4 pb-12 max-w-4xl">
    <article class="bg-white p-8 rounded-lg shadow-lg">

      ${linkPilar}

      ${resultado.conteudo}

      <!-- Autor -->
      <div class="flex items-start gap-5 border-t border-gray-100 pt-8 mt-8">
        <a href="${CONFIG.autor.paginaUrl}" class="flex-shrink-0">
          <img
            src="${CONFIG.autor.foto}"
            alt="Foto de ${CONFIG.autor.nome}"
            onerror="this.style.display='none'"
            class="w-20 h-20 rounded-full object-cover border-2 border-sol-blue hover:opacity-90 transition-opacity"
          >
        </a>
        <div>
          <a href="${CONFIG.autor.paginaUrl}" class="font-bold text-sol-dark text-lg hover:text-sol-blue transition-colors">
            ${CONFIG.autor.nome}
          </a>
          <p class="text-sol-blue text-sm font-semibold mb-1">${CONFIG.autor.crc}</p>
          <p class="text-gray-500 text-sm">${CONFIG.autor.titulo}</p>
          <p class="text-gray-600 text-sm mt-1 leading-relaxed">${CONFIG.autor.bio}</p>
          <a href="${CONFIG.autor.paginaUrl}" class="inline-block mt-2 text-xs text-sol-blue hover:underline">Ver perfil completo →</a>
        </div>
      </div>

      <!-- CTA -->
      <section class="text-center py-8 bg-sol-blue text-white rounded-lg mt-8">
        <h3 class="text-2xl font-bold mb-4">Precisa de ajuda com contabilidade?</h3>
        <p class="mb-6 text-lg">Fale agora com um especialista da ${CONFIG.empresa} e resolva sua situação!</p>
        <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" class="inline-block bg-sol-gold hover:bg-yellow-600 text-sol-dark font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out">
          ${resultado.ctaTexto}
        </a>
      </section>
    </article>
  </main>

  <div class="whatsapp-float">
    <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" aria-label="Fale conosco pelo WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" viewBox="0 0 16 16">
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.534.068 7.927c0 1.354.364 2.635.938 3.751L.068 16l4.204-1.102a7.933 7.933 0 0 0 3.711.92h.004c4.368 0 7.926-3.533 7.926-7.926 0-2.056-.82-3.9-2.13-5.244-.94-.94-2.22-1.465-3.535-1.465zm-4.14 5.116c-.114-.057-.69-.34-.795-.378-.104-.038-.18-.038-.255.038-.075.075-.295.378-.36.453-.065.075-.13.08-.245.03-.115-.057-.49-.18-.93-.572-.358-.31-.598-.52-.673-.645-.075-.124-.004-.118.06-.182.06-.065.15-.18.225-.275.075-.094.1-.16.15-.245.05-.085.025-.16-.013-.225-.038-.065-.255-.61-.35-.83-.095-.21-.19-.18-.255-.18-.065 0-.14-.004-.215-.004-.075 0-.19.02-.295.114-.105.095-.4.38-.4.92s.405 1.07.46 1.145c.055.075.76.117 1.485.75.725.634 1.25 1.05 1.4.1.15-.057.255-.15.34-.235.085-.085.16-.18.225-.245.065-.065.1-.04.15.025.05.065.34.56.4.675.06.115.04.21.01.245z"/>
      </svg>
    </a>
  </div>

  <footer class="bg-sol-dark text-white py-8">
    <div class="container mx-auto px-4 text-center">
      <p class="mb-4">&copy; ${hoje.getFullYear()} ${CONFIG.empresa}. Todos os direitos reservados.</p>
      <ul class="flex justify-center space-x-6">
        <li><a href="/" class="hover:text-sol-gold">Início</a></li>
        <li><a href="/blog" class="hover:text-sol-gold">Blog</a></li>
        <li><a href="/#contato" class="hover:text-sol-gold">Contato</a></li>
        <li><a href="/politica-de-privacidade" class="hover:text-sol-gold">Política de Privacidade</a></li>
      </ul>
    </div>
  </footer>

  <!-- CHATBOT WIDGET - SOL CONTÁBIL v2 -->
  <button id="sol-toggle" style="position: fixed; bottom: 28px; right: 28px; z-index: 9998; width: 60px; height: 60px; border-radius: 50%; border: none; cursor: pointer; background: linear-gradient(145deg, #0A2540 0%, #1a6fc4 100%); box-shadow: 0 4px 24px rgba(26,111,196,0.5); transition: transform 0.25s, box-shadow 0.25s; display: flex; align-items: center; justify-content: center;" title="Abrir assistente virtual">
    <span id="sol-badge" style="position: absolute; top: -3px; right: -3px; width: 22px; height: 22px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: white; border: 2px solid white; animation: sol-pulse 2s infinite;">1</span>
    <svg id="sol-toggle-icon-chat" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="position: absolute; transition: opacity 0.2s, transform 0.2s;">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <svg id="sol-toggle-icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="position: absolute; opacity: 0; transform: rotate(-90deg); transition: opacity 0.2s, transform 0.2s;">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>

  <div id="sol-window" style="position: fixed; bottom: 100px; right: 28px; z-index: 9999; width: 370px; height: 560px; max-height: 82vh; background: white; border-radius: 20px; box-shadow: 0 12px 56px rgba(0,0,0,0.18); display: none; flex-direction: column; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); animation: sol-slidein 0.3s cubic-bezier(0.34,1.56,0.64,1);">
    <div id="sol-header" style="background: linear-gradient(135deg, #0A2540 0%, #1a6fc4 100%); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 18px; border: 2px solid rgba(255,255,255,0.3);">🤖</div>
        <div>
          <p style="color: white; font-size: 14px; font-weight: 700; margin: 0; line-height: 1.2;">Sol</p>
          <p style="color: rgba(255,255,255,0.75); font-size: 11px; margin: 0; display: flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #4ade80; display: inline-block; animation: sol-blink 2s infinite;"></span> Online agora</p>
        </div>
      </div>
      <button id="sol-header-close" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0;">✕</button>
    </div>
    <div id="sol-messages" style="flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #f9fafb;">
      <div style="background: white; border-radius: 12px; padding: 12px; max-width: 85%; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <p style="margin: 0; color: #1f2937; font-size: 13px; line-height: 1.5;">👋 Olá! Sou a Sol, assistente da Sol Contábil. Respondemos em segundos ✓</p>
      </div>
    </div>
    <div style="padding: 12px 16px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px; flex-shrink: 0;">
      <input id="sol-input" type="text" placeholder="Sua dúvida..." style="flex: 1; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px; font-size: 13px; outline: none; font-family: 'DM Sans', 'Segoe UI', sans-serif;">
      <button id="sol-send-btn" style="background: #1a6fc4; color: white; border: none; border-radius: 8px; padding: 8px 12px; cursor: pointer; font-weight: 600; font-family: 'DM Sans', 'Segoe UI', sans-serif;">→</button>
    </div>
  </div>

  <style>
    @keyframes sol-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 6px rgba(239,68,68,0)} }
    @keyframes sol-blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes sol-slidein { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    #sol-toggle:hover { transform: scale(1.1); box-shadow: 0 6px 32px rgba(26,111,196,0.65); }
    #sol-toggle.is-open { background: linear-gradient(145deg, #1a1a2e 0%, #374151 100%); }
    #sol-toggle.is-open #sol-toggle-icon-chat { opacity: 0; transform: rotate(90deg); }
    #sol-toggle.is-open #sol-toggle-icon-close { opacity: 1; transform: rotate(0deg); }
    @media (max-width: 480px) {
      #sol-window { width: calc(100vw - 16px); right: 8px; bottom: 84px; height: 72vh; border-radius: 16px; }
      #sol-toggle { bottom: 18px; right: 18px; width: 56px; height: 56px; }
    }
  </style>

  <script>
    const solToggle = document.getElementById('sol-toggle');
    const solWindow = document.getElementById('sol-window');
    const solHeaderClose = document.getElementById('sol-header-close');
    const solInput = document.getElementById('sol-input');
    const solSendBtn = document.getElementById('sol-send-btn');
    const solMessages = document.getElementById('sol-messages');
    const solBadge = document.getElementById('sol-badge');

    // Mostrar notificação automaticamente
    solBadge.style.display = 'flex';

    // Toggle da janela
    solToggle.addEventListener('click', () => {
      const isOpen = solWindow.style.display !== 'none';
      solWindow.style.display = isOpen ? 'none' : 'flex';
      solToggle.classList.toggle('is-open');
      if (!isOpen) {
        solInput.focus();
        solBadge.style.display = 'none';
      }
    });

    // Fechar janela
    solHeaderClose.addEventListener('click', () => {
      solWindow.style.display = 'none';
      solToggle.classList.remove('is-open');
    });

    // Enviar mensagem
    solSendBtn.addEventListener('click', () => {
      const msg = solInput.value.trim();
      if (msg) {
        const userMsg = document.createElement('div');
        userMsg.style.cssText = 'align-self: flex-end; background: #1a6fc4; color: white; border-radius: 12px; padding: 10px 12px; max-width: 85%; font-size: 13px; line-height: 1.5;';
        userMsg.textContent = msg;
        solMessages.appendChild(userMsg);
        solInput.value = '';

        setTimeout(() => {
          const botMsg = document.createElement('div');
          botMsg.style.cssText = 'background: white; border-radius: 12px; padding: 12px; max-width: 85%; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-size: 13px; line-height: 1.5;';
          botMsg.textContent = 'Obrigado pela sua mensagem! Um especialista da Sol Contábil entrará em contato em breve. 📞';
          solMessages.appendChild(botMsg);
          solMessages.scrollTop = solMessages.scrollHeight;
        }, 500);
      }
    });

    solInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') solSendBtn.click();
    });
  </script>

</body>
</html>`;

  // Salva o post
  const caminhoPost = path.join('blog', `${slug}.html`);
  fs.writeFileSync(caminhoPost, html, 'utf8');
  console.log(`💾 Post salvo: ${caminhoPost}`);

  // Atualiza index e sitemap
  atualizarIndexBlog(slug, resultado.titulo, resultado.metaDescription, dataFormatada, dataISO, tempoLeitura, tipo);
  gerarSitemap(dataISO);

  console.log(`🚀 Pronto! [${tipo.toUpperCase()}] "${resultado.titulo}"`);
}

// ============================================================
// BUSCA POSTS EXISTENTES
// ============================================================
function obterPostsExistentes() {
  const blogDir = path.join('blog');
  if (!fs.existsSync(blogDir)) return [];
  try {
    return fs.readdirSync(blogDir)
      .filter(f => f.endsWith('.html') && f !== 'index.html')
      .slice(-8)
      .map(arquivo => {
        const slug = arquivo.replace('.html', '');
        try {
          const conteudo = fs.readFileSync(path.join(blogDir, arquivo), 'utf8');
          const match = conteudo.match(/<title>([^<]+) - /);
          return { slug, titulo: match ? match[1] : slug.replace(/-/g, ' ') };
        } catch { return { slug, titulo: slug.replace(/-/g, ' ') }; }
      });
  } catch { return []; }
}

// ============================================================
// ATUALIZA O INDEX DO BLOG
// ============================================================
function atualizarIndexBlog(slug, titulo, descricao, dataFormatada, dataISO, tempoLeitura, tipo) {
  const indexPath = path.join('blog', 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('⚠️  blog/index.html não encontrado.');
    return;
  }

  const badgeHtml = tipo === 'pilar'
    ? `<span class="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mb-2">📚 Guia Completo</span>`
    : `<span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-2">🔍 Artigo</span>`;

  const novoCard = `
    <!-- POST: ${dataISO} -->
    <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="p-6">
        ${badgeHtml}
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-sol-blue font-semibold">${dataFormatada}</p>
          <span class="text-xs text-gray-400">⏱️ ${tempoLeitura}</span>
        </div>
        <h2 class="text-xl font-bold text-sol-dark mb-3 leading-tight">
          <a href="/blog/${slug}" class="hover:text-sol-blue transition-colors">${titulo}</a>
        </h2>
        <p class="text-gray-600 text-sm mb-4 leading-relaxed">${descricao}</p>
        <a href="/blog/${slug}" class="inline-block bg-sol-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          Ler artigo completo →
        </a>
      </div>
    </article>`;

  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  const marcador = '<!-- POSTS_INICIO -->';
  if (indexHtml.includes(marcador)) {
    indexHtml = indexHtml.replace(marcador, marcador + novoCard);
    fs.writeFileSync(indexPath, indexHtml, 'utf8');
    console.log('📋 Index do blog atualizado!');
  } else {
    console.log('⚠️  Adicione <!-- POSTS_INICIO --> no blog/index.html');
  }
}

// ============================================================
// GERA O SITEMAP.XML
// ============================================================
function gerarSitemap(dataISO) {
  const blogDir = path.join('blog');
  const paginasEstaticas = [
    { url: '/', prioridade: '1.0', frequencia: 'weekly' },
    { url: '/blog', prioridade: '0.9', frequencia: 'daily' },
    { url: '/servicos', prioridade: '0.8', frequencia: 'monthly' },
    { url: '/simuladores', prioridade: '0.7', frequencia: 'monthly' },
    { url: '/responsavel-tecnico', prioridade: '0.7', frequencia: 'monthly' },
  ];

  let urlsPosts = [];
  if (fs.existsSync(blogDir)) {
    urlsPosts = fs.readdirSync(blogDir)
      .filter(f => f.endsWith('.html') && f !== 'index.html')
      .map(arquivo => {
        const slugPost = arquivo.replace('.html', '');
        let dataPost = dataISO;
        try { dataPost = fs.statSync(path.join(blogDir, arquivo)).mtime.toISOString().split('T')[0]; } catch {}
        return `  <url>
    <loc>https://solcontabil.com.br/blog/${slugPost}</loc>
    <lastmod>${dataPost}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });
  }

  const urlsEstaticas = paginasEstaticas.map(p => `  <url>
    <loc>https://solcontabil.com.br${p.url}</loc>
    <lastmod>${dataISO}</lastmod>
    <changefreq>${p.frequencia}</changefreq>
    <priority>${p.prioridade}</priority>
  </url>`).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsEstaticas}
${urlsPosts.join('\n')}
</urlset>`;

  fs.writeFileSync('sitemap.xml', sitemap, 'utf8');
  console.log(`🗺️  Sitemap atualizado com ${urlsPosts.length} posts!`);
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
