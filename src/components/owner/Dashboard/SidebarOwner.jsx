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
import styles from "./SidebarOwner.module.css";
import { Link } from "react-router-dom";

const SidebarOwner = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3 className="text-center">Owner Panel</h3>
      </div>
      <Nav className="flex-column h-100">
        <Link to="/owner/dashboard" className={styles.navLink}>
          <FaChartBar /> Dashboard{" "}
        </Link>
        <Link to="/owner/building" className={styles.navLink}>
          <FaBuilding /> Tòa nhà
        </Link>
        <Link to="/owner/house" className={styles.navLink}>
          <FaHouseUser /> Nhà
        </Link>
        <Link to="/owner/room" className={styles.navLink}>
          <FaBed /> Phòng
        </Link>
        <Link to="/owner/appointment" className={styles.navLink}>
          <FaUsers /> Lịch hẹn
        </Link>
        <Link to="/" className={styles.navLink}>
          <FaHome /> Trang chủ
        </Link>
       
      </Nav>
    </div>
  );
};

export default SidebarOwner;
