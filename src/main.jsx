import { createRoot } from "react-dom/client";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./components/routes/AppRoutes";
createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/77HomeFe">
    <AppRoutes/>
  </BrowserRouter>
);
