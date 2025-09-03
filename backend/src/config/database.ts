import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/oto-tamir-mvp';

export const connectDB = async (): Promise<void> => {
  try {
    // MongoDB URI kontrolü
    if (!MONGODB_URI) {
      console.log('📝 Demo modunda çalışıyor - MONGODB_URI tanımlanmamış');
      console.log('💡 Gerçek MongoDB bağlantısı için .env dosyasında MONGODB_URI ayarlayın');
      return;
    }

    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB bağlantı hatası:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB bağlantısı kesildi');
    });
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    console.log('📝 Demo modunda çalışıyor - MongoDB bağlantısı başarısız');
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
