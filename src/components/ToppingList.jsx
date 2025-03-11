import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, InputNumber, Popconfirm } from "antd";
import axios from "axios";

const ToppingList = () => {
    const [toppings, setToppings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTopping, setEditingTopping] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Lấy danh sách topping từ API
    useEffect(() => {
        fetchToppings();
    }, []);

    const fetchToppings = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/topping/get-all");
            console.log("API Response:", response.data);
            if (Array.isArray(response.data.data)) {
                setToppings(response.data.data);
            } else {
                throw new Error("API không trả về mảng!");
            }
        } catch (error) {
            message.error("Lỗi khi lấy danh sách topping");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý chỉnh sửa topping
    const handleEdit = (topping) => {
        setEditingTopping(topping);
        form.setFieldsValue(topping);
        setIsModalVisible(true);
    };

    // Gửi cập nhật topping lên API
    const handleUpdate = async (values) => {
        try {
            const updatedTopping = { ...values, _id: editingTopping._id };
            await axios.put("http://localhost:8080/api/v1/topping/update", updatedTopping);
            message.success("Cập nhật topping thành công!");
            setEditingTopping(null);
            setIsModalVisible(false);
            fetchToppings();
        } catch (error) {
            console.error("Lỗi khi cập nhật topping:", error);
            message.error("Không thể cập nhật topping.");
        }
    };

    // Xử lý xóa topping
    const handleDelete = async (id) => {
        try {
            await axios.post("http://localhost:8080/api/v1/topping/delete", { _id: id }); // Nếu API cần body
            message.success("Đã xóa topping thành công!");
            fetchToppings();
        } catch (error) {
            console.error("Lỗi khi xóa topping:", error);
            message.error("Không thể xóa topping.");
        }
    };

    // Hiển thị Modal thêm mới topping
    const showAddModal = () => {
        setEditingTopping(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    // Gửi yêu cầu thêm topping mới
    const handleAddTopping = async (values) => {
        try {
            await axios.post("http://localhost:8080/api/v1/topping/add", values);
            message.success("Thêm topping thành công!");
            setIsModalVisible(false);
            fetchToppings();
        } catch (error) {
            console.error("Lỗi khi thêm topping:", error);
            message.error("Không thể thêm topping.");
        }
    };

    // Định nghĩa cột của bảng
    const columns = [
        {
            title: "Tên Topping",
            dataIndex: "topping_name",
            key: "topping_name",
        },
        {
            title: "Mô tả",
            dataIndex: "topping_description",
            key: "topping_description",
        },
        {
            title: "Giá ($)",
            dataIndex: "topping_price",
            key: "topping_price",
            render: (price) => `$${price.toFixed(2)}`,
        },
        {
            title: "Số lượng",
            dataIndex: "topping_quantity",
            key: "topping_quantity",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button type="primary" onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="container">
            <h2>Danh sách Topping</h2>
            <Button type="primary" style={{ marginBottom: "15px" }} onClick={showAddModal}>
                Thêm Topping
            </Button>
            <Table
                dataSource={Array.isArray(toppings) ? toppings : []}
                columns={columns}
                rowKey="_id"
                loading={loading}
                bordered
                pagination={{ pageSize: 6 }}
            />

            {/* Modal Thêm / Chỉnh sửa Topping */}
            <Modal
                title={editingTopping ? "Chỉnh sửa Topping" : "Thêm Topping"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={editingTopping ? handleUpdate : handleAddTopping}
                >
                    <Form.Item name="topping_name" label="Tên Topping" rules={[{ required: true, message: "Nhập tên topping" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="topping_description" label="Mô Tả">
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item name="topping_price" label="Giá ($)" rules={[{ required: true, message: "Nhập giá topping" }]}>
                        <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="topping_quantity" label="Số Lượng" rules={[{ required: true, message: "Nhập số lượng topping" }]}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ToppingList;
