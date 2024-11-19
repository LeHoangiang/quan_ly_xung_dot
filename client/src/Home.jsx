import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-6">Quản Lý Voucher Quán Cà Phê</h1>
      <div className="flex space-x-4">
        <Link
          to="/voucher-check"
          className="bg-white text-blue-500 px-6 py-2 rounded shadow hover:bg-gray-200 transition"
        >
          Kiểm Tra Voucher
        </Link>
        <Link
          to="/voucher-management"
          className="bg-white text-blue-500 px-6 py-2 rounded shadow hover:bg-gray-200 transition"
        >
          Quản Lý Voucher
        </Link>
        <Link
          to="/voucher-list"
          className="bg-white text-blue-500 px-6 py-2 rounded shadow hover:bg-gray-200 transition"
        >
          Danh Sách Voucher
        </Link>
      </div>
    </div>
  );
}

export default Home;
