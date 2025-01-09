import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import {
  FaUserCircle,
  FaUserAlt,
  FaCalendarAlt,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaTachometerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../../styles/Header.scss";

const Header = () => {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth"));
   

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <Navbar bg="white" expand="lg" className="header-navbar shadow-sm">
      <Container fluid>
        <Navbar.Brand
          className="d-flex align-items-center"
          onClick={() => navigate("/")}
        >
          <img
            src="/77Home.png"
            alt="77Home"
            height="40"
            className="d-inline-block align-top me-2"
          />
          <span className="brand-text">77Home</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* User Profile */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-profile">
                {auth?.fullName ? (
                  <div className="d-flex align-items-center">
                    <span className="mx-2">{auth.fullName}</span>
                    <FaUserCircle size={24} />
                  </div>
                ) : (
                  <FaUserCircle size={24} />
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {auth?.access_token ? (
                  <>
                    <Dropdown.Item href="/profile">
                      <FaUserAlt className="me-2" /> Thông tin cá nhân
                    </Dropdown.Item>
                    <Dropdown.Item href="/appointment">
                      <FaCalendarAlt className="me-2" /> Lịch hẹn
                    </Dropdown.Item>

                    {auth.role.DT.includes("Admin") && (
                      <Dropdown.Item href="/admin/dashboard">
                        <FaTachometerAlt className="me-2" /> Admin Dashboard
                      </Dropdown.Item>
                    )}
                    {auth.role.DT.includes("Owner") && (
                      <Dropdown.Item href="/owner/dashboard">
                        <FaTachometerAlt className="me-2" /> Owner Dashboard
                      </Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Đăng xuất
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item href="/login">
                      <FaSignInAlt className="me-2" /> Đăng nhập
                    </Dropdown.Item>
                    <Dropdown.Item href="/register">
                      <FaUserPlus className="me-2" /> Đăng ký
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
