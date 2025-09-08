'use client';

import { lazy, Suspense, ComponentType } from 'react';
import { SkeletonCard, InlineLoading } from './LoadingStates';

// Lazy loading wrapper component
const LazyWrapper = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => (
    <Suspense fallback={<SkeletonCard />}>
      <Component {...props} />
    </Suspense>
  );
};

// Dashboard Components - Lazy loaded
export const LazyDashboard = LazyWrapper(
  lazy(() => import('../app/dashboard/page').then(module => ({ default: module.default })))
);

export const LazyWorkOrders = LazyWrapper(
  lazy(() => import('../app/dashboard/work-orders/page').then(module => ({ default: module.default })))
);

export const LazyVehicles = LazyWrapper(
  lazy(() => import('../app/dashboard/vehicles/page').then(module => ({ default: module.default })))
);

export const LazyCustomers = LazyWrapper(
  lazy(() => import('../app/dashboard/customers/page').then(module => ({ default: module.default })))
);

export const LazyAppointments = LazyWrapper(
  lazy(() => import('../app/dashboard/appointments/page').then(module => ({ default: module.default })))
);

// Auth Components - Lazy loaded
export const LazyLogin = LazyWrapper(
  lazy(() => import('../app/login/page').then(module => ({ default: module.default })))
);

export const LazyRegister = LazyWrapper(
  lazy(() => import('../app/register/page').then(module => ({ default: module.default })))
);

// UI Components - Lazy loaded (commented out until components are created)
// export const LazyVehicleForm = LazyWrapper(
//   lazy(() => import('./forms/VehicleForm').then(module => ({ default: module.default })))
// );

// export const LazyWorkOrderForm = LazyWrapper(
//   lazy(() => import('./forms/WorkOrderForm').then(module => ({ default: module.default })))
// );

// export const LazyCustomerForm = LazyWrapper(
//   lazy(() => import('./forms/CustomerForm').then(module => ({ default: module.default })))
// );

// Charts and Analytics - Lazy loaded (heavy components) - commented out until components are created
// export const LazyAnalytics = LazyWrapper(
//   lazy(() => import('./analytics/AnalyticsDashboard').then(module => ({ default: module.default })))
// );

// export const LazyReports = LazyWrapper(
//   lazy(() => import('./reports/ReportsPage').then(module => ({ default: module.default })))
// );

// Settings and Profile - Lazy loaded - commented out until pages are created
// export const LazySettings = LazyWrapper(
//   lazy(() => import('../app/dashboard/settings/page').then(module => ({ default: module.default })))
// );

// export const LazyProfile = LazyWrapper(
//   lazy(() => import('../app/dashboard/profile/page').then(module => ({ default: module.default })))
// );

// Preload function for critical components
export const preloadCriticalComponents = () => {
  // Preload dashboard components
  import('../app/dashboard/page');
  // import('./forms/VehicleForm'); // Commented out until component is created
  // import('./forms/WorkOrderForm'); // Commented out until component is created
};

// Preload function for non-critical components
export const preloadSecondaryComponents = () => {
  // Preload secondary components after initial load
  setTimeout(() => {
    import('../app/dashboard/vehicles/page');
    import('../app/dashboard/customers/page');
    import('../app/dashboard/appointments/page');
  }, 2000);
};
