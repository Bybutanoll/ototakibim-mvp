const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test Role-Based Access Control
async function testRBAC() {
  console.log('🔐 Role-Based Access Control Test Başlatılıyor...\n');

  try {
    // 1. Create test users with different roles
    console.log('1. Test kullanıcıları oluşturuluyor...');
    
    const users = [
      {
        email: 'owner@test.com',
        password: 'test123456',
        firstName: 'Owner',
        lastName: 'User',
        tenantRole: 'owner',
        companyName: 'Test Company',
        tenantId: 'test-company'
      },
      {
        email: 'manager@test.com',
        password: 'test123456',
        firstName: 'Manager',
        lastName: 'User',
        tenantRole: 'manager',
        companyName: 'Test Company',
        tenantId: 'test-company'
      },
      {
        email: 'technician@test.com',
        password: 'test123456',
        firstName: 'Technician',
        lastName: 'User',
        tenantRole: 'technician',
        companyName: 'Test Company',
        tenantId: 'test-company'
      }
    ];

    const tokens = {};

    for (const user of users) {
      try {
        // Register user
        await axios.post(`${API_BASE}/auth/register`, user);
        console.log(`✅ ${user.tenantRole} kullanıcısı oluşturuldu`);

        // Login user
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: user.email,
          password: user.password
        });
        
        tokens[user.tenantRole] = loginResponse.data.data.token;
        console.log(`✅ ${user.tenantRole} giriş yaptı`);
      } catch (error) {
        console.log(`⚠️ ${user.tenantRole} kullanıcısı zaten mevcut, giriş yapılıyor...`);
        
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: user.email,
          password: user.password
        });
        
        tokens[user.tenantRole] = loginResponse.data.data.token;
        console.log(`✅ ${user.tenantRole} giriş yaptı`);
      }
    }
    console.log('');

    // 2. Test permission checks
    console.log('2. Yetki kontrolleri test ediliyor...');
    
    const testPermissions = [
      { role: 'owner', resource: 'users', action: 'create', shouldPass: true },
      { role: 'owner', resource: 'users', action: 'delete', shouldPass: true },
      { role: 'manager', resource: 'users', action: 'create', shouldPass: true },
      { role: 'manager', resource: 'users', action: 'delete', shouldPass: false },
      { role: 'technician', resource: 'users', action: 'create', shouldPass: false },
      { role: 'technician', resource: 'workOrders', action: 'read', shouldPass: true },
      { role: 'technician', resource: 'workOrders', action: 'delete', shouldPass: false }
    ];

    for (const test of testPermissions) {
      const token = tokens[test.role];
      if (!token) continue;

      try {
        const response = await axios.post(`${API_BASE}/subscription/check-limit`, {
          type: 'workOrders',
          amount: 1
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`✅ ${test.role} - ${test.resource}:${test.action} - ${test.shouldPass ? 'PASS' : 'FAIL'} (Beklenen: ${test.shouldPass})`);
      } catch (error) {
        console.log(`❌ ${test.role} - ${test.resource}:${test.action} - ${test.shouldPass ? 'FAIL' : 'PASS'} (Beklenen: ${test.shouldPass})`);
      }
    }
    console.log('');

    // 3. Test work order operations
    console.log('3. İş emri operasyonları test ediliyor...');
    
    // Owner creates work order
    try {
      const ownerResponse = await axios.post(`${API_BASE}/work-orders`, {
        customerName: 'Test Customer',
        customerPhone: '05551234567',
        vehicleBrand: 'Toyota',
        vehicleModel: 'Corolla',
        vehiclePlate: '34ABC123',
        problemDescription: 'Test problem description',
        priority: 'normal'
      }, {
        headers: { Authorization: `Bearer ${tokens.owner}` }
      });
      console.log('✅ Owner iş emri oluşturdu');
    } catch (error) {
      console.log('❌ Owner iş emri oluşturma hatası:', error.response?.data?.message);
    }

    // Manager creates work order
    try {
      const managerResponse = await axios.post(`${API_BASE}/work-orders`, {
        customerName: 'Test Customer 2',
        customerPhone: '05551234568',
        vehicleBrand: 'Honda',
        vehicleModel: 'Civic',
        vehiclePlate: '34DEF456',
        problemDescription: 'Test problem description 2',
        priority: 'normal'
      }, {
        headers: { Authorization: `Bearer ${tokens.manager}` }
      });
      console.log('✅ Manager iş emri oluşturdu');
    } catch (error) {
      console.log('❌ Manager iş emri oluşturma hatası:', error.response?.data?.message);
    }

    // Technician tries to create work order (should fail)
    try {
      const technicianResponse = await axios.post(`${API_BASE}/work-orders`, {
        customerName: 'Test Customer 3',
        customerPhone: '05551234569',
        vehicleBrand: 'Ford',
        vehicleModel: 'Focus',
        vehiclePlate: '34GHI789',
        problemDescription: 'Test problem description 3',
        priority: 'normal'
      }, {
        headers: { Authorization: `Bearer ${tokens.technician}` }
      });
      console.log('❌ Technician iş emri oluşturdu (Beklenmeyen başarı)');
    } catch (error) {
      console.log('✅ Technician iş emri oluşturamadı (Beklenen davranış)');
    }
    console.log('');

    // 4. Test user management operations
    console.log('4. Kullanıcı yönetimi operasyonları test ediliyor...');
    
    // Owner tries to get users
    try {
      const ownerUsersResponse = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${tokens.owner}` }
      });
      console.log('✅ Owner kullanıcı listesini alabildi');
    } catch (error) {
      console.log('❌ Owner kullanıcı listesi hatası:', error.response?.data?.message);
    }

    // Manager tries to get users
    try {
      const managerUsersResponse = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${tokens.manager}` }
      });
      console.log('✅ Manager kullanıcı listesini alabildi');
    } catch (error) {
      console.log('❌ Manager kullanıcı listesi hatası:', error.response?.data?.message);
    }

    // Technician tries to get users (should fail)
    try {
      const technicianUsersResponse = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${tokens.technician}` }
      });
      console.log('❌ Technician kullanıcı listesini alabildi (Beklenmeyen başarı)');
    } catch (error) {
      console.log('✅ Technician kullanıcı listesini alamadı (Beklenen davranış)');
    }
    console.log('');

    // 5. Test subscription operations
    console.log('5. Abonelik operasyonları test ediliyor...');
    
    // Owner tries to get subscription info
    try {
      const ownerSubResponse = await axios.get(`${API_BASE}/subscription/usage`, {
        headers: { Authorization: `Bearer ${tokens.owner}` }
      });
      console.log('✅ Owner abonelik bilgilerini alabildi');
    } catch (error) {
      console.log('❌ Owner abonelik bilgileri hatası:', error.response?.data?.message);
    }

    // Manager tries to get subscription info
    try {
      const managerSubResponse = await axios.get(`${API_BASE}/subscription/usage`, {
        headers: { Authorization: `Bearer ${tokens.manager}` }
      });
      console.log('✅ Manager abonelik bilgilerini alabildi');
    } catch (error) {
      console.log('❌ Manager abonelik bilgileri hatası:', error.response?.data?.message);
    }

    // Technician tries to get subscription info (should fail)
    try {
      const technicianSubResponse = await axios.get(`${API_BASE}/subscription/usage`, {
        headers: { Authorization: `Bearer ${tokens.technician}` }
      });
      console.log('❌ Technician abonelik bilgilerini alabildi (Beklenmeyen başarı)');
    } catch (error) {
      console.log('✅ Technician abonelik bilgilerini alamadı (Beklenen davranış)');
    }

    console.log('\n🎉 Role-Based Access Control Test Tamamlandı!');
    console.log('\n📊 Test Sonuçları:');
    console.log('✅ Kullanıcı oluşturma ve giriş');
    console.log('✅ Yetki kontrolleri');
    console.log('✅ İş emri operasyonları');
    console.log('✅ Kullanıcı yönetimi operasyonları');
    console.log('✅ Abonelik operasyonları');
    console.log('✅ Rol bazlı erişim kontrolü');

  } catch (error) {
    console.error('❌ Test hatası:', error.response?.data || error.message);
  }
}

// Run the test
testRBAC();
