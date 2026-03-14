const SALARIO_MINIMO = 1621.00;
const TETO_INSS = 8475.55;

// Tabela IRPF 2026
const FAIXAS_IRPF = [
    { limite: 5000, aliquota: 0, deducao: 0 },
    { limite: 6500, aliquota: 0.075, deducao: 375 },
    { limite: 8000, aliquota: 0.15, deducao: 862.5 },
    { limite: 11000, aliquota: 0.225, deducao: 1462.5 },
    { limite: Infinity, aliquota: 0.275, deducao: 2012.5 }
];

// Tabela Simples Nacional - Anexo III (Exemplo)
const ANEXO_III = [
    { limite: 180000, aliquota: 0.06, deducao: 0 },
    { limite: 360000, aliquota: 0.112, deducao: 9360 },
    { limite: 720000, aliquota: 0.135, deducao: 17640 },
    { limite: 1800000, aliquota: 0.16, deducao: 35640 },
    { limite: 3600000, aliquota: 0.21, deducao: 125640 },
    { limite: 4800000, aliquota: 0.33, deducao: 648000 }
];

function calcularIRPF(baseCalculo) {
    for (const faixa of FAIXAS_IRPF) {
        if (baseCalculo <= faixa.limite) {
            return (baseCalculo * faixa.aliquota) - faixa.deducao;
        }
    }
}

function calcularINSSAutonomo(rendimento) {
    const base = Math.min(rendimento, TETO_INSS);
    return base * 0.20;
}

function calcularINSSSocio(prolabore) {
    const base = Math.min(prolabore, TETO_INSS);
    return base * 0.11;
}

function calcularSimplesNacional(faturamentoAnual, folhaPagamentoAnual) {
    const fatorR = folhaPagamentoAnual / faturamentoAnual;
    let anexo = ANEXO_III; // Simplificado para Anexo III com Fator R > 28%

    for (const faixa of anexo) {
        if (faturamentoAnual <= faixa.limite) {
            const aliquotaEfetiva = ((faturamentoAnual * faixa.aliquota) - faixa.deducao) / faturamentoAnual;
            return faturamentoAnual * aliquotaEfetiva;
        }
    }
    
    return 0;
}
