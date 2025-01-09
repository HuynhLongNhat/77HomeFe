// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import Unauthorized from "../Authorized";

const PrivateRoute = ({ children, allowedRoles }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  // Chưa đăng nhập -> redirect to login
  if (!auth?.access_token) {
    return <Navigate to="/login" />;
  }

  const userRole = auth.role?.DT?.[0];

  // Không có quyền -> hiển thị trang Unauthorized
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Unauthorized />;
  }

  return children;
};

export default PrivateRoute;
