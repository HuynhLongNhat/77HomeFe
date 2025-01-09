/* eslint-disable react/prop-types */
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteUser } from "../../../service/userService";
const DeleteUser = (props) => {
  const { show, handleClose, userData, fetchAllListUser } = props;
  console.log("data", userData);
  const confirmDelete = async () => {
    const res = await deleteUser(userData?.citizenNumber);
    console.log("res", res);
    if (res && res.EC === 0) {
      toast.success("Xóa người dùng thành công");
      fetchAllListUser();
      handleClose();
    } else {
      toast.error("Xóa người dùng thất bại");
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa người dùng!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            Bạn có chắc chắn muốn thực hiện thao tác này không ?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="danger" onClick={() => confirmDelete()}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteUser;
