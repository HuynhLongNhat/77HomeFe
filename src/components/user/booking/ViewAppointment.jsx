import { useEffect, useState } from "react";
import "../../../styles/ViewAppointment.scss";
import {
  getAppointmentByRenter,
} from "../../../service/AppointmentService";
import AbortModalRenter from "./AbortModalRenter";
import {
  createPaymentLink,
} from "../../../service/paymentService";

const ViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showAbortModal, setShowAbortModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const auth = JSON.parse(localStorage.getItem("auth"));
  useEffect(() => {
    fetchAppointmentsByRenter();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, dateFilter, appointments]);

  const fetchAppointmentsByRenter = async () => {
    const response = await getAppointmentByRenter(auth.id);
    if (response && response.EC === 0) {
      setAppointments(response.DT);
      setFilteredAppointments(response.DT);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.room?.house?.owner?.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.renter.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.room.house.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.room.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (appointment) => appointment.status === parseInt(statusFilter)
      );
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(
        (appointment) =>
          new Date(appointment.meetDate).toISOString().split("T")[0] ===
          dateFilter
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "#FFC107";
      case 2:
        return "#4CAF50";
      case 3:
        return "#F44336";
      case 4:
        return "#FF9800";
      case 5:
        return "#2196F3";
      default:
        return "#757575";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Đang chờ";
      case 2:
        return "Đã xác nhận";
      case 3:
        return "Đã hủy";
      case 4:
        return "Từ chối";
      case 5:
        return "Đã thanh toán";
      default:
        return "Không xác định";
    }
  };
  const handleOpenAbortModal = (appointmentId) => {
    setShowAbortModal(true);
    setSelectedAppointmentId(appointmentId);
  };
  const handleCloseAbortModal = () => {
    setShowAbortModal(false);
    setSelectedAppointmentId(null);
  };
  const renderActionButtons = (appointment) => {
    if (appointment.status === 1) {
      return (
        <button
          className="action-button delete"
          onClick={() => handleOpenAbortModal(appointment.id)}
        >
          <i className="far fa-trash-alt"></i>
          Hủy
        </button>
      );
    } else if (appointment.status === 2) {
      return (
        <button
          className="action-button payment"
          onClick={() => handlePayment(appointment)}
        >
          <i className="fas fa-credit-card"></i>
          Thanh toán
        </button>
      );
    } else if (appointment.status === 6) {
      return (
        <button className="action-button paid" disabled>
          <i className="fas fa-check"></i>
          Đã thanh toán
        </button>
      );
    }
    return null;
  };
   
  const handlePayment = async (appointment) => {
  try {
    // Generate a unique order code
      const orderCode = appointment.id * 1000 + Math.floor(Math.random() * 1000);
      const orderData = {
      amount: appointment?.room?.monthlyRent,
      description: `Thanh toán thuê phòng`,
      orderCode: orderCode,
      returnUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    };

    // Create payment link
    const response = await createPaymentLink(orderData);
console.log(response);
    if (response?.success && response?.paymentUrl?.checkoutUrl) {
      // Store the orderCode in localStorage for later verification
      localStorage.setItem("pendingPaymentOrderCode", orderCode);

      // Redirect to payment URL
      window.location.href = response.paymentUrl.checkoutUrl;
    } else {
      throw new Error(response?.message || "Invalid payment response");
    }
  } catch (error) {
    console.error("Payment error:", error);
    // Show user-friendly error message
    alert("Có lỗi xảy ra khi xử lý thanh toán: " + error.message);
  }
  };

  return (
    <>
      <div className="appointment-container">
        <h1 className="page-title">
          <i className="fas fa-calendar-alt"></i> Danh sách lịch hẹn
        </h1>

        <div className="filter-section">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="filter-wrapper">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="1">Đang chờ</option>
              <option value="2">Đã xác nhận</option>
              <option value="3">Đã hủy</option>
              <option value="4">Từ chối</option>
            </select>
          </div>
          <div className="date-wrapper">
            <input
              type="date"
              className="date-filter"
              value={dateFilter}
              onChange={handleDateChange}
            />
          </div>
        </div>

        <div className="appointments-grid">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <span
                  className="status-badge"
                  style={{
                    backgroundColor: getStatusColor(appointment.status),
                  }}
                >
                  {getStatusText(appointment.status)}
                </span>
                <span className="appointment-date">
                  <i className="far fa-calendar-alt px-1"></i>
                  {new Date(appointment.meetDate).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div className="appointment-body">
                <div className="info-row">
                  <i className="fas fa-user-tie"></i>

                  <span>{appointment.room?.house?.owner?.fullName}</span>
                </div>
                <div className="info-row">
                  <i className="far fa-user"></i>
                  <span>{appointment.renter.fullName}</span>
                </div>
                <div className="info-row">
                  <i className="far fa-comment-alt"></i>
                  <span>{appointment.note}</span>
                </div>
                <div className="info-row">
                  <i className="fas fa-home"></i>
                  <span>{appointment.room.house.name}</span>
                </div>
                <div className="info-row">
                  <i className="fas fa-door-open"></i>
                  <span>{appointment.room.name}</span>
                </div>
                <div className="info-row">
                  <i className="fas fa-money-bill-wave"></i>
                  <span>
                    {appointment.room.monthlyRent.toLocaleString()} VNĐ/tháng
                  </span>
                </div>
              </div>

              <div className="appointment-actions">
                {renderActionButtons(appointment)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AbortModalRenter
        show={showAbortModal}
        idAppointment={selectedAppointmentId}
        handleClose={handleCloseAbortModal}
        fetchAppointmentsByRenter={fetchAppointmentsByRenter}
      />
    </>
  );
};

export default ViewAppointment;
