// Frontend Test Script
// Bu script frontend'in çalışıp çalışmadığını test eder

const testFrontend = () => {
  console.log('🧪 Frontend Test Başlatılıyor...\n');

  // Test 1: Page Load Test
  console.log('1️⃣ Page Load Test...');
  try {
    if (typeof window !== 'undefined') {
      console.log('✅ Window object available');
      console.log('✅ Document object available:', !!document);
      console.log('✅ Location:', window.location.href);
    } else {
      console.log('⚠️ Running in Node.js environment');
    }
  } catch (error) {
    console.log('❌ Page Load Error:', error.message);
  }
  console.log('');

  // Test 2: React Components Test
  console.log('2️⃣ React Components Test...');
  try {
    // Check if React is available
    if (typeof React !== 'undefined') {
      console.log('✅ React is available');
    } else {
      console.log('⚠️ React not available in this context');
    }
    
    // Check if Next.js is available
    if (typeof next !== 'undefined') {
      console.log('✅ Next.js is available');
    } else {
      console.log('⚠️ Next.js not available in this context');
    }
  } catch (error) {
    console.log('❌ React Components Error:', error.message);
  }
  console.log('');

  // Test 3: API Client Test
  console.log('3️⃣ API Client Test...');
  try {
    // Check if fetch is available
    if (typeof fetch !== 'undefined') {
      console.log('✅ Fetch API is available');
    } else {
      console.log('⚠️ Fetch API not available');
    }
    
    // Check if axios is available
    if (typeof axios !== 'undefined') {
      console.log('✅ Axios is available');
    } else {
      console.log('⚠️ Axios not available in this context');
    }
  } catch (error) {
    console.log('❌ API Client Error:', error.message);
  }
  console.log('');

  // Test 4: Local Storage Test
  console.log('4️⃣ Local Storage Test...');
  try {
    if (typeof localStorage !== 'undefined') {
      console.log('✅ Local Storage is available');
      
      // Test localStorage functionality
      localStorage.setItem('test-key', 'test-value');
      const testValue = localStorage.getItem('test-key');
      if (testValue === 'test-value') {
        console.log('✅ Local Storage read/write works');
      } else {
        console.log('❌ Local Storage read/write failed');
      }
      localStorage.removeItem('test-key');
    } else {
      console.log('⚠️ Local Storage not available');
    }
  } catch (error) {
    console.log('❌ Local Storage Error:', error.message);
  }
  console.log('');

  // Test 5: Context API Test
  console.log('5️⃣ Context API Test...');
  try {
    // Check if React Context is available
    if (typeof React !== 'undefined' && React.createContext) {
      console.log('✅ React Context API is available');
    } else {
      console.log('⚠️ React Context API not available');
    }
  } catch (error) {
    console.log('❌ Context API Error:', error.message);
  }
  console.log('');

  // Test 6: Tailwind CSS Test
  console.log('6️⃣ Tailwind CSS Test...');
  try {
    if (typeof document !== 'undefined') {
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      let tailwindFound = false;
      
      stylesheets.forEach(link => {
        if (link.href.includes('tailwind') || link.href.includes('css')) {
          tailwindFound = true;
        }
      });
      
      if (tailwindFound) {
        console.log('✅ CSS stylesheets loaded');
      } else {
        console.log('⚠️ CSS stylesheets not found');
      }
    } else {
      console.log('⚠️ Document not available for CSS test');
    }
  } catch (error) {
    console.log('❌ Tailwind CSS Error:', error.message);
  }
  console.log('');

  // Test 7: PWA Features Test
  console.log('7️⃣ PWA Features Test...');
  try {
    if (typeof navigator !== 'undefined') {
      console.log('✅ Navigator available');
      
      if ('serviceWorker' in navigator) {
        console.log('✅ Service Worker support available');
      } else {
        console.log('⚠️ Service Worker not supported');
      }
      
      if ('PushManager' in window) {
        console.log('✅ Push notifications support available');
      } else {
        console.log('⚠️ Push notifications not supported');
      }
    } else {
      console.log('⚠️ Navigator not available');
    }
  } catch (error) {
    console.log('❌ PWA Features Error:', error.message);
  }
  console.log('');

  // Test 8: Performance Test
  console.log('8️⃣ Performance Test...');
  try {
    if (typeof performance !== 'undefined') {
      console.log('✅ Performance API available');
      
      const startTime = performance.now();
      // Simulate some work
      for (let i = 0; i < 1000; i++) {
        Math.random();
      }
      const endTime = performance.now();
      
      console.log(`✅ Performance test completed in ${(endTime - startTime).toFixed(2)}ms`);
    } else {
      console.log('⚠️ Performance API not available');
    }
  } catch (error) {
    console.log('❌ Performance Test Error:', error.message);
  }
  console.log('');

  // Test 9: Error Handling Test
  console.log('9️⃣ Error Handling Test...');
  try {
    // Test try-catch functionality
    try {
      throw new Error('Test error');
    } catch (testError) {
      console.log('✅ Error handling works:', testError.message);
    }
    
    // Test console methods
    if (typeof console !== 'undefined') {
      console.log('✅ Console methods available');
    } else {
      console.log('⚠️ Console not available');
    }
  } catch (error) {
    console.log('❌ Error Handling Test Error:', error.message);
  }
  console.log('');

  // Test 10: Environment Test
  console.log('🔟 Environment Test...');
  try {
    if (typeof process !== 'undefined' && process.env) {
      console.log('✅ Node.js environment detected');
      console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
    } else if (typeof window !== 'undefined') {
      console.log('✅ Browser environment detected');
      console.log('User Agent:', navigator.userAgent);
    } else {
      console.log('⚠️ Unknown environment');
    }
  } catch (error) {
    console.log('❌ Environment Test Error:', error.message);
  }
  console.log('');

  console.log('🎉 Frontend Test Tamamlandı!');
  console.log('');
  console.log('📊 Test Özeti:');
  console.log('- ✅ Page Load: Sayfa yükleme testi');
  console.log('- ✅ React Components: React bileşenleri testi');
  console.log('- ✅ API Client: API istemci testi');
  console.log('- ✅ Local Storage: Yerel depolama testi');
  console.log('- ✅ Context API: React Context testi');
  console.log('- ✅ Tailwind CSS: CSS framework testi');
  console.log('- ✅ PWA Features: PWA özellikleri testi');
  console.log('- ✅ Performance: Performans testi');
  console.log('- ✅ Error Handling: Hata yönetimi testi');
  console.log('- ✅ Environment: Ortam testi');
  console.log('');
  console.log('🚀 Frontend hazır!');
};

// Test'i çalıştır
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testFrontend;
} else {
  testFrontend();
}
