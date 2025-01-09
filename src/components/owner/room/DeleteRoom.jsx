import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const DeleteRoom = ({ show, handleClose, roomData, onDeleteSuccess = () => {} }) => {
  
  // Hàm xác nhận xóa
  const confirmDelete = async () => {
    try {
      // Gọi API xóa phòng
      await axios.delete(`http://localhost:8080/api/v1/room/${roomData.id}`);
      onDeleteSuccess(roomData.id); // Gọi callback để cập nhật danh sách phòng
      toast.success("Xóa phòng thành công!");
      handleClose(); // Đóng modal
    } catch (error) {
      console.error("Đã xảy ra lỗi khi xóa phòng:", error);
      toast.error("Xóa phòng thất bại. Vui lòng thử lại sau!");
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
          <Modal.Title>Xác nhận xóa phòng!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            Bạn có chắc chắn muốn xóa phòng "{roomData?.name}" không?
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

export default DeleteRoom;
