import React, { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Modal,
  Button,
  List,
  InputNumber,
  Typography,
  Dropdown,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useCart } from "../context/CartContext";

const { Header, Content, Footer } = Layout;

const items = [
    { key: "1", label: <Link to="/">Trang Chủ</Link> },
    { key: "2", label: <Link to="/drinks">Đồ Uống</Link> },
    { key: "3", label: <Link to="/add-drink">Thêm Đồ Uống</Link> },
    { key: "7", label: <Link to="/export">Thống Kê Xuất</Link> },

];
const { Title } = Typography;


const AppLayout = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { cart, removeFromCart, updateQuantity, calculateTotal } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    navigate("/checkout");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    message.success("Đăng xuất thành công!");
    navigate("/login");
  };


  const profileMenu = (
    <Menu>
      {isLoggedIn ? (
        <>
          <Menu.Item key="2" onClick={handleLogout}>
            Đăng xuất
          </Menu.Item>
          <Menu.Item key="3">
            Profile
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="3" onClick={() => navigate("/login")}>
          Đăng nhập
        </Menu.Item>
      )}
    </Menu>
  );


  const items = [
    { key: "1", label: <Link to="/">Trang Chủ</Link> },
    // ✅ Hiển thị thêm nếu là nhân viên (staff)
    ...(role === "staff"
      ? [
        { key: "3", label: <Link to="/add-drink">Thêm Đồ Uống</Link> },
        { key: "8", label: <Link to="/toppings">Toppings</Link> },
        { key: "2", label: <Link to="/drinks">Đồ Uống</Link> },
        { key: "4", label: <Link to="/export">Xuất Thống Kê</Link> },
        // { key: "3", label: <Link to="/add-drink">Thêm Đồ Uống</Link> },
      ]
      : []),

    {
      key: "4",
      label: (
        <Badge count={cart.length} showZero>
          <Button
            type="primary"
            shape="circle"
            icon={<ShoppingCartOutlined />}
            onClick={showModal}
          />
        </Badge>
      ),
      style: { marginLeft: "auto" },
    },
    {
      key: "5",
      label: (
        <Dropdown overlay={profileMenu} trigger={["click"]}>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ cursor: "pointer" }}
          />
        </Dropdown>
      ),
    },
  ];



  return (
    <Layout className="layout">
      <Header>
        <Menu theme="dark" mode="horizontal" items={items} />
      </Header>
      <Content style={{ padding: "20px" }}>{children}</Content>
      <Footer style={{ textAlign: "center" }}>Ant Design ©2025</Footer>

      {/* Modal giỏ hàng */}
      <Modal
        title="Giỏ Hàng"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Thanh Toán
          </Button>,
        ]}
      >
        <List
          dataSource={cart}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  danger
                  onClick={() => removeFromCart(item._id)}
                >
                  Xóa
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.drink_image} />}
                title={item.drink_name}
                description={`Giá: $${item.drink_price.toFixed(2)}`}
              />
              <InputNumber
                min={1}
                defaultValue={item.quantity}
                onChange={(value) => updateQuantity(item._id, value)}
              />
            </List.Item>
          )}
        />
        {/* Hiển thị tổng số tiền */}
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Title level={4}>Tổng cộng: ${calculateTotal().toFixed(2)}</Title>
        </div>
      </Modal>
    </Layout>
  );
};

export default AppLayout;