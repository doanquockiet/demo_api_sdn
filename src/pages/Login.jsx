import React from "react";
import { Card, Typography, Input, Button } from "antd";
import { Link } from "react-router-dom";
import GoogleAuth from "./GoogleLogin";

const { Title } = Typography;

const Login = () => {
    return (
        <div className="login-container">
            <Card className="login-card">
                <Title level={3}>Đăng Nhập</Title>

                <Input placeholder="Email" type="email" className="login-input" />
                <Input placeholder="Mật khẩu" type="password" className="login-input" />

                <Button type="primary" className="login-button">Đăng Nhập</Button>

                <div className="login_google">
                    <GoogleAuth />
                </div>

                <Link to="/forgot-password" className="forgot-password-link">Quên mật khẩu?</Link>
            </Card>

            <style>
                {`
                    html, body {
                        height: 100%;
                        margin: 0;
                        overflow: hidden;
                    }
                    .login-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100vw;
                        height: 90vh;
                        background: #f5f5f5;
                    }
                    .login-card {
                        width: 400px;
                        text-align: center;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        background: white;
                    }
                    .login-input {
                        width: 100%;
                        margin: 10px 0;
                        padding: 10px;
                        border-radius: 5px;
                        border: 1px solid #ddd;
                    }
                    .login-button {
                        width: 100%;
                        margin-top: 15px;
                        background-color: #1890ff;
                        color: white;
                    }
                    .forgot-password-link {
                        display: block;
                        margin-top: 10px;
                        color: #1890ff;
                        text-decoration: none;
                    }
                    .forgot-password-link:hover {
                        text-decoration: underline;
                    }
                        .login_google{
                        margin-top: 20px
                        }
                `}
            </style>
        </div>
    );
};

export default Login;
