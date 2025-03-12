import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, Button, Upload, message, Select, Image, Card, Row, Col, Typography, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;
const { Title } = Typography;

const AddDrink = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate(); // Hook để điều hướng

    // Hàm upload ảnh lên server và lấy URL
    const handleUpload = async ({ file }) => {
        const formData = new FormData();
        formData.append("coffee", file); // Đảm bảo key trùng với backend

        setUploading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/v1/upload-file/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data && response.data.success) {
                setImageUrl(response.data.data.url);
                message.success("Ảnh đã tải lên thành công!");
            } else {
                message.error("Lỗi khi tải ảnh lên.");
            }
        } catch (error) {
            console.error("Lỗi upload ảnh:", error);
            message.error("Không thể tải ảnh lên.");
        } finally {
            setUploading(false);
        }
    };

    // Hiển thị thông báo thành công
    const showSuccessModal = () => {
        Modal.success({
            title: "Thêm Đồ Uống Thành Công",
            content: "Đồ uống đã được thêm vào hệ thống!",
            onOk() {
                form.resetFields();
                setImageUrl(null);
                navigate("/"); // Quay về trang chủ
            },
        });
    };

    // Hiển thị thông báo thất bại
    const showErrorModal = (errorMessage) => {
        Modal.error({
            title: "Lỗi",
            content: errorMessage || "Có lỗi xảy ra, vui lòng thử lại!",
        });
    };

    // Hàm gửi dữ liệu đồ uống lên server
    const onFinish = async (values) => {
        if (!imageUrl) {
            message.error("Vui lòng tải lên hình ảnh.");
            return;
        }

        const drinkData = {
            ...values,
            drink_image: imageUrl, // Gán URL ảnh vào dữ liệu
        };

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8080/api/v1/drink/add", drinkData);
            if (response.status === 200) {
                showSuccessModal(); // Hiển thị modal thành công và quay về home
            }
        } catch (error) {
            console.error("Lỗi khi thêm đồ uống:", error);
            showErrorModal(error.response?.data?.message || "Không thể thêm đồ uống.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify="center" style={{ marginTop: 20 }}>
            <Col xs={24} sm={20} md={16} lg={12}>
                <Card
                    title={<Title level={3} style={{ textAlign: "center" }}>Thêm Đồ Uống Mới</Title>}
                    bordered={false}
                    style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", borderRadius: "10px", padding: "20px" }}
                >
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Row gutter={[16, 16]}>
                            {/* Cột 1: Tên và mô tả */}
                            <Col xs={24} sm={12}>
                                <Form.Item name="drink_name" label="Tên Đồ Uống" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                                    <Input placeholder="Nhập tên đồ uống" />
                                </Form.Item>
                                <Form.Item name="drink_description" label="Mô Tả">
                                    <Input.TextArea placeholder="Mô tả về đồ uống" rows={3} />
                                </Form.Item>
                            </Col>

                            {/* Cột 2: Loại, Giá, Số Lượng */}
                            <Col xs={24} sm={12}>
                                <Form.Item name="drink_type" label="Loại Đồ Uống" rules={[{ required: true, message: "Chọn loại đồ uống" }]}>
                                    <Select placeholder="Chọn loại">
                                        <Option value="coffee">COFFEE</Option>
                                        <Option value="tea">TEA</Option>
                                        <Option value="juice">JUICE</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="drink_price" label="Giá ($)" rules={[{ required: true, message: "Nhập giá sản phẩm" }]}>
                                    <InputNumber min={1} step={0.1} style={{ width: "100%" }} />
                                </Form.Item>
                                <Form.Item name="drink_quantity" label="Số Lượng" rules={[{ required: true, message: "Nhập số lượng" }]}>
                                    <InputNumber min={1} style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Upload hình ảnh */}
                        <Form.Item label="Hình Ảnh">
                            <Upload
                                customRequest={handleUpload}
                                showUploadList={false}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />} loading={uploading}>Tải ảnh lên</Button>
                            </Upload>

                            {imageUrl && (
                                <div style={{ marginTop: "10px", textAlign: "center" }}>
                                    <Image width={120} src={imageUrl} alt="Ảnh xem trước" style={{ borderRadius: "8px", border: "1px solid #ddd", padding: "5px" }} />
                                </div>
                            )}
                        </Form.Item>

                        {/* Nút Thêm Đồ Uống */}
                        <Form.Item style={{ textAlign: "center" }}>
                            <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%", fontSize: "16px", height: "40px" }}>
                                Thêm Đồ Uống
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default AddDrink;
