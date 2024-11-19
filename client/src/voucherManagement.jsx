import React, { useState } from "react";
import axios from "axios";

function VoucherManagement() {
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Add Voucher Function
  const handleAddVoucher = async () => {
    if (!name || !discount || !expiryDate) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      setMessage("");
      return;
    }

    try {
      // Ensure the expiryDate is in the correct format before sending
      const formattedExpiryDate = new Date(expiryDate).toISOString();
      
      console.log(formattedExpiryDate); // Log to verify the date format

      const response = await axios.post("http://localhost:5000/voucher/add", { name, discount, expiryDate: formattedExpiryDate });
      setMessage(response.data.message);
      setError("");
      setName("");
      setDiscount("");
      setExpiryDate("");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi thêm voucher!");
      setMessage("");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Quản Lý Voucher</h1>

      {/* Error and Success Messages */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {message && <div className="text-green-500 mb-4">{message}</div>}

      {/* Add Voucher Section */}
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Thêm Voucher</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mã Voucher"
          className="w-full border border-gray-300 p-2 mb-4 rounded"
        />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Giảm giá (%)"
          className="w-full border border-gray-300 p-2 mb-4 rounded"
        />
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="w-full border border-gray-300 p-2 mb-4 rounded"
        />
        <button
          onClick={handleAddVoucher}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Thêm Voucher
        </button>
      </div>
    </div>
  );
}

export default VoucherManagement;
