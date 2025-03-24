import React, { useEffect, useState } from "react";
import { Result, Spin, Button } from "antd";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
    const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
    const [message, setMessage] = useState("Đang xác minh email...");
    const navigate = useNavigate();
    const location = useLocation();

    const [token, setToken] = useState(null);

    // ✅ Lấy token từ URL sau khi location sẵn sàng
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const foundToken = params.get("token");
        if (foundToken) {
            setToken(foundToken); // 👈 Set token khi đã chắc chắn có
        } else {
            setStatus("error");
            setMessage("Không tìm thấy token xác minh.");
        }
    }, [location.search]);

    // ✅ Chỉ gọi API khi token đã có
    useEffect(() => {
        if (!token) return;

        const verifyEmail = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/auth/verify-email?token=${token}`);
                setStatus("success");
                setMessage(res.data.message || "Xác minh thành công!");
            } catch (error) {
                setStatus("error");
                setMessage(
                    error.response?.data?.message || "Xác minh thất bại. Token không hợp lệ hoặc đã hết hạn."
                );
            }
        };

        verifyEmail();
    }, [token]); // 👈 Chỉ chạy khi token đã có

    return (
        <div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {status === "loading" ? (
                <Spin tip="Đang xác minh email..." size="large" />
            ) : (
                <Result
                    status={status}
                    title={status === "success" ? "Xác minh thành công!" : "Xác minh thất bại"}
                    subTitle={message}
                    extra={
                        <Button
                            type="primary"
                            onClick={() => navigate(status === "success" ? "/login" : "/register")}
                        >
                            {status === "success" ? "Đăng nhập ngay" : "Thử lại"}
                        </Button>
                    }
                />
            )}
        </div>
    );
};

export default VerifyEmail;
