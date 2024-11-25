const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const voucherRoutes = require("./voucherRouter");
const errorHandler = require("./errorHandler");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

//cors
app.use(cors());

// Routes
app.use("/voucher", voucherRoutes);

// Error Handling Middleware
app.use(errorHandler);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
  }
};
// router.post('/add', async (req, res) => {
//   try {
//     const { name, discount, expiryDate, quantity, version } = req.body;
    
//     // Kiểm tra version trong database
//     const existingVoucher = await Voucher.findOne({ name });
//     if (existingVoucher && existingVoucher.version !== version) {
//       return res.status(409).json({
//         versionConflict: true,
//         message: "Version conflict detected"
//       });
//     }

//     // Tạo voucher mới với version tăng thêm 1
//     const newVoucher = new Voucher({
//       name,
//       discount,
//       expiryDate,
//       quantity,
//       version: version + 1
//     });

//     await newVoucher.save();
//     res.json({ message: "Voucher added successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
