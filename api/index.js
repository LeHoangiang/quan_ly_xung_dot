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

// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
