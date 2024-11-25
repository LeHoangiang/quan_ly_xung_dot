const express = require("express");
const {
    checkVoucher,
    addVoucher,
    getAllVouchers,
    updateVoucher
} = require("./voucherController");
const Voucher = require("./voucherModel")

const router = express.Router();

// API Routes
router.post("/check", checkVoucher);
router.post("/add", addVoucher);
router.get("/list", getAllVouchers);
router.put("/update/:id",updateVoucher);
// Sửa lại route delete
router.delete("/delete/:id", async (req, res) => {
    try {
        console.log("Attempting to delete voucher with ID:", req.params.id);
        const voucherId = req.params.id;
        
        const deletedVoucher = await Voucher.findByIdAndDelete(voucherId);
        
        if (!deletedVoucher) {
            console.log("Voucher not found with ID:", voucherId);
            return res.status(404).json({ message: "Không tìm thấy voucher" });
        }
        
        console.log("Successfully deleted voucher:", deletedVoucher);
        return res.status(200).json({ 
            success: true,
            message: "Xóa voucher thành công", 
            voucher: deletedVoucher 
        });
    } catch (err) {
        console.error('Lỗi khi xóa voucher:', err);
        return res.status(500).json({ 
            success: false,
            message: "Lỗi server khi xóa voucher" 
        });
    }
});

console.log("Routes registered:", router.stack); 
router.put('/update/:id', async (req, res) => {
    try {
      const { name, discount, expiryDate, quantity, version } = req.body;
      
      // Kiểm tra version trong database
      const existingVoucher = await Voucher.findById(req.params.id);
      if (!existingVoucher) {
        return res.status(404).json({ message: "Không tìm thấy voucher" });
      }
  
      if (existingVoucher.version !== version) {
        return res.status(409).json({
          versionConflict: true,
          message: "Version conflict detected"
        });
      }
  
      // Cập nhật voucher với version mới
      const updatedVoucher = await Voucher.findByIdAndUpdate(
        req.params.id,
        {
          name,
          discount,
          expiryDate,
          quantity,
          version: version + 1
        },
        { new: true }
      );
  
      res.json({
        message: "Voucher updated successfully",
        voucher: updatedVoucher
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  // Thêm route xóa voucher


module.exports = router;