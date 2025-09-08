import express from 'express';
import { 
  getVehicles, 
  getVehicle, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle, 
  searchVehicles,
  addMaintenanceRecord,
  upload
} from '../controllers/vehicleController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation middleware - Geçici olarak devre dışı
// const vehicleValidation = [
//   body('plate')
//     .trim()
//     .isLength({ min: 5, max: 20 })
//     .withMessage('Plaka 5-20 karakter arasında olmalıdır'),
//   body('brand')
//     .trim()
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Marka 2-50 karakter arasında olmalıdır'),
//   body('model')
//     .trim()
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Model 2-50 karakter arasında olmalıdır'),
//   body('year')
//     .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
//     .withMessage('Geçerli bir yıl giriniz'),
//   body('vin')
//     .trim()
//     .isLength({ min: 17, max: 17 })
//     .withMessage('VIN numarası 17 karakter olmalıdır'),
//   body('engineSize')
//     .trim()
//     .isLength({ min: 1, max: 20 })
//     .withMessage('Motor hacmi 1-20 karakter arasında olmalıdır'),
//   body('fuelType')
//     .isIn(['gasoline', 'diesel', 'electric', 'hybrid', 'lpg'])
//     .withMessage('Geçerli bir yakıt tipi seçiniz'),
//   body('transmission')
//     .isIn(['manual', 'automatic', 'semi-automatic'])
//     .withMessage('Geçerli bir vites tipi seçiniz'),
//   body('mileage')
//     .isInt({ min: 0 })
//     .withMessage('Kilometre 0\'dan büyük olmalıdır'),
//   body('color')
//     .trim()
//     .isLength({ min: 2, max: 30 })
//     .withMessage('Renk 2-30 karakter arasında olmalıdır')
// ];

// const maintenanceValidation = [
//   body('date')
//     .isISO8601()
//     .withMessage('Geçerli bir tarih giriniz'),
//   body('type')
//     .isIn(['service', 'repair', 'inspection'])
//     .withMessage('Geçerli bir bakım tipi seçiniz'),
//   body('description')
//     .trim()
//     .isLength({ min: 10, max: 500 })
//     .withMessage('Açıklama 10-500 karakter arasında olmalıdır'),
//   body('cost')
//     .isFloat({ min: 0 })
//     .withMessage('Maliyet 0\'dan büyük olmalıdır'),
//   body('mileage')
//     .isInt({ min: 0 })
//     .withMessage('Kilometre 0\'dan büyük olmalıdır')
// ];

// Routes - Tüm route'lar authentication gerektiriyor
router.use(authenticateToken);

// GET /api/vehicles - Tüm araçları getir
router.get('/', getVehicles);

// GET /api/vehicles/search - Araç ara
router.get('/search', searchVehicles);

// GET /api/vehicles/:id - Tek araç getir
router.get('/:id', getVehicle);

// POST /api/vehicles - Yeni araç oluştur
router.post('/', upload.array('photos', 5), createVehicle);

// PUT /api/vehicles/:id - Araç güncelle
router.put('/:id', upload.array('photos', 5), updateVehicle);

// DELETE /api/vehicles/:id - Araç sil
router.delete('/:id', deleteVehicle);

// POST /api/vehicles/:id/maintenance - Bakım kaydı ekle
router.post('/:id/maintenance', addMaintenanceRecord);

export default router;
