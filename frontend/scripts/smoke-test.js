#!/usr/bin/env node

const http = require('http');
const https = require('https');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const testEndpoints = [
  { path: '/', expectedStatus: 200, description: 'Homepage' },
  { path: '/login', expectedStatus: 200, description: 'Login page' },
  { path: '/register', expectedStatus: 200, description: 'Register page' },
  { path: '/dashboard', expectedStatus: 200, description: 'Dashboard page' },
  { path: '/api/health', expectedStatus: 200, description: 'Health check' },
];

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runSmokeTests() {
  console.log('🚀 Starting smoke tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of testEndpoints) {
    const url = `${BASE_URL}${test.path}`;
    console.log(`Testing ${test.description} (${url})...`);
    
    try {
      const response = await makeRequest(url);
      
      if (response.statusCode === test.expectedStatus) {
        console.log(`✅ ${test.description}: ${response.statusCode}`);
        passed++;
      } else {
        console.log(`❌ ${test.description}: Expected ${test.expectedStatus}, got ${response.statusCode}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.description}: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All smoke tests passed!');
    process.exit(0);
  }
}

// Check if server is running
async function checkServerHealth() {
  try {
    await makeRequest(`${BASE_URL}/`);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if server is running...');
  
  const isServerRunning = await checkServerHealth();
  
  if (!isServerRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   npm run dev');
    console.log('   or');
    console.log('   npm start');
    process.exit(1);
  }
  
  console.log('✅ Server is running\n');
  await runSmokeTests();
}

main().catch(error => {
  console.error('💥 Smoke test failed:', error);
  process.exit(1);
});
