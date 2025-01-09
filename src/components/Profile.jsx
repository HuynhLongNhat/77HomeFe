import { useEffect, useState } from "react";
import "../styles/Profile.scss";
import Header from "./user/layout/header";
import Footer from "./user/layout/footer";
import { updateUser, getUserById } from "../service/userService";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

const Profile = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    citizenNumber: auth?.citizenNumber || "",
    fullName: auth?.fullName || "",
    address: auth?.address || "",
    email: auth?.email || "",
    phone: auth?.phone || "",
    dateOfBirth: auth?.dateOfBirth || "",
    gender: auth?.gender || "0", // 0 là Nam, 1 là Nữ
  });

  useEffect(() => {
    fetchUseByCitizenumber();
  }, []);

  const fetchUseByCitizenumber = async () => {
    let user = await getUserById(auth?.id);
    if (user && user.EC === 0) {
      setUserInfo(user.DT);
      console.log("User", user);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    let updateInfo = await updateUser(auth.id, {
      fullName: userInfo.fullName,
      dateOfBirth: userInfo.dateOfBirth,
      gender: userInfo.gender,
    });
    if (updateInfo && updateInfo.EC === 0) {
      toast.success(updateInfo.EM);
      // Cập nhật lại thông tin sau khi lưu thành công
      fetchUseByCitizenumber();
    } else {
      toast.error(updateInfo.EM);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm chuyển đổi giới tính từ số sang chữ
  const getGenderText = (genderValue) => {
    return genderValue === false ? "Nam" : "Nữ";
  };

  return (
    <>
      <div className="profile-container my-2">
        <div className="profile-header">
          <h1>Hồ Sơ Của Tôi</h1>
        </div>

        <div className="profile-content">
          <div className="profile-field">
            <label>Số CCCD:</label>
            <span>{userInfo.citizenNumber}</span>
          </div>

          <div className="profile-field">
            <label>Họ và tên:</label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={userInfo.fullName}
                onChange={handleChange}
              />
            ) : (
              <span>{userInfo.fullName}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Email:</label>
            <span>{userInfo.email}</span>
          </div>

          <div className="profile-field">
            <label>Số điện thoại:</label>
            <span>{userInfo.phone}</span>
          </div>

          <div className="profile-field">
            <label>Ngày sinh:</label>
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={userInfo.dateOfBirth}
                onChange={handleChange}
              />
            ) : (
              <span>{userInfo.dateOfBirth}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Giới tính:</label>
            {isEditing ? (
              <select
                name="gender"
                value={userInfo.gender}
                onChange={handleChange}
              >
                <option value="false">Nam</option>
                <option value="true">Nữ</option>
              </select>
            ) : (
              <span>{getGenderText(userInfo.gender)}</span>
            )}
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <Button
                  variant="secondary mx-2"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset lại dữ liệu khi hủy
                    fetchUseByCitizenumber();
                  }}
                >
                  Hủy
                </Button>
                <button className="save-btn" onClick={handleSave}>
                  Lưu
                </button>
              </>
            ) : (
              <>
                <button className="edit-btn" onClick={handleEdit}>
                  Chỉnh sửa
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
