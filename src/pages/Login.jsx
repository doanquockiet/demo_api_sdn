import React from "react";
import { Card, Typography } from "antd";
import GoogleAuth from "./GoogleLogin";


const { Title } = Typography;

const Login = () => {
    return (
        <div className="login-container">
            <Card className="login-card" style={{ width: 400, textAlign: "center", padding: "20px", borderRadius: "10px" }}>
                <Title level={3}>Đăng Nhập</Title>
                <GoogleAuth />
            </Card>
        </div>
    );
};

export default Login;
