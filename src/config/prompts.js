/**
 * Configuração centralizada de prompts do sistema
 * 
 * Este arquivo centraliza todos os prompts utilizados no sistema,
 * organizados por empresa e tipo de análise, facilitando manutenção 
 * e expansão para novas empresas.
 */

export const PROMPTS = {
  /**
   * Configurações por empresa
   */
  COMPANIES: {
    'enia-marcia-joias': {
      name: 'Enia Marcia Joias',
      icon: 'fas fa-gem',
      FINANCIAL: {
        RECEIPT: `Identifique se é uma ORDEM DE SERVIÇO, um COMPROVANTE DE RECEBIMENTO DA STONE ou um COMPROVANTE DE VENDA:

**ORDEM DE SERVIÇO:**
Características: documento que contém "ordem de serviço" e seções "RECEBEMOS" e "Restante".

Dados a extrair:
1. DATA: Procure EXCLUSIVAMENTE no campo "Data:" que está na seção "Restante" (lado direito do documento) ou no Comprovante da Stone podendo estar no canto superior direito ou esquerdo. IGNORE todas as outras datas do documento.
2. NOME DO CLIENTE: Procure por campo "Cliente:" ou similar
3. NÚMERO DA ORDEM: Procure por "Nº" seguido de números (exemplo: "Nº 1747") - pode estar no canto superior direito
4. VALOR: Procure nos seguintes locais, em ORDEM DE PRIORIDADE:
   - PRIMEIRO: Campo "DÉBITO" com valor R$ (se existir)
   - SEGUNDO: Campo "Valor Total:"
   - TERCEIRO: Qualquer valor em destaque

FORMATO DE RETORNO: XX-XX VENDA XXXX NOME_CLIENTE XXX,XX

EXEMPLO: 26-03 VENDA 1747 HELIO FILHO 1285,00

**COMPROVANTE DE RECEBIMENTO DA STONE:**
Características: contém "STONE" e "Comprovante de recebimento" ou "Stone Instituição de Pagamentos S.A."

Dados a extrair:
1. DATA: Procure abaixo de "Comprovante de recebimento"
2. NOME: Campo "QUEM PAGOU"
3. NÚMERO: Número escrito à mão na folha (se houver)
4. VALOR: Campo "Valor"

FORMATO DE RETORNO: XX-XX VENDA XXXX NOME_CLIENTE XXX,XX

EXEMPLO: 01-04 VENDA 5866 HELIO FILHO 2090,00

**COMPROVANTE DE VENDA:**
Características: contém "Nº" em vermelho no canto inferior direito e "agradecemos a preferência"

Dados a extrair:
1. DATA: Campo "Entrada:"
2. NOME: Campo "Nome:"
3. NÚMERO: Número vermelho no canto inferior direito (nunca manuscrito)
4. VALOR: Campo "Total R$"

FORMATO DE RETORNO: XX-XX VENDA XXXX NOME_CLIENTE XXX,XX

EXEMPLO: 01-04 VENDA 5866 HELIO FILHO 2090,00

**COMPROVANTE DE RECEBIMENTO DA Sicoob:**
Características: contém "SICOOB" e "Comprovante de recebimento" ou "Comprovante de recebimento Pix"

Dados a extrair:
1. DATA: Procure ao lado esquerdo de "Recebido em"
2. NOME: Campo "Pagador" abaixo de "Nome"
3. NÚMERO: Número escrito à mão na folha (se houver)
4. VALOR: Abaixo de "Comprovante de recebimento Pix"

FORMATO DE RETORNO: XX-XX VENDA XXXX NOME_CLIENTE XXX,XX

EXEMPLO: 01-04 VENDA 5866 HELIO FILHO 2090,00

**REGRAS GERAIS:**
- Use "ND" para dados não encontrados
- RETORNE APENAS no formato especificado
- Formato obrigatório: XX-XX VENDA XXXX NOME_CLIENTE XXX,XX`,

        PAYMENT: `pizza`
      }
    },

    'eletromoveis': {
      name: 'Eletromoveis',
      icon: 'fas fa-car-battery',
      FINANCIAL: {
        RECEIPT: `Identifique se é um COMPROVANTE DE CARTÃO e extraia os seguintes dados:

Características para identificação:
Contém bandeira do cartão (ex: Mastercard)
Campo “VENDA DÉBITO” ou “VENDA CRÉDITO”
Campo “VALOR”
Campo com data e hora da operação

Dados a extrair:
DATA: Campo de data da operação (após “VALOR”)
OPERAÇÃO: O texto logo acima do valor, indicando se foi “VENDA DÉBITO” ou “VENDA CRÉDITO”
VALOR: Campo “VALOR”

FORMATO DE RETORNO:
XX-XX CARTAO OPERACAO XXX,XX

onde:
XX-XX = dia e mês da data da operação
OPERACAO = tipo da operação (“VENDA DÉBITO” ou “VENDA CRÉDITO”)
XXX,XX = valor, com ponto como separador decimal

EXEMPLO DE RETORNO:
03-06 CARTAO VENDA DÉBITO 70,00

Identifique se é um COMPROVANTE DE VENDA de cartão PicPay e extraia os seguintes dados:

Características para identificação:
Logotipo ou nome PicPay
Campo “COMPROVANTE DE VENDA”
Campo com data e hora no topo
Campo “VALOR” com destaque

Dados a extrair:
DATA: Campo de data da operação (normalmente no topo, junto ao horário)
OPERAÇÃO: Campo logo abaixo de “VALOR” indicando “Crédito” ou “Débito”
VALOR: Campo “VALOR” com cifra em reais

FORMATO DE RETORNO:
XX-XX CARTAO OPERACAO XXX,XX

onde:
XX-XX = dia e mês da data da operação
OPERACAO = tipo da operação (“VENDA CRÉDITO” ou “VENDA DÉBITO”)
XXX,XX = valor, com ponto como separador decimal

EXEMPLO DE RETORNO:
11-06 CARTAO VENDA CRÉDITO 242,00

Identifique se é um COMPROVANTE DE DEPÓSITO do Sicoob e extraia os seguintes dados:

Características para identificação:
Logotipo ou nome SICOOB
Campo “DEPÓSITO CONTA CORRENTE”
Campo “DATA DO DEPÓSITO”
Campo “VALOR”

Dados a extrair:
DATA DO DEPÓSITO: Campo “Data do Depósito”
TIPO DE OPERAÇÃO: Campo “Operacao”, verificando se contém “DEPÓSITO CONTA CORRENTE”
VALOR: Campo “Valor”

FORMATO DE RETORNO:
XX-XX DEPOSITO CONTA CORRENTE XXX,XX

onde:
XX-XX = dia e mês da data do depósito
XXX,XX = valor depositado, com ponto como separador decimal

EXEMPLO DE RETORNO:
03-06 DEPOSITO CONTA CORRENTE 7944,00

Identifique se é um COMPROVANTE DE DEPÓSITO EM CONTA CORRENTE do Bradesco e extraia os seguintes dados:

Características para identificação:
Logotipo Bradesco Expresso
Campo “DEPÓSITO EM CONTA CORRENTE”
Campo “VALOR TOTAL”
Campo com data e hora da operação

Dados a extrair:
DATA: Campo de data da operação (após “Data”)
TIPO DE OPERAÇÃO: Sempre retorne “DEPÓSITO CONTA CORRENTE”
VALOR TOTAL: Campo “VALOR TOTAL”

FORMATO DE RETORNO:
XX-XX DEPOSITO CONTA CORRENTE XXX,XX

onde:
XX-XX = dia e mês da data do depósito
XXX,XX = valor total, com ponto como separador decimal

EXEMPLO DE RETORNO:
20-06 DEPOSITO CONTA CORRENTE 2000,00

`,

        PAYMENT: `Identifique se é uma NOTA FISCAL DE VENDA e extraia os seguintes dados:

Características para identificação:
Contém “NOTA FISCAL ELETRÔNICA”
Campo “VENDA” como natureza da operação
Campo “VALOR TOTAL DA NOTA” ou “TOTAL DA NOTA”
Campo “DATA DE EMISSÃO”

Dados a extrair:
DATA DE EMISSÃO: Procure o campo com a etiqueta “Data de Emissão”
NOME DO FORNECEDOR: Campo “Razão Social” no topo do documento
VALOR DA NOTA: Campo “TOTAL DA NOTA” (não confundir com total dos produtos)
FORMATO DE RETORNO:
XX-XX FORNECEDOR NOME_FORNECEDOR XXX,XX

onde:
XX-XX = dia e mês da data de emissão
NOME_FORNECEDOR = nome completo do fornecedor
XXX,XX = valor total da nota
EXEMPLO DE RETORNO:
02-06 FORNECEDOR J&A MOVEIS LTDA - EPP 1.535,49

Identifique se é um COMPROVANTE DE ENVIO PIX do Sicoob e extraia os seguintes dados:

Características para identificação:
Logotipo do SICOOB
Contém “Comprovante de envio Pix”
Campo “Transferido” com data e hora

Dados a extrair:
RECEBEDOR: Nome no campo “Recebedor”
DESCRIÇÃO: Texto abaixo do valor transferido (exemplo: “compra de pés de madeira”)
VALOR: Campo “R$” destacado logo abaixo de “Comprovante de envio Pix”

FORMATO DE RETORNO:
XX-XX PIX NOME_RECEBEDOR DESCRICAO XXX,XX

onde:
XX-XX = dia e mês da data de transferência
NOME_RECEBEDOR = nome completo do recebedor
DESCRICAO = texto descritivo da transferência
XXX,XX = valor transferido, com ponto como separador decimal

EXEMPLO DE RETORNO:
02-06 PIX JOAQUIM ANTONIO DE CARVALHO compra de pes de madeira 990,00

Identifique se é um BOLETO BANCÁRIO e extraia os seguintes dados:

Características para identificação:
Código de barras na lateral
Campo “Beneficiário”
Campo “Data de Vencimento”
Campo “Valor do Documento”

Dados a extrair:
DATA DE VENCIMENTO: Campo “Vencimento”
BENEFICIÁRIO: Campo “Beneficiário”
VALOR: Campo “Valor do Documento”

FORMATO DE RETORNO:
XX-XX BOLETO BENEFICIARIO XXX,XX

onde:
XX-XX = dia e mês da data de vencimento
BENEFICIARIO = nome completo do beneficiário
XXX,XX = valor do boleto (com ponto como separador decimal)

EXEMPLO DE RETORNO:
07-07 BOLETO J A MOVEIS LTDA 1539,40

Identifique se é um COMPROVANTE DE TRANSFERÊNCIA BANCÁRIA do Bradesco e extraia os seguintes dados:

Características para identificação:
Logotipo do Bradesco Net Empresa
Campo “Comprovante de Transação Bancária”
Campo “Data da operação”

Dados a extrair:
DATA DA OPERAÇÃO: Campo “Data da operação”
NOME: Campo “Nome” dentro de “Dados de quem recebeu”
VALOR: Campo “Valor” em “Dados da transferência”

FORMATO DE RETORNO:
XX-XX TRANSF NOME XXX,XX

onde:
XX-XX = dia e mês da data da operação
NOME = nome completo do recebedor
XXX,XX = valor da transferência, com ponto como separador decimal

EXEMPLO DE RETORNO:
06-06 TRANSF GENESIS WILLIAM FERREIRA 1000,00

Identifique se é uma CONTA DE ÁGUA da SANEAGO e extraia os seguintes dados:

Características para identificação:
Logotipo ou nome SANEAGO
Campo “Vencimento”
Campo “Valor a pagar”

Dados a extrair:
VENCIMENTO: Campo “Vencimento”
NOME DO FORNECEDOR: Sempre fixo como “SANEAMENTO DE GOIÁS S.A”
VALOR: Campo “Valor a pagar”

FORMATO DE RETORNO:
XX-XX AGUA NOME_FORNECEDOR XXX,XX

onde:
XX-XX = dia e mês do vencimento
NOME_FORNECEDOR = “SANEAMENTO DE GOIÁS S.A”
XXX,XX = valor a pagar, com ponto como separador decimal

EXEMPLO DE RETORNO:
21-06 AGUA SANEAMENTO DE GOIÁS S.A 224,34

Identifique se é um COMPROVANTE DE ABASTECIMENTO de posto de combustível e extraia os seguintes dados:

Características para identificação:
Logotipo Auto Posto Petrolina
Campo “Total” com valor destacado
Campo manuscrito com data

Dados a extrair:
DATA: Campo manuscrito (normalmente ao lado de “Data”)
NOME DO FORNECEDOR: Fixo como “AUTO POSTO PETROLINA”
VALOR: Campo “Total”

FORMATO DE RETORNO:
XX-XX COMB AUTO POSTO PETROLINA XXX,XX

onde:
XX-XX = dia e mês da data do abastecimento
XXX,XX = valor total, com ponto como separador decimal

EXEMPLO DE RETORNO:
05-06 COMB AUTO POSTO PETROLINA 150,00

Identifique se é um COMPROVANTE DE TRANSFERÊNCIA BANCÁRIA do Bradesco e extraia os seguintes dados:

Características para identificação:
Contém logotipo ou nome Bradesco
Campo “Confirmação de Operação”
Campo “Data da operação”

Dados a extrair:
DATA DA OPERAÇÃO: Campo “Data da operação”
NOME: Campo “Nome” dentro de “Dados de quem recebeu”
DESCRIÇÃO: Campo “Descrição” em “Dados da Transferência”
VALOR: Campo “Valor” em “Dados da Transferência”

FORMATO DE RETORNO:
XX-XX TRANSF NOME DESCRICAO XXX,XX

onde:
XX-XX = dia e mês da data da operação
NOME = nome completo do recebedor
DESCRICAO = descrição da transferência
XXX,XX = valor da transferência, com ponto como separador decimal

EXEMPLO DE RETORNO:
03-06 TRANSF MICAELLY KAROLINY MARTINS Pagamento Maio 5500,00

**REGRAS GERAIS:**
- Use "ND" para dados não encontrados
- RETORNE APENAS no formato especificado
- Formato obrigatório: XX-XX VENDA XXXX NOME_CLIENTE XXX,XX
`
      }
    }
  },

  /**
   * Prompts de validação e teste
   */
  VALIDATION: {
    API_TEST: "pizza" // Prompt de teste
  }
};

/**
 * Lista todas as empresas disponíveis
 * @returns {Array<Object>} Lista de empresas com id, nome e ícone
 */
export function getAvailableCompanies() {
  return Object.entries(PROMPTS.COMPANIES).map(([id, config]) => ({
    id,
    name: config.name,
    icon: config.icon
  }));
}

/**
 * Retorna o prompt baseado na empresa e tipo de análise
 * @param {string} company - ID da empresa (enia-marcia-joias, eletromoveis)
 * @param {string} analysisType - Tipo de análise (financial-receipt, financial-payment)
 * @returns {string} Prompt correspondente
 */
export function getPrompt(company, analysisType) {
  // Fallback para compatibilidade com código existente
  if (typeof company === 'string' && !analysisType) {
    analysisType = company;
    company = 'enia-marcia-joias'; // empresa padrão
  }

  const companyConfig = PROMPTS.COMPANIES[company];
  if (!companyConfig) {
    console.warn(`Empresa não encontrada: ${company}. Usando padrão.`);
    company = 'enia-marcia-joias';
  }

  const prompts = {
    'financial-receipt': PROMPTS.COMPANIES[company]?.FINANCIAL?.RECEIPT,
    'financial-payment': PROMPTS.COMPANIES[company]?.FINANCIAL?.PAYMENT,
    'default': PROMPTS.VALIDATION.API_TEST
  };

  return prompts[analysisType] || prompts['default'];
}

/**
 * Lista todos os tipos de análise disponíveis
 * @returns {Array<string>} Lista de tipos de análise
 */
export function getAvailableAnalysisTypes() {
  return [
    'financial-receipt',
    'financial-payment'
  ];
}

/**
 * Retorna informações da empresa
 * @param {string} companyId - ID da empresa
 * @returns {Object} Configuração da empresa
 */
export function getCompanyInfo(companyId) {
  return PROMPTS.COMPANIES[companyId] || PROMPTS.COMPANIES['enia-marcia-joias'];
}

export default {
  PROMPTS,
  getPrompt,
  getAvailableAnalysisTypes,
  getAvailableCompanies,
  getCompanyInfo
}; 