import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaHome, FaHandshake, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "./user/layout/header";
import Footer from "./user/layout/footer";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
    <Header/>
    <div className="homepage">
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          minHeight: "100vh",
          background:
            'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="display-3 fw-bold mb-4">77Home</h1>
            <h2 className="h3 mb-4">Tìm Nhà Trọ Tại Quy Nhơn Dễ Dàng</h2>
            <p className="lead mb-5">
              Khám phá không gian sống lý tưởng với dịch vụ cho thuê nhà trọ uy
              tín và chất lượng
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/house")}
              style={{
                backgroundColor: "#4f46e5",
                border: "none",
                padding: "15px 40px",
                borderRadius: "30px",
              }}
            >
              Tìm Nhà Ngay
            </Button>
          </motion.div>
        </Container>
      </div>

      {/* Features Section */}
      <section className="py-5" style={{ backgroundColor: "#f8fafc" }}>
        <Container>
          <h2 className="text-center mb-5">Tại sao chọn 77Home?</h2>
          <div className="row g-4">
            {[
              {
                icon: <FaSearch size={40} />,
                title: "Tìm Kiếm Dễ Dàng",
                description:
                  "Hệ thống tìm kiếm thông minh giúp bạn nhanh chóng tìm được nhà trọ phù hợp",
              },
              {
                icon: <FaHome size={40} />,
                title: "Đa Dạng Lựa Chọn",
                description:
                  "Nhiều loại phòng trọ với đầy đủ tiện nghi tại các khu vực trung tâm Quy Nhơn",
              },
              {
                icon: <FaHandshake size={40} />,
                title: "Uy Tín & Tin Cậy",
                description:
                  "Tất cả nhà trọ đều được kiểm duyệt và đảm bảo chất lượng",
              },
              {
                icon: <FaShieldAlt size={40} />,
                title: "An Toàn & Bảo Mật",
                description: "Thông tin của bạn luôn được bảo vệ an toàn",
              },
            ].map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <motion.div
                  className="text-center p-4"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-3" style={{ color: "#4f46e5" }}>
                    {feature.icon}
                  </div>
                  <h3 className="h5 mb-3">{feature.title}</h3>
                  <p className="text-muted">{feature.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </Container>
      </section>

    </div>
    <Footer/>
    </>
  );
};

export default HomePage;
