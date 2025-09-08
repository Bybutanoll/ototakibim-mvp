import mongoose from 'mongoose';

export class BaseModel {
  /**
   * Index'leri güvenli şekilde oluşturur - duplicate index uyarılarını önler
   */
  static createIndexSafely(schema: mongoose.Schema, indexes: any[]) {
    // Mevcut index'leri temizle
    try {
      schema.clearIndexes();
    } catch (error) {
      // Index temizleme hatası görmezden gel
    }
    
    // Yeni index'leri ekle
    indexes.forEach(index => {
      try {
        if (index.fields && typeof index.fields === 'object') {
          schema.index(index.fields, index.options || {});
        }
      } catch (error) {
        console.warn(`Index oluşturma hatası:`, error);
      }
    });
  }

  /**
   * Tenant bazlı index'leri oluşturur
   */
  static createTenantIndexes(schema: mongoose.Schema, additionalIndexes: any[] = []) {
    const tenantIndexes = [
      { fields: { tenantId: 1 } },
      { fields: { tenantId: 1, createdAt: -1 } },
      { fields: { tenantId: 1, updatedAt: -1 } },
      ...additionalIndexes
    ];

    this.createIndexSafely(schema, tenantIndexes);
  }

  /**
   * Soft delete için index'leri oluşturur
   */
  static createSoftDeleteIndexes(schema: mongoose.Schema, additionalIndexes: any[] = []) {
    const softDeleteIndexes = [
      { fields: { deletedAt: 1 } },
      { fields: { isDeleted: 1 } },
      ...additionalIndexes
    ];

    this.createIndexSafely(schema, softDeleteIndexes);
  }

  /**
   * Schema'ya ortak alanları ekler
   */
  static addCommonFields(schema: mongoose.Schema) {
    schema.add({
      createdAt: {
        type: Date,
        default: Date.now,
        index: true
      },
      updatedAt: {
        type: Date,
        default: Date.now,
        index: true
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    });

    // UpdatedAt'i otomatik güncelle
    schema.pre('save', function(next) {
      this.updatedAt = new Date();
      next();
    });

    schema.pre('findOneAndUpdate', function(next) {
      this.set({ updatedAt: new Date() });
      next();
    });
  }
}
