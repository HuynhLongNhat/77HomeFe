import { Row, Col, Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../../../styles/DetailBuilding.scss";
import { getBuildingDetail } from "../../../service/buildingService";
const DetailBuildingAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detailBuilding, setDetailBuilding] = useState({}); // Chuyển sang object

  useEffect(() => {
    fetchBuildingById();
  }, []);

  const fetchBuildingById = async () => {
    try {
      const res = await getBuildingDetail(id);
      console.log("data", res.DT);
      if (res && res.DT) {
        setDetailBuilding(res.DT);
      }
    } catch (error) {
      console.error("Error fetching building by ID:", error);
    }
  };
  const statusMapping = {
    1: "Đang hoạt động",
    2: "Đang sửa chữa",
    3: "Ngừng hoạt động",
  };
  const regionMapping = {
    1: "Khu dân cư",
    2: "Khu công nghiệp",
    3: "Khu quy hoạch",
  };

  return (
    <Container className="p-4">
      <Row className="p-3 mb-5 bg-white rounded shadow-sm">
        <Col
          md={6}
          className="d-flex justify-content-center align-items-center mb-4 mb-md-0"
        >
          {detailBuilding.avatar ? (
            <img
              src={detailBuilding.avatar}
              className="image-house-detail img-fluid rounded"
              alt={`Hình ảnh của ${detailBuilding.name}`}
            />
          ) : (
            <FaImage className="image-house-detail" size={200} />
          )}
        </Col>
        <Col md={6}>
          <h3 className="mb-4">{detailBuilding.name || "Chưa cập nhật"}</h3>
          <Row>
            {" "}
            {/* Sử dụng Row để sắp xếp thông tin */}
            <Col xs={6} className="mb-2">
              <strong>Địa chỉ:</strong> {detailBuilding.address || "N/A"},
              <span> phường {detailBuilding?.ward?.name || "N/A"}</span>{" "}
              {/* Hiển thị tên phường */}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Diện tích:</strong> {detailBuilding.area || "N/A"} m²
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Số tầng:</strong> {detailBuilding.numberOfFloors || "N/A"}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Năm xây dựng:</strong> {detailBuilding.yearBuilt || "N/A"}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Kinh độ:</strong> {detailBuilding.longitude || "N/A"}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Vĩ độ:</strong> {detailBuilding.latitude || "N/A"}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Khu vực:</strong>{" "}
              {regionMapping[detailBuilding.region] || "N/A"}
            </Col>
            <Col xs={12} className="mb-2">
              <strong>Mô tả:</strong>{" "}
              {detailBuilding.description || "Chưa có mô tả"}
            </Col>
            <Col xs={6} className="mb-3">
              <strong>Trạng thái:</strong>{" "}
              {statusMapping[detailBuilding.status] || "N/A"}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Người tạo:</strong>{" "}
              {detailBuilding?.createdBy_user?.fullName || "Không có dữ liệu"}
            </Col>
            <Col>
              <div>
                <strong>Thông tin liên lạc:</strong>
                <p className="mb-1">
                  <strong> Tên chủ trọ</strong>:{" "}
                  {detailBuilding.ownerRepresent || "Không có dữ liệu"}
                </p>
                <p>
                  <strong>Email</strong>:{" "}
                  {detailBuilding.owner?.email || "Chưa có dữ liệu"}
                </p>
              </div>
            </Col>
          </Row>
          <Button
            variant="warning"
            onClick={() =>
              navigate(`/admin/building/update/${detailBuilding.id}`, {
                state: detailBuilding,
              })
            }
          >
            Chỉnh sửa
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailBuildingAdmin;
