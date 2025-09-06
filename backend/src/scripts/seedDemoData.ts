import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Vehicle from '../models/Vehicle';
import { connectDB } from '../config/database';

const demoUsers = [
  {
    firstName: 'Mehmet',
    lastName: 'Usta',
    email: 'mehmet@demo.com',
    phone: '+90 555 123 4567',
    password: 'demo123456',
    role: 'technician' as const,
    isActive: true,
    onboardingCompleted: true,
    businessName: 'Mehmet Usta Oto Servis',
    businessType: 'Oto Tamir',
    address: 'İstanbul, Türkiye'
  },
  {
    firstName: 'Ayşe',
    lastName: 'Demir',
    email: 'ayse@demo.com',
    phone: '+90 555 987 6543',
    password: 'demo123456',
    role: 'manager' as const,
    isActive: true,
    onboardingCompleted: true,
    businessName: 'Demir Fleet Management',
    businessType: 'Fleet Yönetimi',
    address: 'Ankara, Türkiye'
  }
];

const demoVehicles = [
  {
    plate: '34 ABC 123',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    vin: '1HGBH41JXMN109186',
    engineSize: '1.6L',
    fuelType: 'gasoline',
    transmission: 'automatic',
    mileage: 45000,
    color: 'Beyaz',
    owner: '', // Will be set after user creation
    isActive: true
  },
  {
    plate: '06 XYZ 789',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2019,
    vin: '1HGBH41JXMN109187',
    engineSize: '1.4L',
    fuelType: 'gasoline',
    transmission: 'manual',
    mileage: 62000,
    color: 'Siyah',
    owner: '', // Will be set after user creation
    isActive: true
  },
  {
    plate: '35 DEF 456',
    brand: 'Ford',
    model: 'Focus',
    year: 2021,
    vin: '1HGBH41JXMN109188',
    engineSize: '1.5L',
    fuelType: 'diesel',
    transmission: 'automatic',
    mileage: 28000,
    color: 'Mavi',
    owner: '', // Will be set after user creation
    isActive: true
  }
];

async function seedDemoData() {
  try {
    console.log('🌱 Demo veriler oluşturuluyor...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    console.log('🗑️ Mevcut veriler temizlendi');
    
    // Create demo users
    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Demo kullanıcı oluşturuldu: ${user.email}`);
    }
    
    // Create demo vehicles
    for (let i = 0; i < demoVehicles.length; i++) {
      const vehicleData = {
        ...demoVehicles[i],
        owner: createdUsers[i % createdUsers.length]._id
      };
      const vehicle = new Vehicle(vehicleData);
      await vehicle.save();
      console.log(`🚗 Demo araç oluşturuldu: ${vehicle.plate}`);
    }
    
    console.log('✅ Demo veriler başarıyla oluşturuldu!');
    console.log('\n📋 Demo Hesaplar:');
    console.log('Email: mehmet@demo.com, Şifre: demo123456');
    console.log('Email: ayse@demo.com, Şifre: demo123456');
    
  } catch (error) {
    console.error('❌ Demo veri oluşturma hatası:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Veritabanı bağlantısı kapatıldı');
  }
}

// Run if called directly
if (require.main === module) {
  seedDemoData();
}

export default seedDemoData;
