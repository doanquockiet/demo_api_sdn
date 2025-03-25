import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Typography, Spin, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

const { Title } = Typography;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async (page = 1, limit = 10) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Vui lòng đăng nhập để xem lịch sử đơn hàng!");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const response = await axios.get(
        `http://localhost:8080/api/v1/orders/customer/${userId}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      if (response.data && response.data.orders) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
      message.error("Không thể tải lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Confirmed":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ xác nhận";
      case "Confirmed":
        return "Đã xác nhận";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "_id",
      key: "_id",
      width: 220,
    },
    {
      title: "Ngày Đặt",
      dataIndex: "order_date",
      key: "order_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.order_date).unix() - dayjs(b.order_date).unix(),
      defaultSortOrder: "descend",
    },
    {
      title: "Thông Tin Khách Hàng",
      dataIndex: "customer_info",
      key: "customer_info",
      render: (info) => (
        <div>
          <p>
            <strong>Tên:</strong> {info.fullName}
          </p>
          <p>
            <strong>SĐT:</strong> {info.phoneNumber}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {info.address}
          </p>
        </div>
      ),
    },
    {
      title: "Mô Tả Đơn Hàng",
      dataIndex: "order_description",
      key: "order_description",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Trạng Thái Thanh Toán",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status) => (
        <Tag color={status === "Paid" ? "green" : "orange"}>
          {status === "Paid" ? "Đã thanh toán" : "Chưa thanh toán"}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Card>
        <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
          Lịch Sử Mua Hàng
        </Title>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          onChange={(page) => fetchOrderHistory(page)}
          bordered
        />
      </Card>
    </div>
  );
};

export default OrderHistory;
