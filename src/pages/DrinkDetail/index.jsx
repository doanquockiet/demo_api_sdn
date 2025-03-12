import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography, Tag, message, Spin } from "antd";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const DrinkDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [drink, setDrink] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } =
        useCart();
    useEffect(() => {
        const fetchDrinkDetail = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/drink-details/drinks/${id}`
                );
                console.log("API Response:", response.data);
                setDrink(response.data?.data || response.data || null);
            } catch (error) {
                message.error("Lỗi khi lấy chi tiết đồ uống");
                console.error("API Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrinkDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    if (!drink) {
        console.log(drink)
        return <p>Không tìm thấy đồ uống.</p>;
    }

    return (
        <div className="container">
            <div className="drink-detail-card">
                <div className="drink-header">
                    <Title style={{ fontSize: '24px' }} level={2}>
                        {drink.drink_name}
                    </Title>
                    <img src={drink.drink_image} alt={drink.drink_name} className="drink-image" />
                </div>
                <div className="drink-detail">
                    <div className="drink-info">
                        <Paragraph className="drink-description">{drink.drink_description}</Paragraph>
                        <Title level={4} className="drink-price">Giá: ${drink.drink_price.toFixed(2)}</Title>
                        <Tag className="drink-tag">{drink.drink_type.toUpperCase()}</Tag>
                        <div className="button-group">

                            <div className="overlay">
                                <Button
                                    type="primary"
                                    icon={<ShoppingCartOutlined />}
                                    className="btn-hover"
                                    onClick={() => addToCart(drink)}
                                >
                                    Thêm vào giỏ
                                </Button>
                            </div>
                        </div>
                    </div>
                    <button
                        className="back-button"
                        onClick={() => navigate("/")}
                    >
                        Quay lại
                    </button>
                </div>
            </div>
            <style>
                {`
          .container {
            max-width: 800px;
            margin: 40px auto;
            background-color: #FFFFFF;
            border-radius: 10px;
          }
        .drink-detail{
        width: 100%;
         height: 250px;
        margin-top: 30px;}
          .drink-header {
         margin-right: 14px;
          }

          .drink-detail-card {
            display: flex;
            align-items: center;
            padding: 20px;
            margin-left: 10px;
          }

          .drink-image {
            width: 210px;
            max-width: 280px;
            max-height: 300px;
            border-radius: 4px;
            margin-bottom: 20px;
          }

          .drink-info {
            width: 100%;
          }

          .drink-description {
            font-size: 16px;
            color: #555;
          }

          .drink-price {
            color: #ff4d4f;
            font-weight: bold;
          }

          .drink-tag {
            font-size: 14px;
            padding: 5px 10px;
            margin-top: 10px;
            display: inline-block;
          }

          .button-group {
            margin-top: 20px;
          }

          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
          }
        .back-button {
            bottom: 10px;
            right: 10px;
            background-color: red;
            color: white;
            padding: 6px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
    margin-top: 40px;
    margin-left: 430px;
        }

        .back-button:hover {
            background-color: darkred;
        }
        `}
            </style>
        </div>
    );
};

export default DrinkDetail;