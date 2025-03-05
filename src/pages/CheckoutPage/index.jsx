import React, { useState } from "react";
import { useCart } from "../../context/CartContext"; // Lấy giỏ hàng từ context
import { Input, Button, Radio, Form, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";
const index = () => {
  const { cart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const navigate = useNavigate();

  // Tính tổng tiền đơn hàng
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.drink_price * item.quantity,
    0
  );

  // Xử lý thay đổi thông tin khách hàng
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  // Gửi đơn hàng đến server
  const handlePayment = async () => {
    if (
      !customerInfo.name ||
      !customerInfo.address ||
      !customerInfo.phoneNumber
    ) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const orderData = {
      cus_id: "123456", // Giả định ID khách hàng
      staff_id: "staff001", // Giả định ID nhân viên
      order_description: cart
        .map((item) => `${item.drink_name} x${item.quantity}`)
        .join(", "),
      total_price: totalAmount,
    };

    try {
      if (paymentMethod === "cash") {
        const response = await axios.post(
          "http://localhost:5000/api/payment/cash",
          orderData
        );
        message.success(response.data.message);
        navigate("/success"); // Điều hướng đến trang xác nhận
      } else {
        message.info("Chuyển hướng sang PayPal...");
      }
    } catch (error) {
      message.error("Thanh toán thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div>
      <div className="checkout-container cart">
        {/* thông tin về đơn hàng đã chọn  */}
        <h2>Cart</h2>
        <Form>
          {cart.map((item) => (
            <div key={item.drink_id} className="cart-item">
              <p>{item.drink_name}</p>
              <p>{item.drink_price}</p>
            </div>
          ))}
        </Form>
      </div>
      <div
        className="checkout-container information"
        style={{ maxWidth: 600, margin: "auto", padding: 20 }}
      >
        <h2>Thông Tin Thanh Toán</h2>
        <Form layout="vertical">
          <Form.Item label="Tên Khách Hàng">
            <Input
              name="name"
              value={customerInfo.name}
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
              name="phone"
              value={customerInfo.phoneNumber}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Phương Thức Thanh Toán">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Radio value="cash">Thanh toán khi nhận hàng (Cash)</Radio>
              <Radio value="paypal">PayPal</Radio>
            </Radio.Group>
          </Form.Item>
          <h3>Tổng Tiền: ${totalAmount.toFixed(2)}</h3>
          <Button type="primary" block onClick={handlePayment}>
            Xác Nhận Thanh Toán
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default index;
