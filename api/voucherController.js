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
  const { name, discount, expiryDate } = req.body;

  try {
    const existingVoucher = await findVoucherByName(name);
    if (existingVoucher) {
      return res.status(400).json({ message: "Voucher đã tồn tại!" });
    }

    const newVoucher = new Voucher({
      name,
      discount,
      expiryDate,
      version: 0, // Khởi tạo version
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
// // Cập nhật không xử lý xung đột
// exports.updateVoucherWithoutConflict = async (req, res) => {
//   const { name, discount, quantity } = req.body;

//   try {
//     // Lấy voucher theo tên
//     const voucher = await Voucher.findOne({ name });
//     if (!voucher) {
//       return res.status(404).json({ message: 'Voucher không tồn tại' });
//     }

//     // Cập nhật trực tiếp
//     voucher.discount = discount;
//     voucher.quantity = quantity;
//     await voucher.save();

//     res.json({ message: 'Voucher đã được cập nhật thành công!' });
//   } catch (err) {
//     res.status(500).json({ message: 'Lỗi khi cập nhật voucher.', error: err.message });
//   }
// };

// // Cập nhật có xử lý xung đột
// exports.updateWithConflictHandling = async (req, res) => {
//   const { name, discount, quantity, version } = req.body;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Lấy voucher theo tên
//     const voucher = await Voucher.findOne({ name }).session(session);
//     if (!voucher) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: 'Voucher không tồn tại' });
//     }

//     // Kiểm tra version để xử lý xung đột
//     if (voucher.version !== version) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(409).json({ message: 'Xung đột phiên bản, vui lòng thử lại!' });
//     }

//     // Cập nhật và tăng version
//     voucher.discount = discount;
//     voucher.quantity = quantity;
//     voucher.version += 1;

//     await voucher.save({ session });
//     await session.commitTransaction();
//     session.endSession();

//     res.json({ message: 'Voucher đã được cập nhật thành công với xử lý xung đột!' });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ message: 'Lỗi khi cập nhật voucher.', error: err.message });
//   }
// };

