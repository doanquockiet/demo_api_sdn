import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Trang Chủ</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý đồ uống.</p>
            <Link to="/drinks">
                <Button type="primary">Xem Danh Sách Đồ Uống</Button>
            </Link>
        </div>
    );
};

export default Home;
