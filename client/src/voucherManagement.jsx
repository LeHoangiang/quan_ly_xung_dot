import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function VoucherManagement() {
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  // const [version, setVersion] = useState(1);
  const [vouchers, setVouchers] = useState([]); // Thêm state cho danh sách voucher
  const [isEditing, setIsEditing] = useState(false); // Trạng thái đang sửa
  const [editingId, setEditingId] = useState(null); // ID của voucher đang sửa
  const [version, setVersion] = useState(1);

  const [updateResults, setUpdateResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVouchers();
  }, []);
  useEffect(() => {
    // Kiểm tra nếu có dữ liệu voucher được truyền từ list
    if (location.state?.editVoucher && location.state?.isEditing) {
      const voucher = location.state.editVoucher;
      handleEditClick(voucher);
    }
  }, [location]);
  const fetchVouchers = async () => {
    try {
      console.log("Fetching vouchers..."); // Debug log
      const response = await axios.get("http://localhost:5000/voucher/list");
      setVouchers(response.data);
    } catch (err) {
      console.error("Error details:", err); // Log chi tiết lỗi
      setError("Lỗi khi tải danh sách voucher!");
    }
  };
  // Add Voucher Function
  const handleAddVoucher = async () => {
    if (!name || !discount || !expiryDate || quantity <= 0) {
      setError("Vui lòng nhập đầy đủ thông tin và quantity phải lớn hơn 0!");
      setMessage("");
      return;
    }

    try {
      // Ensure the expiryDate is in the correct format before sending
      const formattedExpiryDate = new Date(expiryDate).toISOString();

      console.log(formattedExpiryDate); // Log to verify the date format

      const response = await axios.post("http://localhost:5000/voucher/add", {
        name,
        discount,
        expiryDate: formattedExpiryDate,
        quantity,
      });
      setMessage(response.data.message);
      setError("");
      setName("");
      setDiscount("");
      setExpiryDate("");
      setQuantity(1);

      // Thêm dòng này để tải lại danh sách sau khi thêm thành công
      fetchVouchers();
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi thêm voucher!");
      setMessage("");
    }
  };
  const handleEditClick = (voucher) => {
    setIsEditing(true);
    setEditingId(voucher._id);
    setName(voucher.name);
    setDiscount(voucher.discount);
    setExpiryDate(new Date(voucher.expiryDate).toISOString().split("T")[0]);
    setQuantity(voucher.quantity);
    setVersion(voucher.version);
  };

  // Hàm cập nhật voucher
  const handleUpdateVoucher = async () => {
    if (!name || !discount || !expiryDate || quantity <= 0) {
      setError("Vui lòng nhập đầy đủ thông tin và quantity phải lớn hơn 0!");
      return;
    }
    try {
      const formattedExpiryDate = new Date(expiryDate).toISOString();

      const response = await axios.put(
        `http://localhost:5000/voucher/update/${editingId}`,
        {
          name,
          discount,
          expiryDate: formattedExpiryDate,
          quantity,
          version,
        }
      );

      if (response.data.versionConflict) {
        setError(
          "Dữ liệu đã được người khác thay đổi. Vui lòng tải lại trang!"
        );
        return;
      }

      console.log("Update response:", response.data);
      setMessage("Voucher đã được cập nhật thành công!");
      setIsEditing(false);
      setEditingId(null);
      clearForm();
      fetchVouchers(); // Tải lại danh sách
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi cập nhật voucher!");
    }
  };

  // Hàm clear form
  const clearForm = () => {
    setName("");
    setDiscount("");
    setExpiryDate("");
    setQuantity(1);
    setError("");
    setMessage("");
    setIsEditing(false);
    setEditingId(null);
    navigate("/voucher-list"); // Quay lại trang danh sách
  };

  // Thêm hàm thực hiện nhiều cập nhật cùng lúc
  // const handleMultipleUpdates = async (voucher) => {
  //   if (!name || !discount || !expiryDate || quantity <= 0) {
  //       setError("Vui lòng nhập đầy đủ thông tin và số lượng phải lớn hơn 0!");
  //       return;
  //   }

  //   const numberOfUpdates = 5;
  //   setUpdateResults([]); // Reset kết quả

  //   // Khởi tạo kết quả ban đầu
  //   const initialUpdates = Array(numberOfUpdates).fill().map((_, index) => ({
  //       id: index + 1,
  //       status: "pending",
  //       message: "Đang cập nhật..."
  //   }));
  //   setUpdateResults(initialUpdates);

  //   const formattedExpiryDate = new Date(expiryDate).toISOString();
  //   const initialVersion = version; // Lưu version ban đầu

  //   // Tạo mảng các promises để thực hiện đồng thời
  //   const updatePromises = Array(numberOfUpdates).fill().map((_, index) => {
  //       return new Promise(async (resolve) => {
  //           try {
  //               const response = await axios.put(
  //                   `http://localhost:5000/voucher/update/${editingId}`,
  //                   {
  //                       name,
  //                       discount,
  //                       expiryDate: formattedExpiryDate,
  //                       quantity,
  //                       version: initialVersion // Sử dụng cùng một version cho tất cả request
  //                   }
  //               );

  //               resolve({
  //                   id: index + 1,
  //                   status: "success",
  //                   message: `Cập nhật thành công lần ${index + 1}`
  //               });
  //           } catch (err) {
  //               resolve({
  //                   id: index + 1,
  //                   status: "error",
  //                   message: err.response?.data?.message || "Lỗi version conflict"
  //               });
  //           }
  //       });
  //   });

  //   // Thực hiện tất cả request cùng lúc
  //   const results = await Promise.all(updatePromises);
  //   setUpdateResults(results);

  //   try {
  //       await fetchVouchers(); // Tải lại danh sách sau khi hoàn thành nè
  //       setMessage("Hoàn thành các lần cập nhật");
  //   } catch (err) {
  //       setError("Có lỗi xảy ra trong quá trình cập nhật");
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Quản Lý Voucher</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {message && <div className="text-green-500 mb-4">{message}</div>}

      {/* Form Section */}
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Sửa Voucher" : "Thêm Voucher"}
        </h2>
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
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Số lượng"
          className="w-full border border-gray-300 p-2 mb-4 rounded"
        />

        <button
          onClick={isEditing ? handleUpdateVoucher : handleAddVoucher}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {isEditing ? "Cập Nhật" : "Thêm Voucher"}
        </button>

        {isEditing ? (
          <div>
            <button
              onClick={clearForm}
              className="w-full mt-2 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Hủy
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddVoucher}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Thêm Voucher
          </button>
        )}
      </div>

      {/* Chỉ hiển thị bảng voucher khi đang ở chế độ sửa */}
      {isEditing && (
        <div className="w-full max-w-4xl bg-white rounded shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Voucher Đang Sửa</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Mã Voucher</th>
                  <th className="px-4 py-2">Giảm Giá (%)</th>
                  <th className="px-4 py-2">Ngày Hết Hạn</th>
                  <th className="px-4 py-2">Số Lượng</th>
                  <th className="px-4 py-2">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {vouchers
                  .filter((voucher) => voucher._id === editingId)
                  .map((voucher) => (
                    <tr key={voucher._id} className="border-b">
                      <td className="px-4 py-2">{voucher.name}</td>
                      <td className="px-4 py-2">{voucher.discount}</td>
                      <td className="px-4 py-2">
                        {new Date(voucher.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{voucher.quantity}</td>
                      <td className="px-4 py-2">
                        {/* <button
                          onClick={() => handleMultipleUpdates(voucher)}
                          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                        >
                          Cập nhật
                        </button> */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {updateResults.length > 0 && (
        <div className="w-full max-w-4xl bg-white rounded shadow-md p-6 mt-4">
          <h2 className="text-xl font-semibold mb-4">Kết Quả Cập Nhật</h2>
          <div className="grid grid-cols-1 gap-2">
            {updateResults.map((result) => (
              <div
                key={result.id}
                className={`p-3 rounded ${
                  result.status === "success"
                    ? "bg-green-100 border-green-500"
                    : result.status === "error"
                    ? "bg-red-100 border-red-500"
                    : "bg-yellow-100 border-yellow-500"
                } border`}
              >
                <div className="flex justify-between items-center">
                  <span>Cập nhật #{result.id}</span>
                  <span>{result.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VoucherManagement;
