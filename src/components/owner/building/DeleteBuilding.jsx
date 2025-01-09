/* eslint-disable react/prop-types */
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deleteBuilding } from "../../../service/buildingService";

import { toast } from "react-toastify";
const DeleteBuilding = (props) => {
  const { show, handleClose, buildingData, fetchAllListBuilding } = props;
  // Gọi API để xóa tòa nhà
  const confirmDelete = async () => {
    const res = await deleteBuilding(buildingData?.id);
    console.log("res", res);
    if (res && res.EC === 0) {
      toast.success("Xóa tòa nhà thành công");
      fetchAllListBuilding();
      handleClose();
    } else {
      toast.error("Xóa tòa nhà thất bại");
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
          <Modal.Title>Xác nhận xóa tòa nhà!</Modal.Title>
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

export default DeleteBuilding;
