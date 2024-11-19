import React, { useEffect, useState } from "react";
import axios from "axios";

function VoucherList() {
  const [vouchers, setVouchers] = useState([]);

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

  return (
    <div className="h-screen flex flex-col items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Danh Sách Voucher</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <ul>
          {vouchers.map((voucher, index) => (
            <li
              key={index}
              className="border-b py-2 flex justify-between items-center"
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
    </div>
  );
}

export default VoucherList;
