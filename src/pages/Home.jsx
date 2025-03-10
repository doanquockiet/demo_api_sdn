import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  message,
  Typography,
  Badge,
  Avatar,
  Dropdown,
  Menu,
  Modal,
  List,
  InputNumber,
} from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const { Meta } = Card;
const { Title } = Typography;

const Home = () => {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, removeFromCart, updateQuantity, calculateTotal } =
    useCart();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/drink/get-all-drink"
        );
        setDrinks(response.data?.data || []);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách đồ uống");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrinks();
  }, []);

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

  return (
    <div style={{ padding: "40px", backgroundColor: "#f8f9fa" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <Title level={2} style={{ fontWeight: "bold", margin: 0 }}>
          Danh Sách Đồ Uống
        </Title>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {drinks.map((drink) => (
          <Col xs={24} sm={12} md={8} lg={6} key={drink._id}>
            <Card
              hoverable
              cover={
                <div className="card-image-container">
                  <img
                    alt={drink.drink_name}
                    src={drink.drink_image}
                    className="card-image"
                  />
                  <div className="overlay">
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      className="btn-hover"
                      onClick={() => addToCart(drink)}
                    >
                      Thêm vào giỏ
                    </Button>
                  </div>
                </div>
              }
              className="drink-card"
            >
              <Meta
                title={<span className="drink-title">{drink.drink_name}</span>}
                description={
                  <p className="drink-description">{drink.drink_description}</p>
                }
              />
              <p className="drink-price">
                Giá: ${drink.drink_price.toFixed(2)}
              </p>
              <Tag className="drink-tag">{drink.drink_type.toUpperCase()}</Tag>
            </Card>
          </Col>
        ))}
      </Row>

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

      <style>
        {`
          .card-image-container {
            position: relative;
            overflow: hidden;
            border-radius: 10px 10px 0 0;
          }

          .card-image {
            width: 100%;
            height: 220px;
            object-fit: cover;
            transition: 0.3s ease-in-out;
          }

          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
          }

          .btn-hover {
            display: none;
          }

          .ant-card:hover .overlay {
            opacity: 1;
          }

          .ant-card:hover .btn-hover {
            display: inline-block;
          }

          .drink-card {
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }

          .drink-title {
            font-weight: bold;
            font-size: 16px;
          }

          .drink-description {
            font-size: 13px;
            color: #555;
            margin-bottom: 5px;
          }

          .drink-price {
            margin-top: 10px;
            font-size: 15px;
            font-weight: bold;
            color: #ff4d4f;
          }

          .drink-tag {
            font-size: 13px;
            padding: 5px 10px;
            border-radius: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
