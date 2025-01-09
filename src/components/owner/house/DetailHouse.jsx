import { Row, Col, Button, ListGroup, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../../../styles/DetailHouse.scss";
import { getHouseDetail } from "../../../service/houseService";

const DetailHouse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detailHouse, setDetailHouse] = useState({});

  useEffect(() => {
    fetchHouseById();
  }, []);

  const fetchHouseById = async () => {
    try {
      const res = await getHouseDetail(id);
      console.log("data", res.DT);
      if (res && res.DT) {
        setDetailHouse(res.DT);
      }
    } catch (error) {
      console.error("Error fetching house by ID:", error);
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
    <Card className="p-4">
      <Row className="p-3 mb-5 bg-white rounded shadow-sm">
        <Col
          md={4}
          className="d-flex justify-content-center align-items-center px-2"
        >
          {detailHouse.avatar ? (
            <Card.Img
              variant="top"
              src={detailHouse.avatar}
              alt="House avatar"
              className="img-fluid rounded"
            />
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <FaImage className="image-house-detail" />
            </div>
          )}
        </Col>
        <Col md={8}>
          <Card.Body>
            {/* Row 1: Basic Information */}
            <Row>
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Tên:</strong>{" "}
                    {detailHouse.name || "Không có dữ liệu"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Địa chỉ:</strong> {detailHouse.address},
                    <span> phường {detailHouse?.ward?.name || ""}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Năm xây dựng:</strong>{" "}
                    {detailHouse.yearBuilt || "Không có dữ liệu"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Mô tả:</strong>{" "}
                    {detailHouse.description || "Không có mô tả"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Số tầng:</strong>{" "}
                    {detailHouse.numberOfFloors || "Không có dữ liệu"}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Số phòng:</strong>{" "}
                    {detailHouse.numberRooms || "Không có dữ liệu"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Diện tích:</strong>{" "}
                    {detailHouse.area || "Không có dữ liệu"} m<sup>2</sup>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Trạng thái:</strong>{" "}
                    {statusMapping[detailHouse.status] || "Không có dữ liệu"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Tọa độ:</strong> Kinh độ:
                    {detailHouse.longitude || "Không có dữ liệu"}, Vĩ độ:
                    {detailHouse.latitude || "Không có dữ liệu"}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
            {/* Row 2: Additional Information */}
            <Row className="mt-4">
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Khu vực:</strong>{" "}
                    {regionMapping[detailHouse.region] || "Không có dữ liệu"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Vị trí:</strong>{" "}
                    {detailHouse.position || "Không có dữ liệu"}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Chủ sở hữu:</strong>{" "}
                    {detailHouse.owner?.fullName || "Không có dữ liệu"}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
            {/* Buttons */}
            <div className="mt-4 mx-2">
              <Button
                variant="warning"
                onClick={() =>
                  navigate(`/owner/house/update/${detailHouse.id}`, {
                    state: detailHouse,
                  })
                }
              >
                Chỉnh sửa
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default DetailHouse;
