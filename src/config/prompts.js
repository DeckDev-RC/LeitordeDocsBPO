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
- Formato obrigatório: XX-XX VENDA XXXX NOME_CLIENTE XXX,XX
- Não retorne palavras como "Boleto" e "Boletos" e "BOLETO" E "BOLETOS"
- Não retorne palavras como "Venda" e "Vendas" e "VENDA" E "VENDAS"
- Não retorne palavras como "Comprovante" e "Comprovantes" e "COMPROVANTE" E "COMPROVANTES"
- Não retorne palavras como "Nota Fiscal" e "Notas Fiscais" e "NOTA FISCAL" E "NOTAS FISCAIS"
- Não retorne palavras como "Transferência" e "Transferências" e "TRANSFERÊNCIA" E "TRANSFERÊNCIAS"
- Não retorne palavras como "Depósito" e "Depósitos" e "DEPÓSITO" E "DEPÓSITOS"
- Não retorne palavras como "Pagamento" e "Pagamentos" e "PAGAMENTO" E "PAGAMENTOS"
- Não retorne palavras como "Pix" e "Pixs" e "PIX" E "PIS"
- Não retorne palavras como "Cartão" e "Cartões" e "CARTÃO" E "CARTÕES"`,

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
Campo "VENDA DÉBITO" ou "VENDA CRÉDITO"
Campo "VALOR"
Campo com data e hora da operação

Dados a extrair:
DATA: Campo de data da operação (após "VALOR")
OPERAÇÃO: O texto logo acima do valor, indicando se foi "VENDA DÉBITO" ou "VENDA CRÉDITO"
VALOR: Campo "VALOR"

FORMATO DE RETORNO:
XX-XX CARTAO OPERACAO XXX,XX

onde:
XX-XX = dia e mês da data da operação
OPERACAO = tipo da operação ("VENDA DÉBITO" ou "VENDA CRÉDITO")
XXX,XX = valor, com ponto como separador decimal

EXEMPLO DE RETORNO:
03-06 CARTAO VENDA DÉBITO 70,00

Identifique se é um COMPROVANTE DE VENDA de cartão PicPay e extraia os seguintes dados:

Características para identificação:
Logotipo ou nome PicPay
Campo "COMPROVANTE DE VENDA"
Campo com data e hora no topo
Campo "VALOR" com destaque

Dados a extrair:
DATA: Campo de data da operação (normalmente no topo, junto ao horário)
OPERAÇÃO: Campo logo abaixo de "VALOR" indicando "Crédito" ou "Débito"
VALOR: Campo "VALOR" com cifra em reais

FORMATO DE RETORNO:
XX-XX CARTAO OPERACAO XXX,XX

onde:
XX-XX = dia e mês da data da operação
OPERACAO = tipo da operação ("VENDA CRÉDITO" ou "VENDA DÉBITO")
XXX,XX = valor, com ponto como separador decimal

EXEMPLO DE RETORNO:
11-06 CARTAO VENDA CRÉDITO 242,00

Identifique se é um COMPROVANTE DE DEPÓSITO do Sicoob e extraia os seguintes dados:

Características para identificação:
Logotipo ou nome SICOOB
Campo "DEPÓSITO CONTA CORRENTE"
Campo "DATA DO DEPÓSITO"
Campo "VALOR"

Dados a extrair:
DATA DO DEPÓSITO: Campo "Data do Depósito"
TIPO DE OPERAÇÃO: Campo "Operacao", verificando se contém "DEPÓSITO CONTA CORRENTE"
VALOR: Campo "Valor"

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
Campo "DEPÓSITO EM CONTA CORRENTE"
Campo "VALOR TOTAL"
Campo com data e hora da operação

Dados a extrair:
DATA: Campo de data da operação (após "Data")
TIPO DE OPERAÇÃO: Sempre retorne "DEPÓSITO CONTA CORRENTE"
VALOR TOTAL: Campo "VALOR TOTAL"

FORMATO DE RETORNO:
XX-XX DEPOSITO CONTA CORRENTE XXX,XX

onde:
XX-XX = dia e mês da data do depósito
XXX,XX = valor total, com ponto como separador decimal

EXEMPLO DE RETORNO:
20-06 DEPOSITO CONTA CORRENTE 2000,00

**REGRAS GERAIS:**
- Use "ND" para dados não encontrados
- RETORNE APENAS no formato especificado
- Formato obrigatório: XX-XX VENDA XXXX NOME_CLIENTE XXX,XX
- Não retorne palavras como "Boleto" e "Boletos" e "BOLETO" E "BOLETOS"
- Não retorne palavras como "Venda" e "Vendas" e "VENDA" E "VENDAS"
- Não retorne palavras como "Comprovante" e "Comprovantes" e "COMPROVANTE" E "COMPROVANTES"
- Não retorne palavras como "Nota Fiscal" e "Notas Fiscais" e "NOTA FISCAL" E "NOTAS FISCAIS"
- Não retorne palavras como "Transferência" e "Transferências" e "TRANSFERÊNCIA" E "TRANSFERÊNCIAS"
- Não retorne palavras como "Depósito" e "Depósitos" e "DEPÓSITO" E "DEPÓSITOS"
- Não retorne palavras como "Pagamento" e "Pagamentos" e "PAGAMENTO" E "PAGAMENTOS"
- Não retorne palavras como "Pix" e "Pixs" e "PIX" E "PIS"
- Não retorne palavras como "Cartão" e "Cartões" e "CARTÃO" E "CARTÕES"
`,

        PAYMENT: `Identifique se é uma NOTA FISCAL DE VENDA e extraia os seguintes dados:

Características para identificação:
Contém "NOTA FISCAL ELETRÔNICA"
Campo "VENDA" como natureza da operação
Campo "VALOR TOTAL DA NOTA" ou "TOTAL DA NOTA"
Campo "DATA DE EMISSÃO"

Dados a extrair:
DATA DE EMISSÃO: Procure o campo com a etiqueta "Data de Emissão"
NOME DO FORNECEDOR: no primeiro bloco superior direito 
VALOR DA NOTA: Campo "TOTAL DA NOTA" (não confundir com total dos produtos)
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
Contém "Comprovante de envio Pix"
Campo "Transferido" com data e hora

Dados a extrair:
RECEBEDOR: Nome no campo "Recebedor"
DESCRIÇÃO: Texto abaixo do valor transferido (exemplo: "compra de pés de madeira")
VALOR: Campo "R$" destacado logo abaixo de "Comprovante de envio Pix"

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
Campo "Beneficiário"
Campo "Data de Vencimento"
Campo "Valor do Documento"

Dados a extrair:
DATA DE VENCIMENTO: Campo "Vencimento"
BENEFICIÁRIO: Campo "Beneficiário"
VALOR: Campo "Valor do Documento"

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
Campo "Comprovante de Transação Bancária"
Campo "Data da operação"

Dados a extrair:
DATA DA OPERAÇÃO: Campo "Data de Vencimento"
NOME: Campo "Nome" dentro de "Dados de quem recebeu"
VALOR: Campo "Valor" em "Dados da transferência"

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
Campo "Vencimento"
Campo "Valor a pagar"

Dados a extrair:
VENCIMENTO: Campo "Vencimento"
NOME DO FORNECEDOR: Sempre fixo como "SANEAMENTO DE GOIÁS S.A"
VALOR: Campo "Valor a pagar"

FORMATO DE RETORNO:
XX-XX AGUA NOME_FORNECEDOR XXX,XX

onde:
XX-XX = dia e mês do vencimento
NOME_FORNECEDOR = "SANEAMENTO DE GOIÁS S.A"
XXX,XX = valor a pagar, com ponto como separador decimal

EXEMPLO DE RETORNO:
21-06 AGUA SANEAMENTO DE GOIÁS S.A 224,34

Identifique se é um COMPROVANTE DE ABASTECIMENTO de posto de combustível e extraia os seguintes dados:

Características para identificação:
Logotipo Auto Posto Petrolina
Campo "Total" com valor destacado
Campo manuscrito com data

Dados a extrair:
DATA: Campo manuscrito (normalmente ao lado de "Data")
NOME DO FORNECEDOR: Fixo como "AUTO POSTO PETROLINA"
VALOR: Campo "Total"

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
Campo "Confirmação de Operação"
Campo "Data da operação"

Dados a extrair:
DATA DA OPERAÇÃO: Campo "Data de Vencimento"
NOME: Campo "Nome" dentro de "Dados de quem recebeu"
DESCRIÇÃO: Campo "Descrição" em "Dados da Transferência"
VALOR: Campo "Valor" em "Dados da Transferência"

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
- Não retorne palavras como "Boleto" e "Boletos" e "BOLETO" E "BOLETOS"
- Não retorne palavras como "Venda" e "Vendas" e "VENDA" E "VENDAS"
- Não retorne palavras como "Comprovante" e "Comprovantes" e "COMPROVANTE" E "COMPROVANTES"
- Não retorne palavras como "Nota Fiscal" e "Notas Fiscais" e "NOTA FISCAL" E "NOTAS FISCAIS"
- Não retorne palavras como "Transferência" e "Transferências" e "TRANSFERÊNCIA" E "TRANSFERÊNCIAS"
- Não retorne palavras como "Depósito" e "Depósitos" e "DEPÓSITO" E "DEPÓSITOS"
- Não retorne palavras como "Pagamento" e "Pagamentos" e "PAGAMENTO" E "PAGAMENTOS"
- Não retorne palavras como "Pix" e "Pixs" e "PIX" E "PIS"
- Não retorne palavras como "Cartão" e "Cartões" e "CARTÃO" E "CARTÕES"`
      }
    },

      'marcmix': {
        name: 'MarcMix',
        icon: 'fas fa-industry',
        FINANCIAL: {
          RECEIPT: `Identifique os tipos de comprovantes e extraia os dados conforme especificado:

**COMPROVANTE DE CARTÃO:**
Características: Bandeira do cartão, campos "VENDA DÉBITO/CRÉDITO", "VALOR"
Dados: DATA, OPERAÇÃO, VALOR
FORMATO: XX-XX CARTAO OPERACAO XXX,XX
EXEMPLO: 03-06 CARTAO VENDA DÉBITO 70,00

**COMPROVANTE PICPAY:**
Características: Logo PicPay, "COMPROVANTE DE VENDA", "VALOR"
Dados: DATA, OPERAÇÃO, VALOR
FORMATO: XX-XX CARTAO OPERACAO XXX,XX
EXEMPLO: 11-06 CARTAO VENDA CRÉDITO 242,00

**COMPROVANTE DE DEPÓSITO:**
Características: "DEPÓSITO CONTA CORRENTE", "DATA DO DEPÓSITO", "VALOR"
Dados: DATA, TIPO, VALOR
FORMATO: XX-XX DEPOSITO CONTA CORRENTE XXX,XX
EXEMPLO: 03-06 DEPOSITO CONTA CORRENTE 7944,00

**REGRAS GERAIS:**
- Use "ND" para dados não encontrados
- RETORNE APENAS no formato especificado
- Não retorne palavras como "Boleto", "Venda", "Comprovante", etc. sozinhas`,

          PAYMENT: `Identifique os tipos de documentos e extraia os dados conforme especificado:

Identifique se é um COMPROVANTE DE ENVIO PIX tipo 1e extraia os seguintes dados:

Características para identificação:
Contém “Pix realizado com sucesso” ou “Comprovante de Pix enviado”
Campo “Dados do recebedor”
Campo “Valor”
Campo “Data”

Dados a extrair:
DATA: Campo de data no formato DD/MM/AAAA, devolvendo apenas DD-MM no retorno (exemplo: “03/04/2025” retorna “03-04”)
NOME: Campo “Nome” dentro de Dados do recebedor
VALOR: Campo “Valor” destacado na transação, com separador decimal ponto
FORMATO DE RETORNO:
XX-XX PIX NOME XXX,XX

onde:
XX-XX = dia e mês extraídos da data do comprovante
NOME = nome completo do recebedor
XXX,XX = valor transferido, com ponto como separador decimal

EXEMPLO DE RETORNO:
03-04 PIX JESSICA ANDRESSA RODRIGUES 600,00

Identifique se é um COMPROVANTE DE PAGAMENTO Sicoob e extraia os seguintes dados:

Características para identificação:
Contém texto como “Comprovante de pagamento” ou “Pagamento realizado com sucesso”
Campo “Beneficiário” com nome/razão social
Campo “Valor total”
Campo “Data do pagamento”

Dados a extrair:
DATA: Campo “Data do pagamento” (devolvendo no formato DD-MM, por exemplo “03/04/2025” vira “03-04”)
BENEFICIÁRIO: Campo “Nome/Razão social” dentro da seção Beneficiário
VALOR TOTAL: Campo “Valor total”, usando ponto como separador decimal
FORMATO DE RETORNO:
XX-XX PAG MPL I E C DE ROUPAS LTDA XXX,XX

onde:
XX-XX = dia e mês extraídos da data do pagamento
BENEFICIÁRIO = nome ou razão social do beneficiário
XXX,XX = valor total pago, com ponto como separador decimal

EXEMPLO DE RETORNO:
03-04 PAG MPL I E C DE ROUPAS LTDA 1119,88

Identifique se é um COMPROVANTE DE ENVIO PIX tipo 2 e extraia os seguintes dados:

Características para identificação:
Contém “Comprovante de Pix enviado”
Campo “Dados do recebedor”
Campo “Valor”
Campo “Data”

Dados a extrair:
DATA: Campo “Data” do comprovante, devolvendo no formato DD-MM (exemplo: “04/04/2025” retorna “04-04”)
NOME: Campo “Nome” dentro de Dados do recebedor
VALOR: Campo “Valor” no cabeçalho, com ponto como separador decimal
FORMATO DE RETORNO:
XX-XX PIX NOME XXX,XX

onde:
XX-XX = dia e mês da data do Pix
NOME = nome completo do recebedor
XXX,XX = valor transferido, com ponto como separador decimal

EXEMPLO DE RETORNO:
04-04 PIX ANA CRISTINA COTRIM DO NASCIMENTO 50,00

Identifique se é um COMPROVANTE DE VENDA DE CARTÃO tipo 1 e extraia os seguintes dados:

Características para identificação:
Contém o nome do fornecedor (ex: ATACADÃO KASART)
Campo com data e hora da operação
Campo “CRÉDITO À VISTA” ou similar
Valor destacado com cifra em reais

Dados a extrair:
DATA: Campo de data (normalmente abaixo do nome do estabelecimento), devolvendo no formato DD-MM (ex: “07/04/2025” vira “07-04”)
NOME DO FORNECEDOR: Fixo como “ATACADÃO KASART”
VALOR: Campo de valor destacado, com ponto como separador decimal

FORMATO DE RETORNO:
XX-XX CARTAO ATACADÃO KASART XXX,XX

onde:
XX-XX = dia e mês da data da operação
XXX,XX = valor da venda, com ponto como separador decimal

EXEMPLO DE RETORNO:
07-04 CARTAO ATACADÃO KASART 870,09

Identifique se é um COMPROVANTE DE VENDA DE CARTÃO tipo 2 e extraia os seguintes dados:

Características para identificação:
Contém nome do fornecedor HIPER FESTA GOL
Campo “CRÉDITO À VISTA” ou similar
Data da operação no cabeçalho
Valor destacado com cifra em reais

Dados a extrair:
DATA: Campo de data no topo do comprovante, devolvendo no formato DD-MM (ex: “07/04/2025” retorna “07-04”)
NOME DO FORNECEDOR: Fixo como “HIPER FESTA GOL”
VALOR: Campo de valor destacado, com ponto como separador decimal

FORMATO DE RETORNO:
XX-XX CARTAO HIPER FESTA GOL XXX,XX

onde:
XX-XX = dia e mês da data da operação
XXX,XX = valor da venda, com ponto como separador decimal

EXEMPLO DE RETORNO:
07-04 CARTAO HIPER FESTA GOL 1000,43

Identifique se é um COMPROVANTE DE PAGAMENTO DE BOLETO e extraia os seguintes dados:

Características para identificação:
Contém “Comprovante Boleto”
Campo “Beneficiário original / Cedente”
Campo “Valor calculado (R$)”
Campo “Data” no topo

Dados a extrair:
DATA: Campo “Data” do comprovante, devolvendo no formato DD-MM (ex: “07/04/2025” vira “07-04”)
NOME: Campo “Nome fantasia” dentro de Beneficiário original / Cedente
VALOR: Campo “Valor calculado (R$)”, usando ponto como separador decimal

FORMATO DE RETORNO:
XX-XX BOLETO NOME XXX,XX

onde:
XX-XX = dia e mês da data do pagamento
NOME = nome fantasia do beneficiário original / cedente
XXX,XX = valor calculado, com ponto como separador decimal

EXEMPLO DE RETORNO:
07-04 BOLETO MPL I E C DE ROUPAS LTDA 465,75

Identifique se é um COMPROVANTE DE VENDA DE CARTÃO tipo 3 e extraia os seguintes dados:

Características para identificação:
Contém texto ou logotipo Cielo
Campo “CRÉDITO À VISTA”
Campo de data e hora
Apresenta a expressão VIA DO CLIENTE (comprovante de maquininha)
Campo de valor destacado com cifra em reais

IMPORTANTE:
O nome do fornecedor deverá ser obtido a partir do CNPJ impresso no comprovante, se possível, fazendo correspondência do CNPJ com base de cadastro previamente informada (exemplo: tabela local, dicionário, etc).
Caso o nome do fornecedor não seja identificado no cadastro, retorne apenas ND para o nome.

Dados a extrair:
DATA: Campo de data (normalmente abaixo do nome do estabelecimento), devolvendo no formato DD-MM (ex: “07/04/2025” retorna “07-04”)
NOME DO FORNECEDOR: Consultar a partir do CNPJ encontrado no comprovante (comparando com a base cadastrada local), caso não encontre retorne “ND”
VALOR: Campo de valor destacado, com ponto como separador decimal

FORMATO DE RETORNO:
XX-XX CARTAO NOME_FORNECEDOR XXX,XX

onde:
XX-XX = dia e mês da data da operação
NOME_FORNECEDOR = nome do fornecedor associado ao CNPJ, ou “ND” se não localizar
XXX,XX = valor, com ponto como separador decimal

EXEMPLO DE RETORNO:
07-04 CARTAO POSTO CARRIJO 158,00

Identifique se é um RECIBO preenchido manualmente e extraia os seguintes dados:

Características para identificação:
Campo “RECIBO” no topo do documento
Campo de data manuscrita
Campo “Assinatura”
Campo “Referente”
Campo de valor destacado normalmente precedido de “R$”

Dados a extrair:
DATA: Campo de data manuscrita, devolvendo no formato DD-MM (ex: “03 Abril 2025” retorna “03-04”)
ASSINATURA: Nome escrito no campo “Assinatura”
REFERENTE: Campo “Referente” (pode estar logo abaixo do “Recebi de” ou “Importância de”)
VALOR: Valor destacado, com ponto como separador decimal

FORMATO DE RETORNO:
XX-XX REC ASSINATURA REFERENTE XXX,XX

onde:
XX-XX = dia e mês da data
ASSINATURA = nome do assinante
REFERENTE = motivo ou referência do pagamento
XXX,XX = valor do recibo, com ponto como separador decimal

EXEMPLO DE RETORNO:
03-04 REC PAULA AMENTA DE SOUZA Custodia salario Paula 1500,00
03-04 REC ISADORA ELIUZA S MACHADO Custodia salario Isadora 520,00

Identifique se é um RECIBO preenchido manualmente tipo 2 e extraia os seguintes dados:

Características para identificação:
Título RECIBO no topo do documento
Campo de data manuscrita
Campo “Referente” preenchido
Campo de valor destacado, normalmente precedido de “R$”

Dados a extrair:
DATA: Campo de data manuscrita, devolvendo no formato DD-MM (ex: “09 Abril 2025” vira “09-04”)
REFERENTE: Campo “Referente” (texto completo preenchido)
VALOR: Valor destacado, com ponto como separador decimal

FORMATO DE RETORNO:
XX-XX REC REFERENTE XXX,XX

onde:
XX-XX = dia e mês da data
REFERENTE = texto preenchido no campo “Referente”
XXX,XX = valor do recibo, com ponto como separador decimal

EXEMPLO DE RETORNO:
09-04 REC Josefa (piso loja Juliana) 735,00

Identifique se é um DOCUMENTO DE ARRECADAÇÃO (DARF) pago e extraia os seguintes dados:

Características para identificação:
Título “Documento de Arrecadação de Receitas Federais”
Campo “Data do pagamento”
Campo “Agente arrecadador” (normalmente banco ou lotérica)
Campo “Valor do documento”

Dados a extrair:
DATA DO PAGAMENTO: Campo de data do pagamento, devolvendo no formato DD-MM (ex: “09/04/2025” retorna “09-04”)
AGENTE ARRECADADOR: Nome da instituição arrecadadora (ex: “Lotéricas Caixa” ou nome do banco)
VALOR DO DOCUMENTO: Valor total pago, com ponto como separador decimal

FORMATO DE RETORNO:
XX-XX DARF AGENTE XXX,XX

onde:
XX-XX = dia e mês da data do pagamento
AGENTE = nome do agente arrecadador
XXX,XX = valor do documento, com ponto como separador decimal

EXEMPLO DE RETORNO:
09-04 DARF LOTERICAS CAIXA 1294,98

Identifique se é um DOCUMENTO DE ARRECADAÇÃO DO SIMPLES NACIONAL (DAS) e extraia os seguintes dados:

Características para identificação:
Contém logotipo e texto Simples Nacional
Campo “Pagar este documento até”
Campo “Valor Total do Documento” destacado
Razão social no cabeçalho

Dados a extrair:
DATA: Campo “Pagar este documento até”, devolvendo no formato DD-MM (ex: “22/04/2025” vira “22-04”)
NOME: Sempre retorne fixo como “SIMPLES NACIONAL”
VALOR TOTAL DO DOCUMENTO: Campo “Valor Total do Documento”, com ponto como separador decimal

FORMATO DE RETORNO:
XX-XX DAS SIMPLES NACIONAL XXX,XX

onde:
XX-XX = dia e mês da data de vencimento
XXX,XX = valor total do documento, com ponto como separador decimal

EXEMPLO DE RETORNO:
22-04 DAS SIMPLES NACIONAL 3274,04

Identifique se é um DOCUMENTO DE ARRECADAÇÃO DE RECEITAS FEDERAIS e extraia os seguintes dados:

Características para identificação:
Logotipo Receita Federal
Campo “Pagar este documento até”
Campo “Valor Total do Documento” destacado
Campo “Data de Vencimento”

Dados a extrair:
DATA: Campo “Pagar este documento até”, devolvendo no formato DD-MM (ex: “17/04/2025” retorna “17-04”)
NOME: Sempre retorne fixo como “RECEITA FEDERAL”
VALOR TOTAL DO DOCUMENTO: Campo “Valor Total do Documento”, com ponto como separador decimal

FORMATO DE RETORNO:
XX-XX DARF RECEITA FEDERAL XXX,XX

onde:
XX-XX = dia e mês da data de vencimento
XXX,XX = valor total do documento, com ponto como separador decimal

EXEMPLO DE RETORNO:
17-04 DARF RECEITA FEDERAL 785,53

Identifique se é uma GUIA DO FGTS DIGITAL (GFD) e extraia os seguintes dados:

Características para identificação:
Logotipo FGTS Digital
Campo “Pagar este documento até”
Campo “Valor a recolher”
Razão social no topo do documento

Dados a extrair:
DATA: Campo “Pagar este documento até”, devolvendo no formato DD-MM (ex: “17/04/2025” retorna “17-04”)
NOME: Sempre retorne fixo como “FGTS”
VALOR A RECOLHER: Campo “Valor a recolher”, com ponto como separador decimal

FORMATO DE RETORNO:
XX-XX FGTS FGTS XXX,XX

onde:
XX-XX = dia e mês da data de vencimento
XXX,XX = valor a recolher, com ponto como separador decimal

EXEMPLO DE RETORNO:
17-04 FGTS FGTS 453,90

Identifique se é um COMPROVANTE DE PAGAMENTO vinculado a compra de produto ou serviço e extraia os seguintes dados:

Características para identificação:
Contém texto como “Pagamento efetuado com sucesso”
Campo com o nome do fornecedor (no topo, ex: ANNA PRATA)
Campo de valor total destacado em reais

Dados a extrair:
NOME DO FORNECEDOR: Sempre capturar o nome em destaque no topo (ex: “ANNA PRATA”)
VALOR: Campo “valor total” ou valor de cobrança destacado, com ponto como separador decimal

FORMATO DE RETORNO:
PAG FORNECEDOR XXX,XX

onde:
FORNECEDOR = nome do fornecedor (ex: ANNA PRATA)
XXX,XX = valor pago, com ponto como separador decimal

EXEMPLO DE RETORNO:
PAG ANNA PRATA 540,00


**REGRAS GERAIS:**
- Use "ND" para dados não encontrados
- RETORNE APENAS no formato especificado
- Não retorne palavras como "Boleto", "Venda", "Comprovante", etc. sozinhas
- Sempre use o termo RECIBO por extenso no formato de saída, nunca apenas REC
- Caso algum campo não seja encontrado, retorne “ND” no local correspondente
- Utilize ponto como separador decimal
- Retorne apenas no formato especificado
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
 * @param {string} company - ID da empresa (enia-marcia-joias, eletromoveis, marcmix)
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