/* eslint-disable react/prop-types */
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/BookingRoom.scss";
import { toast } from "react-toastify";
import { createNewAppoitment } from "../../../service/appointmentService";
import { updateRoom } from "../../../service/appointmentService";
const BookingRoom = ({ roomData, onClose, fetchAllHouse }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  console.log("citizen", auth.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    renterId: auth.id || "",
    rentEntityId: roomData.id || "",
    meetDate: new Date(),
    note: "",
  });

  const validateForm = () => {
    if (!appointmentData.renterId) {
      toast.error("Please login to book an appointment");
      return false;
    }

    if (!appointmentData.rentEntityId) {
      toast.error("Invalid room information");
      return false;
    }

    const currentDate = new Date();
    if (appointmentData.meetDate < currentDate) {
      toast.error("Vui lòng chọn một ngày trong tương lai!");
      return false;
    }

    // Check if meetDate is within business hours (8 AM - 6 PM)
    const hours = appointmentData.meetDate.getHours();
    if (hours < 8 || hours >= 18) {
      toast.error("Vui lòng chọn thời gian từ 8 giờ sáng đến 6 giờ chiều");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const formattedData = {
        ...appointmentData,
        meetDate: appointmentData.meetDate.toISOString(),
      };
      console.log("formattedData", formattedData);
      const response = await createNewAppoitment(formattedData);

      if (response && response.EC === 0) {
        toast.success(response.EM);
        let updatestatusRoom = await updateRoom(appointmentData.rentEntityId, {
          status: 1,
        });
        if (updatestatusRoom.EC === 0) {
        fetchAllHouse();
        }
        onClose();
      }
      if (response && response.EC === -1) {
        toast.error(response.EM);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setAppointmentData((prev) => ({
      ...prev,
      meetDate: date,
    }));
  };

  // Filter available times for DatePicker
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    // Filter out past times
    if (
      selectedDate.getDate() === currentDate.getDate() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    ) {
      return currentDate.getTime() < selectedDate.getTime();
    }

    // Filter business hours (8 AM - 6 PM)
    const hours = selectedDate.getHours();
    return hours >= 8 && hours < 18;
  };

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h3>Lịch hẹn </h3>
        <div className="room-card">
          <div className="room-info">
            <h5>{roomData?.name}</h5>
            <div className="room-details">
              <div className="detail-item">
                <i className="fas fa-money-bill"></i>
                <span>{roomData?.monthlyRent?.toLocaleString()} VND/tháng</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-vector-square"></i>
                <span>{roomData?.area} m²</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-users"></i>
                <span>{roomData?.maxOccupants} người </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Form onSubmit={handleSubmit} className="booking-form">
        <Form.Group className="form-group">
          <Form.Label>Ngày hẹn </Form.Label>
          <DatePicker
            selected={appointmentData.meetDate}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="custom-input date-picker"
            minDate={new Date()}
            filterTime={filterPassedTime}
            required
            timeIntervals={15}
            timeCaption="Time"
            excludeTimes={[]} // You can add excluded times here if needed
          />
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>Ghi chú</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="note"
            value={appointmentData.note}
            onChange={handleChange}
            placeholder="Any special requests or questions?"
            className="custom-textarea"
          />
        </Form.Group>

        <div className="button-group">
          <Button
            variant="outline-secondary"
            onClick={onClose}
            className="cancel-btn"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BookingRoom;
