import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaHome,
  FaUsers,
  FaMoneyBillWave,
  FaExpandArrowsAlt,
} from "react-icons/fa";
import DeleteRoom from "./DeleteRoom";
import "../../../styles/ListRoom.scss";
const ListRoomOwner = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // State để lưu từ khóa tìm kiếm
  const [statusFilter, setStatusFilter] = useState("");
  const [houses, setHouses] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [houseFilter, setHouseFilter] = useState("");
  const auth = JSON.parse(localStorage.getItem("auth"));
  const itemsPerPage = 6;

  const navigate = useNavigate();

  // Hàm lấy dữ liệu từ API
  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/room");
      console.log(response)
      if (response && response.data.DT) {
        const listRoomByOwner = response.data.DT.filter(
          (room) => room.house.owner.citizenNumber === auth.id
        );
        console.log("listRoomByOwner ", listRoomByOwner);
        if (listRoomByOwner.length > 0) {
          setRooms(listRoomByOwner);
        }
      }

     
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phòng:", error);
    }
  };

  const fetchHouses = async () => {
    let { data } = await axios.get("http://localhost:8080/api/v1/house");
    if (data && data.DT) {
      const listHouseByOwner = data.DT.filter(
        (house) => house.owner.citizenNumber === auth.id
      );
      console.log("listHouseByOwner ", listHouseByOwner);
      if (listHouseByOwner.length > 0) {
        setHouses(listHouseByOwner);
      }
    }
  };
  useEffect(() => {
    fetchRooms();
    fetchHouses();
  }, []);

  const handleViewDetails = (roomId) => {
    navigate(`/owner/room/${roomId}`);
  };

  const handleDeleteRoom = (room) => {
    setSelectedRoom(room);
    setShowDeleteModal(true);
  };

  const filteredRooms = rooms
    .filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((room) => {
      return statusFilter ? room.status === parseInt(statusFilter) : true;
    })
    .filter((room) => {
      return houseFilter ? room.house.id === parseInt(houseFilter) : true;
    });
  const pageCount = Math.ceil(filteredRooms.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentRooms = filteredRooms.slice(offset, offset + itemsPerPage);

  const statusMapping = {
    0: "Còn trống",
    1: "Đã thuê",
    2: "Bảo trì",
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, statusFilter, houseFilter]);

  const handleDeleteSuccess = (roomId) => {
    const updatedRooms = rooms.filter((room) => room.id !== roomId);
    setRooms(updatedRooms);
    setCurrentPage(0);
    setShowDeleteModal(false);
  };

  return (
    <Container fluid className="list-room-container py-4">
      <div className="dashboard-header">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title">Danh sách phòng của {auth.fullName}</h1>
          <Button
            className="btn-add-room"
            onClick={() => navigate("/owner/room/create")}
          >
            <FaPlus /> Thêm phòng mới
          </Button>
        </div>

        <Row className="search-filters mb-4">
          <Col lg={4} md={6} className="mb-3">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Tìm kiếm phòng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Col>

          <Col lg={4} md={6} className="mb-3">
            <div className="filter-select">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="0">Còn trống</option>
                <option value="1">Đã thuê</option>
                <option value="2">Bảo trì</option>
              </Form.Select>
            </div>
          </Col>

          <Col lg={4} md={6} className="mb-3">
            <div className="filter-select">
              <Form.Select
                value={houseFilter}
                onChange={(e) => setHouseFilter(e.target.value)}
              >
                <option value="">Tất cả nhà</option>
                {houses.map((house) => (
                  <option key={house.id} value={house.id}>
                    {house.name}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Col>
        </Row>
      </div>

      <Row className="rooms-grid">
        {currentRooms && currentRooms.length > 0 ? (
          currentRooms.map((room) => (
            <Col key={room.id} lg={4} md={6} className="mb-4">
              <Card className="room-card">
                <div className="room-image">
                  <img
                    src={room.avatar || "https://via.placeholder.com/300x200"}
                    alt={room.name}
                    className="card-img-top"
                  />
                  <Badge className={`status-badge status-${room.status}`}>
                    {statusMapping[room.status]}
                  </Badge>
                </div>

                <Card.Body>
                  <Card.Title className="room-title">{room.name}</Card.Title>

                  <div className="room-details">
                    <div className="detail-item">
                      <FaExpandArrowsAlt />
                      <span>{room.area} m²</span>
                    </div>
                    <div className="detail-item">
                      <FaUsers />
                      <span>{room.maxOccupants} người</span>
                    </div>
                    <div className="detail-item">
                      <FaMoneyBillWave />
                      <span>{room.monthlyRent.toLocaleString()} VND/tháng</span>
                    </div>
                    <div className="detail-item">
                      <FaHome />
                      <span>{room.house.name}</span>
                    </div>
                  </div>

                  <p className="room-description">{room.description}</p>

                  <div className="card-actions">
                    <Button
                      variant="primary"
                      className="btn-view"
                      onClick={() => handleViewDetails(room.id)}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      variant="danger"
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoom(room);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <div className="no-results">
              <i className="fas fa-search mb-3"></i>
              <h3>Không tìm thấy phòng phù hợp</h3>
              <p>Vui lòng thử tìm kiếm với tiêu chí khác</p>
            </div>
          </Col>
        )}
      </Row>

      <DeleteRoom
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        roomData={selectedRoom}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {pageCount > 1 && (
        <div className="pagination-wrapper">
          <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
            previousLabel={"←"}
            nextLabel={"→"}
          />
        </div>
      )}
    </Container>
  );
};

export default ListRoomOwner;
