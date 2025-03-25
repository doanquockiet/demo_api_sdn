import React from "react";
import { Table } from "antd";

const BangSanPham = ({ products, loading }) => {
  const columns = [
    { title: "Tên Sản Phẩm", dataIndex: "product_name", key: "product_name" },
    { title: "Loại", dataIndex: "product_type", key: "product_type" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    { title: "Tồn Kho", dataIndex: "stock_quantity", key: "stock_quantity" },
    { title: "Đã Bán", dataIndex: "total_sold", key: "total_sold" },
    {
      title: "Doanh Thu",
      dataIndex: "total_revenue",
      key: "total_revenue",
      render: (revenue) => `${revenue.toLocaleString()} đ`,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      loading={loading}
      rowKey="product_name"
      bordered // 🔥 Thêm đường viền giữa các cột
      pagination={{ pageSize: 10 }}
      style={{ marginTop: "16px" }}
    />
  );
};

export default BangSanPham;
