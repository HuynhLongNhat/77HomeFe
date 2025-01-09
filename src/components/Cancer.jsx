import { useNavigate } from "react-router-dom";
import "../styles/Payment.scss"
const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="status-container error">
      <div className="status-card">
        <div className="status-icon error">
          <i className="fas fa-times-circle"></i>
        </div>
        <h1>Thanh toán không thành công</h1>
        <p>Rất tiếc, giao dịch của bạn đã bị hủy. Vui lòng thử lại sau.</p>
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

export default Cancel;