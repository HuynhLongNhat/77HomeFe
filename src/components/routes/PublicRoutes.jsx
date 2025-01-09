import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));

 
  if (auth) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
