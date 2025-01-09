import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Container,
  Row,
  Col,
  Badge,
  Spinner,
  Button,
} from "react-bootstrap";
import { getUserById } from "../../../service/userService";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);
        setUser(response.DT);
      } catch (err) {
        setError("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  if (!user) {
    return <div className="text-center">Không tìm thấy người dùng</div>;
  }

  const getValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return (
        <Badge bg="info" className="text-white">
          N/A
        </Badge>
      );
    }

    if (typeof value === "string" && value.includes("T")) {
      // Format ISO date strings to 'YYYY-MM-DD'
      return new Date(value).toLocaleDateString();
    }

    return value;
  };

  const handleEditClick = () => {
    navigate(`/admin/users/${id}/update`, { state: { user } });
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Thông tin chi tiết</h4>
          <Button size="sm" variant="primary" onClick={handleEditClick}>
            Edit
          </Button>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <strong>Họ tên:</strong> {getValue(user.fullName)}
              </p>
              <p>
                <strong>Email:</strong> {getValue(user.email)}
              </p>
              <p>
                <strong>Số CCCD:</strong> {getValue(user.citizenNumber)}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                {user.user_roles?.[0]?.role?.name ? (
                  <Badge
                    bg={
                      user.user_roles[0].role.name === "Admin"
                        ? "primary"
                        : user.user_roles[0].role.name === "Owner"
                        ? "success"
                        : "info"
                    }
                  >
                    {user.user_roles[0].role.name}
                  </Badge>
                ) : (
                  <Badge bg="info" className="text-white">
                    N/A
                  </Badge>
                )}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Phone Number:</strong> {getValue(user.phone)}
              </p>
              <p>
                <strong>Date of Birth:</strong> {getValue(user.dateOfBirth)}
              </p>
              <p>
                <strong>Gender:</strong>{" "}
                {user.gender === false ? (
                  "Nữ"
                ) : user.gender === true ? (
                  "Nam"
                ) : (
                  <Badge bg="info" className="text-white">
                    N/A
                  </Badge>
                )}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDetail;
