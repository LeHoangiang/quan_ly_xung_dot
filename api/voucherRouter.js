const express = require("express");
const {
    checkVoucher,
    addVoucher,
    getAllVouchers,

} = require("./voucherController");

const router = express.Router();

// API Routes
router.post("/check", checkVoucher);
router.post("/add", addVoucher);
router.get("/list", getAllVouchers);


module.exports = router;