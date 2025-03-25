import React from "react";
import { Table, Tag } from "antd";
import dayjs from "dayjs";

const BangDonHang = ({ orders, loading }) => {
  const columns = [
    { title: "Mã Đơn Hàng", dataIndex: "order_id", key: "order_id" },
    {
      title: "Ngày Đặt",
      dataIndex: "order_date",
      key: "order_date",
      sorter: (a, b) => dayjs(a.order_date).unix() - dayjs(b.order_date).unix(), // Sắp xếp theo ngày
      defaultSortOrder: "descend", // 🔥 Mặc định sắp xếp giảm dần (mới nhất trước)
    },
    { title: "Khách Hàng", dataIndex: "customer_name", key: "customer_name" },
    {
      title: "Tổng Tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    { title: "Số Lượng", dataIndex: "total_items", key: "total_items" },
    {
      title: "Thanh Toán",
      dataIndex: "was_paid",
      key: "was_paid",
      render: (was_paid) => (
        <Tag color={was_paid === "Paid" ? "blue" : "red"}>
          {was_paid === "Paid" ? "Đã Thanh Toán" : "Chưa Thanh Toán"}
        </Tag>
      ),
    },
    { title: "Ngày Nhận", dataIndex: "received_date", key: "received_date" },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      loading={loading}
      rowKey="order_id"
      bordered // 🔥 Thêm đường viền giữa các cột
      pagination={{ pageSize: 10 }}
      style={{ marginTop: "16px" }}
    />
  );
};

export default BangDonHang;
