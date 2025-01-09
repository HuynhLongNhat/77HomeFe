import { useEffect, useState } from "react";
import { Form, Row, Col, Container, Button, Card } from "react-bootstrap";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { createNewRoom } from "../../../service/roomService";
import "../../../styles/CreateNewRoom.scss";
const CreateNewRoom = () => {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const auth = JSON.parse(localStorage.getItem("auth"));

  const schema = yup.object().shape({
    name: yup.string().required("Tên phòng không được để trống"),
    area: yup
      .number()
      .typeError("Diện tích không được để trống")
      .min(1, "Diện tích phải là số dương")
      .required("Diện tích không được để trống"),
    maxOccupants: yup
      .number()
      .typeError("Số người tối đa không được để trống")
      .min(1, "Số người tối đa phải là số dương")
      .required("Số người tối đa không được để trống"),
    monthlyRent: yup
      .number()
      .typeError("Giá thuê không được để trống")
      .min(1, "Giá thuê phải là số dương")
      .required("Giá thuê không được để trống"),
    description: yup.string().required("Mô tả không được để trống"),
    status: yup.string().required("Trạng thái không được để trống"),
    house_id: yup.string().required("Vui lòng chọn nhà"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  
  } = useForm({
    resolver: yupResolver(schema),
  });
  const fetchHouses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/house");
    if (response && response.data.DT) {
      const listHouseByOwner = response.data.DT.filter(
        (house) => house.owner.citizenNumber === auth.id
      );
      console.log("listHouseByOwner ", listHouseByOwner);
      if (listHouseByOwner.length > 0) {
        setHouses(listHouseByOwner);
      }
    }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà:", error);
    }
  };
  useEffect(() => {
    fetchHouses();
  }, []);
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0]; 
    if (!file) return;

    try {
      setAvatarPreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ssga5jml");
      formData.append("api_key", "963862276821583");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dbnofh9a8/image/upload`,
        formData
      );
      setPreviewUrls(response.data.secure_url); // Chỉ lưu một URL
    } catch (error) {
      console.error("Upload ảnh thất bại:", error);
      toast.error("Không thể tải ảnh lên. Vui lòng thử lại.");
    }
  };
    const onSubmit = async (data) => {
      console.log("Form Data:", data);
      console.log("Image URL:", previewUrls);
      if (previewUrls.length > 0) {
        try {
          // Chuẩn bị dữ liệu phòng
          const roomData = {
            ...data,
            avatar: previewUrls || "", // Đảm bảo avatar không undefined
          };

          const response = await createNewRoom(roomData);
          if (response && response.EC === 0) {
            toast.success("Thêm phòng mới thành công!");

            // Reset trạng thái và form
            setAvatarPreview(null);
            setPreviewUrls("");
            reset();
            navigate("/owner/room");
          } else {
            toast.error(response?.EM || "Thêm phòng thất bại!");
          }
        } catch (error) {
          console.error("Lỗi khi gửi dữ liệu:", error);
          toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
      }
    };

  return (
    <Container className="create-new-room-container py-5">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">Thêm Phòng Mới</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên phòng</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên phòng"
                    {...register("name")}
                    className="rounded-pill"
                  />
                  <p className="text-danger small">{errors.name?.message}</p>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Diện tích (m²)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập diện tích"
                    {...register("area")}
                    className="rounded-pill"
                  />
                  <p className="text-danger small">{errors.area?.message}</p>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số người tối đa</Form.Label>
                  <Form.Control
                    type="number"
                    {...register("maxOccupants")}
                    className="rounded-pill"
                  />
                  <p className="text-danger small">
                    {errors.maxOccupants?.message}
                  </p>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá thuê (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    {...register("monthlyRent")}
                    className="rounded-pill"
                  />
                  <p className="text-danger small">
                    {errors.monthlyRent?.message}
                  </p>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("description")}
                className="rounded"
              />
              <p className="text-danger small">{errors.description?.message}</p>
            </Form.Group>

            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select {...register("status")} className="rounded-pill">
                    <option value="">Chọn trạng thái</option>
                    <option value="0">Còn trống</option>
                    <option value="1">Đã thuê</option>
                    <option value="2">Bảo trì</option>
                  </Form.Select>
                  <p className="text-danger small">{errors.status?.message}</p>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nhà</Form.Label>
                  <Form.Select
                    {...register("house_id")}
                    className="rounded-pill"
                  >
                    <option value="">Chọn nhà</option>
                    {houses.map((house) => (
                      <option key={house.id} value={house.id}>
                        {house.name}
                      </option>
                    ))}
                  </Form.Select>
                  <p className="text-danger small">
                    {errors.house_id?.message}
                  </p>
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-4">
              <p className="mb-2">Hình ảnh phòng</p>
              <div className="image-upload-container">
                <label className="upload-label">
                  <FaCloudUploadAlt size={30} />
                  <span>Tải lên hình ảnh</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </label>
                <div className="image-preview-container">
                  {avatarPreview && (
                    <div className="preview-image-wrapper">
                      <img src={avatarPreview} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="secondary"
                className="btn-submit px-5  rounded-pill mx-2"
                onClick={() => navigate("/owner/room")}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="btn-submit px-5 rounded-pill"
              >
                Thêm
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateNewRoom;
