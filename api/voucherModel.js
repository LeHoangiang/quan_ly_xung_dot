const mongoose = require("mongoose");

// Tạo schema cho Voucher
const voucherSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    discount: { 
      type: Number, 
      required: true, 
      min: 0
    },
    valid: { 
      type: Boolean, 
      default: true 
    },
    expiryDate: { 
      type: Date, 
      required: true, 
      validate: {
        validator: function (v) {
          return v > Date.now();
        },
        message: "Ngày hết hạn phải xa hơn ngày hiện tại!"
      }
    },
    usageCount: { 
      type: Number, 
      default: 0, 
      min: 0
    },
    quantity: {
      type: Number,
      default: 1,
      required: true,
      min: 0
    },
    version: { 
      type: Number, 
      default: 1  
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Voucher", voucherSchema);
