/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Form, Row, Col, Container, InputGroup, Button } from "react-bootstrap";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "../../../styles/CreateNewHouse.scss";
import { getAllWard } from "../../../service/wardService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAllUsers } from "../../../service/userService";
import axios from "axios";
import { toast } from "react-toastify";
import { updateHouse } from "../../../service/houseService";

const schema = yup.object({
  name: yup.string().required("Tên nhà không được để trống!"),
  address: yup.string().required("Số nhà, Tên đường không được để trống!"),
  yearBuilt: yup
    .number()
    .typeError("Năm xây dựng không được để trống!")
    .integer("Năm xây dựng phải là số nguyên!")
    .positive("Năm xây dựng phải là số dương!"),
  description: yup.string().required("Mô tả không được để trống!"),
  numberOfFloors: yup
    .number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .required("Số tầng không được để trống!")
    .integer("Số tầng phải là số nguyên!")
    .positive("Số tầng phải là số dương!"),
  numberRooms: yup
    .number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .required("Số phòng không được để trống!")
    .integer("Số phòng phải là số nguyên!")
    .positive("Số phòng phải là số dương!"),
  area: yup
    .number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .required("Diện tích không được để trống!")
    .positive("Diện tích phải là số dương!"),
  status: yup.string().required("Trạng thái không được để trống!"),
  avatar: yup
    .mixed()
    .required("Vui lòng chọn hình ảnh nhà!")
    .test("fileType", "Vui lòng chọn ảnh PNG hoặc JPG!", (value) => {
      return (
        value && value[0] && ["image/png", "image/jpeg"].includes(value[0].type)
      );
    })
    .test("fileSize", "Dung lượng ảnh phải nhỏ hơn 5MB!", (value) => {
      return value && value[0] && value[0].size <= 5 * 1024 * 1024;
    }),
  longitude: yup.number().typeError("Kinh độ không được để trống!"),
  latitude: yup.number().typeError("Vĩ độ không được để trống!"),
  region: yup.string().required("Vùng không được để trống!"),
  position: yup.string().required("Vị trí không được để trống!"),
  ward_id: yup.string().required("Phường/Xã không được để trống!"),
  owner_id: yup.string().required("Chủ sỡ hữu không được để trống!"),
});

const UpdateHouse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const houseDetails = location.state || {};
  const [userList, setUserList] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [wardList, setWardList] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllWard();
      await fetchAllUser();
      if (houseDetails) {
        setValue("name", houseDetails.name);
        setValue("address", houseDetails.address);
        setValue("yearBuilt", houseDetails.yearBuilt);
        setValue("description", houseDetails.description);
        setValue("numberOfFloors", houseDetails.numberOfFloors);
        setValue("numberRooms", houseDetails.numberRooms);
        setValue("area", houseDetails.area);
        setValue("status", houseDetails.status);
        setValue("avatar", houseDetails.avatar);
        setValue("longitude", houseDetails.longitude);
        setValue("latitude", houseDetails.latitude);
        setValue("region", houseDetails.region);
        setValue("position", houseDetails.position);
        setValue("ward_id", houseDetails.ward.id);
        setValue("owner_id", houseDetails.owner.citizenNumber);

        setAvatarPreview(houseDetails.avatar);
      }
    };
    fetchData();
    console.log(houseDetails);
  }, [houseDetails, setValue]);

  useEffect(() => {
    fetchAllWard();
    fetchAllUser();
  }, []);

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
    if (avatarUrl.length > 0) {
    try {
      const response = await updateHouse(id, {
        name: data.name,
        address: data.address,
        yearBuilt: data.yearBuilt,
        description: data.description,
        numberOfFloors: data.numberOfFloors,
        numberRooms: data.numberRooms,
        area: data.area,
        status: data.status,
        avatar: avatarUrl,
        longitude: data.longitude,
        latitude: data.latitude,
        region: data.region,
        position: data.position,
        ward_id: data.ward_id,
        owner_id: data.owner_id,
      });

      if (response && response.EC === 0) {
        toast.success("Cập nhật nhà thành công!");
        setAvatarPreview("");
        navigate("/owner/house");
      } else {
        toast.error("Cập nhật nhà thất bại!");
      }
      console.log(response);
    } catch (error) {
      console.error("Gửi dữ liệu thất bại:", error);
    }
  }
  };

  return (
    <Container className="content-container">
      <h1 className="text-center mb-3">Cập nhật nhà</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="name">
              <Form.Label>Tên nhà</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên nhà"
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
                  placeholder="Mô tả nhà của bạn"
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
          <Col md={4}>
            <Form.Group controlId="numberRooms">
              <Form.Label>Số phòng</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số phòng"
                {...register("numberRooms")}
                defaultValue={0}
                isInvalid={errors.numberRooms}
              />
              <Form.Control.Feedback type="invalid">
                {errors.numberRooms?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
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
            <Form.Group controlId="owner_id">
              <Form.Label>Chủ sỡ hữu</Form.Label>
              <Form.Control
                as="select"
                {...register("owner_id")}
                isInvalid={errors.owner_id}
              >
                <option value="">Chọn tên chủ sỡ hữu</option>
                {userList.map((user) => (
                  <option key={user.citizenNumber} value={user.citizenNumber}>
                    {user.fullName}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.owner_id?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>{" "}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="position">
              <Form.Label>Vị trí</Form.Label>
              <Form.Control
                type="string"
                placeholder="Nhập vị trí"
                {...register("position")}
                isInvalid={errors.position}
              />
              <Form.Control.Feedback type="invalid">
                {errors.position?.message}
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
            onClick={() => navigate("/owner/house")}
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
export default UpdateHouse;
