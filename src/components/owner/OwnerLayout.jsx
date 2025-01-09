import { Outlet } from "react-router-dom";
import styles from "./OwnerLayout.module.css";
import SidebarOwner from "./Dashboard/SidebarOwner";
import Header from "../user/layout/header";
import Footer from "../user/layout/footer";
const OwnerLayout = () => {
  return (
    <>
    <Header/>
      <div className={styles.adminLayout}>
        <SidebarOwner />
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </div>
    <Footer/>
    </>
  );
};

export default OwnerLayout;
