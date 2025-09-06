import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Report from '../models/Report';
import Payment from '../models/Payment';
import WorkOrder from '../models/WorkOrder';
import Appointment from '../models/Appointment';
import Customer from '../models/Customer';
import Vehicle from '../models/Vehicle';
import { catchAsync, CustomError } from '../middleware/errorHandler';

// Demo mode kontrolü
const isDemoMode = process.env.NODE_ENV !== 'production' && !process.env.MONGODB_URI;

// Get all reports
export const getReports = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const demoReports = [
      {
        _id: 'demo_report_1',
        reportType: 'revenue',
        reportName: 'Aylık Gelir Raporu',
        reportDescription: 'Ocak 2024 aylık gelir analizi',
        dateRange: {
          startDate: new Date('2024-01-01T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          period: 'monthly'
        },
        data: {
          summary: {
            totalRecords: 45,
            totalRevenue: 125000,
            totalCost: 75000,
            totalProfit: 50000,
            averageValue: 2777.78,
            growthRate: 15.5
          },
          timeSeries: [
            { date: new Date('2024-01-01'), value: 5000, label: '1 Ocak' },
            { date: new Date('2024-01-02'), value: 7500, label: '2 Ocak' },
            { date: new Date('2024-01-03'), value: 6200, label: '3 Ocak' },
            { date: new Date('2024-01-04'), value: 8800, label: '4 Ocak' },
            { date: new Date('2024-01-05'), value: 9200, label: '5 Ocak' }
          ],
          categories: [
            { name: 'Fren Sistemi', value: 35000, percentage: 28 },
            { name: 'Motor Onarımı', value: 28000, percentage: 22.4 },
            { name: 'Periyodik Bakım', value: 25000, percentage: 20 },
            { name: 'Elektrik', value: 15000, percentage: 12 },
            { name: 'Diğer', value: 22000, percentage: 17.6 }
          ]
        },
        chartConfig: {
          type: 'bar',
          title: 'Aylık Gelir Dağılımı',
          xAxisLabel: 'Hizmet Türü',
          yAxisLabel: 'Gelir (TL)',
          showLegend: true,
          showGrid: true,
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        },
        status: 'completed',
        generatedAt: new Date('2024-01-31T23:59:59Z'),
        generatedBy: 'demo_user_1',
        exportOptions: {
          formats: ['pdf', 'excel'],
          includeCharts: true,
          includeDetails: true,
          includeSummary: true
        },
        createdAt: new Date('2024-01-31T23:59:59Z'),
        updatedAt: new Date('2024-01-31T23:59:59Z')
      },
      {
        _id: 'demo_report_2',
        reportType: 'customer',
        reportName: 'Müşteri Analizi Raporu',
        reportDescription: 'Müşteri segmentasyonu ve davranış analizi',
        dateRange: {
          startDate: new Date('2024-01-01T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          period: 'monthly'
        },
        data: {
          summary: {
            totalRecords: 120,
            totalRevenue: 125000,
            averageValue: 1041.67,
            growthRate: 8.2
          },
          categories: [
            { name: 'VIP Müşteriler', value: 15, percentage: 12.5 },
            { name: 'Sadık Müşteriler', value: 35, percentage: 29.2 },
            { name: 'Yeni Müşteriler', value: 25, percentage: 20.8 },
            { name: 'Riskli Müşteriler', value: 20, percentage: 16.7 },
            { name: 'Kayıp Müşteriler', value: 25, percentage: 20.8 }
          ]
        },
        chartConfig: {
          type: 'pie',
          title: 'Müşteri Segmentasyonu',
          showLegend: true,
          showGrid: false,
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        },
        status: 'completed',
        generatedAt: new Date('2024-01-31T23:59:59Z'),
        generatedBy: 'demo_user_1',
        exportOptions: {
          formats: ['pdf', 'excel'],
          includeCharts: true,
          includeDetails: true,
          includeSummary: true
        },
        createdAt: new Date('2024-01-31T23:59:59Z'),
        updatedAt: new Date('2024-01-31T23:59:59Z')
      },
      {
        _id: 'demo_report_3',
        reportType: 'work_order',
        reportName: 'İş Emri Performans Raporu',
        reportDescription: 'İş emri tamamlanma süreleri ve verimlilik analizi',
        dateRange: {
          startDate: new Date('2024-01-01T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          period: 'monthly'
        },
        data: {
          summary: {
            totalRecords: 85,
            totalRevenue: 125000,
            averageValue: 1470.59,
            growthRate: 12.3
          },
          timeSeries: [
            { date: new Date('2024-01-01'), value: 3, label: '1 Ocak' },
            { date: new Date('2024-01-02'), value: 5, label: '2 Ocak' },
            { date: new Date('2024-01-03'), value: 4, label: '3 Ocak' },
            { date: new Date('2024-01-04'), value: 6, label: '4 Ocak' },
            { date: new Date('2024-01-05'), value: 7, label: '5 Ocak' }
          ],
          categories: [
            { name: 'Tamamlandı', value: 65, percentage: 76.5 },
            { name: 'Devam Ediyor', value: 12, percentage: 14.1 },
            { name: 'Beklemede', value: 5, percentage: 5.9 },
            { name: 'İptal Edildi', value: 3, percentage: 3.5 }
          ]
        },
        chartConfig: {
          type: 'line',
          title: 'Günlük İş Emri Sayısı',
          xAxisLabel: 'Tarih',
          yAxisLabel: 'İş Emri Sayısı',
          showLegend: true,
          showGrid: true,
          colors: ['#3B82F6']
        },
        status: 'completed',
        generatedAt: new Date('2024-01-31T23:59:59Z'),
        generatedBy: 'demo_user_1',
        exportOptions: {
          formats: ['pdf', 'excel'],
          includeCharts: true,
          includeDetails: true,
          includeSummary: true
        },
        createdAt: new Date('2024-01-31T23:59:59Z'),
        updatedAt: new Date('2024-01-31T23:59:59Z')
      }
    ];

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const reportType = req.query.reportType as string || '';

    let filteredReports = demoReports;
    
    if (reportType) {
      filteredReports = filteredReports.filter(report => report.reportType === reportType);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: paginatedReports,
      pagination: {
        current: page,
        pages: Math.ceil(filteredReports.length / limit),
        total: filteredReports.length
      }
    });
    return;
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const reportType = req.query.reportType as string || '';

  let query: any = { owner: userId, isActive: true };

  if (reportType) {
    query.reportType = reportType;
  }

  const reports = await Report.find(query)
    .populate('generatedBy', 'firstName lastName')
    .populate('history.performedBy', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Report.countDocuments(query);

  res.json({
    status: 'success',
    data: reports,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// Get report statistics
export const getReportStats = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const stats = {
      totalReports: 12,
      completedReports: 10,
      scheduledReports: 3,
      failedReports: 1,
      totalExports: 45,
      thisMonth: 5,
      lastMonth: 4,
      averageGenerationTime: 2.5,
      reportTypes: {
        'revenue': 4,
        'customer': 3,
        'work_order': 2,
        'inventory': 1,
        'appointment': 1,
        'payment': 1
      },
      topReports: [
        { name: 'Aylık Gelir Raporu', views: 25, exports: 8 },
        { name: 'Müşteri Analizi Raporu', views: 18, exports: 5 },
        { name: 'İş Emri Performans Raporu', views: 15, exports: 3 },
        { name: 'Stok Durumu Raporu', views: 12, exports: 2 },
        { name: 'Randevu Analizi Raporu', views: 10, exports: 1 }
      ]
    };

    res.json({ status: 'success', data: stats });
    return;
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const stats = await Report.aggregate([
    { $match: { owner: userId, isActive: true } },
    {
      $group: {
        _id: null,
        totalReports: { $sum: 1 },
        completedReports: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        scheduledReports: {
          $sum: { $cond: [{ $eq: ['$schedule.isScheduled', true] }, 1, 0] }
        },
        failedReports: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        }
      }
    }
  ]);

  res.json({ status: 'success', data: stats[0] || {} });
});

// Generate new report
export const generateReport = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const newReport = {
      _id: 'demo_report_new',
      reportType: req.body.reportType || 'revenue',
      reportName: req.body.reportName || 'Yeni Rapor',
      reportDescription: req.body.reportDescription || 'Demo rapor açıklaması',
      dateRange: {
        startDate: new Date(req.body.startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(req.body.endDate || Date.now()),
        period: req.body.period || 'monthly'
      },
      data: {
        summary: {
          totalRecords: 25,
          totalRevenue: 75000,
          totalCost: 45000,
          totalProfit: 30000,
          averageValue: 3000,
          growthRate: 10.5
        }
      },
      chartConfig: {
        type: req.body.chartType || 'bar',
        title: req.body.reportName || 'Yeni Rapor',
        showLegend: true,
        showGrid: true
      },
      status: 'completed',
      generatedAt: new Date(),
      generatedBy: 'demo_user_1',
      exportOptions: {
        formats: ['pdf', 'excel'],
        includeCharts: true,
        includeDetails: true,
        includeSummary: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({ status: 'success', message: 'Rapor başarıyla oluşturuldu', data: newReport });
    return;
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const {
    reportType,
    reportName,
    reportDescription,
    startDate,
    endDate,
    period,
    filters,
    chartConfig
  } = req.body;

  // Create report
  const report = new Report({
    owner: userId,
    reportType,
    reportName,
    reportDescription,
    dateRange: {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      period
    },
    filters: filters || {},
    chartConfig: chartConfig || {
      type: 'bar',
      title: reportName,
      showLegend: true,
      showGrid: true
    },
    status: 'generating',
    generatedBy: userId,
    exportOptions: {
      formats: ['pdf', 'excel'],
      includeCharts: true,
      includeDetails: true,
      includeSummary: true
    },
    metadata: {
      version: '1.0',
      generatedWith: 'OtoTakibim API v1.0',
      dataSource: 'MongoDB',
      processingTime: 0,
      recordCount: 0
    }
  });

  await report.save();

  // Generate report data based on type
  await generateReportData(report);

  res.status(201).json({ status: 'success', message: 'Rapor başarıyla oluşturuldu', data: report });
});

// Get single report
export const getReport = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const demoReport = {
      _id: 'demo_report_1',
      reportType: 'revenue',
      reportName: 'Aylık Gelir Raporu',
      reportDescription: 'Ocak 2024 aylık gelir analizi',
      dateRange: {
        startDate: new Date('2024-01-01T00:00:00Z'),
        endDate: new Date('2024-01-31T23:59:59Z'),
        period: 'monthly'
      },
      data: {
        summary: {
          totalRecords: 45,
          totalRevenue: 125000,
          totalCost: 75000,
          totalProfit: 50000,
          averageValue: 2777.78,
          growthRate: 15.5
        },
        timeSeries: [
          { date: new Date('2024-01-01'), value: 5000, label: '1 Ocak' },
          { date: new Date('2024-01-02'), value: 7500, label: '2 Ocak' },
          { date: new Date('2024-01-03'), value: 6200, label: '3 Ocak' },
          { date: new Date('2024-01-04'), value: 8800, label: '4 Ocak' },
          { date: new Date('2024-01-05'), value: 9200, label: '5 Ocak' }
        ],
        categories: [
          { name: 'Fren Sistemi', value: 35000, percentage: 28 },
          { name: 'Motor Onarımı', value: 28000, percentage: 22.4 },
          { name: 'Periyodik Bakım', value: 25000, percentage: 20 },
          { name: 'Elektrik', value: 15000, percentage: 12 },
          { name: 'Diğer', value: 22000, percentage: 17.6 }
        ]
      },
      chartConfig: {
        type: 'bar',
        title: 'Aylık Gelir Dağılımı',
        xAxisLabel: 'Hizmet Türü',
        yAxisLabel: 'Gelir (TL)',
        showLegend: true,
        showGrid: true,
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      },
      status: 'completed',
      generatedAt: new Date('2024-01-31T23:59:59Z'),
      generatedBy: 'demo_user_1',
      exportOptions: {
        formats: ['pdf', 'excel'],
        includeCharts: true,
        includeDetails: true,
        includeSummary: true
      },
      createdAt: new Date('2024-01-31T23:59:59Z'),
      updatedAt: new Date('2024-01-31T23:59:59Z')
    };

    res.json({ status: 'success', data: demoReport });
    return;
  }

  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const report = await Report.findOne({ _id: id, owner: userId, isActive: true });
  if (!report) {
    throw new CustomError('Rapor bulunamadı', 404);
  }

  res.json({ status: 'success', data: report });
});

// Delete report
export const deleteReport = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'Rapor başarıyla silindi' });
    return;
  }

  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const report = await Report.findOne({ _id: id, owner: userId, isActive: true });
  if (!report) {
    throw new CustomError('Rapor bulunamadı', 404);
  }

  report.isActive = false;
  await report.save();

  res.json({ status: 'success', message: 'Rapor başarıyla silindi' });
});

// Helper function to generate report data
async function generateReportData(report: any) {
  const startTime = Date.now();
  
  try {
    let data: any = { summary: { totalRecords: 0 } };

    switch (report.reportType) {
      case 'revenue':
        data = await generateRevenueReport(report);
        break;
      case 'customer':
        data = await generateCustomerReport(report);
        break;
      case 'work_order':
        data = await generateWorkOrderReport(report);
        break;
      case 'payment':
        data = await generatePaymentReport(report);
        break;
      default:
        data = { summary: { totalRecords: 0 } };
    }

    report.data = data;
    report.status = 'completed';
    report.generatedAt = new Date();
    report.metadata.processingTime = Date.now() - startTime;
    report.metadata.recordCount = data.summary.totalRecords;

    await report.save();
  } catch (error) {
    report.status = 'failed';
    report.metadata.processingTime = Date.now() - startTime;
    await report.save();
    throw error;
  }
}

// Generate revenue report
async function generateRevenueReport(report: any) {
  const payments = await Payment.find({
    owner: report.owner,
    invoiceDate: {
      $gte: report.dateRange.startDate,
      $lte: report.dateRange.endDate
    },
    isActive: true
  });

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);
  const totalCost = payments.reduce((sum, payment) => sum + payment.subtotal, 0);
  const totalProfit = totalRevenue - totalCost;

  return {
    summary: {
      totalRecords: payments.length,
      totalRevenue,
      totalCost,
      totalProfit,
      averageValue: payments.length > 0 ? totalRevenue / payments.length : 0,
      growthRate: 0 // Calculate based on previous period
    },
    timeSeries: [], // Generate time series data
    categories: [] // Generate category data
  };
}

// Generate customer report
async function generateCustomerReport(report: any) {
  const customers = await Customer.find({
    owner: report.owner,
    createdAt: {
      $gte: report.dateRange.startDate,
      $lte: report.dateRange.endDate
    },
    isActive: true
  });

  return {
    summary: {
      totalRecords: customers.length,
      averageValue: 0,
      growthRate: 0
    },
    categories: [],
    details: []
  };
}

// Generate work order report
async function generateWorkOrderReport(report: any) {
  const workOrders = await WorkOrder.find({
    owner: report.owner,
    createdAt: {
      $gte: report.dateRange.startDate,
      $lte: report.dateRange.endDate
    },
    isActive: true
  });

  return {
    summary: {
      totalRecords: workOrders.length,
      averageValue: 0,
      growthRate: 0
    },
    timeSeries: [],
    categories: []
  };
}

// Generate payment report
async function generatePaymentReport(report: any) {
  const payments = await Payment.find({
    owner: report.owner,
    invoiceDate: {
      $gte: report.dateRange.startDate,
      $lte: report.dateRange.endDate
    },
    isActive: true
  });

  return {
    summary: {
      totalRecords: payments.length,
      totalRevenue: payments.reduce((sum, payment) => sum + payment.totalAmount, 0),
      averageValue: 0,
      growthRate: 0
    },
    categories: [],
    details: []
  };
}