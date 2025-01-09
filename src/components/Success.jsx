import { useNavigate } from "react-router-dom";
import { processPaymentCallback } from "../service/paymentService";
import "../styles/Payment.scss";
import { useEffect } from "react";
const Success = () => {
  const navigate = useNavigate();
useEffect(() => {
  const handlePaymentSuccess = async () => {
    try {
      const orderCode = localStorage.getItem("pendingPaymentOrderCode");
      if (!orderCode) {
        navigate("/");
        return;
      }

      // Call your backend to verify and process the payment
      const response = await processPaymentCallback (orderCode);

      if (response.data.EC === 0) {
        alert("Thanh toán thành công!");
      } else {
        alert("Có lỗi xảy ra trong quá trình xử lý thanh toán");
      }

      // Clear the pending payment
      localStorage.removeItem("pendingPaymentOrder");

      // Redirect to appropriate page
      navigate("/appointments");
    } catch (error) {
      console.error("Error processing payment success:", error);
      alert("Có lỗi xảy ra trong quá trình xử lý thanh toán");
      navigate("/");
    }
  };

  handlePaymentSuccess();
}, [navigate]);

  return (
    <div className="status-container success">
      <div className="status-card">
        <div className="status-icon success">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1>Thanh toán thành công!</h1>
        <p>
          Cảm ơn bạn đã thanh toán. Chúng tôi đã ghi nhận giao dịch của bạn.
        </p>
        <button
          className="status-button"
          onClick={() => navigate("/appointment")}
        >
          Quay lại danh sách lịch hẹn
        </button>
      </div>
    </div>
  );
};

export default Success;