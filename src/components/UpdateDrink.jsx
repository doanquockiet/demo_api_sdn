import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, Button, Upload, message, Select, Image, Card, Row, Col, Typography, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;
const { Title } = Typography;

const UpdateDrink = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [drinkData, setDrinkData] = useState(null); // Lưu thông tin sản phẩm

    // Lấy thông tin đồ uống từ API khi trang load
    useEffect(() => {
        const fetchDrink = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/drink/get-detail/${id}`);
                console.log("data", response.data.data);

                if (response.data) {
                    setDrinkData(response.data.data); // Lưu dữ liệu vào state
                    setImageUrl(response.data.data.drink_image); // Cập nhật hình ảnh

                    // Điền dữ liệu vào form
                    form.setFieldsValue({
                        drink_name: response.data.data.drink_name,
                        drink_description: response.data.data.drink_description,
                        drink_type: response.data.data.drink_type,
                        drink_price: response.data.data.drink_price,
                        drink_quantity: response.data.data.drink_quantity,
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu đồ uống:", error);
                message.error("Không thể tải dữ liệu đồ uống.");
            }
        };
        fetchDrink();
    }, [id, form]);

    // Upload ảnh mới
    const handleUpload = async ({ file }) => {
        const formData = new FormData();
        formData.append("coffee", file);

        setUploading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/v1/upload-file/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data && response.data.success) {
                setImageUrl(response.data.data.url); // Cập nhật URL ảnh mới
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

    // Hiển thị thông báo cập nhật thành công
    const showSuccessModal = () => {
        Modal.success({
            title: "Cập Nhật Thành Công",
            content: "Thông tin đồ uống đã được cập nhật!",
            onOk() {
                navigate("/drinks"); // Quay lại danh sách đồ uống
            },
        });
    };

    // Xử lý cập nhật dữ liệu
    const onFinish = async (values) => {
        if (!imageUrl) {
            message.error("Vui lòng tải lên hình ảnh.");
            return;
        }

        const updatedDrink = {
            ...values,
            drink_image: imageUrl,
        };

        try {
            setLoading(true);
            await axios.put(`http://localhost:8080/api/v1/drink/update/${id}`, updatedDrink);
            showSuccessModal();
        } catch (error) {
            console.error("Lỗi khi cập nhật đồ uống:", error);
            message.error("Không thể cập nhật đồ uống.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify="center" style={{ marginTop: 20 }}>
            <Col xs={24} sm={20} md={16} lg={12}>
                <Card
                    title={<Title level={3} style={{ textAlign: "center" }}>Cập Nhật Đồ Uống</Title>}
                    bordered={false}
                    style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", borderRadius: "10px", padding: "20px" }}
                >
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="drink_name" label="Tên Đồ Uống" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                                    <Input placeholder="Nhập tên đồ uống" />
                                </Form.Item>
                                <Form.Item name="drink_description" label="Mô Tả">
                                    <Input.TextArea placeholder="Mô tả về đồ uống" rows={3} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item name="drink_type" label="Loại Đồ Uống" rules={[{ required: true, message: "Chọn loại đồ uống" }]}>
                                    <Select placeholder="Chọn loại" defaultValue={drinkData?.drink_type}>
                                        <Option value="coffee">Cà phê</Option>
                                        <Option value="tea">Trà</Option>
                                        <Option value="juice">Nước ép</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="drink_price" label="Giá ($)" rules={[{ required: true, message: "Nhập giá sản phẩm" }]}>
                                    <InputNumber min={1} step={0.1} style={{ width: "100%" }} defaultValue={drinkData?.drink_price} />
                                </Form.Item>
                                <Form.Item name="drink_quantity" label="Số Lượng" rules={[{ required: true, message: "Nhập số lượng" }]}>
                                    <InputNumber min={1} style={{ width: "100%" }} defaultValue={drinkData?.drink_quantity} />
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

                        {/* Nút Cập Nhật */}
                        <Form.Item style={{ textAlign: "center" }}>
                            <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%", fontSize: "16px", height: "40px" }}>
                                Cập Nhật Đồ Uống
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default UpdateDrink;
