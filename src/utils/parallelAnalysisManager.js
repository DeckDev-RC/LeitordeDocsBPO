/**
 * Gerenciador de Análises Paralelas
 * Distribui o processamento de análises entre múltiplas chaves de API
 * para maximizar o desempenho e utilização das chaves disponíveis
 */

import geminiConfig from '../config/gemini.js';
import apiKeyManager from './apiKeyManager.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import AntiCacheHelper from './antiCacheHelper.js';
import CacheHelper from './cacheHelper.js';

class ParallelAnalysisManager {
  constructor() {
    // Número máximo de análises paralelas (uma por chave)
    this.maxParallelAnalyses = apiKeyManager.apiKeys.length;
    
    // Fila de análises pendentes
    this.pendingAnalyses = [];
    
    // Análises em andamento
    this.runningAnalyses = new Map();
    
    // Contadores
    this.completedAnalyses = 0;
    this.failedAnalyses = 0;
    
    // Status de processamento
    this.isProcessing = false;
    
    // Instâncias de API por chave
    this.apiInstances = new Map();
    
    console.log(`🚀 Gerenciador de análises paralelas inicializado com capacidade para ${this.maxParallelAnalyses} análises simultâneas`);
  }
  
  /**
   * Obtém uma instância da API para uma chave específica
   * @param {string} apiKey - Chave de API
   * @returns {Object} Instância da API Gemini
   */
  getApiInstance(apiKey) {
    if (!this.apiInstances.has(apiKey)) {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.apiInstances.set(apiKey, genAI);
    }
    return this.apiInstances.get(apiKey);
  }

  /**
   * Adiciona uma análise à fila de processamento
   * @param {Object} analysisData - Dados da análise
   * @returns {Promise} Promessa que resolve com o resultado da análise
   */
  queueAnalysis(analysisData) {
    return new Promise((resolve, reject) => {
      // Adiciona à fila com callbacks para resolução
      this.pendingAnalyses.push({
        ...analysisData,
        resolve,
        reject,
        queued: Date.now()
      });
      
      // Inicia o processamento se não estiver em andamento
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  /**
   * Processa a fila de análises, iniciando análises paralelas quando possível
   */
  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    try {
      // Continua processando enquanto houver análises pendentes
      // e slots disponíveis para processamento paralelo
      while (this.pendingAnalyses.length > 0 && 
             this.runningAnalyses.size < this.maxParallelAnalyses) {
        
        // Obtém a próxima análise da fila
        const analysis = this.pendingAnalyses.shift();
        
        // Gera um ID único para esta análise
        const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Obtém a próxima chave disponível
        const apiKey = apiKeyManager.getNextKey();
        
        // Adiciona à lista de análises em andamento
        this.runningAnalyses.set(analysisId, {
          ...analysis,
          apiKey,
          startTime: Date.now()
        });
        
        // Inicia a análise de forma assíncrona
        this.runAnalysis(analysisId, apiKey, analysis)
          .catch(error => {
            console.error(`❌ Erro não tratado em análise paralela: ${error.message}`);
          });
      }
    } finally {
      // Se ainda houver análises pendentes ou em andamento, continua processando
      if (this.pendingAnalyses.length > 0 || this.runningAnalyses.size > 0) {
        setTimeout(() => this.processQueue(), 100);
      } else {
        this.isProcessing = false;
      }
    }
  }

  /**
   * Executa uma análise usando uma chave de API específica
   * @param {string} analysisId - ID da análise
   * @param {string} apiKey - Chave de API a ser usada
   * @param {Object} analysis - Dados da análise
   */
  async runAnalysis(analysisId, apiKey, analysis) {
    const { 
      imageData, 
      mimeType = 'image/jpeg', 
      prompt, 
      fileName = '', 
      fileIndex = null,
      forceStructuredFormat = true,
      resolve, 
      reject 
    } = analysis;
    
    try {
      console.log(`🔄 Iniciando análise ${analysisId} com chave ${apiKeyManager.maskKey(apiKey)}`);
      
      // Verifica se já temos essa análise em cache
      const cachedResult = CacheHelper.getCachedResult(imageData, prompt, 'receipt');
      if (cachedResult) {
        console.log(`🚀 Usando resultado em cache para ${fileName || analysisId}`);
        resolve(cachedResult);
        this.completeAnalysis(analysisId, true);
        return;
      }
      
      // Aplica estratégias anti-cache
      const antiCacheData = AntiCacheHelper.applyFullAntiCache(
        prompt, 
        fileName, 
        fileIndex, 
        0
      );
      
      // Obtém uma instância da API para esta chave
      const genAI = this.getApiInstance(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Prepara a parte da imagem
      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType
        }
      };
      
      // Executa a análise
      const result = await model.generateContent([antiCacheData.prompt, imagePart], { 
        generationConfig: antiCacheData.generationConfig 
      });
      
      const response = await result.response;
      const rawData = response.text();
      
      // Formata o resultado se necessário
      let finalResult;
      if (forceStructuredFormat && !antiCacheData.isTestPrompt) {
        // Usa a função de formatação do GeminiService
        // Simplificada aqui para evitar dependência circular
        finalResult = this.formatReceiptData(rawData);
      } else {
        finalResult = rawData;
      }
      
      // Armazena em cache
      CacheHelper.cacheResult(imageData, prompt, 'receipt', finalResult);
      
      // Resolve a promessa com o resultado
      resolve(finalResult);
      
      // Marca como concluída
      this.completeAnalysis(analysisId, true);
      
    } catch (error) {
      console.error(`❌ Erro na análise ${analysisId}: ${error.message}`);
      
      // Verifica se é erro de limite de taxa
      const is429Error = error.message.includes('429') || 
                        error.message.includes('Too Many Requests') || 
                        error.message.includes('quota');
      
      if (is429Error) {
        // Reporta o erro ao gerenciador de chaves
        apiKeyManager.reportError(apiKey, error);
        
        // Recoloca na fila para tentar novamente com outra chave
        console.log(`🔄 Recolocando análise ${analysisId} na fila para tentar com outra chave`);
        
        // Adiciona de volta à fila, mas no início para prioridade
        this.pendingAnalyses.unshift({
          imageData, 
          mimeType, 
          prompt, 
          fileName, 
          fileIndex,
          forceStructuredFormat,
          resolve, 
          reject,
          queued: Date.now(),
          retries: (analysis.retries || 0) + 1
        });
        
        // Se já tentou muitas vezes, falha
        if ((analysis.retries || 0) >= 3) {
          reject(new Error(`Falha após ${analysis.retries} tentativas: ${error.message}`));
          this.completeAnalysis(analysisId, false);
        }
      } else {
        // Para outros erros, falha imediatamente
        reject(error);
        this.completeAnalysis(analysisId, false);
      }
    }
  }

  /**
   * Marca uma análise como concluída
   * @param {string} analysisId - ID da análise
   * @param {boolean} success - Se a análise foi bem-sucedida
   */
  completeAnalysis(analysisId, success) {
    // Remove da lista de análises em andamento
    if (this.runningAnalyses.has(analysisId)) {
      const analysis = this.runningAnalyses.get(analysisId);
      const duration = Date.now() - analysis.startTime;
      
      this.runningAnalyses.delete(analysisId);
      
      // Atualiza contadores
      if (success) {
        this.completedAnalyses++;
        console.log(`✅ Análise ${analysisId} concluída em ${duration}ms`);
      } else {
        this.failedAnalyses++;
        console.log(`❌ Análise ${analysisId} falhou após ${duration}ms`);
      }
    }
    
    // Continua processando a fila
    this.processQueue();
  }

  /**
   * Formata os dados extraídos do comprovante (versão simplificada)
   * @param {string} rawData - Dados brutos extraídos
   * @returns {string} Dados formatados
   */
  formatReceiptData(rawData) {
    // Versão simplificada da formatação
    let formatted = rawData.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    return formatted;
  }

  /**
   * Obtém estatísticas do processamento
   * @returns {Object} Estatísticas
   */
  getStats() {
    return {
      pendingAnalyses: this.pendingAnalyses.length,
      runningAnalyses: this.runningAnalyses.size,
      completedAnalyses: this.completedAnalyses,
      failedAnalyses: this.failedAnalyses,
      totalProcessed: this.completedAnalyses + this.failedAnalyses,
      maxParallelAnalyses: this.maxParallelAnalyses,
      isProcessing: this.isProcessing
    };
  }
}

// Exporta uma instância única
export default new ParallelAnalysisManager(); 