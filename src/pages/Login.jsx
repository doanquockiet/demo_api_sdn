import React, { useState } from "react";
import { Card, Typography, Input, Button, Modal, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleAuth from "./GoogleLogin";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    user_name: "",
    password: "",
    full_name: "",
    email: "",
  });
  const [loginForm, setLoginForm] = useState({
    user_name: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        loginForm
      );
      message.success("Đăng nhập thành công!");
      // Lưu token và role vào local storage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role); // Lưu role
      // Chuyển hướng đến trang chính
      navigate("/");
    } catch (err) {
      message.error(err.response?.data?.message || "Đăng nhập thất bại.");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        registerForm
      );
      message.success(
        res.data.message ||
          "Đăng ký thành công! Vui lòng kiểm tra email để xác minh."
      );
      setShowRegisterModal(false);
      setRegisterForm({
        user_name: "",
        password: "",
        full_name: "",
        email: "",
      });
    } catch (err) {
      message.error(err.response?.data?.message || "Đăng ký thất bại.");
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={3}>Đăng Nhập</Title>
        <Input
          placeholder="Tên đăng nhập"
          type="email"
          className="login-input"
          value={loginForm.user_name}
          onChange={(e) =>
            setLoginForm({ ...loginForm, user_name: e.target.value })
          }
        />
        <Input
          placeholder="Mật khẩu"
          type="password"
          className="login-input"
          value={loginForm.password}
          onChange={(e) =>
            setLoginForm({ ...loginForm, password: e.target.value })
          }
        />
        <Button type="primary" className="login-button" onClick={handleLogin}>
          Đăng Nhập
        </Button>

        <div className="login_google">
          <GoogleAuth />
        </div>

        <Link to="/forgot-password" className="forgot-password-link">
          Quên mật khẩu?
        </Link>

        {/* 👉 Link để mở modal đăng ký */}
        <div style={{ marginTop: "10px" }}>
          <span>Bạn chưa có tài khoản? </span>
          <a onClick={() => setShowRegisterModal(true)}>Đăng ký</a>
        </div>
      </Card>

      {/* ✅ Modal đăng ký */}
      <Modal
        title="Đăng ký tài khoản"
        open={showRegisterModal}
        onCancel={() => setShowRegisterModal(false)}
        onOk={handleRegister}
        okText="Đăng ký"
        cancelText="Hủy"
      >
        <Input
          placeholder="Tên đăng nhập"
          value={registerForm.user_name}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, user_name: e.target.value })
          }
          className="login-input"
        />
        <Input
          placeholder="Họ tên đầy đủ"
          value={registerForm.full_name}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, full_name: e.target.value })
          }
          className="login-input"
        />
        <Input
          placeholder="Email"
          type="email"
          value={registerForm.email}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, email: e.target.value })
          }
          className="login-input"
        />
        <Input.Password
          placeholder="Mật khẩu"
          value={registerForm.password}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, password: e.target.value })
          }
          className="login-input"
        />
      </Modal>

      {/* 👇 Styles giữ nguyên */}
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
          .login_google {
              margin-top: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default Login;
