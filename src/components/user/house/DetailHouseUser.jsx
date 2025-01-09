import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../styles/DetailHouseUser.scss";
import { Badge, Modal } from "react-bootstrap";
import BookingRoom from "../booking/BookingRoom";
const DetailHouseUser = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  useEffect(() => {
fetchAllHouse();
  }, [id]);

 const fetchAllHouse = () =>{
  if (id) {
    fetch(`http://localhost:8080/api/v1/house/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setHouse(data.DT))
      .catch((error) => console.error("Error fetching house details:", error));
  }
 }

  if (!house) return <div className="loading">Loading...</div>;

  const statusMapping = {
    0: { text: "Còn trống", variant: "success" },
    1: { text: "Đã thuê", variant: "danger" },
    2: { text: "Bảo trì", variant: "warning" },
  };
  const handleRoomBooking = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedRoom(null);
  };
  return (
    <div className="house-detail-container">
      {/* Hero Section with Single Image */}
      <div className="hero-section">
        {house.avatar ? (
          <div className="main-image-container">
            <img src={house.avatar} alt="House Avatar" className="main-image" />
          </div>
        ) : (
          <div className="no-image">No image available</div>
        )}
        <div className="hero-content">
          <h1>{house.name}</h1>
          <p className="address">
            <i className="fas fa-map-marker-alt"></i>
            {house.address}, {house.ward.name}
          </p>
          <div className="status-badge" data-status={house.status}>
            {house.status === 1
              ? "Đang hoạt động"
              : house.status === 2
              ? "Đang sửa chữa"
              : "Ngừng hoạt động"}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Property Overview */}
        <section className="property-overview">
          <h2>Tổng quan</h2>
          <div className="overview-grid">
            <div className="overview-item">
              <i className="fas fa-bed"></i>
              <span>Phòng: {house?.rooms?.length}</span>
            </div>
            <div className="overview-item">
              <i className="fas fa-stairs"></i>
              <span>Tầng: {house.numberOfFloors}</span>
            </div>
            <div className="overview-item">
              <i className="fas fa-vector-square"></i>
              <span>Diện tích: {house.area}m²</span>
            </div>
            <div className="overview-item">
              <i className="fas fa-calendar-alt"></i>
              <span>Năm xây dựng: {house.yearBuilt}</span>
            </div>
            <div className="overview-item">
              <i className="fas fa-location-arrow"></i>
              <span>Kinh độ: {house.longitude}</span>
            </div>
            <div className="overview-item">
              <i className="fas fa-location-arrow"></i>
              <span>Vĩ độ: {house.latitude}</span>
            </div>
            <div className="overview-item">
              <i className="fas fa-map-marked-alt"></i>
              <span>
                {house.region === 1
                  ? "Khu dân cư"
                  : house.region === 2
                  ? "Khu công nghiệp"
                  : "Khu quy hoạch"}
              </span>
            </div>
            <div className="overview-item">
              <i className="fas fa-map-pin"></i>
              <span> {house.position}</span>
            </div>
            <div className="overview-item description-item">
              <i className="fas fa-file-alt"></i>
              <span>{house.description}</span>
            </div>
          </div>
        </section>

        <section className="property-overview">
          <h2>Thông tin chủ nhà</h2>
          <div className="overview-grid">
            <div className="overview-item">
              <i className="fas fa-user"></i>
              <span>{house.owner.fullName}</span>
            </div>
            <div className="overview-item">
              <i className="fas fa-phone"></i>
              <span>{house.owner.phone}</span>
            </div>
            <div className="overview-item">
              <i className="fas fa-envelope"></i>
              <span>{house.owner.email}</span>
            </div>
          </div>
        </section>

        {/* Room Listings */}
        <section className="property-overview room-listings">
          <h2>Phòng</h2>
          <div className="rooms-grid">
            {house.rooms?.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-image">
                  <img
                    src={room.avatar || "default-room-image.jpg"}
                    alt={room.name}
                  />
                </div>
                <div className="room-info">
                  <h3 className="room-title">{room.name}</h3>
                  <div className="room-details">
                    <Badge
                      bg={statusMapping[room.status].variant}
                      className="mb-3 px-3 py-2 text-white"
                    >
                      {statusMapping[room.status].text}
                    </Badge>
                    <span>
                      <i className="fas fa-dollar-sign"></i> {room.monthlyRent}
                      vnd /tháng
                    </span>
                    <span>
                      <i className="fas fa-vector-square"></i>
                      <span>{room.area} m²</span>
                    </span>
                    <span>
                      <i className="fas fa-users"></i>
                      {room.maxOccupants}
                    </span>
                  </div>
                  <button
                    className="book-now-btn"
                    onClick={() => handleRoomBooking(room)}
                    disabled={room.status == 1}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Modal show={showBookingModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {selectedRoom && (
            <BookingRoom
              roomData={selectedRoom}
              onClose={handleCloseModal}
              fetchAllHouse={fetchAllHouse}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DetailHouseUser;
