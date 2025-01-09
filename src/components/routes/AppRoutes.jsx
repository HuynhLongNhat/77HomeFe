import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import CreateNewHouse from "../../components/owner/house/CreateNewHouse";
import { Suspense } from "react";
import ListHouse from "../admin/house/ListHouse";
import DetailHouse from "../../components/owner/house/DetailHouse";
import UpdateHouse from "../../components/owner/house/UpdateHouse";
import CreateNewBuilding from "../../components/owner/building/CreateNewBuilding";
import DetailBuilding from "../../components/owner/building/DetailBuilding";
import UpdateBuilding from "../../components/owner/building/UpdateBuilding";
import ManageHouseUser from "../../components/user/house/ManageHouseUser";
import ListHouseUser from "../../components/user/house/ListHouseUser";
import DetailHouseUser from "../../components/user/house/DetailHouseUser";
import ListRoom from "../admin/room/ListRoom";
import CreateNewRoom from "../../components/owner/room/CreateNewRoom";
import DetailRoom from "../../components/owner/room/DetailRoom";
import UpdatedRoom from "../../components/owner/room/UpdateRoom";
import AdminLayout from "../../components/admin/AdminLayout";
import UserDetail from "../../components/admin/Dashboard/UserDetail";
import UserList from "../../components/admin/Dashboard/UserList";
import Dashboard from "../../components/admin/Dashboard/Dashboard";
import UpdateUser from "../../components/admin/Dashboard/UpdateUser";
import DashboardOwner from "../../components/owner/Dashboard/DashboardOwner";
import OwnerLayout from "../../components/owner/OwnerLayout";
import PrivateRoute from "./PrivateRoutes";
import Unauthorized from "../Authorized";
import PageLogin from "../user/PageLogin";
import PageRegister from "../user/PageRegister";
import HomePage from "../HomePage";
import NotFoundPage from "../NotFoundPage";
import Profile from "../Profile";
import ViewAppointment from "../user/booking/ViewAppointment";
import ListAppointmentAdmin from "../admin/Dashboard/ListAppointmentAdmin";
import ListAppointmentOwner from "../owner/appointment/ListAppointmentOwner";
import ListBuildingOwner from "../owner/building/ListBuildingOwner";
import ListBuilding from "../admin/building/ListBuilding"
import ListHouseOwner from "../owner/house/ListHouseOwner";
import ListRoomOwner from "../owner/room/ListRoomOwner";
import Success from "../Success";
import Cancel from "../Cancer";
import CreateNewBuildingAdmin from "../admin/building/CreateNewBuildingAdmin";
import DetailBuildingAdmin from "../admin/building/DetailBuildingAdmin";
import UpdateBuildingAdmin from "../admin/building/UpdateBuildingAdmin";
import DetailRoomAdmin from "../admin/room/DetailRoomAdmin";
import CreateNewRoomAdmin from "../admin/room/CreateNewRoomAdmin";
import UpdateRoomAdmin from "../admin/room/UpdateRoomAdmin";
import CreateNewHouseAdmin from "../admin/house/CreateNewHouseAdmin";
import UpdateHouseAdmin from "../admin/house/UpdateHouseAdmin";
import DetailHouseAdmin from "../admin/house/DetailHouseAdmin";

const AppRoutes = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<PageLogin />} />
          <Route path="/register" element={<PageRegister />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={["Renter", "Owner", "Admin"]}>
                <ManageHouseUser />
              </PrivateRoute>
            }
          >
            {/* Nested routes under ManageHouseUser */}
            <Route path="house" element={<ListHouseUser />} />
            <Route path="house/:id" element={<DetailHouseUser />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/appointment" element={<ViewAppointment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Route>

          <Route
            path="/owner"
            element={
              <PrivateRoute allowedRoles={["Owner"]}>
                <OwnerLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<DashboardOwner />} />
            <Route path="building" element={<ListBuildingOwner />} />
            <Route path="building/create" element={<CreateNewBuilding />} />
            <Route path="building/update/:id" element={<UpdateBuilding />} />
            <Route path="building/:id" element={<DetailBuilding />} />
            <Route path="house" element={<ListHouseOwner />} />
            <Route path="house/create" element={<CreateNewHouse />} />
            <Route path="house/update/:id" element={<UpdateHouse />} />
            <Route path="house/:id" element={<DetailHouse />} />
            <Route path="room" element={<ListRoomOwner />} />
            <Route path="room/create" element={<CreateNewRoom />} />
            <Route path="room/update/:id" element={<UpdatedRoom />} />
            <Route path="room/:id" element={<DetailRoom />} />
            <Route path="appointment" element={<ListAppointmentOwner />} />
          </Route>

          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="users/:id/update" element={<UpdateUser />} />

            <Route path="building" element={<ListBuilding />} />
            <Route path="building/create" element={<CreateNewBuildingAdmin />} />
            <Route path="building/update/:id" element={<UpdateBuildingAdmin />} />
            <Route path="building/:id" element={<DetailBuildingAdmin />} />

            <Route path="house" element={<ListHouse />} />
            <Route path="house/create" element={<CreateNewHouseAdmin />} />
            <Route path="house/update/:id" element={<UpdateHouseAdmin />} />
            <Route path="house/:id" element={<DetailHouseAdmin />} />

            <Route path="room" element={<ListRoom />} />
            <Route path="room/create" element={<CreateNewRoomAdmin />} />
            <Route path="room/update/:id" element={<UpdateRoomAdmin />} />
            <Route path="room/:id" element={<DetailRoomAdmin />} />

            <Route path="appointment" element={<ListAppointmentAdmin />} />
          </Route>
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer />
      </Suspense>
    </div>
  );
};

export default AppRoutes;
