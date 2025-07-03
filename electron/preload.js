const { contextBridge, ipcRenderer } = require('electron');

// Expõe APIs seguras para o processo renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Informações do sistema
  platform: process.platform,
  version: process.versions.electron,
  isElectron: true,
  
  // Informações sobre a arquitetura unificada
  architecture: 'unified-web-desktop',
  serverMode: 'web-unified',
  
  // Funções de utilidade (se precisarmos no futuro)
  openExternal: (url) => {
    ipcRenderer.invoke('open-external', url);
  },
  
  // Log para debug com identificação Electron
  log: (message) => {
    console.log('[Electron Desktop]', message);
  },
  
  // Função para verificar se estamos rodando no Electron
  checkElectronMode: () => {
    return {
      isElectron: true,
      hasWebFeatures: true,
      unifiedArchitecture: true
    };
  }
});

// Log de inicialização com informações da nova arquitetura
console.log('🔧 Preload script carregado - Arquitetura Unificada Web+Desktop');
console.log('✅ Todas as funcionalidades web disponíveis no desktop');
console.log('🎯 Cache, análise paralela, anti-cache e outras funcionalidades ativas'); 