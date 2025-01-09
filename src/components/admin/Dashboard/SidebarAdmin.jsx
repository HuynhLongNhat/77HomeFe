import { Nav } from "react-bootstrap";
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaHouseUser,
  FaBed,
  FaCalendarAlt,
  FaChartBar,
} from "react-icons/fa";
import styles from "./SidebarAdmin.module.css";
import { Link } from "react-router-dom";

const SidebarAdmin = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3 className="text-center">Admin Panel</h3>
      </div>
      <Nav className="flex-column h-100">
        {/* Dashboard */}
        <Link to="/admin/dashboard" className={styles.navLink}>
          <FaChartBar /> Dashboard
        </Link>

        {/* Users */}
        <Link to="/admin/users" className={styles.navLink}>
          <FaUsers /> Users
        </Link>

        {/* Buildings */}
        <Link to="/admin/building" className={styles.navLink}>
          <FaBuilding /> Tòa nhà
        </Link>

        {/* Houses */}
        <Link to="/admin/house" className={styles.navLink}>
          <FaHouseUser /> Nhà
        </Link>

        {/* Rooms */}
        <Link to="/admin/room" className={styles.navLink}>
          <FaBed /> Phòng
        </Link>

        {/* Appointments */}
        <Link to="/admin/appointment" className={styles.navLink}>
          <FaCalendarAlt /> Lịch hẹn
        </Link>

        {/* Home */}
        <Link to="/" className={styles.navLink}>
          <FaHome /> Trang chủ
        </Link>

      
      </Nav>
    </div>
  );
};

export default SidebarAdmin;
