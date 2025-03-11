import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography, Tag, message, Spin, Input, Rate } from "antd";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const { Title, Paragraph } = Typography;

const DrinkDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [drink, setDrink] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [ratingValue, setRatingValue] = useState(0);
    const [ratingComment, setRatingComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [loadingRatings, setLoadingRatings] = useState(true);

    useEffect(() => {
        const fetchDrinkDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/drink-details/drinks/${id}`);
                console.log("API Response:", response.data);
                setDrink(response.data?.data || response.data || null);
            } catch (error) {
                message.error("Lỗi khi lấy chi tiết đồ uống");
                console.error("API Error:", error);
            } finally {
                setLoading(false);
            }
        };
        const fetchRatings = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/ratings/${id}`);
                console.log("test", response)
                setRatings(response.data?.data || []);
            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setLoadingRatings(false);
            }
        };

        fetchDrinkDetail();
        fetchRatings();
    }, [id]);

    const handleRatingSubmit = async () => {
        if (!ratingValue || !ratingComment.trim()) {
            return message.error("Vui lòng nhập đầy đủ thông tin đánh giá!");
        }
        setSubmitting(true);
        try {
            const token = Cookies.get("token");
            if (!token) {
                message.error("Bạn cần đăng nhập để gửi đánh giá!");
                setSubmitting(false);
                return;
            }
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            const response = await axios.post(
                "http://localhost:8080/api/v1/ratings",
                {
                    rating_value: ratingValue,
                    rating_comment: ratingComment,
                    drink_id: id,
                    auth_user: userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                message.success("Đánh giá đã được gửi thành công!");
                setRatingValue(0);
                setRatingComment("");
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Có lỗi xảy ra!");
            console.error("API Error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }
    if (!drink) {
        return <p>Không tìm thấy đồ uống.</p>;
    }
    return (
        <div className="container">
            <div className="drink-detail-card">
                <div className="drink-header">
                    <Title style={{ fontSize: "24px" }} level={2}>
                        {drink.drink_name}
                    </Title>
                    <img src={drink.drink_image} alt={drink.drink_name} className="drink-image" />
                </div>
                <div className="drink-detail">
                    <div className="drink-info">
                        <Paragraph className="drink-description">{drink.drink_description}</Paragraph>
                        <Title level={4} className="drink-price">
                            Giá: ${drink.drink_price.toFixed(2)}
                        </Title>
                        <Tag className="drink-tag">{drink.drink_type.toUpperCase()}</Tag>
                        <div className="button-group">
                            <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => addToCart(drink)}>
                                Thêm vào giỏ
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="rating-section">
                <Title level={4} className="rating-title">Đánh giá sản phẩm</Title>
                <div className="rating-list">
                    <Title level={5} className="rating-list-title">Đánh giá từ người dùng:</Title>
                    {loadingRatings ? (
                        <Spin />
                    ) : ratings.length > 0 ? (
                        ratings.map((rating, index) => (
                            <Card key={index} className="rating-card">
                                <Rate disabled value={rating.rating_value} />
                                <Paragraph>{rating.rating_comment}</Paragraph>
                                <Tag color="blue">{rating.auth_user?.username || "Anonymos"}</Tag>
                            </Card>
                        ))
                    ) : (
                        <Paragraph>Chưa có đánh giá nào.</Paragraph>
                    )}
                </div>
                <div className="rating-content">
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>Viết đánh giá</p>
                    <Rate onChange={setRatingValue} value={ratingValue} className="rating-stars" />
                    <Input.TextArea
                        rows={3}
                        placeholder="Nhập nhận xét của bạn..."
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        className="rating-input"
                    />
                    <Button type="primary" onClick={handleRatingSubmit} loading={submitting} className="rating-submit">
                        Gửi đánh giá
                    </Button>
                </div>
            </div>
            <button className="back-button" onClick={() => navigate("/")}>
                Quay lại
            </button>
            <style>
                {`
                .container {
                    max-width: 800px;
                    margin: 40px auto;
                    background-color: #FFFFFF;
                    border-radius: 10px;
                    padding: 20px;
                }

                .drink-detail-card {
                    display: flex;
                }

                .drink-header {
                    text-align: left;
                        width: 300px;
    max-width: 100%;
                }
                .drink-info {
                    margin-top: 60px;
    margin-left: 20px;
                }
                .drink-image {
                    width: 100%;
                    max-width: 280px;
                    border-radius: 8px;
                    display: block;
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

                .rating-section {
                    margin-top: 30px;
                    padding: 15px;
                    background: #f9f9f9;
                    border-radius: 8px;
                    text-align: left;
                }

                .rating-title {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 15px;
                }

                .rating-content {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .rating-stars {
                    font-size: 24px;
                }

                .rating-input {
                    width: 100%;
                    max-width: 600px;
                }

                .rating-submit {
                    background-color: #1890ff;
                    border: none;
                    padding: 8px 20px;
                    font-size: 16px;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .rating-submit:hover {
                    background-color: #40a9ff;
                }

                .back-button {
                    margin-top: 20px;
                    background-color: #ff4d4f;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
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