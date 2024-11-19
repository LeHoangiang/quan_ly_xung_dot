import React, { useState } from "react";
import axios from "axios";

function VoucherCheck() {
  const [name, setName] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/voucher/check", {
        name
      });
      setResponseMessage(res.data.message || "Voucher hợp lệ!");
    } catch (err) {
      setResponseMessage(err.response.data.message || "Voucher không hợp lệ.");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Kiểm Tra Voucher</h1>
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập mã voucher"
          className="w-full border border-gray-300 p-2 mb-4 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Kiểm tra
        </button>
      </form>
      {responseMessage && (
        <p className="mt-4 text-lg text-gray-700">{responseMessage}</p>
      )}
    </div>
  );
}

export default VoucherCheck;
