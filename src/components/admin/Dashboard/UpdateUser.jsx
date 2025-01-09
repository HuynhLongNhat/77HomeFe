import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { getUserById, updateUser } from "../../../service/userService";
import { toast } from "react-toastify";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Predefined roles
  const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Owner" },
    { id: 3, name: "Renter" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getUserById(id);
        const userData = userResponse.DT;
        console.log("data updated", userData);

        // Handle gender conversion from boolean to "0" (Nam) or "1" (Nữ)
        const genderValue =
          userData.gender === true ? "0" : userData.gender === false ? "1" : "";

        // Check if dateOfBirth exists and format it correctly (ensure it's in YYYY-MM-DD format)
        const formattedDateOfBirth = userData.dateOfBirth
          ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
          : "";

        setUser(userData);
        setSelectedRole(userData.user_roles?.[0]?.roles_id || "");
        setFullName(userData.fullName || "");
        setDateOfBirth(formattedDateOfBirth); // Set the formatted date here
        setGender(genderValue);
      } catch (err) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataUser = {
      fullName,
      dateOfBirth,
      gender: gender === "0" ? true : gender === "1" ? false : null, // Convert gender to boolean
      role_id: selectedRole,
    };
    try {
      await updateUser(id, dataUser);
      toast.success("User updated successfully");
      navigate(`/admin/users/${id}`);
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

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
    return (
      <Container className="py-4">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h3 className="text-center">Update User Information</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formDateOfBirth">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    as="select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="0">Nam</option>
                    <option value="1">Nữ</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formRole">
                  <Form.Label>Select Role</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3" block>
                  Update User
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateUser;
