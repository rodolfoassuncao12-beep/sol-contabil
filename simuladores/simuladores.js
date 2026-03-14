function simularEconomiaTributaria(faturamentoMensal, regimeAtual, atividade, temFuncionarios) {
    const faturamentoAnual = faturamentoMensal * 12;
    // Lógica de cálculo simplificada para o exemplo
    const impostoAtualEstimado = faturamentoAnual * 0.15; // Exemplo
    const impostoOtimizadoEstimado = faturamentoAnual * 0.10; // Exemplo
    const economiaMensal = (impostoAtualEstimado - impostoOtimizadoEstimado) / 12;
    const economiaAnual = impostoAtualEstimado - impostoOtimizadoEstimado;

    return {
        impostoAtualEstimado,
        impostoOtimizadoEstimado,
        economiaMensal,
        economiaAnual
    };
}

function simularPfVsPj(faturamentoMensal, especialidade, cidade) {
    const faturamentoAnual = faturamentoMensal * 12;

    // Cálculos para Pessoa Física
    const inssPf = calcularINSSAutonomo(faturamentoMensal);
    const baseCalculoIrpf = faturamentoMensal - inssPf;
    const irpfPf = calcularIRPF(baseCalculoIrpf);
    const issPf = faturamentoMensal * 0.05;
    const totalPf = inssPf + irpfPf + issPf;

    // Cálculos para Pessoa Jurídica (Simples Nacional)
    const prolabore = Math.max(SALARIO_MINIMO, faturamentoMensal * 0.28);
    const inssPjSocio = calcularINSSSocio(prolabore);
    const simplesNacional = calcularSimplesNacional(faturamentoAnual, prolabore * 12) / 12;
    const irpfPjSocio = calcularIRPF(prolabore - inssPjSocio);
    const totalPj = simplesNacional + inssPjSocio + irpfPjSocio;

    const economiaMensal = totalPf - totalPj;
    const economiaAnual = economiaMensal * 12;

    return {
        pf: {
            inss: inssPf,
            irpf: irpfPf,
            iss: issPf,
            total: totalPf
        },
        pj: {
            das: simplesNacional,
            inssSocio: inssPjSocio,
            irpfSocio: irpfPjSocio,
            total: totalPj
        },
        economiaMensal,
        economiaAnual
    };
}
