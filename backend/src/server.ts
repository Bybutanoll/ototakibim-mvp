import app from './app';
import { connectDB } from './config/database';
import { handleUnhandledRejection, handleUncaughtException } from './middleware/errorHandler';
import { createServer } from 'http';
import dotenv from 'dotenv';

dotenv.config();

// Handle uncaught exceptions and unhandled rejections
handleUncaughtException();
handleUnhandledRejection();

const DEFAULT_PORT = parseInt(process.env.PORT || '5000');
const FALLBACK_PORTS = [5001, 5002, 5003];

let globalServer: any = null;

const tryPort = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = createServer(app);
    globalServer = server; // Global server referansı
    
    server.listen(port, () => {
      console.log(`✅ Backend başarıyla başlatıldı!`);
      console.log(`🔧 Port: ${port}`);
      console.log(`📱 Frontend: http://localhost:3000`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health Check: http://localhost:${port}/api/health`);
      console.log(`📊 API Docs: http://localhost:${port}/api`);
      resolve(true);
    });
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${port} kullanımda, başka port deneniyor...`);
        resolve(false);
      } else {
        console.error(`❌ Port ${port} hatası:`, err.message);
        resolve(false);
      }
    });
  });
};

const startServer = async () => {
  try {
    console.log('🚀 OtoTakibim Backend başlatılıyor...');
    
    // MongoDB bağlantısı (opsiyonel)
    await connectDB();
    
    // Ana port'u dene
    let started = await tryPort(DEFAULT_PORT);
    
    // Ana port çalışmazsa fallback'leri dene
    if (!started) {
      for (const port of FALLBACK_PORTS) {
        started = await tryPort(port);
        if (started) break;
      }
    }

    if (!started) {
      console.error('❌ Hiçbir port bulunamadı! Tüm portlar kullanımda.');
      console.log('💡 Çözüm: npm run kill-ports komutunu çalıştırın');
      process.exit(1);
    }

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM sinyali alındı, server kapatılıyor...');
      if (globalServer) {
        globalServer.close(() => {
          console.log('✅ Server kapatıldı');
          process.exit(0);
        });
      }
    });

    process.on('SIGINT', () => {
      console.log('🛑 SIGINT sinyali alındı, server kapatılıyor...');
      if (globalServer) {
        globalServer.close(() => {
          console.log('✅ Server kapatıldı');
          process.exit(0);
        });
      }
    });

  } catch (error) {
    console.error('❌ Server başlatma hatası:', error);
    process.exit(1);
  }
};

// Graceful shutdown handlers are now in startServer function

startServer();
