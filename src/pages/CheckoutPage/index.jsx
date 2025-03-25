import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { Input, Button, Radio, Form, message, Row, Col } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./styles.css";

const Index = () => {
  const { cart, clearCart, saveOrderToHistory } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    full_name: "",
    address: "",
    phone_number: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Vui lòng đăng nhập để thanh toán!");
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

      if (response.data) {
        setCustomerInfo({
          full_name: response.data.full_name || "",
          address: response.data.address || "",
          phone_number: response.data.phone_number || "",
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      message.error("Không thể lấy thông tin người dùng!");
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.drink_price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handlePayment = async () => {
    if (
      !customerInfo.full_name ||
      !customerInfo.address ||
      !customerInfo.phone_number
    ) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const orderData = {
        cus_id: userId,
        order_description: cart
          .map((item) => `${item.drink_name} x${item.quantity}`)
          .join(", "),
        total_price: totalAmount,
        customer_info: {
          fullName: customerInfo.full_name,
          address: customerInfo.address,
          phoneNumber: customerInfo.phone_number,
        },
      };

      console.log("Order Data Sent:", JSON.stringify(orderData, null, 2));

      if (paymentMethod === "cash") {
        const response = await axios.post(
          "http://localhost:8080/api/v1/payment/cash",
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          message.success("Đặt hàng thành công!");
          saveOrderToHistory(orderData);
          clearCart();
          navigate("/order-history");
        }
      } else {
        // Phần xử lý PayPal
      }
    } catch (error) {
      console.error("Full error object:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        message.error(
          error.response.data.message || "Có lỗi xảy ra khi đặt hàng!"
        );
      } else if (error.request) {
        console.error("Request was made but no response received");
        message.error("Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.");
      } else {
        console.error("Error setting up request:", error.message);
        message.error("Lỗi: " + error.message);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[24, 24]} style={{ display: "flex", flexWrap: "nowrap" }}>
        <Col xs={24} md={12} style={{ flex: 1, marginRight: 24 }}>
          <div className="checkout-container cart">
            <h2>Giỏ Hàng</h2>
            <Form>
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <img
                    style={{ width: 100 }}
                    src={item.drink_image}
                    alt={item.drink_name}
                  />
                  <p>{item.drink_name}</p>
                  <p>${item.drink_price.toFixed(2)}</p>
                  <p>Số lượng: {item.quantity}</p>
                </div>
              ))}
            </Form>
          </div>
        </Col>

        <Col xs={24} md={12} style={{ flex: 1 }}>
          <div className="checkout-container information">
            <h2>Thông Tin Thanh Toán</h2>
            <Form layout="vertical">
              <Form.Item label="Họ Tên">
                <Input
                  name="full_name"
                  value={customerInfo.full_name}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item label="Địa Chỉ">
                <Input
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item label="Số Điện Thoại">
                <Input
                  name="phone_number"
                  value={customerInfo.phone_number}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item label="Phương Thức Thanh Toán">
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <Radio value="cash">Tiền Mặt</Radio>
                  <Radio value="paypal">PayPal</Radio>
                </Radio.Group>
              </Form.Item>
              <h3>Tổng Tiền: ${totalAmount.toFixed(2)}</h3>
              <Button type="primary" block onClick={handlePayment}>
                Thanh Toán
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Index;
