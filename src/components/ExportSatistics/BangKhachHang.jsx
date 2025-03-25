import React from "react";
import { Table } from "antd";

const BangKhachHang = ({ customers, loading }) => {
  const columns = [
    {
      title: "Tên Khách Hàng",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số Điện Thoại", dataIndex: "phone_number", key: "phone_number" },
    { title: "Địa Chỉ", dataIndex: "address", key: "address" },
    { title: "Số Đơn Hàng", dataIndex: "total_orders", key: "total_orders" },
    {
      title: "Tổng Chi Tiêu",
      dataIndex: "total_spent",
      key: "total_spent",
      render: (spent) => `${spent.toLocaleString()} đ`,
    },
    {
      title: "Sản Phẩm Mua Nhiều Nhất",
      dataIndex: "most_purchased_product",
      key: "most_purchased_product",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={customers}
      loading={loading}
      rowKey="customer_name"
      bordered // 🔥 Thêm đường viền giữa các cột
      pagination={{ pageSize: 10 }}
      style={{ marginTop: "16px" }}
    />
  );
};

export default BangKhachHang;
