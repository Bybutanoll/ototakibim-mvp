import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import WorkOrder from '../models/WorkOrder';
import Customer from '../models/Customer';
import Vehicle from '../models/Vehicle';
import Tenant from '../models/Tenant';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ototakibim';

async function migrateToMultiTenant() {
  try {
    console.log('🚀 Starting multi-tenant migration...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Step 1: Create default tenant
    console.log('📝 Creating default tenant...');
    const defaultTenant = await Tenant.findOneAndUpdate(
      { tenantId: 'default-tenant' },
      {
        tenantId: 'default-tenant',
        companyName: 'Default Company',
        contactEmail: 'admin@ototakibim.com',
        subscription: {
          plan: 'enterprise',
          status: 'active',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          limits: {
            workOrders: -1,
            users: -1,
            storage: -1,
            apiCalls: -1
          },
          features: [
            'basic_dashboard', 'vehicle_management', 'basic_reports',
            'ai_features', 'advanced_reports', 'integrations', 'api_access',
            'white_label', 'priority_support', 'bulk_import', 'custom_branding',
            'advanced_analytics', 'sms_notifications', 'email_notifications',
            'mobile_app', 'backup_restore'
          ]
        },
        settings: {
          branding: {
            primaryColor: '#3B82F6',
            secondaryColor: '#1E40AF'
          },
          notifications: {
            sms: false,
            email: true,
            push: true
          },
          business: {
            timezone: 'Europe/Istanbul',
            currency: 'TRY',
            language: 'tr',
            workingHours: {
              start: '09:00',
              end: '18:00',
              days: [1, 2, 3, 4, 5]
            }
          }
        },
        usage: {
          workOrders: 0,
          users: 0,
          storage: 0,
          apiCalls: 0,
          lastReset: new Date()
        },
        isActive: true,
        isVerified: true
      },
      { upsert: true, new: true }
    );
    console.log('✅ Default tenant created:', defaultTenant.tenantId);

    // Step 2: Update existing users
    console.log('👥 Migrating users...');
    const users = await User.find({});
    let userCount = 0;
    
    for (const user of users) {
      // Skip if already has tenantId
      if (user.tenantId) {
        continue;
      }

      // Determine tenant role based on existing role
      let tenantRole = 'technician';
      if (user.role === 'admin') {
        tenantRole = 'owner';
      } else if (user.role === 'manager') {
        tenantRole = 'manager';
      }

      await User.findByIdAndUpdate(user._id, {
        tenantId: 'default-tenant',
        tenantRole: tenantRole,
        globalRole: user.role === 'admin' ? 'admin' : undefined
      });
      
      userCount++;
    }
    console.log(`✅ Migrated ${userCount} users`);

    // Step 3: Update existing work orders
    console.log('📋 Migrating work orders...');
    const workOrders = await WorkOrder.find({});
    let workOrderCount = 0;
    
    for (const workOrder of workOrders) {
      // Skip if already has tenantId
      if (workOrder.tenantId) {
        continue;
      }

      await WorkOrder.findByIdAndUpdate(workOrder._id, {
        tenantId: 'default-tenant'
      });
      
      workOrderCount++;
    }
    console.log(`✅ Migrated ${workOrderCount} work orders`);

    // Step 4: Update existing customers
    console.log('👤 Migrating customers...');
    const customers = await Customer.find({});
    let customerCount = 0;
    
    for (const customer of customers) {
      // Skip if already has tenantId
      if (customer.tenantId) {
        continue;
      }

      await Customer.findByIdAndUpdate(customer._id, {
        tenantId: 'default-tenant'
      });
      
      customerCount++;
    }
    console.log(`✅ Migrated ${customerCount} customers`);

    // Step 5: Update existing vehicles
    console.log('🚗 Migrating vehicles...');
    const vehicles = await Vehicle.find({});
    let vehicleCount = 0;
    
    for (const vehicle of vehicles) {
      // Skip if already has tenantId
      if (vehicle.tenantId) {
        continue;
      }

      await Vehicle.findByIdAndUpdate(vehicle._id, {
        tenantId: 'default-tenant'
      });
      
      vehicleCount++;
    }
    console.log(`✅ Migrated ${vehicleCount} vehicles`);

    // Step 6: Update tenant usage
    console.log('📊 Updating tenant usage...');
    await Tenant.findByIdAndUpdate(defaultTenant._id, {
      'usage.users': userCount,
      'usage.workOrders': workOrderCount
    });

    console.log('🎉 Multi-tenant migration completed successfully!');
    console.log('📈 Migration Summary:');
    console.log(`   - Default tenant: ${defaultTenant.tenantId}`);
    console.log(`   - Users migrated: ${userCount}`);
    console.log(`   - Work orders migrated: ${workOrderCount}`);
    console.log(`   - Customers migrated: ${customerCount}`);
    console.log(`   - Vehicles migrated: ${vehicleCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateToMultiTenant()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

export default migrateToMultiTenant;
