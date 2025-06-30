# Changelog

## [2.3.0] - 2024-12-20
### Adicionado
- **Sistema avançado de rate limiting** (#003)
  - Fila de requisições para processamento ordenado
  - Monitoramento em tempo real de limites da API
  - Backoff exponencial com jitter para erros 429
  - Controle de janela deslizante para melhor distribuição
  
- **Cache de imagens** (#003)
  - Armazenamento automático de resultados para reuso
  - Evita reprocessamento de imagens idênticas
  - Política LRU (Least Recently Used) para gestão de cache
  - Hash único baseado em conteúdo+prompt
  
- **Monitor de estatísticas** (#003)
  - Dashboard em tempo real de uso da API
  - Visualização da fila de processamento
  - Estatísticas de cache (hits/misses)
  - Barra de progresso visual para rate limits

### Melhorado
- Detecção e extração mais robusta de retry delay dos erros da API
- Aumento do intervalo mínimo entre requisições para 5s (12 req/min)
- Tratamento de erros com mensagens mais específicas
- Logs mais detalhados com status de processamento

### Corrigido
- Falhas repetidas por rate limit em lotes grandes de imagens
- Reprocessamento desnecessário de imagens idênticas
- Intervalos inconsistentes entre requisições
- Sobrecarga da API em uploads simultâneos

## [2.2.0] - 2024-12-19
### Adicionado
- **Suporte a Comprovantes de Venda** (#002)
  - Reconhecimento automático de comprovantes de venda além de ordens de serviço e comprovantes STONE
  - Extração de dados específicos: data (campo "Entrada:"), nome (campo "Nome:"), número de venda (canto inferior direito em vermelho) e valor (campo "Total R$")
  - Identificação automática pelo rodapé "Nº" em vermelho e texto "agradecemos a preferência"
  - Mesmo formato de retorno padronizado: `XX-XX VENDA XXXX NOME_CLIENTE XXX,XX`
  
### Alterado
- **Prompt unificado ampliado** (#002)
  - Agora identifica automaticamente três tipos: ordens de serviço, comprovantes STONE E comprovantes de venda
  - Mantém total compatibilidade com análises existentes
  - Instruções específicas para cada tipo de documento
  
### Documentação
- **README.md atualizado** (#002)
  - Nova seção "Comprovantes de Venda" em Contas a Receber
  - Documentação detalhada dos campos e identificação
  - Lista de documentos suportados expandida

## [2.1.0] - 2024-12-19
### Adicionado
- **Processamento ilimitado**: Removido limite de 20 imagens - agora analise quantas quiser
- **Estatísticas em tempo real**: Contador de processadas, erros, tempo decorrido e estimativa restante
- **Avisos inteligentes**: Alertas específicos baseados na quantidade de imagens (50+, 100+)
- **Estimativas precisas**: Tempo restante calculado baseado na performance atual
- **Feedback melhorado**: Emojis e cores diferenciadas para grandes volumes

### Alterado
- Limite do servidor aumentado de 50 para 1000 imagens por requisição
- Aviso de rate limit agora aparece com 10+ imagens (antes era 5+)
- Interface de upload atualizada para indicar "sem limite de quantidade"
- Estimativas de tempo agora mostram horas e minutos para grandes volumes
- Botões de ação com cores diferenciadas para volumes perigosos (100+ imagens)

### Melhorado
- Performance do processamento em lote
- Feedback visual durante análises longas
- Mensagens de conclusão mais informativas
- Documentação atualizada com estimativas de tempo

## [2.0.0] - 2024-12-19
### Alterado
- **BREAKING CHANGE**: Aplicação agora foca exclusivamente em documentos financeiros
- Removidos todos os tipos de análise exceto "Contas a Receber" e "Contas a Pagar"
- Interface simplificada com apenas 2 opções de leitura
- Título da aplicação alterado para "Leitor de Documentos Financeiros"
- Ícone principal alterado para `fa-file-invoice-dollar`
- Descrição atualizada para "Extraia dados de contas a pagar e receber com IA"

### Removido
- Análise geral de imagens
- Extração de texto (OCR) genérica
- Identificação de objetos
- Análise de pessoas
- Análise técnica de imagens
- Análise de elementos artísticos
- Tipo "Comprovantes/Boletos" genérico

### Adicionado
- Validação rigorosa de tipos de análise no backend
- Mensagens de erro específicas para tipos não suportados
- README.md completamente reescrito focando em documentos financeiros

### Corrigido
- Lógica simplificada no servidor removendo condicionais desnecessárias
- Formatação de resultados adaptada para os novos tipos
- Geração de nomes de arquivo atualizada para os tipos financeiros

## [1.1.0] - 2024-12-19
### Adicionado
- **Suporte a Comprovantes de Recebimento STONE** (#001)
  - Reconhecimento automático de comprovantes STONE além das ordens de serviço
  - Extração de dados: data, nome do pagador, número de venda e valor
  - Mesmo formato de retorno padronizado: `XX-XX VENDA XXXX NOME_CLIENTE XXX,XX`
  
### Alterado
- **Prompt unificado para financial-receipt** (#001)
  - Agora identifica automaticamente ordens de serviço E comprovantes STONE
  - Mantém compatibilidade com análises existentes
  
- **Função de formatação aprimorada** (#001)
  - Suporte ao novo formato com VENDA XXXX
  - Fallback para formato antigo (compatibilidade)
  - Parsing manual melhorado
  
- **Geração de nomes de arquivo atualizada** (#001)
  - Suporte ao novo formato com número de venda
  - Mantém compatibilidade com formatos anteriores

### Documentação
- **README.md atualizado** (#001)
  - Seção de Contas a Receber expandida
  - Exemplos atualizados com novo formato
  - Lista de documentos suportados reorganizada
  
- **DOCUMENTACAO_ANALISE_FINANCEIRA.md atualizada** (#001)
  - Detalhamento dos tipos de documentos suportados
  - Especificações técnicas de cada tipo
  
- **Arquivo de teste criado** (#001)
  - TESTE_COMPROVANTES_STONE.md com instruções de uso
  - Exemplos práticos e cenários de teste

## [1.0.0] - 2024-12-18
### Adicionado
- Sistema base de análise de documentos financeiros
- Suporte a ordens de serviço
- Interface web para upload e análise
- API REST para integração
- Processamento em lote de imagens
- Download de resultados renomeados

### Tecnologias
- Google Gemini 1.5 Flash para análise
- Node.js + Express.js backend
- Interface web responsiva
- Suporte a múltiplos formatos de imagem 