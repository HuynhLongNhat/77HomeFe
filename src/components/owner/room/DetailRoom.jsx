import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Spinner,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import "../../../styles/DetailRoom.scss";

const DetailRoom = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/room/${id}`
      );
      setRoom(response.data.DT);
    } catch (err) {
      setError("Không thể tải thông tin phòng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const statusMapping = {
    0: { text: "Còn trống", variant: "success" },
    1: { text: "Đã thuê", variant: "danger" },
    2: { text: "Bảo trì", variant: "warning" },
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="detail-room-container py-5">
      <Row>
        <Col lg={8}>
          <div className="room-images mb-4">
            <div className="main-image">
              <img
                src={room.avatar || "https://via.placeholder.com/800x500"}
                alt={room.name}
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </Col>
        <Col lg={4}>
          <Card className="room-info-card border-0 shadow-sm">
            <Card.Body>
              <h2 className="room-title mb-4">{room.name}</h2>
              <Badge
                bg={statusMapping[room.status].variant}
                className="mb-3 px-3 py-2"
              >
                {statusMapping[room.status].text}
              </Badge>

              <div className="price-tag my-4">
                <h3 className="text-primary mb-0">
                  {room.monthlyRent.toLocaleString()} VND
                  <small className="text-muted">/tháng</small>
                </h3>
              </div>

              <div className="room-details">
                <div className="detail-item">
                  <i className="fas fa-vector-square"></i>
                  <span>Diện tích: {room.area} m²</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <span>Số người tối đa: {room.maxOccupants}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-home"></i>
                  <span>Thuộc: {room.house.name}</span>
                </div>
              </div>

              <div className="description mt-4">
                <h5>Mô tả</h5>
                <p>{room.description}</p>
              </div>

              <div className="action-buttons mt-4">
                <Button
                  variant="outline-secondary"
                  className="me-3"
                  onClick={() => navigate("/owner/room")}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Quay lại
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate(`/owner/room/update/${room.id}`, { state: room })
                  }
                >
                  <i className="fas fa-edit me-2"></i>
                  Chỉnh sửa
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailRoom;
