import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Form,
  Pagination,
} from "react-bootstrap";
import { getAllUsers } from "../../../service/userService";
import styles from "./UserList.module.css";
import { useNavigate } from "react-router-dom";
import DeleteUser from "./DeleteUser";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.DT);
      setLoading(false);
    } catch (err) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.citizenNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.Item
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </Pagination.Item>

        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;
          if (pageNumber === currentPage || pageNumber === currentPage + 1) {
            return (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            );
          }
          return null;
        })}

        <Pagination.Item
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </Pagination.Item>
      </Pagination>
    );
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = (userId) => {
    setUsers(users.filter((user) => user.citizenNumber !== userId));
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
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className={`${styles["d-flex"]} m-2`}>
      <div className={styles["main-content"]}>
        <Container fluid>
          <Card className="mb-4">
            <Card.Body>
              <Form>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Tìm kiếm bằng email, name, hoặc citizen number..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          <Card className={styles.card}>
            <Card.Header className={styles["card-header"]}>
              <h5 className="mb-0">Danh sách người dùng</h5>
            </Card.Header>
            <Card.Body className={styles["card-body"]}>
              <Table responsive hover className={styles.table}>
                <thead>
                  <tr>
                    <th>Citizen Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.citizenNumber}>
                      <td>{user.citizenNumber}</td>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge
                          bg={
                            user.user_roles?.[0]?.role?.name === "Admin"
                              ? "primary"
                              : user.user_roles?.[0]?.role?.name === "Owner"
                              ? "success"
                              : "info"
                          }
                          className={styles.badge}
                        >
                          {user.user_roles?.[0]?.role?.name || "N/A"}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="info"
                          className={`${styles["btn-sm"]} me-2`}
                          onClick={() =>
                            navigate(`/admin/users/${user.citizenNumber}`)
                          }
                        >
                          View
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          className={styles["btn-sm"]}
                          onClick={() => handleDeleteUser(user)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {renderPagination()}
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Modal Xác Nhận Xóa */}
      {userToDelete && (
        <DeleteUser
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          userData={userToDelete}
          fetchAllListUser={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserList;
