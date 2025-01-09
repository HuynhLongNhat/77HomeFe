/* eslint-disable react/prop-types */
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Dropdown,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import { Range } from "react-range";
import "../../../styles/ListHouse.scss";
import { useNavigate } from "react-router-dom";
import DeleteBuilding from "./DeleteBuilding";
import { getAllWard } from "../../../service/wardService";
import { getAllBuilding } from "../../../service/buildingService";
import "../../../styles/Building.scss";
const ListBuildingOwner = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));

  const navigate = useNavigate();
  const [wardList, setWardList] = useState([]);
  const [ListBuilding, setListBuilding] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredbuildings, setFilteredbuildings] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");

  const [areaSizeRange, setAreaSizeRange] = useState([0, 10000]);
  const [searchYear, setSearchYear] = useState();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpenModalDelete, setOpenModalDelete] = useState(false);
  const [buildingData, setbuildingData] = useState([]);
  const itemsPerPage = 3;

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredbuildings.slice(offset, offset + itemsPerPage);

  useEffect(() => {
    fetchAllWard();
    fetchAllListBuilding();
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
    const res = await getAllWard();

    if (res && res.DT) {
      setWardList(res.DT);
    }
  };

  const fetchAllListBuilding = async () => {
    const res = await getAllBuilding();
    if (res && res.DT) {
      const filteredBuildings = res.DT.filter(
        (building) => building.createdBy_user.citizenNumber === auth.id
      );
 console.log("filteredBuildings ", filteredBuildings);
      if (filteredBuildings.length > 0) {
        setListBuilding(filteredBuildings);
        setFilteredbuildings(filteredBuildings);
      }
    }
  };


  const filterBuildings = () => {
    return ListBuilding.filter((building) => {
      const buildingName = building.name.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = !searchTerm || buildingName.includes(searchTermLower);

      const areaSize =
        typeof building.area === "string"
          ? parseInt(building.area.replace(/\D/g, ""), 10)
          : building.area;
      const areaSizeMatch =
        areaSize >= areaSizeRange[0] && areaSize <= areaSizeRange[1];

      const parsedSearchYear = parseInt(searchYear, 10);
      const yearMatch =
        !searchYear ||
        (parsedSearchYear && building.yearBuilt === parsedSearchYear);
      // console.log("abc :", building.yearBuilt, searchYear);
      const statusMatch =
        selectedStatus === "" ||
        building.status === parseInt(selectedStatus, 10);

      const wardMatch =
        selectedWard === "" || building.ward_id === parseInt(selectedWard, 10);
      console.log("selected ward", building.ward_id, selectedWard);
      return (
        nameMatch && areaSizeMatch && statusMatch && yearMatch && wardMatch
      );
    });
  };

  const handleSearch = () => {
    const filteredbuildings = filterBuildings();
    console.log("filteredbuildings", filteredbuildings);
    setFilteredbuildings(filteredbuildings);
    setCurrentPage(0);
  };

  const handleViewDetail = (buildingId) => {
    navigate(`/owner/building/${buildingId}`);
  };

  const handleTongleModalConfirm = () => {
    setOpenModalDelete(!isOpenModalDelete);
  };
  const handleDeletebuilding = (building) => {
    handleTongleModalConfirm(isOpenModalDelete);
    setbuildingData(building);
  };

  return (
    <Container className="mt-4">
      <Button
        className="btn-create-new"
        variant="primary"
        onClick={() => navigate("/owner/building/create")}
      >
        Thêm tòa nhà
      </Button>
      {/* Tiêu đề */}
      <h1 className="text-center mb-4">Danh sách tòa nhà của {auth.fullName}</h1>

      {/* Thanh tìm kiếm */}

      <Row className="mb-3 ">
        <Col md={2}>
          <Form.Control
            type="text"
            className="custom-form-control"
            placeholder="Tòa nhà"
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
              <div className="d-flex justify-content-center flex-wrap mt-3">
                <Range
                  step={1}
                  min={0}
                  max={10000}
                  values={areaSizeRange}
                  onChange={(values) => setAreaSizeRange(values)}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        // eslint-disable-next-line react/prop-types
                        ...props.style,
                        height: "6px",
                        width: "100%",
                        backgroundColor: "#ccc",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: `${(areaSizeRange[0] / 10000) * 100}%`,
                          width: `${
                            ((areaSizeRange[1] - areaSizeRange[0]) / 10000) *
                            100
                          }%`,
                          height: "100%",
                          backgroundColor: "#007bff",
                          transition: "all 0.3s ease",
                        }}
                      />
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
                        border: "2px solid #007bff",
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
          <Form.Control
            type="text"
            className="custom-form-control"
            placeholder="Năm xây dựng"
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
          />
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
      <Row className="mt-5 custom-row-height">
        {currentItems && currentItems.length > 0 ? (
          currentItems.map((building) => (
            <Col md={12} key={building.id} className="mb-3">
              <Card className="p-3">
                <Row>
                  <Col md={4}>
                    <Card.Img
                      variant="top"
                      src={building.avatar}
                      alt={`Hình ảnh của ${building.name}`}
                      className="image-building"
                      onClick={() => handleViewDetail(`${building.id}`)}
                    />
                  </Col>
                  <Col md={8} className="text-start">
                    <Card.Body>
                      <Card.Title>{building.name}</Card.Title>
                      <Card.Text>
                        <b>Mô tả:</b> {truncateText(building.description, 85)}
                        <br />
                        <span>
                          <b>Địa chỉ:</b> {building.address} ,
                          <span>phường </span>
                          {building.ward.name}
                        </span>
                        <br />
                        <span>
                          <b>Diện tích:</b> {building.area} m<sup>2</sup>
                        </span>
                        <br />
                        <span>
                          <b>Năm xây dựng:</b> {building.yearBuilt}
                        </span>
                        <br />
                        <span>
                          <b>Trạng thái:</b> {statusMapping[building.status]}
                        </span>
                      </Card.Text>
                      <Button
                        variant="danger"
                        className="px-4 mt-2"
                        onClick={() => handleDeletebuilding(building)}
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
          <div className="text-center fs-5 fw-bold">
            Không có nhà trọ phù hợp!
          </div>
        )}
      </Row>
      <ReactPaginate
        previousLabel="Trước"
        nextLabel="Sau"
        onPageChange={handlePageClick}
        pageCount={Math.ceil(filteredbuildings.length / itemsPerPage)}
        containerClassName="pagination"
        activeClassName="active"
        disabledClassName="disabled"
      />

      <DeleteBuilding
        show={isOpenModalDelete}
        handleClose={handleTongleModalConfirm}
        buildingData={buildingData}
        fetchAllListBuilding={fetchAllListBuilding}
      />
    </Container>
  );
};

export default ListBuildingOwner;
