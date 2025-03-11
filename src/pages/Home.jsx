import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { Row, Col, Card, Typography, message, Modal, Button, Select, Checkbox, Input } from "antd";
import axios from "axios";
=======
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
>>>>>>> 6fcdcf63c84ad826e46ec849c8c1c13dfe9c1015

const { Meta } = Card;
const { Title } = Typography;
const { Option } = Select;

const Home = () => {
<<<<<<< HEAD
    const [drinks, setDrinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
=======
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, removeFromCart, updateQuantity, calculateTotal } =
    useCart();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
>>>>>>> 6fcdcf63c84ad826e46ec849c8c1c13dfe9c1015

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

<<<<<<< HEAD
    const fetchDrinkDetail = async (id, isSoldOut) => {
        if (isSoldOut) return; // Ngăn chặn click khi hết hàng
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/drink/get-detail/${id}`);
            setSelectedDrink(response.data.data);
            setIsModalVisible(true);
        } catch (error) {
            message.error("Lỗi khi lấy chi tiết đồ uống");
            console.error(error);
        }
    };

    return (
        <div className="container">
            <Title level={2} className="title">Danh Sách Đồ Uống</Title>

            <Row gutter={[16, 24]} justify="center">
                {drinks.map((drink) => {
                    const isSoldOut = drink.drink_quantity <= 0;
                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={drink._id}>
                            <Card
                                hoverable={!isSoldOut}
                                className={`drink-card ${isSoldOut ? "sold-out-card" : ""}`}
                                onClick={() => fetchDrinkDetail(drink._id, isSoldOut)}
                                cover={
                                    <div className="image-container">
                                        <img
                                            alt={drink.drink_name}
                                            src={drink.drink_image}
                                            className="drink-image"
                                        />
                                        {drink.best_seller && <span className="best-seller">Best Seller</span>}
                                        {isSoldOut && <span className="sold-out">Sold Out</span>}
                                    </div>
                                }
                            >
                                <Meta
                                    title={<span className="drink-title">{drink.drink_name}</span>}
                                    description={<p className="drink-price">{drink.drink_price.toLocaleString()}đ</p>}
                                />
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <Modal
                title={selectedDrink?.drink_name}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedDrink && (
                    <div>
                        <div className="modal-image-container">
                            <img src={selectedDrink.drink_image} alt={selectedDrink.drink_name} className="modal-image" />
                        </div>
                        <p className="modal-price">Giá: {selectedDrink.drink_price.toLocaleString()}đ</p>
                        <p>{selectedDrink.drink_description}</p>
                        <Title level={5}>Chọn size *</Title>
                        <Select defaultValue="Size L" style={{ width: "100%" }}>
                            <Option value="L">Size L +0đ</Option>
                        </Select>
                        <Title level={5} style={{ marginTop: "10px" }}>Ghi chú thêm</Title>
                        <Input placeholder="Nhập ghi chú cho món này" />
                        <Title level={5} style={{ marginTop: "10px" }}>Chọn Topping (Tối đa 2 món)</Title>
                        <Checkbox> Kem Phô Mai Macchiato +10.000đ</Checkbox>
                        <Checkbox> Shot Espresso +10.000đ</Checkbox>
                        <Checkbox> Trái Vải +10.000đ</Checkbox>
                        <Checkbox> Hạt Sen +10.000đ</Checkbox>
                        <Button type="primary" block style={{ marginTop: "20px" }}>
                            Thêm vào giỏ
                        </Button>
                    </div>
                )}
            </Modal>

            <style>
                {`
                    .container {
                        padding: 40px;
                        background-color: #fff;
                        text-align: center;
                    }
                    .title {
                        margin-bottom: 30px;
                        font-weight: bold;
                    }
                    .drink-card {
                        border-radius: 15px;
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                        cursor: pointer;
                    }
                    .drink-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
                    }
                    .drink-card.sold-out-card {
                        cursor: not-allowed;
                        opacity: 0.6;
                    }
                    .image-container {
                        position: relative;
                        width: 100%;
                        height: 250px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }
                    .drink-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-top-left-radius: 15px;
                        border-top-right-radius: 15px;
                    }
                    .best-seller, .sold-out {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        background: red;
                        color: white;
                        padding: 5px 10px;
                        font-size: 12px;
                        font-weight: bold;
                        border-radius: 5px;
                    }
                    .best-seller {
                        background: orange;
                    }
                 .modal-image-container {
    width: 100%;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #f5f5f5; /* Màu nền để làm nổi bật ảnh nếu có khoảng trống */
}

.modal-image {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Hiển thị toàn bộ ảnh mà không bị cắt */
    border-radius: 10px;
}

.image-container {
    position: relative;
    width: 100%;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #f5f5f5; /* Màu nền nếu ảnh không full */
}

.drink-image {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Hiển thị toàn bộ ảnh mà không bị cắt */
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}

                `}
            </style>
=======
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
>>>>>>> 6fcdcf63c84ad826e46ec849c8c1c13dfe9c1015
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
