// components/Unauthorized.jsx
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="text-center">
        <div className="mb-4">
          <svg
            width="150"
            height="150"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15C11.4477 15 11 14.5523 11 14C11 13.4477 11.4477 13 12 13C12.5523 13 13 13.4477 13 14C13 14.5523 12.5523 15 12 15Z"
              fill="#dc3545"
            />
            <path
              d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
              fill="#dc3545"
            />
            <path
              d="M12 17C11.4477 17 11 16.5523 11 16V10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10V16C13 16.5523 12.5523 17 12 17Z"
              fill="#dc3545"
            />
          </svg>
        </div>
        <h1 className="display-4 mb-4 fw-bold" style={{ color: "#dc3545" }}>
          Access Denied
        </h1>
        <div className="mb-4">
          <p className="lead text-muted">
            Xin lỗi, bạn không có quyền truy cập vào trang này.
          </p>
          <p className="text-muted">
            Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là một sự nhầm
            lẫn.
          </p>
        </div>
        <div className="d-flex justify-content-center gap-3">
          <Button
            variant="outline-secondary"
            onClick={() => navigate(-1)}
            className="px-4"
          >
            Quay lại
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            className="px-4"
            style={{ backgroundColor: "#5a67d8", borderColor: "#5a67d8" }}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Unauthorized;
