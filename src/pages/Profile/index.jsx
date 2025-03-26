import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Row,
  Col,
  Button,
  message,
  Spin,
  Modal,
  Form,
  Input,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LockOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const { Title, Text } = Typography;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Vui lòng đăng nhập để xem thông tin!");
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const response = await axios.get(
        `http://localhost:8080/api/v1/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data) {
        setProfile(response.data);
        // Điền dữ liệu vào form chỉnh sửa
        editForm.setFieldsValue({
          full_name: response.data.full_name,
          email: response.data.email,
          phone_number: response.data.phone_number,
          address: response.data.address,
        });
      } else {
        message.error("Không thể lấy thông tin người dùng!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin profile:", error);
      message.error("Có lỗi xảy ra khi lấy thông tin!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const response = await axios.post(
        `http://localhost:8080/api/v1/profile/change-password/${userId}`,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        message.success("Đổi mật khẩu thành công!");
        setIsChangePasswordModalVisible(false);
        form.resetFields();
      } else {
        message.error("Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu!"
      );
    }
  };

  const handleEditProfile = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const response = await axios.put(
        `http://localhost:8080/api/v1/profile/edit/${userId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        message.success("Cập nhật thông tin thành công!");
        setIsEditProfileModalVisible(false);
        fetchProfile(); // Tải lại thông tin profile
      } else {
        message.error("Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin!"
      );
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Card>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Avatar
            size={120}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff", marginBottom: "16px" }}
          />
          <Title level={2}>{profile?.full_name || "Chưa cập nhật"}</Title>
          <Text type="secondary">@{profile?.user_name || "username"}</Text>
        </div>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card type="inner" title="Thông tin cá nhân">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Text strong>
                    <MailOutlined style={{ marginRight: "8px" }} />
                    Email:
                  </Text>{" "}
                  {profile?.email || "Chưa cập nhật"}
                </Col>
                <Col span={24}>
                  <Text strong>
                    <PhoneOutlined style={{ marginRight: "8px" }} />
                    Số điện thoại:
                  </Text>{" "}
                  {profile?.phone_number || "Chưa cập nhật"}
                </Col>
                <Col span={24}>
                  <Text strong>
                    <EnvironmentOutlined style={{ marginRight: "8px" }} />
                    Địa chỉ:
                  </Text>{" "}
                  {profile?.address || "Chưa cập nhật"}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setIsEditProfileModalVisible(true)}
            style={{ marginRight: "16px" }}
          >
            Chỉnh sửa thông tin
          </Button>
          <Button
            type="primary"
            icon={<LockOutlined />}
            onClick={() => setIsChangePasswordModalVisible(true)}
            style={{ marginRight: "16px" }}
          >
            Đổi mật khẩu
          </Button>
          {/* <Button onClick={() => navigate("/")}>Quay lại trang chủ</Button> */}
        </div>
      </Card>

      {/* Modal đổi mật khẩu */}
      <Modal
        title="Đổi mật khẩu"
        open={isChangePasswordModalVisible}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleChangePassword} layout="vertical">
          <Form.Item
            name="oldPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa thông tin */}
      <Modal
        title="Chỉnh sửa thông tin"
        open={isEditProfileModalVisible}
        onCancel={() => setIsEditProfileModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEditProfile} layout="vertical">
          <Form.Item
            name="full_name"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
