const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';

class SystemTester {
  constructor() {
    this.results = {
      backend: { passed: 0, failed: 0, tests: [] },
      frontend: { passed: 0, failed: 0, tests: [] },
      integration: { passed: 0, failed: 0, tests: [] },
      overall: { passed: 0, failed: 0, total: 0 }
    };
    this.authToken = '';
  }

  async runTest(testName, testFunction, category = 'integration') {
    try {
      console.log(`🧪 ${testName}...`);
      const result = await testFunction();
      this.results[category].passed++;
      this.results[category].tests.push({ name: testName, status: 'PASSED', result });
      console.log(`✅ ${testName}: PASSED`);
      return result;
    } catch (error) {
      this.results[category].failed++;
      this.results[category].tests.push({ name: testName, status: 'FAILED', error: error.message });
      console.log(`❌ ${testName}: FAILED - ${error.message}`);
      return null;
    }
  }

  async testBackendHealth() {
    const response = await axios.get(`${BACKEND_URL}/api/health`);
    if (response.status !== 200) {
      throw new Error(`Health check failed with status ${response.status}`);
    }
    return response.data;
  }

  async testBackendAuthentication() {
    const testUser = {
      email: 'test@example.com',
      password: 'test123456'
    };

    try {
      // Try to login first
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, testUser);
      this.authToken = loginResponse.data.token;
      return loginResponse.data;
    } catch (error) {
      // If login fails, try to register
      const registerResponse = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        ...testUser,
        name: 'Test User',
        tenantName: 'Test Tenant',
        tenantSlug: 'test-tenant'
      });
      
      // Then login
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, testUser);
      this.authToken = loginResponse.data.token;
      return loginResponse.data;
    }
  }

  async testUsageMonitoring() {
    if (!this.authToken) {
      throw new Error('No auth token available');
    }

    const headers = { Authorization: `Bearer ${this.authToken}` };
    
    // Test usage dashboard
    const dashboardResponse = await axios.get(`${BACKEND_URL}/api/usage/dashboard`, { headers });
    
    // Test usage statistics
    const statsResponse = await axios.get(`${BACKEND_URL}/api/usage/stats?period=month`, { headers });
    
    // Test usage alerts
    const alertsResponse = await axios.get(`${BACKEND_URL}/api/usage/alerts`, { headers });

    return {
      dashboard: dashboardResponse.data,
      stats: statsResponse.data,
      alerts: alertsResponse.data
    };
  }

  async testRateLimiting() {
    if (!this.authToken) {
      throw new Error('No auth token available');
    }

    const headers = { Authorization: `Bearer ${this.authToken}` };
    
    // Make multiple requests to test rate limiting
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        axios.get(`${BACKEND_URL}/api/usage/dashboard`, { headers })
          .catch(err => ({ error: err.response?.status, data: err.response?.data }))
      );
    }
    
    const results = await Promise.all(promises);
    const successCount = results.filter(r => !r.error).length;
    const rateLimitedCount = results.filter(r => r.error === 429).length;
    
    if (rateLimitedCount === 0) {
      throw new Error('Rate limiting not working - no requests were rate limited');
    }
    
    return { successCount, rateLimitedCount, total: results.length };
  }

  async testSubscriptionManagement() {
    if (!this.authToken) {
      throw new Error('No auth token available');
    }

    const headers = { Authorization: `Bearer ${this.authToken}` };
    
    // Test current subscription
    const subscriptionResponse = await axios.get(`${BACKEND_URL}/api/subscription/current`, { headers });
    
    // Test subscription plans
    const plansResponse = await axios.get(`${BACKEND_URL}/api/subscription/plans`, { headers });

    return {
      current: subscriptionResponse.data,
      plans: plansResponse.data
    };
  }

  async testUserManagement() {
    if (!this.authToken) {
      throw new Error('No auth token available');
    }

    const headers = { Authorization: `Bearer ${this.authToken}` };
    
    // Test get users
    const usersResponse = await axios.get(`${BACKEND_URL}/api/users`, { headers });
    
    return usersResponse.data;
  }

  async testFrontendAccessibility() {
    try {
      const response = await axios.get(FRONTEND_URL);
      if (response.status !== 200) {
        throw new Error(`Frontend not accessible with status ${response.status}`);
      }
      return { status: response.status, accessible: true };
    } catch (error) {
      throw new Error(`Frontend not accessible: ${error.message}`);
    }
  }

  async testFrontendBuild() {
    return new Promise((resolve, reject) => {
      exec('npm run build', { cwd: path.join(__dirname, 'frontend') }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Build failed: ${error.message}`));
        } else {
          resolve({ stdout, stderr, success: true });
        }
      });
    });
  }

  async testDatabaseConnection() {
    // This would test database connectivity
    // For now, we'll assume it's working if backend is responding
    const response = await axios.get(`${BACKEND_URL}/api/health`);
    if (response.data.database !== 'connected') {
      throw new Error('Database not connected');
    }
    return response.data;
  }

  async testAPISecurity() {
    // Test unauthorized access
    try {
      await axios.get(`${BACKEND_URL}/api/usage/dashboard`);
      throw new Error('Security test failed - unauthorized access allowed');
    } catch (error) {
      if (error.response?.status === 401) {
        return { security: 'PASSED', message: 'Unauthorized access properly blocked' };
      } else {
        throw new Error(`Security test failed with unexpected error: ${error.message}`);
      }
    }
  }

  async testPerformance() {
    const startTime = Date.now();
    
    // Make multiple API calls to test performance
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(axios.get(`${BACKEND_URL}/api/health`));
    }
    
    await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (duration > 5000) { // 5 seconds
      throw new Error(`Performance test failed - took ${duration}ms`);
    }
    
    return { duration, performance: 'PASSED' };
  }

  async runAllTests() {
    console.log('🚀 OtoTakibim System Test Başlatılıyor...\n');
    console.log('=' * 60);
    console.log('');

    // Backend Tests
    console.log('🔧 BACKEND TESTS');
    console.log('-'.repeat(40));
    
    await this.runTest('Backend Health Check', () => this.testBackendHealth(), 'backend');
    await this.runTest('Backend Authentication', () => this.testBackendAuthentication(), 'backend');
    await this.runTest('Database Connection', () => this.testDatabaseConnection(), 'backend');
    await this.runTest('Usage Monitoring', () => this.testUsageMonitoring(), 'backend');
    await this.runTest('Rate Limiting', () => this.testRateLimiting(), 'backend');
    await this.runTest('Subscription Management', () => this.testSubscriptionManagement(), 'backend');
    await this.runTest('User Management', () => this.testUserManagement(), 'backend');
    await this.runTest('API Security', () => this.testAPISecurity(), 'backend');
    await this.runTest('Performance', () => this.testPerformance(), 'backend');
    
    console.log('');

    // Frontend Tests
    console.log('🎨 FRONTEND TESTS');
    console.log('-'.repeat(40));
    
    await this.runTest('Frontend Accessibility', () => this.testFrontendAccessibility(), 'frontend');
    // await this.runTest('Frontend Build', () => this.testFrontendBuild(), 'frontend');
    
    console.log('');

    // Integration Tests
    console.log('🔗 INTEGRATION TESTS');
    console.log('-'.repeat(40));
    
    // Add integration tests here
    
    console.log('');

    // Generate Report
    this.generateReport();
  }

  generateReport() {
    console.log('📊 TEST REPORT');
    console.log('=' * 60);
    console.log('');

    // Calculate totals
    this.results.overall.total = 
      this.results.backend.passed + this.results.backend.failed +
      this.results.frontend.passed + this.results.frontend.failed +
      this.results.integration.passed + this.results.integration.failed;
    
    this.results.overall.passed = 
      this.results.backend.passed + this.results.frontend.passed + this.results.integration.passed;
    
    this.results.overall.failed = 
      this.results.backend.failed + this.results.frontend.failed + this.results.integration.failed;

    // Backend Results
    console.log('🔧 Backend Tests:');
    console.log(`  ✅ Passed: ${this.results.backend.passed}`);
    console.log(`  ❌ Failed: ${this.results.backend.failed}`);
    console.log(`  📊 Success Rate: ${((this.results.backend.passed / (this.results.backend.passed + this.results.backend.failed)) * 100).toFixed(1)}%`);
    console.log('');

    // Frontend Results
    console.log('🎨 Frontend Tests:');
    console.log(`  ✅ Passed: ${this.results.frontend.passed}`);
    console.log(`  ❌ Failed: ${this.results.frontend.failed}`);
    console.log(`  📊 Success Rate: ${((this.results.frontend.passed / (this.results.frontend.passed + this.results.frontend.failed)) * 100).toFixed(1)}%`);
    console.log('');

    // Integration Results
    console.log('🔗 Integration Tests:');
    console.log(`  ✅ Passed: ${this.results.integration.passed}`);
    console.log(`  ❌ Failed: ${this.results.integration.failed}`);
    console.log(`  📊 Success Rate: ${((this.results.integration.passed / (this.results.integration.passed + this.results.integration.failed)) * 100).toFixed(1)}%`);
    console.log('');

    // Overall Results
    console.log('🎯 Overall Results:');
    console.log(`  ✅ Total Passed: ${this.results.overall.passed}`);
    console.log(`  ❌ Total Failed: ${this.results.overall.failed}`);
    console.log(`  📊 Overall Success Rate: ${((this.results.overall.passed / this.results.overall.total) * 100).toFixed(1)}%`);
    console.log('');

    // Failed Tests Details
    const failedTests = [
      ...this.results.backend.tests.filter(t => t.status === 'FAILED'),
      ...this.results.frontend.tests.filter(t => t.status === 'FAILED'),
      ...this.results.integration.tests.filter(t => t.status === 'FAILED')
    ];

    if (failedTests.length > 0) {
      console.log('❌ Failed Tests:');
      failedTests.forEach(test => {
        console.log(`  - ${test.name}: ${test.error}`);
      });
      console.log('');
    }

    // System Status
    const successRate = (this.results.overall.passed / this.results.overall.total) * 100;
    
    if (successRate >= 90) {
      console.log('🎉 SYSTEM STATUS: EXCELLENT');
      console.log('✅ System is production-ready!');
    } else if (successRate >= 80) {
      console.log('⚠️ SYSTEM STATUS: GOOD');
      console.log('✅ System is mostly ready, minor issues to fix');
    } else if (successRate >= 70) {
      console.log('⚠️ SYSTEM STATUS: FAIR');
      console.log('❌ System needs improvements before production');
    } else {
      console.log('❌ SYSTEM STATUS: POOR');
      console.log('❌ System is not ready for production');
    }

    console.log('');
    console.log('🏁 Test completed at:', new Date().toLocaleString('tr-TR'));
  }
}

// Test'i çalıştır
const tester = new SystemTester();
tester.runAllTests().catch(console.error);
