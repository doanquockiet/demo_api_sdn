import React, { useEffect, useState } from "react";
import { Table, Image, Tag, message, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DrinkList = () => {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    setLoading(true);
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

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/drink/delete/${id}`);
      message.success("Đã xóa đồ uống thành công!");
      fetchDrinks(); // Cập nhật danh sách sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa đồ uống:", error);
      message.error("Không thể xóa đồ uống.");
    }
  };

  // Hàm xử lý cập nhật sản phẩm
  const handleUpdate = (id) => {
    navigate(`/update-drink/${id}`); // Điều hướng đến trang cập nhật
  };

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
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record._id)}
          >
            Cập Nhật
          </Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="danger" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <h2>Danh sách đồ uống</h2>
        <div>
        <Button type="primary" style={{ marginBottom: "15px" }} onClick={() => navigate(`/add-drink`)}>
                New Drink
            </Button>
        </div>
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
