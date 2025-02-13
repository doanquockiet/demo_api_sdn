import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Tag, message, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
const { Meta } = Card;
const { Title } = Typography;

const Home = () => {
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

    return (
        <div style={{ padding: "40px", backgroundColor: "#f8f9fa" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "30px", fontWeight: "bold" }}>
                Danh Sách Đồ Uống
            </Title>

            <Row gutter={[24, 24]} justify="center">
                {drinks.map((drink) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={drink._id}>
                        <Card
                            hoverable
                            cover={
                                <div style={{ position: "relative", overflow: "hidden", borderRadius: "10px 10px 0 0" }}>
                                    <img
                                        alt={drink.drink_name}
                                        src={drink.drink_image}
                                        style={{
                                            width: "100%",
                                            height: "220px",
                                            objectFit: "cover",
                                            transition: "0.3s ease-in-out",
                                        }}
                                    />
                                    {/* Hiệu ứng overlay khi hover */}
                                    <div className="overlay">
                                        <Button type="primary" icon={<ShoppingCartOutlined />} className="btn-hover">
                                            Thêm vào giỏ
                                        </Button>
                                    </div>
                                </div>
                            }
                            style={{
                                borderRadius: "10px",
                                overflow: "hidden",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Meta
                                title={<span style={{ fontWeight: "bold", fontSize: "16px" }}>{drink.drink_name}</span>}
                                description={<p style={{ fontSize: "13px", color: "#555", marginBottom: "5px" }}>{drink.drink_description}</p>}
                            />
                            <p style={{ marginTop: "10px", fontSize: "15px", fontWeight: "bold", color: "#ff4d4f" }}>
                                Giá: ${drink.drink_price.toFixed(2)}
                            </p>
                            <Tag color="geekblue" style={{ fontSize: "13px", padding: "5px 10px", borderRadius: "5px" }}>
                                {drink.drink_type.toUpperCase()}
                            </Tag>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* CSS Custom */}
            <style>
                {`
            .overlay {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 0, 0, 0.5);
              opacity: 0;
              transition: opacity 0.3s ease-in-out;
            }
  
            .btn-hover {
              display: none;
            }
  
            .ant-card:hover .overlay {
              opacity: 1;
            }
  
            .ant-card:hover .btn-hover {
              display: inline-block;
            }
          `}
            </style>
        </div>
    );
};

export default Home;
