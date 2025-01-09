/* eslint-disable react/prop-types */
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5";
import { AiTwotoneEyeInvisible, AiFillEye } from "react-icons/ai";
import "../../styles/Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../service/authService";
import { toast } from "react-toastify";
const schema = yup.object({
  email: yup
    .string()
    .required("Email không được để trống!")
    .email("Email không đúng định dạng!"),
  password: yup.string().required("Password không được để trống!"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (data) => {
    try {
      let res = await loginUser(data);
      console.log("data", res);
      if (res && res.EC === 0) {
        // Lưu thông tin auth vào localStorage
        localStorage.setItem("auth", JSON.stringify(res.DT));
        toast.success("Đăng nhập thành công");

        // Điều hướng dựa vào role
        const userRole = res.DT.role?.DT?.[0];
        if (userRole === "Admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "Owner") {
          navigate("/owner/dashboard");
        } else {
          navigate("/");
        }
      }
      if (res && res.EC === -1) {
        console.log("thất bại")
        toast.error("Tài khoản hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      console.log("Error", error.message);
      toast.error("Đăng nhập thất bại");
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100 "
    >
      <div
        className="p-4 bg-white rounded shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3
          className="text-center mb-4 fw-bold"
          style={{ marginRight: "65%", fontSize: "1.5rem" }}
        >
          Sign in
        </h3>

        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label className="fw-semibold" style={{ fontSize: "0.7rem" }}>
              Email
            </Form.Label>
            <div
              className="d-flex align-items-center border rounded px-2"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <IoMailOutline className="text-muted me-2" />
              <Form.Control
                type="text"
                placeholder="Enter email"
                className="border-0 shadow-none fw-semibold"
                style={{ fontSize: "0.7rem", backgroundColor: "#F5F5F5" }}
                {...register("email")}
                isInvalid={errors.email}
              />
            </div>
            {errors.email && (
              <div className="error-message">{errors.email.message}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label className="fw-semibold" style={{ fontSize: "0.7rem" }}>
              Password
            </Form.Label>
            <div
              className="d-flex align-items-center border rounded px-2"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <IoMdLock className="text-muted me-2" />
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="border-0 shadow-none fw-semibold"
                style={{ fontSize: "0.7rem", backgroundColor: "#F5F5F5" }}
                {...register("password")}
                isInvalid={!!errors.password}
              />
              {showPassword ? (
                <AiFillEye
                  data-testid="toggle-password-visibility"
                  className="text-muted ms-2"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <AiTwotoneEyeInvisible
                  data-testid="toggle-password-visibility"
                  className="text-muted ms-2"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>

            <div className="error-message">
              {errors.password ? errors.password.message : ""}
            </div>
            <div className="text-end mt-2">
              <a
                href="#"
                className="text-decoration-none"
                style={{
                  fontSize: "0.7rem",
                  color: "#5a67d8",
                }}
              >
                Forgot password?
              </a>
            </div>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            onClick={() => handleFormSubmit()}
            className="w-100 fw-semibold mb-3"
            style={{
              backgroundColor: "#5a67d8",
              borderColor: "#5a67d8",
              fontSize: "0.7rem",
            }}
          >
            Sign In
          </Button>
        </Form>

        <div
          className="text-center text-muted mt-3"
          style={{ fontSize: "0.6rem", fontWeight: "bold" }}
        >
          OR CONTINUE WITH
        </div>

        <Row className="text-center mb-5">
          <Col>
            <Button className="btn-social btn-google" variant="outline-danger">
              <FaGoogle />
            </Button>
          </Col>
          <Col>
            <Button
              className="btn-social btn-facebook"
              variant="outline-primary"
            >
              <FaFacebook />
            </Button>
          </Col>
        </Row>

        <div className="text-center">
          <span
            className="text-muted fw-semibold"
            style={{ fontSize: "0.7rem" }}
          >
            Don&apos;t have an account?{" "}
          </span>
          <Link
            to="/register"
            style={{ color: "#5a67d8", fontSize: "0.7rem" }}
            className=" fw-semibold text-decoration-none"
          >
            Sign up
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Login;
