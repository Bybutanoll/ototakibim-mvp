import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/oto-tamir-mvp';

// MongoDB connection options for production
const mongooseOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
  retryWrites: true,
  w: 'majority',
};

export const connectDB = async (): Promise<void> => {
  try {
    // Demo modu kontrolü
    if (process.env.DEMO_MODE === 'true') {
      console.log('🎭 Demo modunda çalışıyor - MongoDB bağlantısı atlanıyor');
      console.log('💡 Gerçek veritabanı için DEMO_MODE=false yapın');
      return;
    }

    // MongoDB URI kontrolü
    if (!MONGODB_URI) {
      console.log('📝 Demo modunda çalışıyor - MONGODB_URI tanımlanmamış');
      console.log('💡 Gerçek MongoDB bağlantısı için .env dosyasında MONGODB_URI ayarlayın');
      return;
    }

    // Production-ready connection with error handling
    const conn = await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log(`✅ MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection Pool Size: ${conn.connection.readyState}`);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB bağlantı hatası:', err);
      // Log to external service in production
      if (process.env.NODE_ENV === 'production') {
        // TODO: Add external logging service (e.g., Sentry, LogRocket)
      }
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB bağlantısı kesildi');
      // Attempt to reconnect
      setTimeout(() => {
        if (mongoose.connection.readyState === 0) {
          console.log('🔄 MongoDB yeniden bağlanmaya çalışıyor...');
          connectDB();
        }
      }, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB yeniden bağlandı');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB bağlantısı kapatıldı (SIGINT)');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    
    // In production, don't fall back to demo mode
    if (process.env.NODE_ENV === 'production') {
      console.error('💥 Production ortamında MongoDB bağlantısı başarısız - Uygulama kapatılıyor');
      process.exit(1);
    } else {
      console.log('📝 Development modunda - Demo moduna geçiliyor');
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB bağlantısı kapatıldı');
  } catch (error) {
    console.error('❌ MongoDB bağlantısı kapatma hatası:', error);
  }
};
