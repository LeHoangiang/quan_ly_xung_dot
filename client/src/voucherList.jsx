import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // Thêm state cho thông báo
  const [error, setError] = useState(""); // Thêm state cho lỗi

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

  const handleEditClick = (voucher, e) => {
    e.stopPropagation(); // Ngăn không cho modal hiện lên khi nhấn nút sửa
    navigate('/voucher-management', { 
      state: { 
        editVoucher: voucher,
        isEditing: true 
      } 
    });
  };

   // Sửa lại hàm handleDeleteClick
   const handleDeleteClick = async (voucher, e) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa voucher ${voucher.name}?`)) {
        try {
            console.log('Attempting to delete voucher:', voucher._id);
            const response = await axios.delete(`http://localhost:5000/voucher/delete/${voucher._id}`);
            
            if (response.data.success) {
                console.log('Delete successful:', response.data);
                setMessage("Xóa voucher thành công!");
                setError("");
                
                // Cập nhật state ngay lập tức
                setVouchers(prevVouchers => prevVouchers.filter(v => v._id !== voucher._id));
            } else {
                throw new Error(response.data.message || "Lỗi khi xóa voucher");
            }
        } catch (err) {
            console.error('Delete error:', err);
            setError(err.response?.data?.message || "Lỗi khi xóa voucher!");
            setMessage("");
        }
    }
};


return (
  <div className="h-screen flex flex-col items-center bg-gray-100">
    <h1 className="text-2xl font-bold mb-4">Danh Sách Voucher</h1>
    
    {message && <div className="text-green-500 mb-4">{message}</div>}
    {error && <div className="text-red-500 mb-4">{error}</div>}
    
    <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl"> {/* Tăng độ rộng container */}
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thông Tin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng Thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao Tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vouchers.map((voucher) => (
            <tr 
              key={voucher._id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleVoucherClick(voucher)}
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-medium">{voucher.name}</span>
                  <span className="text-sm text-gray-500">Giảm giá: {voucher.discount}%</span>
                  <span className="text-sm text-gray-500">
                    Hết hạn: {new Date(voucher.expiryDate).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Số lượng: {voucher.quantity}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  voucher.valid 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {voucher.valid ? "Hợp lệ" : "Hết hạn"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => handleEditClick(voucher, e)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(voucher, e)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Modal giữ nguyên không thay đổi */}
    {selectedVoucher && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md w-1/3">
          <h2 className="text-xl font-bold mb-4">Thông Tin Voucher</h2>
          <p><strong>Tên:</strong> {selectedVoucher.name}</p>
          <p><strong>Giảm giá:</strong> {selectedVoucher.discount}%</p>
          <p><strong>Ngày hết hạn:</strong> {new Date(selectedVoucher.expiryDate).toLocaleDateString()}</p>
          <p><strong>Số lượng:</strong> {selectedVoucher.quantity}</p>
          <p><strong>Trạng thái:</strong> {selectedVoucher.valid ? "Còn hiệu lực" : "Hết hạn"}</p>
          <button onClick={closeModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Đóng</button>
        </div>
      </div>
    )}
  </div>
)
}

export default VoucherList;
