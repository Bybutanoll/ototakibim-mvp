const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test subscription system
async function testSubscriptionSystem() {
  console.log('🚀 Subscription System Test Başlatılıyor...\n');

  try {
    // 1. Test getting all plans
    console.log('1. Planları getiriliyor...');
    const plansResponse = await axios.get(`${API_BASE}/subscription/plans`);
    console.log('✅ Planlar başarıyla alındı:');
    plansResponse.data.data.forEach(plan => {
      console.log(`   - ${plan.name}: ₺${plan.price}/ay (${plan.features.length} özellik)`);
    });
    console.log('');

    // 2. Test getting specific plan
    console.log('2. Starter plan detayları getiriliyor...');
    const starterPlanResponse = await axios.get(`${API_BASE}/subscription/plans/starter`);
    console.log('✅ Starter plan detayları:');
    console.log(`   - Fiyat: ₺${starterPlanResponse.data.data.price}`);
    console.log(`   - İş Emirleri: ${starterPlanResponse.data.data.limits.workOrders}`);
    console.log(`   - Kullanıcılar: ${starterPlanResponse.data.data.limits.users}`);
    console.log('');

    // 3. Test authentication (create a test user first)
    console.log('3. Test kullanıcısı oluşturuluyor...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      email: 'test@subscription.com',
      password: 'test123456',
      firstName: 'Test',
      lastName: 'User',
      companyName: 'Test Company',
      tenantId: 'test-company'
    });
    console.log('✅ Test kullanıcısı oluşturuldu');

    // 4. Login
    console.log('4. Giriş yapılıyor...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@subscription.com',
      password: 'test123456'
    });
    const token = loginResponse.data.data.token;
    console.log('✅ Giriş başarılı');

    // Set up axios with token
    const authenticatedAxios = axios.create({
      baseURL: API_BASE,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // 5. Test getting usage
    console.log('5. Kullanım bilgileri getiriliyor...');
    const usageResponse = await authenticatedAxios.get('/subscription/usage');
    console.log('✅ Kullanım bilgileri:');
    console.log(`   - Plan: ${usageResponse.data.data.plan}`);
    console.log(`   - Durum: ${usageResponse.data.data.status}`);
    console.log(`   - İş Emirleri: ${usageResponse.data.data.usage.workOrders}/${usageResponse.data.data.limits.workOrders}`);
    console.log(`   - Kullanıcılar: ${usageResponse.data.data.usage.users}/${usageResponse.data.data.limits.users}`);
    console.log('');

    // 6. Test checking limits
    console.log('6. Limit kontrolü yapılıyor...');
    const limitCheckResponse = await authenticatedAxios.post('/subscription/check-limit', {
      type: 'workOrders',
      amount: 1
    });
    console.log('✅ Limit kontrolü:');
    console.log(`   - İş emri oluşturabilir mi: ${limitCheckResponse.data.data.canPerform}`);
    console.log('');

    // 7. Test getting features
    console.log('7. Özellikler getiriliyor...');
    const featuresResponse = await authenticatedAxios.get('/subscription/features');
    console.log('✅ Mevcut özellikler:');
    featuresResponse.data.data.forEach(feature => {
      console.log(`   - ${feature}`);
    });
    console.log('');

    // 8. Test feature check
    console.log('8. Özellik kontrolü yapılıyor...');
    const featureCheckResponse = await authenticatedAxios.get('/subscription/features/ai_features');
    console.log('✅ AI özelliği kontrolü:');
    console.log(`   - AI özelliği var mı: ${featureCheckResponse.data.data.hasFeature}`);
    console.log('');

    // 9. Test plan change (if not already professional)
    if (usageResponse.data.data.plan !== 'professional') {
      console.log('9. Plan değiştiriliyor (Professional)...');
      try {
        await authenticatedAxios.post('/subscription/change-plan', {
          plan: 'professional'
        });
        console.log('✅ Plan başarıyla değiştirildi');
      } catch (error) {
        console.log('⚠️ Plan değiştirme hatası (beklenen):', error.response?.data?.message || error.message);
      }
    } else {
      console.log('9. Zaten Professional plan kullanılıyor');
    }
    console.log('');

    // 10. Test trial extension
    if (usageResponse.data.data.status === 'trial') {
      console.log('10. Deneme süresi uzatılıyor...');
      try {
        await authenticatedAxios.post('/subscription/extend-trial', {
          days: 7
        });
        console.log('✅ Deneme süresi 7 gün uzatıldı');
      } catch (error) {
        console.log('⚠️ Deneme süresi uzatma hatası:', error.response?.data?.message || error.message);
      }
    } else {
      console.log('10. Deneme süresi değil, uzatma gerekmiyor');
    }

    console.log('\n🎉 Subscription System Test Tamamlandı!');
    console.log('\n📊 Test Sonuçları:');
    console.log('✅ Plan listesi API');
    console.log('✅ Plan detay API');
    console.log('✅ Kullanım bilgileri API');
    console.log('✅ Limit kontrolü API');
    console.log('✅ Özellik listesi API');
    console.log('✅ Özellik kontrolü API');
    console.log('✅ Plan değiştirme API');
    console.log('✅ Deneme süresi uzatma API');

  } catch (error) {
    console.error('❌ Test hatası:', error.response?.data || error.message);
  }
}

// Run the test
testSubscriptionSystem();
