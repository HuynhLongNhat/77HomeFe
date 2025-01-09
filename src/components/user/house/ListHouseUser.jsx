import React, { useEffect, useState } from "react";
import "../../../styles/ListHouseUser.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListHouseUser = () => {
  const [houses, setHouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [housesPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState({
    active: false,
    repairing: false,
    inactive: false,
  });
  const [areaFilter, setAreaFilter] = useState({
    "0-200": false,
    "200-500": false,
    "500-1000": false,
    "1000+": false,
  });
  const [wardFilter, setWardFilter] = useState("");
  const [wards, setWards] = useState([]);
  const navigate = useNavigate();

  const fetchHouses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/house");
      if (response && response.data) {
        setHouses(response.data.DT);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà:", error);
    }
  };
  const fetchWards = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/ward/");
      if (response && response.data) {
        setWards(response.data.DT);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường/xã:", error);
    }
  };

  useEffect(() => {
    fetchWards();
    fetchHouses();
  }, []);

  const handleStatusChange = (event) => {
    const { name, checked } = event.target;
    setStatusFilter((prevFilter) => ({
      ...prevFilter,
      [name]: checked,
    }));
  };

  const handleAreaChange = (e) => {
    setAreaFilter((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleWardChange = (e) => {
    const selectedWardId = e.target.value;
    setWardFilter(selectedWardId);
  };

  // Xác định số lượng nhà cần hiển thị trên trang hiện tại
  const indexOfLastHouse = currentPage * housesPerPage;
  const indexOfFirstHouse = indexOfLastHouse - housesPerPage;

  // Lọc dữ liệu nếu cần (ví dụ: lọc theo trạng thái, khu vực, ...)
  const filteredHouses = houses.filter((house) => {
    const isNameMatch = house.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isStatusMatch =
      (statusFilter.active && house.status === 1) ||
      (statusFilter.repairing && house.status === 2) ||
      (statusFilter.inactive && house.status === 3) ||
      (!statusFilter.active &&
        !statusFilter.repairing &&
        !statusFilter.inactive);

    const isAreaMatch =
      (areaFilter["0-200"] && house.area >= 0 && house.area <= 200) ||
      (areaFilter["200-500"] && house.area >= 200 && house.area <= 500) ||
      (areaFilter["500-1000"] && house.area >= 500 && house.area <= 1000) ||
      (areaFilter["1000+"] && house.area >= 1000) ||
      !Object.values(areaFilter).includes(true);

    const isWardMatch = wardFilter
      ? house.ward.id === parseInt(wardFilter)
      : true;

    return isNameMatch && isStatusMatch && isAreaMatch && isWardMatch;
  });

  const currentHouses = filteredHouses.slice(
    indexOfFirstHouse,
    indexOfLastHouse
  );

  // Chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Xử lý điều kiện disable cho nút "Previous" và "Next"
  const isFirstPage = currentPage === 1;
  const isLastPage =
    currentPage === Math.ceil(filteredHouses.length / housesPerPage);

  return (
    <div className="app-container-user">
      <div className="content">
        <aside className="sidebar">
          <header className="search-header">
            <h3>Tìm kiếm</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm nhà theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </header>
          <hr></hr>
          <form className="filter-form">
            <h3>Trạng thái</h3>
            <ul>
              <li>
                <input
                  type="checkbox"
                  name="active"
                  checked={statusFilter.active}
                  onChange={handleStatusChange}
                />
                Đang hoạt động
              </li>
              <li>
                <input
                  type="checkbox"
                  name="repairing"
                  checked={statusFilter.repairing}
                  onChange={handleStatusChange}
                />
                Đang sửa chữa
              </li>
              <li>
                <input
                  type="checkbox"
                  name="inactive"
                  checked={statusFilter.inactive}
                  onChange={handleStatusChange}
                />
                Ngừng hoạt động
              </li>
            </ul>
            <hr></hr>
            <h3>Diện tích</h3>
            <ul>
              <li>
                <input
                  type="checkbox"
                  name="0-200"
                  checked={areaFilter["0-200"]}
                  onChange={handleAreaChange}
                />
                0 - 200 m²
              </li>
              <li>
                <input
                  type="checkbox"
                  name="200-500"
                  checked={areaFilter["200-500"]}
                  onChange={handleAreaChange}
                />
                200 - 500 m²
              </li>
              <li>
                <input
                  type="checkbox"
                  name="500-1000"
                  checked={areaFilter["500-1000"]}
                  onChange={handleAreaChange}
                />
                500 - 1000 m²
              </li>
              <li>
                <input
                  type="checkbox"
                  name="1000+"
                  checked={areaFilter["1000+"]}
                  onChange={handleAreaChange}
                />
                Trên 1000 m²
              </li>
            </ul>
            <hr></hr>
            <h3>Phường/Xã</h3>
            <select
              className="search-input"
              value={wardFilter}
              onChange={handleWardChange}
            >
              <option value="">Tất cả phường/xã</option>
              {wards.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name}
                </option>
              ))}
            </select>
          </form>
        </aside>
        <main className="house-list">
          {currentHouses.length > 0 ? (
            currentHouses.map((house) => (
              <div
                className="house-card"
                key={house.id}
                onClick={() => navigate(`/house/${house.id}`)}
              >
                <img
                  src={
                    house.avatar ||
                    "https://vanangroup.com.vn/wp-content/uploads/2024/05/Hinh-anh-phong-ngu-khach-san-binh-dan-vua-dep-vua-tiet-kiem.jpg"
                  }
                  alt={house.name}
                  className="house-image"
                />
                <div className="house-details">
                  <p
                    className={`house-type ${
                      house.status === 1
                        ? "available"
                        : house.status === 2
                        ? "repairing"
                        : "inactive"
                    }`}
                  >
                    {house.status === 1
                      ? "Đang hoạt động"
                      : house.status === 2
                      ? "Đang sửa chữa"
                      : "Ngừng hoạt động"}
                  </p>
                  <h2 className="house-name">{house.name}</h2>
                  <p className="house-description">
                    Mô tả: {house.description}
                  </p>
                  <p className="house-location">
                    Địa chỉ: {house.address}, phường {house.ward.name}
                  </p>
                  <p className="house-description">
                    Diện tích: {house.area} m<sup>2</sup>
                  </p>
                  <p className="house-description">
                 Năm xây dựng: {house.yearBuilt} m<sup>2</sup>
                  </p>

                  <p></p>
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy kết quả phù hợp.</p>
          )}

          {/* Pagination */}
          <div className="pagination">
            {/* Previous Button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={isFirstPage}
              className="pagination-button"
            >
              {"<<"}
            </button>

            {/* Page Numbers */}
            {Array.from({
              length: Math.ceil(filteredHouses.length / housesPerPage),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={isLastPage}
              className="pagination-button"
            >
              {">>"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListHouseUser;
