const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// ============================================================
// LISTA DE TEMAS - Rotação automática diária
// ============================================================
const TEMAS = [
  // Abertura de empresa
  "Como abrir uma empresa em Limeira SP passo a passo",
  "Como abrir empresa em Campinas SP: guia completo",
  "Como abrir empresa em Piracicaba SP: tudo que você precisa saber",
  "Abertura de empresa para médicos em Limeira SP",
  "Como abrir empresa para dentistas em Limeira SP",
  "Como abrir empresa para advogados em Limeira SP",
  "Como abrir empresa para engenheiros em Limeira SP",
  "Como abrir empresa para psicólogos: guia completo",
  "Como abrir empresa para personal trainer: passo a passo",
  "Como abrir empresa para consultores: guia completo",

  // MEI
  "MEI: tudo que você precisa saber em 2026",
  "Obrigações fiscais do MEI em 2026",
  "DAS MEI: o que é e como pagar",
  "MEI pode ter funcionário? Tudo que você precisa saber",
  "Como fazer a transição de MEI para ME",
  "MEI: quais serviços podem ser cadastrados",
  "Limite de faturamento do MEI: o que acontece se ultrapassar",
  "MEI pode emitir nota fiscal? Guia completo",
  "INSS MEI: como funciona a aposentadoria do microempreendedor",
  "Como cancelar o MEI: passo a passo completo",

  // Impostos e tributação
  "Como declarar o Imposto de Renda corretamente",
  "Simples Nacional: vantagens e desvantagens",
  "Diferença entre Lucro Presumido e Lucro Real",
  "Como reduzir impostos legalmente para pequenas empresas",
  "IRPJ: tudo sobre o Imposto de Renda Pessoa Jurídica",
  "CSLL: o que é e como calcular",
  "PIS e COFINS: guia completo para pequenas empresas",
  "ISS: o que é e quem deve pagar",
  "ICMS: guia completo para empresas em São Paulo",
  "Planejamento tributário: o que é e por que é importante",
  "Regime tributário: como escolher o melhor para sua empresa",
  "Como pagar menos imposto legalmente em 2026",
  "Substituição tributária: o que é e como funciona",

  // Folha de pagamento e RH
  "Como fazer a folha de pagamento corretamente",
  "Como registrar funcionário corretamente em 2026",
  "13 salário: como calcular e quando pagar",
  "Férias: cálculo e obrigações do empregador",
  "FGTS: o que é, como funciona e quando sacar",
  "Rescisão trabalhista: como calcular e pagar corretamente",
  "Horas extras: como calcular e registrar corretamente",
  "Como calcular o salário líquido de um funcionário",
  "eSocial: guia completo para pequenas empresas",

  // Contabilidade geral
  "O que é pro-labore e como calcular",
  "Como emitir nota fiscal eletrônica passo a passo",
  "Gestão financeira para pequenas empresas",
  "DRE: o que é e como interpretar o demonstrativo",
  "Como fazer balanço patrimonial para pequenas empresas",
  "Notas fiscais: tipos e quando usar cada uma",
  "Fluxo de caixa: como montar e controlar",
  "Como trocar de contador sem complicações",
  "Erros fiscais mais comuns e como evitá-los",
  "Contabilidade online: vantagens e como funciona",
  "CNPJ: como consultar e o que cada informação significa",
  "INSS para autônomos: como contribuir e valores",

  // Nichos específicos
  "Contabilidade para médicos: guia completo",
  "Contabilidade para advogados: o que você precisa saber",
  "Contabilidade para restaurantes e bares em Limeira",
  "Contabilidade para e-commerce: guia completo 2026",
  "Contabilidade para influenciadores digitais",
  "Contabilidade para transportadores autônomos",
  "Contabilidade para construtoras: guia completo",
  "Contabilidade para clínicas de estética",
  "Contabilidade para academias e personal trainers",

  // Obrigações acessórias
  "SPED Contábil: o que é e como funciona",
  "Certidão negativa de débitos: como obter e para que serve",
  "Inscrição estadual: o que é e como obter",
  "Alvará de funcionamento: como obter em Limeira SP",
];

// ============================================================
// TEMAS SAZONAIS - Prioridade em meses específicos
// ============================================================
const TEMAS_SAZONAIS = {
  '01': [
    "Planejamento tributário 2026: como começar o ano certo",
    "Obrigações fiscais de janeiro: o que sua empresa precisa fazer",
  ],
  '03': [
    "Declaração do Imposto de Renda 2026: guia completo",
    "IR 2026: deduções que você pode usar para pagar menos imposto",
    "Malha fina: como evitar e o que fazer se cair",
  ],
  '04': [
    "Prazo do Imposto de Renda: como não perder e evitar multas",
    "Restituição do IR: quando receber e como consultar",
  ],
  '11': [
    "13 salário primeira parcela: como calcular e pagar corretamente",
    "Planejamento de fim de ano para sua empresa: checklist fiscal",
  ],
  '12': [
    "Fechamento fiscal do ano: o que sua empresa precisa fazer",
    "13 salário segunda parcela: prazo e como calcular",
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
// FUNÇÃO PRINCIPAL
// ============================================================
async function main() {
  const client = new Anthropic();
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const dataISO = hoje.toISOString().split('T')[0];

  // Escolhe tema sazonal se existir, senão rotaciona lista geral
  let tema;
  const sazonais = TEMAS_SAZONAIS[mes];
  if (sazonais && sazonais.length > 0) {
    const diaDoMes = hoje.getDate();
    if (diaDoMes <= sazonais.length) {
      tema = sazonais[diaDoMes - 1];
    }
  }
  if (!tema) {
    const diaDoAno = Math.floor((Date.now() - new Date(hoje.getFullYear(), 0, 0)) / 86400000);
    tema = TEMAS[diaDoAno % TEMAS.length];
  }

  console.log(`📝 Gerando post sobre: "${tema}"`);

  // Gera o slug para a URL
  const slug = tema
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 60);

  // Busca posts existentes para sugerir links internos ao Claude
  const postsExistentes = obterPostsExistentes();
  const sugestaoLinks = postsExistentes.length > 0
    ? `\nLINKS INTERNOS DISPONÍVEIS (inclua 2-3 naturalmente no texto quando relevante):\n` +
      postsExistentes.slice(0, 6).map(p => `- /blog/${p.slug} → "${p.titulo}"`).join('\n')
    : '';

  // ============================================================
  // PROMPT PARA O CLAUDE
  // ============================================================
  const prompt = `Você é um especialista em contabilidade e SEO. Crie um artigo de blog COMPLETO em português brasileiro sobre o tema: "${tema}"

O artigo deve ser para o escritório de contabilidade "${CONFIG.empresa}" localizado em ${CONFIG.cidade}-SP.
${sugestaoLinks}

ESTRUTURA OBRIGATÓRIA (retorne APENAS o JSON válido, sem markdown):
{
  "titulo": "Título otimizado com palavra-chave principal (máx 60 chars)",
  "metaDescription": "Meta description atraente com palavra-chave (máx 160 chars)",
  "heroSubtitle": "Subtítulo curto e impactante para o hero (máx 100 chars)",
  "keywords": "palavra1, palavra2, palavra3, palavra4, palavra5",
  "tempoLeitura": "6 min",
  "conteudo": "HTML completo do artigo. Use estas seções: introducao (2-3 paragrafos mencionando ${CONFIG.cidade} e ${CONFIG.empresa}), explicacao detalhada com h3 e listas ul, passo a passo com ol, FAQ com 3-4 perguntas em h3, conclusao. Tags: section class mb-8, h2 class text-2xl font-bold mb-4, h3 class text-xl font-semibold mb-3, p class mb-4 leading-relaxed, ul class list-disc list-inside ml-4 mb-4 leading-relaxed. Tamanho: 1200-1500 palavras.",
  "ctaTexto": "Falar com a Sol Contábil via WhatsApp"
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

  // ============================================================
  // MONTA O HTML COMPLETO DO POST
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

</body>
</html>`;

  // Salva o post
  const caminhoPost = path.join('blog', `${slug}.html`);
  fs.writeFileSync(caminhoPost, html, 'utf8');
  console.log(`💾 Post salvo: ${caminhoPost}`);

  // Atualiza index e sitemap
  atualizarIndexBlog(slug, resultado.titulo, resultado.metaDescription, dataFormatada, dataISO, tempoLeitura);
  gerarSitemap(dataISO);

  console.log('🚀 Tudo pronto! Vercel vai publicar automaticamente.');
}

// ============================================================
// BUSCA POSTS EXISTENTES para links internos
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
function atualizarIndexBlog(slug, titulo, descricao, dataFormatada, dataISO, tempoLeitura) {
  const indexPath = path.join('blog', 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('⚠️  blog/index.html não encontrado.');
    return;
  }

  const novoCard = `
    <!-- POST: ${dataISO} -->
    <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="p-6">
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
    console.log('⚠️  Adicione <!-- POSTS_INICIO --> dentro da grid no blog/index.html');
  }
}

// ============================================================
// GERA O SITEMAP.XML COMPLETO
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
