import React from "react";
import { Table, Tag } from "antd";

const BangDanhGia = ({ ratings, loading }) => {
  const columns = [
    { title: "Tên Sản Phẩm", dataIndex: "product_name", key: "product_name" },
    { title: "Loại", dataIndex: "product_type", key: "product_type" },
    {
      title: "Số Lượt Đánh Giá",
      dataIndex: "total_reviews",
      key: "total_reviews",
    },
    {
      title: "Điểm Trung Bình",
      dataIndex: "average_rating",
      key: "average_rating",
      render: (rating) => (
        <Tag color={rating >= 4 ? "green" : "volcano"}>{rating.toFixed(1)}</Tag>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={ratings}
      loading={loading}
      rowKey="product_name"
      bordered // 🔥 Thêm đường viền giữa các cột
      pagination={{ pageSize: 10 }} // ⚡ Giới hạn 10 dòng mỗi trang
      style={{ marginTop: "16px" }} // 📏 Khoảng cách với phần trên
    />
  );
};

export default BangDanhGia;
