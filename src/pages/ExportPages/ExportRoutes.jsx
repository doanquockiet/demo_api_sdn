import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Dropdown, Menu, Layout, Card, Space, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import ThongKeDonHang from "./OrderStatistics";
import ThongKeSanPham from "./ThongKeSanPham";
import ThongKeDanhGia from "./ThongKeDanhGia";

const { Content } = Layout;
const { Title } = Typography;

const ExportRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("/export/don-hang");

  // Mặc định hiển thị Thống Kê Đơn Hàng khi vào `/export`
  useEffect(() => {
    if (location.pathname === "/export") {
      navigate("/export/don-hang", { replace: true });
    }
  }, [location, navigate]);

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    navigate(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="/export/don-hang">📦 Thống Kê Đơn Hàng</Menu.Item>
      <Menu.Item key="/export/san-pham">🛒 Thống Kê Sản Phẩm</Menu.Item>
      <Menu.Item key="/export/danh-gia">⭐ Thống Kê Đánh Giá</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          textAlign: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <Card>
            <Space>
              <Dropdown overlay={menu} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <DownOutlined /> Chọn Thống Kê
                </a>
              </Dropdown>
            </Space>
          </Card>
          <Routes>
            <Route path="/don-hang" element={<ThongKeDonHang />} />
            <Route path="/san-pham" element={<ThongKeSanPham />} />
            <Route path="/danh-gia" element={<ThongKeDanhGia />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
};

export default ExportRoutes;
