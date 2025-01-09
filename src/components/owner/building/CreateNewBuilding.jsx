/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { Form, Row, Col, Container, InputGroup, Button } from "react-bootstrap";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "../../../styles/CreateNewHouse.scss";
import { getAllWard } from "../../../service/wardService";
import { getAllUsers } from "../../../service/userService";
import { createBuilding } from "../../../service/buildingService";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const schema = yup.object({
  name: yup.string().required("Tên toà nhà không được để trống!"),
  description: yup.string().required("Mô tả không được để trống!"),
  ward_id: yup.string().required("Phường/Xã không được để trống!"),
  address: yup.string().required("Số nhà, Tên đường không được để trống!"),
  yearBuilt: yup
    .number()
    .typeError("Năm xây dựng không được để trống!")
    .integer("Năm xây dựng phải là số nguyên!")
    .positive("Năm xây dựng phải là số dương!"),
  numberOfFloors: yup
    .number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .required("Số tầng không được để trống!")
    .integer("Số tầng phải là số nguyên!")
    .positive("Số tầng phải là số dương!"),
  area: yup
    .number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .required("Diện tích không được để trống!")
    .positive("Diện tích phải là số dương!"),
  longitude: yup.number().typeError("Kinh độ không được để trống!"),
  latitude: yup.number().typeError("Vĩ độ không được để trống!"),
  status: yup.string().required("Trạng thái không được để trống!"),
  region: yup.string().required("Vùng không được để trống!"),
  createdBy: yup.string().required("Người tạo không được để trống!"),
  ownerRepresent: yup.string().required("Chủ sỡ hữu không được để trống!"),
  avatar: yup
    .mixed()
    .required("Vui lòng chọn hình ảnh toà nhà!")
    .test("fileType", "Vui lòng chọn ảnh PNG hoặc JPG!", (value) => {
      return (
        value && value[0] && ["image/png", "image/jpeg"].includes(value[0].type)
      );
    })
    .test("fileSize", "Dung lượng ảnh phải nhỏ hơn 5MB!", (value) => {
      return value && value[0] && value[0].size <= 5 * 1024 * 1024;
    }),
});

const CreateNewBuilding = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [wardList, setWardList] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [userList, setUserList] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const auth = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    fetchAllWard();
    fetchAllUser();
  }, []);
  useEffect(()=>{
   if(auth)  {
      setValue("createdBy", auth.id);
      setValue("ownerRepresent", auth.fullName);
   }
  } ,[auth])
  const fetchAllWard = async () => {
    const res = await getAllWard();
    if (res && res.DT) {
      setWardList(res.DT);
    }
  };
  const fetchAllUser = async () => {
    const res = await getAllUsers();

    if (res && res.DT) {
      setUserList(res.DT);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Hiển thị ảnh preview
    setAvatarPreview(URL.createObjectURL(file));

    // Upload ảnh lên Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ssga5jml");
    formData.append("api_key", "963862276821583");
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dbnofh9a8/image/upload`,
        formData
      );
      setAvatarUrl(response.data.secure_url);
    } catch (error) {
      console.error("Upload ảnh thất bại:", error);
    }
  };

  const onSubmit = async (data) => {
    console.log("data", data);
    console.log("avatar", avatarUrl);
if (avatarUrl.length > 0) {
  try {
    // Gọi createBuilding và chờ đợi kết quả
    const response = await createBuilding({
      name: data.name,
      address: data.address,
      area: data.area,
      createdBy: data.createdBy,
      description: data.description,
      yearBuilt: data.yearBuilt,
      numberOfFloors: data.numberOfFloors,
      status: data.status,
      ward_id: data.ward_id,
      ownerRepresent: data.ownerRepresent,
      longitude: data.longitude,
      latitude: data.latitude,
      region: data.region,
      avatar: avatarUrl,
    });

    if (response && response.EC === 0) {
      toast.success("Thêm toà nhà thành công!");
      setAvatarPreview("");
      reset();
      navigate("/owner/building");
    } else {
      toast.error("Thêm toà nhà thất bại!");
    }
  } catch (error) {
    console.error("Gửi dữ liệu thất bại:", error);
  }
}
  };

  return (
    <Container className="content-container">
      <h1 className="text-center mb-3">Thêm toà nhà</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="name">
              <Form.Label>Tên toà nhà</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên toà nhà"
                  {...register("name")}
                  isInvalid={errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={8}>
            <Form.Group controlId="description">
              <Form.Label>Mô tả</Form.Label>
              <InputGroup>
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="Mô tả toà nhà của bạn"
                  {...register("description")}
                  isInvalid={errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="ward">
              <Form.Label>Phường/Xã</Form.Label>
              <Form.Select
                className="no-scrollbar"
                {...register("ward_id")}
                isInvalid={errors.ward_id}
              >
                <option value="">Chọn phường/Xã</option>
                {wardList.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.ward_id?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="address">
              <Form.Label>Số nhà, Tên đường</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số nhà, tên đường"
                {...register("address")}
                isInvalid={errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="yearBuilt">
              <Form.Label>Năm xây dựng</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập năm xây dựng"
                {...register("yearBuilt")}
                isInvalid={errors.yearBuilt}
              />
              <Form.Control.Feedback type="invalid">
                {errors.yearBuilt?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="numberOfFloors">
              <Form.Label>Số tầng</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số tầng"
                {...register("numberOfFloors")}
                defaultValue={0}
                isInvalid={errors.numberOfFloors}
              />
              <Form.Control.Feedback type="invalid">
                {errors.numberOfFloors?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="area">
              <Form.Label>Diện tích (m²)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập diện tích"
                {...register("area")}
                defaultValue={0}
                isInvalid={errors.area}
              />
              <Form.Control.Feedback type="invalid">
                {errors.area?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="longitude">
              <Form.Label>Kinh độ</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập kinh độ"
                {...register("longitude")}
                isInvalid={errors.longitude}
              />
              <Form.Control.Feedback type="invalid">
                {errors.longitude?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="latitude">
              <Form.Label>Vĩ độ</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập vĩ độ"
                {...register("latitude")}
                isInvalid={errors.latitude}
              />
              <Form.Control.Feedback type="invalid">
                {errors.latitude?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="status">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Control
                as="select"
                {...register("status")}
                isInvalid={errors.status}
              >
                <option value="">Chọn trạng thái</option>
                <option value="1">Đang hoạt động</option>
                <option value="2">Đang sửa chữa</option>
                <option value="3">Ngừng hoạt động</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.status?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="region">
              <Form.Label>Vùng</Form.Label>
              <Form.Control
                as="select"
                {...register("region")}
                isInvalid={errors.region}
              >
                <option value="">Chọn vùng</option>
                <option value="1">Khu dân cư</option>
                <option value="2">Khu công nghiệp</option>
                <option value="3">Khu quy hoạch</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.region?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="ownerRepresent">
              <Form.Label>Chủ sỡ hữu</Form.Label>
              <Form.Control
                as="select"
                {...register("ownerRepresent")}
                isInvalid={errors.ownerRepresent}
              >
                <option value="">Chọn tên chủ sỡ hữu</option>
                {userList.map((user) => (
                  <option key={user.citizenNumber} value={user.fullName}>
                    {user.fullName}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.ownerRepresent?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>{" "}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="createdBy">
              <Form.Label>Người tạo</Form.Label>
              <Form.Control
                as="select"
                {...register("createdBy")}
                isInvalid={errors.createdBy}
              >
                <option value="">Chọn tên người tạo</option>
                {userList.map((user) => (
                  <option key={user.citizenNumber} value={user.citizenNumber}>
                    {user.fullName}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.createdBy?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="avatar">
              <Form.Label>Hình ảnh toà nhà</Form.Label>
              <Form.Control
                type="file"
                accept="image/png, image/jpeg"
                {...register("avatar")}
                onChange={(e) => handleAvatarChange(e)}
                isInvalid={errors.avatar}
              />
              {avatarPreview && (
                <div className="image-preview mt-2">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    width="200px"
                    height="auto"
                  />
                </div>
              )}
              <Form.Control.Feedback type="invalid">
                {errors.avatar?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <div className="mt-3 d-flex justify-content-end">
          <Button
            variant="secondary"
            className="mx-2"
            onClick={() => navigate("/admin/building")}
          >
            Hủy
          </Button>

          <Button variant="primary" type="submit">
            Gửi thông tin
          </Button>
        </div>
      </Form>
    </Container>
  );
};
export default CreateNewBuilding;
