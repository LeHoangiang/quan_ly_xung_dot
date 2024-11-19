const Voucher = require("./voucherModel");

// Kiểm tra mã voucher
exports.checkVoucher = async (req, res) => {
  const { name, customerId } = req.body;
  try {
    const voucher = await Voucher.findOne({ name });

    if (!voucher || !voucher.valid) {
      return res.status(400).json({ message: "Voucher không hợp lệ!" });
    }

    if (voucher.expiryDate < new Date()) {
      return res.status(400).json({ message: "Voucher đã hết hạn!" });
    }

    // Xử lý logic xung đột nếu voucher đã được sử dụng
    voucher.usageCount += 1;
    if (voucher.usageCount > 1) {
      return res.status(409).json({ message: "Voucher đã được sử dụng!" });
    }

    await voucher.save();
    res.json({ message: "Voucher hợp lệ!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi kiểm tra voucher." });
  }
};

// Thêm voucher mới
exports.addVoucher = async (req, res) => {
  const { name, discount, expiryDate } = req.body;
  try {
    const newVoucher = new Voucher({ name, discount, expiryDate });
    await newVoucher.save();
    res.json({ message: "Voucher được thêm thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Không thể thêm voucher." });
  }
};

// Lấy danh sách voucher
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy danh sách voucher." });
  }
};
