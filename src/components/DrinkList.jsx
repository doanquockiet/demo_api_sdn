import React, { useEffect, useState } from "react";
import { Table, Image, Tag, message } from "antd";
import axios from "axios";

const DrinkList = () => {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/drink/get-all-drink");
        if (response.data && response.data.data) {
          setDrinks(response.data.data);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        message.error("Lỗi khi lấy danh sách đồ uống");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, []);

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "drink_image",
      key: "drink_image",
      render: (url) => <Image src={url} alt="drink" width={70} />,
    },
    {
      title: "Tên đồ uống",
      dataIndex: "drink_name",
      key: "drink_name",
    },
    {
      title: "Loại",
      dataIndex: "drink_type",
      key: "drink_type",
      render: (type) => <Tag color="blue">{type.toUpperCase()}</Tag>,
    },
    {
      title: "Giá",
      dataIndex: "drink_price",
      key: "drink_price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Số lượng",
      dataIndex: "drink_quantity",
      key: "drink_quantity",
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div className="container">
      <h2>Danh sách đồ uống</h2>
      <Table
        dataSource={drinks}
        columns={columns}
        rowKey="_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
};

export default DrinkList;
