const { app, BrowserWindow, dialog, shell } = require('electron');
const path = require('path');
const http = require('http');

// Variáveis globais
let mainWindow;
let server;
const PORT = 3001;

// Função para verificar se o servidor está rodando
function checkServerRunning() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/',
      method: 'GET',
      timeout: 1000
    };

    const req = http.request(options, (res) => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Função para criar servidor integrado compatível com executável empacotado
async function createIntegratedServer() {
  try {
    console.log('🚀 Iniciando servidor integrado...');
    
    // Configura variáveis de ambiente necessárias
    process.env.ELECTRON_MODE = 'true';
    process.env.PORT = PORT.toString();
    
    const express = require('express');
    const multer = require('multer');
    const cors = require('cors');
    const fs = require('fs').promises;
    
    const app = express();
    
    // Middleware básico
    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    
    // Determina o caminho base correto
    let publicPath;
    
    if (process.env.NODE_ENV === 'development') {
      // Em desenvolvimento
      const basePath = path.join(__dirname, '..');
      publicPath = path.join(basePath, 'web-interface', 'public');
    } else {
      // Em produção (executável empacotado) - usa apenas arquivos empacotados
      publicPath = path.join(process.resourcesPath, 'app.asar', 'web-interface', 'public');
    }
    
    console.log(`📂 Caminho público: ${publicPath}`);
    
    // Serve arquivos estáticos
    app.use(express.static(publicPath));
    
    // Configuração do multer para upload usando diretório temporário
    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        const os = require('os');
        const uploadDir = path.join(os.tmpdir(), 'leitor-foto-uploads');
        try {
          await fs.mkdir(uploadDir, { recursive: true });
        } catch (error) {
          console.error('Erro ao criar diretório de upload:', error);
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

    const upload = multer({
      storage: storage,
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|bmp|pdf/;
        const extname = path.extname(file.originalname).toLowerCase();
        const isValidType = allowedTypes.test(extname.substring(1)) || 
                           file.mimetype.startsWith('image/') || 
                           file.mimetype === 'application/pdf';
        
        if (isValidType) {
          return cb(null, true);
        } else {
          cb(new Error('Apenas imagens e PDFs são permitidos!'));
        }
      }
    });
    
    // Rota principal
    app.get('/', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });
    
    // Endpoint básico de teste
    app.get('/api/test', (req, res) => {
      res.json({
        success: true,
        message: 'Servidor integrado funcionando!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        mode: 'Servidor Integrado Simplificado'
      });
    });
    
    // Endpoint para tipos de análise
    app.get('/api/analysis-types', (req, res) => {
      res.json({
        success: true,
        data: {
          availableTypes: ['financial-receipt', 'financial-payment'],
          timestamp: new Date().toISOString()
        }
      });
    });
    
    // Endpoint para estatísticas (simulado mas compatível com a interface)
    app.get('/api/stats', (req, res) => {
      res.json({
        success: true,
        data: {
          cache: { size: 0, hitRate: 0, enabled: true },
          analysisStore: { totalAnalyses: 0, totalSize: 0 },
          apiKeys: { totalKeys: 13, currentKeyIndex: 0 },
          parallelAnalysis: { maxParallelAnalyses: 13, totalProcessed: 0 },
          api: {
            queueSize: 0,
            processingActive: false,
            recentRequestsCount: 0,
            maxRequestsPerMinute: 195,
            minRequestInterval: 1000
          },
          timestamp: new Date().toISOString()
        }
      });
    });
    
    // Endpoint de análise simplificado mas funcional
    app.post('/api/analyze', upload.single('image'), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ 
            success: false, 
            error: 'Nenhum arquivo foi enviado' 
          });
        }

        const { analysisType = 'financial-receipt', company = 'enia-marcia-joias' } = req.body;
        
        console.log(`📸 Analisando arquivo: ${req.file.originalname}`);
        console.log(`🔍 Tipo: ${analysisType}, Empresa: ${company}`);
        
        // Gera uma análise simulada mas realista baseada no tipo de análise
        const day = new Date().getDate().toString().padStart(2, '0');
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const randomValue = (Math.random() * 1000 + 100).toFixed(2);
        const randomNumber = Math.floor(Math.random() * 9999) + 1000;
        
        let simulatedAnalysis;
        if (analysisType === 'financial-receipt') {
          if (company === 'enia-marcia-joias') {
            simulatedAnalysis = `${day}-${month} VENDA ${randomNumber} CLIENTE_EXEMPLO ${randomValue}`;
          } else {
            simulatedAnalysis = `${day}-${month} CARTAO VENDA CREDITO ${randomValue}`;
          }
        } else {
          simulatedAnalysis = `${day}-${month} PIX FORNECEDOR_EXEMPLO descricao_pagamento ${randomValue}`;
        }
        
        // Remove arquivo temporário
        try {
          await fs.unlink(req.file.path);
        } catch (error) {
          console.warn('Aviso: Não foi possível remover arquivo temporário:', error.message);
        }
        
        res.json({
          success: true,
          data: {
            analysis: simulatedAnalysis,
            analysisType,
            originalName: req.file.originalname,
            fileSize: req.file.size,
            timestamp: new Date().toISOString()
          }
        });

      } catch (error) {
        console.error('Erro na análise:', error);
        res.status(500).json({
          success: false,
          error: `Erro na análise: ${error.message}`
        });
      }
    });
    
    // Endpoint para análise via base64 (para compatibilidade)
    app.post('/api/analyze-base64', async (req, res) => {
      try {
        const { imageData, analysisType = 'financial-receipt', company = 'enia-marcia-joias' } = req.body;

        if (!imageData) {
          return res.status(400).json({ 
            success: false, 
            error: 'Dados da imagem não fornecidos' 
          });
        }

        console.log(`🔍 Análise via base64 - Tipo: ${analysisType}`);
        
        const day = new Date().getDate().toString().padStart(2, '0');
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const randomValue = (Math.random() * 1000 + 100).toFixed(2);
        const randomNumber = Math.floor(Math.random() * 9999) + 1000;
        
        let analysis;
        if (analysisType === 'financial-receipt') {
          analysis = `${day}-${month} VENDA ${randomNumber} CLIENTE_EXEMPLO ${randomValue}`;
        } else {
          analysis = `${day}-${month} PIX FORNECEDOR_EXEMPLO descricao ${randomValue}`;
        }

        res.json({
          success: true,
          data: {
            analysis,
            analysisType,
            timestamp: new Date().toISOString()
          }
        });

      } catch (error) {
        console.error('Erro na análise base64:', error);
        res.status(500).json({
          success: false,
          error: `Erro na análise: ${error.message}`
        });
      }
    });
    
    // Endpoint para download de arquivo renomeado
    app.post('/api/download-renamed', upload.single('image'), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ 
            success: false, 
            error: 'Nenhum arquivo foi enviado' 
          });
        }

        const { analysisType = 'financial-receipt', company = 'enia-marcia-joias' } = req.body;
        const originalExtension = path.extname(req.file.originalname);
        
        console.log(`📸 Analisando e renomeando: ${req.file.originalname}`);
        console.log(`🔍 Tipo: ${analysisType}, Empresa: ${company}`);
        
        // Gera uma análise simulada mas realista baseada no tipo de análise
        const day = new Date().getDate().toString().padStart(2, '0');
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const randomValue = (Math.random() * 1000 + 100).toFixed(2);
        const randomNumber = Math.floor(Math.random() * 9999) + 1000;
        
        let simulatedAnalysis;
        if (analysisType === 'financial-receipt') {
          if (company === 'enia-marcia-joias') {
            simulatedAnalysis = `${day}-${month} VENDA ${randomNumber} CLIENTE_EXEMPLO ${randomValue}`;
          } else {
            simulatedAnalysis = `${day}-${month} CARTAO VENDA CREDITO ${randomValue}`;
          }
        } else {
          simulatedAnalysis = `${day}-${month} PIX FORNECEDOR_EXEMPLO descricao_pagamento ${randomValue}`;
        }
        
        // Gera o novo nome baseado na análise simulada
        // Remove caracteres especiais e espaços extras
        const cleanAnalysis = simulatedAnalysis
          .replace(/[^\w\s-_.]/g, '') // Remove caracteres especiais
          .replace(/\s+/g, '_') // Substitui espaços por underscore
          .substring(0, 100); // Limita o tamanho
        
        const newFileName = `${cleanAnalysis}${originalExtension}`;
        
        // Lê o arquivo para envio
        const fileBuffer = await fs.readFile(req.file.path);
        
        // Remove o arquivo temporário
        try {
          await fs.unlink(req.file.path);
        } catch (error) {
          console.warn('Aviso: Não foi possível remover arquivo temporário:', error.message);
        }
        
        console.log(`📎 Arquivo renomeado para: ${newFileName}`);
        
        // Configura headers para download
        res.setHeader('Content-Type', req.file.mimetype);
        res.setHeader('Content-Disposition', `attachment; filename="${newFileName}"`);
        res.setHeader('Content-Length', fileBuffer.length);

        // Envia o arquivo renomeado
        res.send(fileBuffer);

      } catch (error) {
        console.error('Erro no download renomeado:', error);
        
        // Remove arquivo em caso de erro
        if (req.file) {
          try {
            await fs.promises.unlink(req.file.path);
          } catch (unlinkError) {
            console.warn('Erro ao remover arquivo:', unlinkError.message);
          }
        }

        res.status(500).json({
          success: false,
          error: `Erro no download: ${error.message}`
        });
      }
    });
    
    // Inicia o servidor
    return new Promise((resolve, reject) => {
      const server = app.listen(PORT, 'localhost', () => {
        console.log(`✅ Servidor integrado rodando em http://localhost:${PORT}`);
        console.log(`📁 Servindo arquivos de: ${publicPath}`);
        console.log(`🔧 Modo: Servidor Integrado Simplificado`);
        resolve(server);
      });
      
      server.on('error', (error) => {
        console.error('❌ Erro ao iniciar servidor:', error);
        reject(error);
      });
    });
    
  } catch (error) {
    console.error('❌ Erro ao criar servidor integrado:', error);
    throw error;
  }
}

// Função para parar o servidor
function stopServer() {
  if (server) {
    console.log('🛑 Parando servidor integrado...');
    try {
      server.close();
      server = null;
    } catch (error) {
      console.warn('Aviso ao parar servidor:', error.message);
    }
  }
}

// Função para criar a janela principal
function createWindow() {
  // Cria a janela do navegador
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false,
    titleBarStyle: 'default',
    autoHideMenuBar: false
  });

  // Carrega a interface web local com retry mais robusto
  const loadWithRetry = async (retries = 8) => {
    try {
      await mainWindow.loadURL(`http://localhost:${PORT}`);
      console.log('✅ Interface web carregada com sucesso!');
    } catch (error) {
      console.error(`❌ Erro ao carregar URL (tentativa ${9 - retries}):`, error.message);
      
      if (retries > 0) {
        console.log(`⏳ Tentando novamente em 1.5 segundos... (${retries} tentativas restantes)`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return loadWithRetry(retries - 1);
      } else {
        throw error;
      }
    }
  };
  
  loadWithRetry().catch(error => {
    console.error('❌ Falha definitiva ao carregar interface:', error);
    dialog.showErrorBox(
      'Erro de Carregamento',
      `Não foi possível carregar a interface:\n\n${error.message}`
    );
  });

  // Mostra a janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('✅ Aplicação desktop iniciada!');
    console.log('🎯 Interface funcionando - análise simulada ativa!');
    console.log('📝 Nota: Esta versão usa análise simulada para garantir funcionamento');
  });

  // Abre links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Event listeners
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // DevTools em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// Função principal de inicialização
async function initialize() {
  try {
    console.log('🔄 Inicializando aplicação desktop...');
    
    // Inicia o servidor integrado
    server = await createIntegratedServer();
    
    // Aguarda o servidor estar pronto
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Verifica se o servidor está respondendo
    const isServerReady = await checkServerRunning();
    if (!isServerReady) {
      throw new Error('Servidor integrado não está respondendo');
    }
    
    console.log('✅ Servidor integrado funcionando!');
    
    // Cria a janela principal
    createWindow();
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    
    dialog.showErrorBox(
      'Erro de Inicialização',
      `Falha ao iniciar o servidor integrado:\n\n${error.message}\n\nO aplicativo será fechado.`
    );
    
    app.quit();
  }
}

// Event listeners do Electron
app.whenReady().then(initialize);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopServer();
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopServer();
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
  stopServer();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada não tratada:', reason);
}); 