import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import WorkOrder from '../models/WorkOrder';
import Customer from '../models/Customer';
import Vehicle from '../models/Vehicle';

// Create new work order
export const createWorkOrder = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehiclePlate,
      vehicleVin,
      problemDescription,
      estimatedCost,
      priority,
      assignedTechnician,
      estimatedDuration,
      notes
    } = req.body;

    // Create or find customer
    let customer = await Customer.findOne({ phone: customerPhone });
    if (!customer) {
      customer = new Customer({
        firstName: customerName.split(' ')[0] || customerName,
        lastName: customerName.split(' ').slice(1).join(' ') || '',
        phone: customerPhone,
        email: customerEmail || '',
        address: '',
        isActive: true
      });
      await customer.save();
    }

                // Create or find vehicle
            let vehicle = await Vehicle.findOne({ plate: vehiclePlate });
            if (!vehicle) {
              vehicle = new Vehicle({
                customerId: customer._id,
                brand: vehicleBrand,
                vehicleModel: vehicleModel,
                year: vehicleYear || null,
                plate: vehiclePlate,
                vin: vehicleVin || '',
                color: '',
                mileage: 0,
                isActive: true
              });
              await vehicle.save();
            }

    // Create work order
    const workOrder = new WorkOrder({
      customerId: customer._id,
      vehicleId: vehicle._id,
      assignedTechnicianId: assignedTechnician || null,
      problemDescription,
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : 0,
      priority: priority || 'normal',
      estimatedDuration: estimatedDuration ? parseFloat(estimatedDuration) : null,
      notes: notes || '',
      status: 'pending',
      isActive: true
    });

    await workOrder.save();

                // Populate customer and vehicle info
            await workOrder.populate([
              { path: 'customerId', select: 'firstName lastName phone email' },
              { path: 'vehicleId', select: 'brand vehicleModel year plate' }
            ]);

    res.status(201).json({
      status: 'success',
      message: 'İş emri başarıyla oluşturuldu',
      data: { workOrder }
    });
  } catch (error) {
    console.error('Create work order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Get all work orders
export const getWorkOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const priority = req.query.priority as string;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { isActive: true };
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } },
        { 'vehicle.plate': { $regex: search, $options: 'i' } },
        { problemDescription: { $regex: search, $options: 'i' } }
      ];
    }

                const workOrders = await WorkOrder.find(filter)
              .populate([
                { path: 'customerId', select: 'firstName lastName phone email' },
                { path: 'vehicleId', select: 'brand vehicleModel year plate' },
                { path: 'assignedTechnicianId', select: 'firstName lastName' }
              ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WorkOrder.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        workOrders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get work orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Get work order by ID
export const getWorkOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const workOrder = await WorkOrder.findById(id)
      .populate([
        { path: 'customerId', select: 'firstName lastName phone email address' },
        { path: 'vehicleId', select: 'brand vehicleModel year plate vin color mileage' },
        { path: 'assignedTechnicianId', select: 'firstName lastName phone' }
      ]);

    if (!workOrder) {
      return res.status(404).json({
        status: 'error',
        message: 'İş emri bulunamadı'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { workOrder }
    });
  } catch (error) {
    console.error('Get work order by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Update work order
export const updateWorkOrder = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const workOrder = await WorkOrder.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'customerId', select: 'firstName lastName phone email' },
      { path: 'vehicleId', select: 'brand vehicleModel year plate' },
      { path: 'assignedTechnicianId', select: 'firstName lastName' }
    ]);

    if (!workOrder) {
      return res.status(404).json({
        status: 'error',
        message: 'İş emri bulunamadı'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'İş emri güncellendi',
      data: { workOrder }
    });
  } catch (error) {
    console.error('Update work order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Delete work order
export const deleteWorkOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const workOrder = await WorkOrder.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!workOrder) {
      return res.status(404).json({
        status: 'error',
        message: 'İş emri bulunamadı'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'İş emri silindi'
    });
  } catch (error) {
    console.error('Delete work order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Update work order status
export const updateWorkOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const workOrder = await WorkOrder.findByIdAndUpdate(
      id,
      { 
        status,
        notes: notes || '',
        updatedAt: new Date()
      },
      { new: true }
    ).populate([
      { path: 'customerId', select: 'firstName lastName phone email' },
      { path: 'vehicleId', select: 'brand vehicleModel year plate' },
      { path: 'assignedTechnicianId', select: 'firstName lastName' }
    ]);

    if (!workOrder) {
      return res.status(404).json({
        status: 'error',
        message: 'İş emri bulunamadı'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'İş emri durumu güncellendi',
      data: { workOrder }
    });
  } catch (error) {
    console.error('Update work order status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};
