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
  const { cart, addToCart, removeFromCart, updateQuantity, calculateTotal } = useCart();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    drink_type: "",
    min_price: "",
    max_price: "",
    sort: "asc", // Sắp xếp theo giá tăng dần mặc định
  });

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        setLoading(true);

        // Tạo query params từ state filters
        const queryParams = new URLSearchParams(filters).toString();
        const response = await axios.get(
          `http://localhost:8080/api/v1/drinks/filter?${queryParams}`
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
  }, [filters]); // Gọi lại API khi filters thay đổi

  const handleSearch = async (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword) {
      // Nếu input trống, gọi API lấy lại toàn bộ danh sách
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/v1/drink/get-all-drink");
        setDrinks(response.data?.data || []);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách đồ uống");
        console.error(error);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Nếu có từ khóa, thực hiện tìm kiếm
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/v1/drinks/search?keyword=${keyword}`
      );
      setDrinks(response.data?.data || []);
    } catch (error) {
      message.error("Lỗi khi tìm kiếm đồ uống");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


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
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm đồ uống..."
            value={searchKeyword}
            onChange={handleSearch} // Cập nhật khi nhập
            style={{ padding: "5px", borderRadius: "5px", width: "200px" }}
          />

          <Button style={{ marginLeft: 20 }} type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* Chọn loại đồ uống */}
          <select
            value={filters.drink_type}
            onChange={(e) => setFilters({ ...filters, drink_type: e.target.value })}
            style={{ padding: "5px 10px", borderRadius: "5px" }}
          >
            <option value="">Tất cả loại</option>
            <option value="coffee">Cà phê</option>
            <option value="tea">Trà</option>
            <option value="smoothie">Sinh tố</option>
          </select>

          {/* Nhập khoảng giá */}
          <input
            type="number"
            placeholder="Giá tối thiểu"
            value={filters.min_price}
            onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
            style={{ padding: "5px", borderRadius: "5px", width: "100px" }}
          />
          <input
            type="number"
            placeholder="Giá tối đa"
            value={filters.max_price}
            onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
            style={{ padding: "5px", borderRadius: "5px", width: "100px" }}
          />

          {/* Sắp xếp theo giá */}
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            style={{ padding: "5px 10px", borderRadius: "5px" }}
          >
            <option value="asc">Giá thấp - cao</option>
            <option value="desc">Giá cao - thấp</option>
          </select>

          {/* Nút Reset */}
          <Button
            onClick={() =>
              setFilters({ drink_type: "", min_price: "", max_price: "", sort: "asc" })
            }
            type="default"
          >
            Reset
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
      </div>

      <Row gutter={[24, 24]} justify="center">
        {drinks.map((drink) => (
          <Col xs={24} sm={12} md={8} lg={6} key={drink._id}>
            <Card
              hoverable
              className="drink-card"
              cover={
                <div className="card-image-container" onClick={() => navigate(`/drinks/${drink._id}`)}>
                  <img
                    alt={drink.drink_name}
                    src={drink.drink_image}
                    className="card-image"
                  />
                  <div className="overlay">
                    <Button type="primary" icon={<ShoppingCartOutlined />} className="btn-hover" onClick={() => addToCart(drink)}>
                      Thêm vào giỏ
                    </Button>
                  </div>
                </div>
              }
            >
              <div className="card-content">
                <Meta title={<span className="drink-title">{drink.drink_name}</span>} description={<p className="drink-description">{drink.drink_description}</p>} />
                <p className="drink-price">Giá: ${drink.drink_price.toFixed(2)}</p>
                <Tag className="drink-tag">{drink.drink_type.toUpperCase()}</Tag>
              </div>
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.drink-card .ant-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-content {
  flex: 1;
}

.drink-title {
  font-weight: bold;
  font-size: 16px;
}

.drink-description {
  font-size: 13px;
  color: #555;
  flex-grow: 1;
}

.drink-price {
  margin-top: 10px;
  font-size: 15px;
  font-weight: bold;
  color: #ff4d4f;
}

        `}
      </style>
    </div>
  );
};

export default Home;