import React, { useState } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSend = async () => {
        try {
            const res = await axios.post("http://localhost:8080/api/v1/auth/forgot-password", { email });
            message.success(res.data.message || "Gửi thành công. Vui lòng kiểm tra email.");
            navigate("/login");
        } catch (err) {
            message.error(err.response?.data?.message || "Gửi mật khẩu thất bại");
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                background: "linear-gradient(to right, #f0f2f5, #dbeafe)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card
                style={{
                    width: 420,
                    padding: 30,
                    borderRadius: 12,
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={3}>🔐 Quên mật khẩu</Title>
                    <Text type="secondary">
                        Nhập email đã đăng ký, chúng tôi sẽ gửi mật khẩu mới cho bạn.
                    </Text>
                </div>

                <Input
                    placeholder="Nhập email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="large"
                    style={{ marginBottom: 20, borderRadius: 8 }}
                />

                <Button
                    type="primary"
                    block
                    size="large"
                    style={{ borderRadius: 8, backgroundColor: "#1677ff" }}
                    onClick={handleSend}
                >
                    Gửi mật khẩu mới
                </Button>
            </Card>
        </div>
    );
};

export default ForgotPassword;
