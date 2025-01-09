import { Outlet } from "react-router-dom";
import Footer from "../layout/footer";
import Header from "../layout/header";
const ManageHouseUser = () => {
  return (
    <div>
      <Header></Header>
      <Outlet />
      <Footer></Footer>
    </div>
  );
};

export default ManageHouseUser;
