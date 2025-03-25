import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, message, Spin, Tag } from "antd";

function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmingOrder, setConfirmingOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8080/api/v1/orders");
            console.log(response);
            setOrders(response.data?.orders || []);
        } catch (error) {
            message.error("Lỗi khi lấy danh sách đơn hàng!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const confirmOrder = async (orderId) => {
        try {
            setConfirmingOrder(orderId);
            const response = await axios.put(
                `http://localhost:8080/api/v1/orders/${orderId}/staff`);
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
            title: "Thao Tác",
            key: "action",
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => confirmOrder(record._id)}
                    loading={confirmingOrder === record._id}
                    disabled={record.status === "Confirmed" || record.status === "Delivered"}
                >
                    Xác nhận
                </Button>
            ),
        },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Danh sách đơn hàng</h2>

            {loading ? (
                <div className="flex justify-center">
                    <Spin size="large" />
                </div>
            ) : (
                <Table
                    dataSource={orders}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
}

export default OrdersList;