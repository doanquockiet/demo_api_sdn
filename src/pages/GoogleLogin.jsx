import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { message } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const clientId = "1076296472223-qi98r64edgmpmbanu8825vnf21ttddk8.apps.googleusercontent.com";
const GoogleAuth = () => {
    const navigate = useNavigate();
    const handleSuccess = async (response) => {
        try {
            console.log("Google Response:", response);
            const userData = jwtDecode(response.credential);
            console.log("Decoded Google User:", userData);

            const { name, email, picture, sub } = userData;


            const res = await axios.post("http://localhost:8080/api/v1/auth/loginByGoogle", {
                user_name: name,
                full_name: name,
                email,
                user_avatar: picture,
                google_id: sub,
            });

            console.log("Server Response:", res.data);
            if (res.data.success && res.data.data.token) {
                message.success("Đăng nhập thành công!");
                Cookies.set("token", res.data.data.token, { expires: 1 });
                navigate("/");
            } else {
                message.error("Lỗi: Token không tồn tại!");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập Google:", error);
            message.error("Đăng nhập thất bại!");
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => message.error("Lỗi đăng nhập Google!")}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleAuth;
