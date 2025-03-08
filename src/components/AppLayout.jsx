import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const items = [
    { key: "1", label: <Link to="/">Trang Chủ</Link> },
    { key: "2", label: <Link to="/drinks">Đồ Uống</Link> },
    { key: "4", label: <Link to="/toppings">Toppings</Link> },
    { key: "5", label: <Link to="/login">Login</Link> },


];

const AppLayout = ({ children }) => {
    return (
        <Layout className="layout">
            <Header>
                <Menu theme="dark" mode="horizontal" items={items} />
            </Header>
            <Content style={{ padding: "20px" }}>{children}</Content>
            <Footer style={{ textAlign: "center" }}>Ant Design ©2025</Footer>
        </Layout>
    );
};

export default AppLayout;
