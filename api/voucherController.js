const Voucher = require("./voucherModel");

// Lấy voucher theo tên
const findVoucherByName = async (name) => {
  return await Voucher.findOne({ name });
};

// Kiểm tra mã voucher
exports.checkVoucher = async (req, res) => {
  const { name } = req.body;

  try {
    const voucher = await findVoucherByName(name);

    if (!voucher || !voucher.valid) {
      return res.status(400).json({ message: "Voucher không hợp lệ!" });
    }

    if (voucher.expiryDate < new Date()) {
      return res.status(400).json({ message: "Voucher đã hết hạn!" });
    }

    res.json({ message: "Voucher hợp lệ!", voucher });
  } catch (err) {
    res.status(500).json({ message: "Lỗi kiểm tra voucher.", error: err.message });
  }
};

// Thêm voucher mới
exports.addVoucher = async (req, res) => {
  const { name, discount, expiryDate, quantity } = req.body;

  try {
    const existingVoucher = await findVoucherByName(name);
    if (existingVoucher) {
      return res.status(400).json({ message: "Voucher đã tồn tại!" });
    }

    const newVoucher = new Voucher({
      name,
      discount,
      expiryDate,
      quantity,
      version: 0,
      valid: true,
    });

    await newVoucher.save();
    res.json({ message: "Voucher được thêm thành công!", voucher: newVoucher });
  } catch (err) {
    res.status(500).json({ message: "Không thể thêm voucher.", error: err.message });
  }
};

// Lấy danh sách voucher
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy danh sách voucher.", error: err.message });
  }
};
// Xóa voucher
exports.deleteVoucher = async (req, res) => {
  const { voucherID } = req.body;

  try {
    const voucher = await Voucher.findByIdAndDelete(voucherID);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher không tồn tại!" });
    }

    res.json({ message: "Xóa voucher thành công!", voucher });
  } catch (err) {
    res.status(500).json({ message: "Không thể xóa voucher.", error: err.message });
  }
};
// Thêm hàm updateVoucher
exports.updateVoucher = async (req, res) => {
  const { id } = req.params;
  const { name, discount, expiryDate, quantity, version } = req.body;
  console.log("Update data:", { name, discount, expiryDate, quantity, version }); // Debug log
  try {
      // Kiểm tra version trong database
      const existingVoucher = await Voucher.findById(id);
      if (!existingVoucher) {
          return res.status(404).json({ message: "Không tìm thấy voucher!" });
      }

      if (existingVoucher.version !== version) {
          return res.status(409).json({
              versionConflict: true,
              message: "Dữ liệu đã được người khác thay đổi. Vui lòng tải lại trang!"
          });
      }

      // Cập nhật voucher với version mới
      const updatedVoucher = await Voucher.findByIdAndUpdate(
          id,
          {
              name,
              discount,
              expiryDate,
              quantity,
              version: version + 1  // Tăng version
          },
          { new: true }  // Trả về document đã được cập nhật
      );

      res.json({
          message: "Voucher đã được cập nhật thành công!",
          voucher: updatedVoucher
      });
  } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({
          message: "Lỗi khi cập nhật voucher!",
          error: err.message
      });
  }
};
