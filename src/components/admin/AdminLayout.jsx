import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import SidebarAdmin from "./Dashboard/SidebarAdmin";
import Header from "../user/layout/header";
import Footer from "../user/layout/footer";
const AdminLayout = () => {
  return (
    <>
    <Header/>
      <div className={styles.adminLayout}>
        <SidebarAdmin />
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default AdminLayout;
