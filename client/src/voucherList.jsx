import React, { useEffect, useState } from "react";
import axios from "axios";

function VoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/voucher/list");
        setVouchers(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách voucher");
      }
    };

    fetchVouchers();
  }, []);

  const handleVoucherClick = (voucher) => {
    setSelectedVoucher(voucher);
  };

  const closeModal = () => {
    setSelectedVoucher(null);
  };

  return (
    <div className="h-screen flex flex-col items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Danh Sách Voucher</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <ul>
          {vouchers.map((voucher, index) => (
            <li
              key={index}
              className="border-b py-2 flex justify-between items-center cursor-pointer"
              onClick={() => handleVoucherClick(voucher)}
            >
              <span>{voucher.name}</span>
              <span
                className={`px-2 py-1 rounded ${
                  voucher.valid ? "bg-green-200" : "bg-red-200"
                }`}
              >
                {voucher.valid ? "Hợp lệ" : "Hết hạn"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {selectedVoucher && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Thông Tin Voucher</h2>
            <p><strong>Tên:</strong> {selectedVoucher.name}</p>
            <p><strong>Giảm giá:</strong> {selectedVoucher.discount}%</p>
            <p><strong>Ngày hết hạn:</strong> {new Date(selectedVoucher.expiryDate).toLocaleDateString()}</p>
            <p><strong>Số lượng:</strong> {selectedVoucher.quantity}</p>
            <p><strong>Trạng thái:</strong> {selectedVoucher.valid ? "Hợp lệ" : "Hết hạn"}</p>
            <button onClick={closeModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoucherList;
