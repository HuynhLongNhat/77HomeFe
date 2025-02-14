/* eslint-disable react/prop-types */
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { rejectAppointmentByOwner } from "../../../service/appointmentService";
import { toast } from "react-toastify";
const RejectModalOwner = ({
  show,
  handleClose,
  idAppointment,
  fetchAppointmentsByOwner,
}) => {
  const [rejectedReason, setRejectedReason] = useState("");
  const handleAbortSubmit = async () => {
    let res = await rejectAppointmentByOwner(idAppointment, {
      rejectedReason: rejectedReason,
    });
    if (res && res.EC === 0) {
      toast.success("Từ chối lịch hẹn thành công");
      fetchAppointmentsByOwner();
      handleClose();
      setRejectedReason("");
    } else {
      toast.error("Từ chối lịch hẹn thất bại");
    }
  };

  // abortedReason;
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Lý do từ chối</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="abortReason">
            <Form.Label>Nhập lý do từ chối:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập lý do từ chối..."
              value={rejectedReason}
              onChange={(e) => setRejectedReason(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleAbortSubmit}
          disabled={!rejectedReason.trim()}
        >
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RejectModalOwner;
