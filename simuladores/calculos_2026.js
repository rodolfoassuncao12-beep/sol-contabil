// PARÂMETROS FISCAIS 2026 - SOL CONTÁBIL
const PARAMETROS_2026 = {
  salarioMinimo: 1621.00,
  tetoINSS: 8475.55,
  isencaoIRPF: 5000.00,
  limiteFaturamentoMEI: 81000.00, // anual
  
  // DAS MEI 2026 (valores fixos)
  dasMEI: {
    comercio: 82.05,
    servicos: 86.05,
    misto: 87.05
  },
  
  // Tabela IRPF 2026
  irpf: [
    { ate: 5000, aliquota: 0, deducao: 0 },
    { de: 5000.01, ate: 6500, aliquota: 0.075, deducao: 375 },
    { de: 6500.01, ate: 8000, aliquota: 0.15, deducao: 862.50 },
    { de: 8000.01, ate: 11000, aliquota: 0.225, deducao: 1462.50 },
    { de: 11000.01, ate: Infinity, aliquota: 0.275, deducao: 2012.50 }
  ],
  
  // INSS
  inss: {
    autonomoPF: 0.20, // 20% sobre rendimento
    socioPJ: 0.11,    // 11% sobre pró-labore
    tetoMensalPF: 1695.11,
    tetoMensalPJ: 932.31
  },
  
  // ISS
  iss: 0.05, // 5% para Limeira/SP
  
  // Simples Nacional - Anexo I (Comércio)
  simplesAnexoI: [
    { faixa: 1, ate: 180000, aliquota: 0.04, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 0.073, deducao: 5940 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 0.095, deducao: 13860 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 0.107, deducao: 22500 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 0.143, deducao: 87300 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 0.19, deducao: 256440 }
  ],
  
  // Simples Nacional - Anexo III (Serviços)
  simplesAnexoIII: [
    { faixa: 1, ate: 180000, aliquota: 0.06, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 0.112, deducao: 9360 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 0.135, deducao: 17640 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 0.16, deducao: 35640 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 0.21, deducao: 125640 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 0.33, deducao: 557640 }
  ],
  
  // Simples Nacional - Anexo V (Serviços - TI, Medicina, Engenharia, Advocacia)
  simplesAnexoV: [
    { faixa: 1, ate: 180000, aliquota: 0.155, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 0.18, deducao: 4500 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 0.195, deducao: 9900 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 0.205, deducao: 17100 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 0.23, deducao: 62100 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 0.305, deducao: 332100 }
  ],
  
  // Lucro Presumido
  lucroPresumido: {
    comercio: { irpj: 0.08, csll: 0.12 },
    servicos: { irpj: 0.32, csll: 0.32 },
    servicesHospitalares: { irpj: 0.08, csll: 0.12 },
    irpjAliquota: 0.15,
    irpjAdicional: 0.10,
    csllAliquota: 0.09,
    pis: 0.0065,
    cofins: 0.03
  }
};

// Função para calcular IRPF
function calcularIRPF(rendimento) {
  for (let faixa of PARAMETROS_2026.irpf) {
    if (rendimento <= faixa.ate) {
      return Math.max(0, (rendimento * faixa.aliquota) - faixa.deducao);
    }
  }
  return 0;
}

// Função para calcular alíquota efetiva do Simples Nacional
function calcularAliquotaSimples(rbt12, tabela) {
  for (let faixa of tabela) {
    if (rbt12 >= (faixa.de || 0) && rbt12 <= faixa.ate) {
      return ((rbt12 * faixa.aliquota) - faixa.deducao) / rbt12;
    }
  }
  return 0;
}

// SIMULADOR 1: MEI vs LTDA
function simularMeiVsLtda(faturamentoMensal, atividade) {
  const faturamentoAnual = faturamentoMensal * 12;
  
  // MEI
  let dasMEI = PARAMETROS_2026.dasMEI.servicos; // padrão
  if (atividade === 'comercio') dasMEI = PARAMETROS_2026.dasMEI.comercio;
  else if (atividade === 'misto') dasMEI = PARAMETROS_2026.dasMEI.misto;
  
  const alertaMEI = faturamentoAnual > PARAMETROS_2026.limiteFaturamentoMEI 
    ? `⚠️ Seu faturamento ultrapassa o limite do MEI (R$ 81.000/ano). Você precisará migrar para ME ou LTDA.`
    : '';
  
  const meiImposto = dasMEI;
  const meiLiquido = faturamentoMensal - meiImposto;
  
  // LTDA - Simples Nacional
  const rbt12 = faturamentoMensal * 12;
  const tabela = atividade === 'comercio' ? PARAMETROS_2026.simplesAnexoI : PARAMETROS_2026.simplesAnexoIII;
  const aliquotaEfetiva = calcularAliquotaSimples(rbt12, tabela);
  const ltdaImposto = faturamentoMensal * aliquotaEfetiva;
  const honorariosContador = 250;
  const ltdaLiquido = faturamentoMensal - ltdaImposto - honorariosContador;
  
  const economia = Math.abs(meiLiquido - ltdaLiquido);
  const melhorOpcao = meiLiquido > ltdaLiquido ? 'MEI' : 'LTDA';
  
  return {
    mei: {
      imposto: meiImposto,
      liquido: meiLiquido,
      alerta: alertaMEI
    },
    ltda: {
      imposto: ltdaImposto,
      honorarios: honorariosContador,
      liquido: ltdaLiquido
    },
    economia: economia,
    melhorOpcao: melhorOpcao
  };
}

// SIMULADOR 2: Regime Tributário
function simularRegimeTributario(faturamentoMensal, atividade) {
  const rbt12 = faturamentoMensal * 12;
  
  // Simples Nacional
  const tabela = atividade === 'comercio' ? PARAMETROS_2026.simplesAnexoI : PARAMETROS_2026.simplesAnexoV;
  const aliquotaSimples = calcularAliquotaSimples(rbt12, tabela);
  const impostoSimples = faturamentoMensal * aliquotaSimples;
  
  // Lucro Presumido
  const basePresumida = faturamentoMensal * (atividade === 'comercio' ? 0.08 : 0.32);
  const irpj = basePresumida * 0.15;
  const irpjAdicional = Math.max(0, (basePresumida - 20000) * 0.10);
  const csll = basePresumida * 0.09;
  const pis = faturamentoMensal * 0.0065;
  const cofins = faturamentoMensal * 0.03;
  const issLP = faturamentoMensal * 0.05;
  const impostoLucroPresumido = irpj + irpjAdicional + csll + pis + cofins + issLP;
  
  // Lucro Real (apenas indicativo)
  const impostoLucroReal = faturamentoMensal * 0.25; // estimativa
  
  const economia = impostoLucroPresumido - impostoSimples;
  const melhorOpcao = 'Simples Nacional';
  
  return {
    simples: impostoSimples,
    lucroPresumido: impostoLucroPresumido,
    lucroReal: impostoLucroReal,
    economia: economia,
    melhorOpcao: melhorOpcao
  };
}

// SIMULADOR 3: Abertura de Empresa
function simularAberturaEmpresa(faturamentoMensal, atividade, temSocios) {
  const faturamentoAnual = faturamentoMensal * 12;
  
  let recomendacao = {};
  
  if (faturamentoAnual <= 81000) {
    recomendacao = {
      tipo: 'MEI',
      regime: 'MEI',
      imposto: PARAMETROS_2026.dasMEI.servicos,
      custoAbertura: 0,
      prazo: 'Imediato',
      descricao: 'Microempreendedor Individual - Ideal para começar'
    };
  } else if (faturamentoAnual <= 360000) {
    recomendacao = {
      tipo: 'ME (Microempresa)',
      regime: 'Simples Nacional',
      imposto: faturamentoMensal * 0.08,
      custoAbertura: 1500,
      prazo: '15 a 30 dias',
      descricao: 'Microempresa - Ótimo para crescimento'
    };
  } else if (faturamentoAnual <= 4800000) {
    recomendacao = {
      tipo: 'EPP (Empresa de Pequeno Porte)',
      regime: 'Simples Nacional',
      imposto: faturamentoMensal * 0.12,
      custoAbertura: 2000,
      prazo: '30 a 45 dias',
      descricao: 'Empresa de Pequeno Porte - Consolidação'
    };
  } else {
    recomendacao = {
      tipo: 'LTDA ou SLU',
      regime: 'Lucro Presumido/Real',
      imposto: faturamentoMensal * 0.20,
      custoAbertura: 3000,
      prazo: '30 a 45 dias',
      descricao: 'Empresa de Grande Porte - Análise personalizada'
    };
  }
  
  if (temSocios) {
    recomendacao.tipo = 'LTDA';
    recomendacao.descricao = 'Sociedade Limitada - Obrigatório com sócios';
  } else if (faturamentoAnual > 360000) {
    recomendacao.tipo = 'SLU (Sociedade Limitada Unipessoal)';
    recomendacao.descricao = 'Sem sócios, sem limite de faturamento';
  }
  
  return recomendacao;
}

// SIMULADOR 4: Honorários Contábeis
function calcularHonorarios(faturamentoMensal, nFuncionarios, regime, nNotasFiscais) {
  let honorarioBase = 0;
  
  // Faixa de faturamento
  if (faturamentoMensal <= 15000) {
    honorarioBase = 425; // média entre 350 e 500
  } else if (faturamentoMensal <= 30000) {
    honorarioBase = 650;
  } else if (faturamentoMensal <= 60000) {
    honorarioBase = 1000;
  } else {
    honorarioBase = 1600;
  }
  
  // Adicional por funcionário
  let adicionalFuncionarios = 0;
  if (nFuncionarios > 0) {
    if (nFuncionarios === 1) {
      adicionalFuncionarios = 100;
    } else if (nFuncionarios <= 5) {
      adicionalFuncionarios = nFuncionarios * 80;
    } else if (nFuncionarios <= 10) {
      adicionalFuncionarios = nFuncionarios * 65;
    } else {
      adicionalFuncionarios = nFuncionarios * 50;
    }
  }
  
  // Adicional por regime
  let adicionalRegime = 0;
  if (regime === 'lucroPresumido') {
    adicionalRegime = honorarioBase * 0.40;
  } else if (regime === 'lucroReal') {
    adicionalRegime = honorarioBase * 0.80;
  }
  
  // Adicional por notas fiscais
  let adicionalNotas = 0;
  if (nNotasFiscais > 10 && nNotasFiscais <= 30) {
    adicionalNotas = 50;
  } else if (nNotasFiscais > 30 && nNotasFiscais <= 100) {
    adicionalNotas = 120;
  } else if (nNotasFiscais > 100) {
    adicionalNotas = 250;
  }
  
  const honorarioTotal = honorarioBase + adicionalFuncionarios + adicionalRegime + adicionalNotas;
  
  return {
    base: honorarioBase,
    adicionaisFuncionarios: adicionalFuncionarios,
    adicionaisRegime: adicionalRegime,
    adicionaisNotas: adicionalNotas,
    total: honorarioTotal,
    minimo: honorarioTotal * 0.85,
    maximo: honorarioTotal * 1.15
  };
}

// SIMULADOR 5: Economia Tributária
function simularEconomiaTributaria(faturamentoMensal, regimeAtual, atividade) {
  const rbt12 = faturamentoMensal * 12;
  
  // Imposto atual
  let impostoAtual = 0;
  if (regimeAtual === 'MEI') {
    impostoAtual = PARAMETROS_2026.dasMEI.servicos;
  } else if (regimeAtual === 'Simples Nacional') {
    const tabela = atividade === 'comercio' ? PARAMETROS_2026.simplesAnexoI : PARAMETROS_2026.simplesAnexoV;
    const aliquota = calcularAliquotaSimples(rbt12, tabela);
    impostoAtual = faturamentoMensal * aliquota;
  } else if (regimeAtual === 'Lucro Presumido') {
    const basePresumida = faturamentoMensal * (atividade === 'comercio' ? 0.08 : 0.32);
    impostoAtual = (basePresumida * 0.15) + (basePresumida * 0.09) + (faturamentoMensal * 0.0065) + (faturamentoMensal * 0.03) + (faturamentoMensal * 0.05);
  }
  
  // Imposto otimizado (sempre Simples Nacional)
  const tabelaOtimizada = atividade === 'comercio' ? PARAMETROS_2026.simplesAnexoI : PARAMETROS_2026.simplesAnexoIII;
  const aliquotaOtimizada = calcularAliquotaSimples(rbt12, tabelaOtimizada);
  const impostoOtimizado = faturamentoMensal * aliquotaOtimizada;
  
  const economia = impostoAtual - impostoOtimizado;
  
  return {
    impostoAtual: impostoAtual,
    impostoOtimizado: impostoOtimizado,
    economia: Math.max(0, economia),
    economiaAnual: Math.max(0, economia * 12)
  };
}

// SIMULADOR 6: PF vs PJ para Profissionais de Saúde
function simularPfVsPjSaude(faturamentoMensal, especialidade) {
  // PF Autônomo
  const inssPF = Math.min(faturamentoMensal * 0.20, PARAMETROS_2026.inss.tetoMensalPF);
  const issPF = faturamentoMensal * 0.05;
  const baseIrpfPF = faturamentoMensal - inssPF;
  const irpfPF = calcularIRPF(baseIrpfPF);
  const totalPF = inssPF + issPF + irpfPF;
  
  // PJ Simples Nacional - Anexo III (com Fator R >= 28%)
  const rbt12 = faturamentoMensal * 12;
  const aliquotaAnexoIII = calcularAliquotaSimples(rbt12, PARAMETROS_2026.simplesAnexoIII);
  const dasPJ = faturamentoMensal * aliquotaAnexoIII;
  
  // Pró-labore (28% para garantir Fator R)
  const proLabore = faturamentoMensal * 0.28;
  const inssSocioPJ = Math.min(proLabore * 0.11, PARAMETROS_2026.inss.tetoMensalPJ);
  const baseIrpfPJ = proLabore - inssSocioPJ;
  const irpfPJ = calcularIRPF(baseIrpfPJ);
  const totalPJ = dasPJ + inssSocioPJ + irpfPJ;
  
  const economia = totalPF - totalPJ;
  
  return {
    pf: {
      inss: inssPF,
      iss: issPF,
      irpf: irpfPF,
      total: totalPF
    },
    pj: {
      das: dasPJ,
      inss: inssSocioPJ,
      irpf: irpfPJ,
      total: totalPJ
    },
    economia: Math.max(0, economia),
    economiaAnual: Math.max(0, economia * 12),
    melhorOpcao: totalPF > totalPJ ? 'PJ' : 'PF'
  };
}
