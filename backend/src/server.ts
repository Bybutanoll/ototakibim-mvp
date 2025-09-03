import app from './app';
import { connectDB } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🚀 OtoTakibim Backend başlatılıyor...');
    
    // MongoDB bağlantısı (opsiyonel)
    await connectDB();
    
    // Server'ı başlat
    const server = app.listen(PORT, () => {
      console.log(`✅ Backend başarıyla başlatıldı!`);
      console.log(`🔧 Port: ${PORT}`);
      console.log(`📱 Frontend: http://localhost:3000`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📊 API Docs: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM sinyali alındı, server kapatılıyor...');
      server.close(() => {
        console.log('✅ Server kapatıldı');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 SIGINT sinyali alındı, server kapatılıyor...');
      server.close(() => {
        console.log('✅ Server kapatıldı');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Server başlatma hatası:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM sinyali alındı, server kapatılıyor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT sinyali alındı, server kapatılıyor...');
  process.exit(0);
});

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

startServer();
