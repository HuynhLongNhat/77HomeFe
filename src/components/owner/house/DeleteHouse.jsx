import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const DeleteHouse = ({ show, handleClose, houseData, onDeleteSuccess = () => {} }) => {

  // Hàm xác nhận xóa
  const confirmDelete = async () => {
    try {
      // Gọi API xóa nhà với id của nhà trọ
      await axios.delete(`http://localhost:8080/api/v1/house/${houseData.id}`); 
      onDeleteSuccess(houseData.id); // Gọi callback từ component cha để cập nhật danh sách
      toast.success("Xóa nhà trọ thành công!"); // Thông báo thành công
      handleClose(); // Đóng modal
    } catch (error) {
      console.error("Đã xảy ra lỗi khi xóa nhà trọ:", error);
      toast.error("Xóa nhà trọ thất bại. Vui lòng thử lại sau!"); // Thông báo lỗi
    }
  };

  return (
    <>
      {/* Toast container để hiển thị thông báo */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />

      {/* Modal xác nhận xóa */}
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa nhà trọ!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            Bạn có chắc chắn muốn xóa nhà trọ "{houseData?.name}" không?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteHouse;
