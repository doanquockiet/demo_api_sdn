import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, message, Spin, Tag, Input } from "antd";

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/v1/orders");
      // Sort orders by creation date (newest first)
      const sortedOrders =
        response.data?.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ) || [];

      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách đơn hàng!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //   const confirmOrder = async (orderId) => {
  //     try {
  //       setConfirmingOrder(orderId);
  //       await axios.put(`http://localhost:8080/api/v1/orders/${orderId}/staff`);
  //       message.success("Đơn hàng đã được xác nhận!");
  //       fetchOrders();
  //     } catch (error) {
  //       message.error("Lỗi khi xác nhận đơn hàng!");
  //       console.error(error);
  //     } finally {
  //       setConfirmingOrder(null);
  //     }
  //   };
  const confirmOrder = async (orderId) => {
    try {
      setConfirmingOrder(orderId);
      await axios.put(`http://localhost:8080/api/v1/orders/${orderId}/staff`, {
        was_paid: true, // Explicitly set was_paid to true
      });
      message.success("Đơn hàng đã được xác nhận!");
      fetchOrders();
    } catch (error) {
      message.error("Lỗi khi xác nhận đơn hàng!");
      console.error(error);
    } finally {
      setConfirmingOrder(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Filter orders based on order ID
    const filtered = orders.filter((order) =>
      order._id.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "Pending":
        return <Tag color="orange">Pending</Tag>;
      case "Delivered":
        return <Tag color="blue">Delivered</Tag>;
      case "Confirmed":
        return <Tag color="green">Confirmed</Tag>;
      default:
        return <Tag color="default">Unknown</Tag>;
    }
  };

  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => confirmOrder(record._id)}
          loading={confirmingOrder === record._id}
          disabled={
            record.status === "Confirmed" || record.status === "Delivered"
          }
        >
          Xác nhận
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Danh sách đơn hàng</h2>

      {/* Search Input */}
      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo mã đơn hàng"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
}

export default OrdersList;
