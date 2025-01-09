/* eslint-disable react/prop-types */
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { abortAppointmentByRenter } from "../../../service/appointmentService";
import { toast } from "react-toastify";
const AbortModalRenter = ({
  show,
  handleClose,
  idAppointment,
  fetchAppointmentsByRenter,
}) => {
  const [abortedReason, setAbortedReason] = useState("");
  const handleAbortSubmit = async () => {
    let res = await abortAppointmentByRenter(idAppointment, {
      abortedReason: abortedReason,
    });
    console.log(res);
    if (res && res.EC === 0) {
      toast.success("Từ chối lịch hẹn thành công");
      fetchAppointmentsByRenter();
      handleClose();
      setAbortedReason("");
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
              value={abortedReason}
              onChange={(e) => setAbortedReason(e.target.value)}
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
          disabled={!abortedReason.trim()}
        >
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AbortModalRenter;
