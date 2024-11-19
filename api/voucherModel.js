const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  name: { type: String, required: true},
  discount: { type: Number, required: true }, 
  valid: { type: Boolean, default: true }, 
  expiryDate: { type: Date, required: true }, 
  usageCount: { type: Number, default: 0 }, 
});

module.exports = mongoose.model("Voucher", voucherSchema);
