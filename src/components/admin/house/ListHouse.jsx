import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Dropdown,
} from "react-bootstrap";
import { getAllWard } from "../../../service/wardService";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

import { Range } from "react-range";
import "../../../styles/ListHouse.scss";
import { useNavigate } from "react-router-dom";
import DeleteHouse from "../../owner/house/DeleteHouse";
const ListHouse = () => {
  const navigate = useNavigate();
  const [wardList, setWardList] = useState([]);
  const [listHouse, setListHouse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [areaSizeRange, setAreaSizeRange] = useState([0, 500]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpenModalDelete, setOpenModalDelete] = useState(false);
  const [houseData, setHouseData] = useState([]);
  const itemsPerPage = 3;

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredHouses.slice(offset, offset + itemsPerPage);

  useEffect(() => {
    fetchAllWard();
    fetchAllListHouse();
  }, []);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const statusMapping = {
    1: "Đang hoạt động",
    2: "Đang sửa chữa",
    3: "Ngừng hoạt động",
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const fetchAllWard = async () => {
    const { DT } = await getAllWard();

    if (DT) {
      setWardList(DT);
    }
  };

  const fetchAllListHouse = async () => {
    const { data } = await axios.get("http://localhost:8080/api/v1/house");
    if (data) {
      setListHouse(data.DT);
      setFilteredHouses(data.DT);
    }
  };

  const filterHouses = () => {
    return listHouse.filter((building) => {
      const buildingName = building.name.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = !searchTerm || buildingName.includes(searchTermLower);

      const areaSize =
        typeof building.area === "string"
          ? parseInt(building.area.replace(/\D/g, ""), 10)
          : building.area;
      const areaSizeMatch =
        areaSize >= areaSizeRange[0] && areaSize <= areaSizeRange[1];

      const housePrice = building.price
        ? parseInt(building.price.replace(/\D/g, ""), 10)
        : 0; // Default to 0 if price is undefined or invalid
      const priceMatch =
        housePrice >= priceRange[0] * 1000000 &&
        housePrice <= priceRange[1] * 1000000;

      const statusMatch =
        selectedStatus === "" ||
        building.status === parseInt(selectedStatus, 10);

      const wardMatch =
        selectedWard === "" || building.ward_id === parseInt(selectedWard, 10);

      return (
        nameMatch && areaSizeMatch && statusMatch && priceMatch && wardMatch
      );
    });
  };

  const handleSearch = () => {
    const filteredHouses = filterHouses();
    setFilteredHouses(filteredHouses);
    setCurrentPage(0); // Reset to the first page when applying filters
  };

  const handleViewDetail = (houseId) => {
    navigate(`/admin/house/${houseId}`);
  };

  const handleTongleModalConfirm = () => {
    setOpenModalDelete(!isOpenModalDelete);
  };
  const handleDeleteHouse = (house) => {
    handleTongleModalConfirm(isOpenModalDelete);
    setHouseData(house);
  };

  const handleDeleteSuccess = (houseId) => {
    const updatedList = listHouse.filter((house) => house.id !== houseId);
    setListHouse(updatedList);
    setFilteredHouses(updatedList);
    setOpenModalDelete(false);
  };

  return (
    <Container className="mt-4">
      <Button
        className="btn-create-new"
        variant="primary"
        onClick={() => navigate("/admin/house/create")}
      >
        Thêm nhà trọ
      </Button>
      {/* Tiêu đề */}
      <h1 className="text-center mb-4">Danh sách nhà trọ</h1>

      {/* Thanh tìm kiếm */}

      <Row className="mb-3 ">
        <Col md={2}>
          <Form.Control
            type="text"
            className="custom-form-control"
            placeholder="Nhà trọ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>

        <Col md={2}>
          <Dropdown className="border rounded">
            <Dropdown.Toggle variant="none" className="custom-dropdown-toggle">
              Chọn diện tích
            </Dropdown.Toggle>

            <Dropdown.Menu className="custom-dropdown-menu">
              <h5 className="fw-bold">Diện tích</h5>
              <Row>
                <Col md={6}>
                  <span className="fw-bold px-1">
                    Từ: {areaSizeRange[0]} m<sup>2</sup>
                  </span>
                  <Form.Control
                    className="mt-2"
                    type="number"
                    value={areaSizeRange[0]}
                    readOnly
                  />
                </Col>
                <Col md={6}>
                  <span className="fw-bold px-1">
                    Đến: {areaSizeRange[1]} m<sup>2</sup>
                  </span>
                  <Form.Control
                    className="mt-2"
                    type="number"
                    value={areaSizeRange[1]}
                    readOnly
                  />
                </Col>
              </Row>
              <div className="slider-container mt-4">
                <Range
                  step={1}
                  min={0}
                  max={500}
                  values={areaSizeRange}
                  onChange={(values) => setAreaSizeRange(values)}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "6px",
                        width: "100%",
                        backgroundColor: "#ccc",
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "20px",
                        width: "20px",
                        backgroundColor: "#007bff",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    />
                  )}
                />
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col md={2}>
          <Dropdown className="border rounded ">
            <Dropdown.Toggle variant="none" className="custom-dropdown-toggle">
              Chọn mức giá
            </Dropdown.Toggle>

            <Dropdown.Menu className="custom-dropdown-menu">
              <h5 className="fw-bold ">Mức giá</h5>
              <Row>
                <Col md={6}>
                  <span className="fw-bold px-1">
                    Từ: {priceRange[0]} triệu
                  </span>
                  <Form.Control
                    className="mt-2"
                    type="number"
                    value={priceRange[0]}
                    readOnly
                  />
                </Col>
                <Col md={6}>
                  <span className="fw-bold px-1">
                    Đến: {priceRange[1]} triệu
                  </span>
                  <Form.Control
                    className="mt-2"
                    type="number"
                    value={priceRange[1]}
                    readOnly
                  />
                </Col>
              </Row>
              <div className="slider-container mt-4">
                <Range
                  step={1}
                  min={0}
                  max={100}
                  values={priceRange}
                  onChange={(values) => setPriceRange(values)}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "6px",
                        width: "100%",
                        backgroundColor: "#ccc",
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "20px",
                        width: "20px",
                        backgroundColor: "#007bff",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    />
                  )}
                />
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col md={2}>
          <Form.Select
            className="custom-form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Chọn trạng thái</option>
            <option value="1">Đang hoạt động</option>
            <option value="2">Đang sửa chữa</option>
            <option value="3">Ngừng hoạt động</option>
            {/* Thêm các trạng thái khác nếu cần */}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            className="no-scrollbar custom-form-select"
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
          >
            <option value="">Chọn phường</option>
            {wardList.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2} className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Col>
      </Row>

      {/* Danh sách nhà trọ */}
      <Row className="mt-5">
        {currentItems && currentItems.length > 0 ? (
          currentItems.map((house, index) => (
            <Col md={12} key={house.id} className="mb-3">
              <Card className="p-3">
                <Row>
                  <Col md={4}>
                    <Card.Img
                      variant="top"
                      src={house.avatar}
                      alt={`Hình ảnh của ${house.name}`}
                      className="image-house"
                      onClick={() => handleViewDetail(house.id)}
                    />
                  </Col>
                  <Col md={8} className="text-start">
                    <Card.Body>
                      <Card.Title>{house.name}</Card.Title>
                      <Card.Text>
                        <b>Năm xây dựng:</b> <span>{house.yearBuilt}</span>{" "}
                        <br />
                        <b>Mô tả:</b> {truncateText(house.description, 85)}
                        <br />
                        <span>
                          <b>Địa chỉ:</b> {house.address}
                        </span>
                        <br />
                        <span>
                          <b>Diện tích:</b> {house.area} m<sup>2</sup>
                        </span>
                        <br />
                        <span>
                          <b>Trạng thái:</b> {statusMapping[house.status]}
                        </span>
                      </Card.Text>
                      <Button
                        variant="danger"
                        className="px-4 mt-2"
                        onClick={() => handleDeleteHouse(house)}
                      >
                        Xóa
                      </Button>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))
        ) : (
          <div className="text-center fs-5  fw-bold">
            Không có nhà trọ phù hợp!
          </div>
        )}
      </Row>
      <ReactPaginate
        previousLabel="Trước"
        nextLabel="Sau"
        onPageChange={handlePageClick}
        pageCount={Math.ceil(filteredHouses.length / itemsPerPage)}
        containerClassName="pagination"
        activeClassName="active"
        disabledClassName="disabled"
      />

      <DeleteHouse
        show={isOpenModalDelete}
        handleClose={handleTongleModalConfirm}
        houseData={houseData}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </Container>
  );
};

export default ListHouse;
