import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, message, Modal, Button, Select, Checkbox, Input } from "antd";
import axios from "axios";

const { Meta } = Card;
const { Title } = Typography;
const { Option } = Select;

const Home = () => {
    const [drinks, setDrinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    const fetchDrinkDetail = async (id, isSoldOut) => {
        if (isSoldOut) return; // Ngăn chặn click khi hết hàng
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/drink/get-detail/${id}`);
            setSelectedDrink(response.data.data);
            setIsModalVisible(true);
        } catch (error) {
            message.error("Lỗi khi lấy chi tiết đồ uống");
            console.error(error);
        }
    };

    return (
        <div className="container">
            <Title level={2} className="title">Danh Sách Đồ Uống</Title>

            <Row gutter={[16, 24]} justify="center">
                {drinks.map((drink) => {
                    const isSoldOut = drink.drink_quantity <= 0;
                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={drink._id}>
                            <Card
                                hoverable={!isSoldOut}
                                className={`drink-card ${isSoldOut ? "sold-out-card" : ""}`}
                                onClick={() => fetchDrinkDetail(drink._id, isSoldOut)}
                                cover={
                                    <div className="image-container">
                                        <img
                                            alt={drink.drink_name}
                                            src={drink.drink_image}
                                            className="drink-image"
                                        />
                                        {drink.best_seller && <span className="best-seller">Best Seller</span>}
                                        {isSoldOut && <span className="sold-out">Sold Out</span>}
                                    </div>
                                }
                            >
                                <Meta
                                    title={<span className="drink-title">{drink.drink_name}</span>}
                                    description={<p className="drink-price">{drink.drink_price.toLocaleString()}đ</p>}
                                />
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <Modal
                title={selectedDrink?.drink_name}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedDrink && (
                    <div>
                        <div className="modal-image-container">
                            <img src={selectedDrink.drink_image} alt={selectedDrink.drink_name} className="modal-image" />
                        </div>
                        <p className="modal-price">Giá: {selectedDrink.drink_price.toLocaleString()}đ</p>
                        <p>{selectedDrink.drink_description}</p>
                        <Title level={5}>Chọn size *</Title>
                        <Select defaultValue="Size L" style={{ width: "100%" }}>
                            <Option value="L">Size L +0đ</Option>
                        </Select>
                        <Title level={5} style={{ marginTop: "10px" }}>Ghi chú thêm</Title>
                        <Input placeholder="Nhập ghi chú cho món này" />
                        <Title level={5} style={{ marginTop: "10px" }}>Chọn Topping (Tối đa 2 món)</Title>
                        <Checkbox> Kem Phô Mai Macchiato +10.000đ</Checkbox>
                        <Checkbox> Shot Espresso +10.000đ</Checkbox>
                        <Checkbox> Trái Vải +10.000đ</Checkbox>
                        <Checkbox> Hạt Sen +10.000đ</Checkbox>
                        <Button type="primary" block style={{ marginTop: "20px" }}>
                            Thêm vào giỏ
                        </Button>
                    </div>
                )}
            </Modal>

            <style>
                {`
                    .container {
                        padding: 40px;
                        background-color: #fff;
                        text-align: center;
                    }
                    .title {
                        margin-bottom: 30px;
                        font-weight: bold;
                    }
                    .drink-card {
                        border-radius: 15px;
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                        cursor: pointer;
                    }
                    .drink-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
                    }
                    .drink-card.sold-out-card {
                        cursor: not-allowed;
                        opacity: 0.6;
                    }
                    .image-container {
                        position: relative;
                        width: 100%;
                        height: 250px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }
                    .drink-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-top-left-radius: 15px;
                        border-top-right-radius: 15px;
                    }
                    .best-seller, .sold-out {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        background: red;
                        color: white;
                        padding: 5px 10px;
                        font-size: 12px;
                        font-weight: bold;
                        border-radius: 5px;
                    }
                    .best-seller {
                        background: orange;
                    }
                    .modal-image-container {
                        width: 100%;
                        height: 250px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }
                    .modal-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 10px;
                    }
                    .modal-price {
                        font-size: 16px;
                        color: #ff4d4f;
                        font-weight: bold;
                    }
                `}
            </style>
        </div>
    );
};

export default Home;
