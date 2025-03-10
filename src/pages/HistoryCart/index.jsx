// HistoryCart.js
import React from "react";
import { List, Typography } from "antd";

const { Title } = Typography;

const HistoryCart = () => {
  const history = JSON.parse(localStorage.getItem("orderHistory")) || [];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Lịch Sử Đơn Hàng</Title>
      <List
        dataSource={history}
        renderItem={(order) => (
          <List.Item>
            <List.Item.Meta
              title={`Đơn hàng: ${order.order_description}`}
              description={`Tổng tiền: $${order.total_price.toFixed(2)}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default HistoryCart;
