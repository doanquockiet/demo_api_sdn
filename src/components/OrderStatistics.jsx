import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Spin,
  Table,
  Select,
  Space,
  Statistic,
  List,
  Avatar,
  Typography,
} from "antd";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Cell,
} from "recharts";

import {
  ShoppingCartOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { TrophyOutlined } from "@ant-design/icons";
const { Text } = Typography;

const { Option } = Select;
// Màu sắc theo thứ hạng
const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
const OrderStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(null);
  const [orderStats, setOrderStats] = useState({});
  const [revenueGrowth, setRevenueGrowth] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topDrinks, setTopDrinks] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, [year, month]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      let query = `year=${year}`;
      if (month) query += `&month=${month}`;

      console.log("📢 Fetching statistics with:", query);

      const [orderRes, revenueRes, customerRes, drinksRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/v1/orders/statistics?${query}`),
        axios.get(
          `http://localhost:8080/api/v1/orders/statistics/revenue-growth?${query}`
        ),
        axios.get(
          `http://localhost:8080/api/v1/orders/statistics/top-customers?${query}`
        ),
        axios.get(
          `http://localhost:8080/api/v1/orders/statistics/top-selling-drinks?${query}`
        ),
      ]);

      console.log("📌 API Response:", {
        orderRes: orderRes.data,
        revenueRes: revenueRes.data,
        customerRes: customerRes.data,
        drinksRes: drinksRes.data,
      });

      setOrderStats(orderRes.data);
      setRevenueGrowth(revenueRes.data.monthlyRevenue || []);
      setTopCustomers(customerRes.data.topCustomers || []);
      setTopDrinks(drinksRes.data.topDrinks || []);
    } catch (error) {
      console.error("❌ Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };
  const vietnameseMonths = [
    "Tháng Một",
    "Tháng Hai",
    "Tháng Ba",
    "Tháng Tư",
    "Tháng Năm",
    "Tháng Sáu",
    "Tháng Bảy",
    "Tháng Tám",
    "Tháng Chín",
    "Tháng Mười",
    "Tháng Mười Một",
    "Tháng Mười Hai",
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
      }}
    >
      <Space
        size="middle"
        style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}
      >
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Chọn năm:</span>
        <Select
          defaultValue={year}
          onChange={(value) => setYear(value)}
          style={{ width: 120 }}
        >
          {Array.from({ length: 5 }, (_, i) => moment().year() - i).map(
            (yr) => (
              <Option key={yr} value={yr}>
                {yr}
              </Option>
            )
          )}
        </Select>

        <span style={{ fontSize: "16px", fontWeight: "bold" }}>
          Chọn tháng:
        </span>
        <Select
          allowClear
          placeholder="Tất cả"
          onChange={(value) => setMonth(value)}
          style={{ width: 120 }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i + 1} value={i + 1}>
              {vietnameseMonths[i]} {/* Lấy tên tháng từ mảng tiếng Việt */}
            </Option>
          ))}
        </Select>
      </Space>

      {loading ? (
        <Spin size="large" className="loading-spinner" />
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
            <Col span={6}>
              <Card
                bordered={false}
                style={{ backgroundColor: "#1890ff", color: "#fff" }}
              >
                <Statistic
                  title="Tổng Đơn Hàng"
                  value={orderStats.totalOrders}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: "#fff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                bordered={false}
                style={{ backgroundColor: "#52c41a", color: "#fff" }}
              >
                <Statistic
                  title="Tổng Doanh Thu"
                  value={`$${orderStats.totalRevenue?.toLocaleString()}`}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#fff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                bordered={false}
                style={{ backgroundColor: "#faad14", color: "#fff" }}
              >
                <Statistic
                  title="Đơn Hàng Đã Giao"
                  value={orderStats.statusCount?.Delivered || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#fff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                bordered={false}
                style={{ backgroundColor: "#ff4d4f", color: "#fff" }}
              >
                <Statistic
                  title="Đơn Hàng Đang Chờ"
                  value={orderStats.statusCount?.Pending || 0}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#fff" }}
                />
              </Card>
            </Col>
          </Row>
          {/* Biểu đồ doanh thu theo tháng */}
          <Card
            title={`Biểu Đồ Doanh Thu (${
              month ? `Ngày trong tháng ${month}` : "Các Tháng"
            })`}
            style={{ marginTop: 20 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              {revenueGrowth.length ? (
                <LineChart data={revenueGrowth}>
                  <XAxis
                    dataKey="_id"
                    tickFormatter={(value) =>
                      month ? `Ngày ${value}` : `Tháng ${value}`
                    }
                  />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#8884d8"
                    name="Doanh Thu ($)"
                  />
                </LineChart>
              ) : (
                <h3 style={{ textAlign: "center" }}>
                  Không có dữ liệu doanh thu
                </h3>
              )}
            </ResponsiveContainer>
          </Card>
          {/* Top 3 Đồ Uống Bán Chạy Nhất */}
          <Card
            title={`🥤 Top 3 Đồ Uống Bán Chạy Nhất (${
              month ? `Tháng ${month}` : "Cả Năm"
            })`}
            style={{ marginTop: 20, textAlign: "center" }}
          >
            {topDrinks.length ? (
              <Row justify="center" align="middle">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topDrinks} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="drink_name" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalSold" name="Số Lượng Bán">
                      {topDrinks.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Row>
            ) : (
              <h3 style={{ textAlign: "center", padding: "20px" }}>
                Không có dữ liệu
              </h3>
            )}
          </Card>
          ;{/* Top 3 Khách Hàng Chi Tiêu Nhiều Nhất */}
          <Card
            title={`🏆 Top 3 Khách Hàng Chi Tiêu Nhiều Nhất (${
              month ? `Tháng ${month}` : "Cả Năm"
            })`}
            style={{ marginTop: 20, textAlign: "center" }}
          >
            {topCustomers.length >= 3 ? (
              <Row justify="center" align="bottom" style={{ height: "250px" }}>
                {/* 🥈 Hạng 2 - Bên trái, thấp hơn */}
                <Col
                  span={6}
                  style={{ textAlign: "center", marginTop: "30px" }}
                >
                  <Avatar
                    size={80}
                    src={
                      topCustomers[1].user_avatar ||
                      "https://via.placeholder.com/80"
                    }
                  />
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    <TrophyOutlined
                      style={{ color: "silver", fontSize: "18px" }}
                    />{" "}
                    {topCustomers[1].full_name}
                  </div>
                  <Text style={{ fontSize: "14px", color: "#555" }}>
                    💰 ${topCustomers[1].totalSpent.toLocaleString()}
                  </Text>
                  <div
                    style={{
                      height: "60px",
                      background: "#d9d9d9",
                      width: "80%",
                      margin: "auto",
                      marginTop: "10px",
                      borderRadius: "8px",
                    }}
                  />
                </Col>

                {/* 🥇 Hạng 1 - Ở giữa, cao nhất */}
                <Col
                  span={6}
                  style={{ textAlign: "center", marginTop: "-30px" }}
                >
                  <Avatar
                    size={100}
                    src={
                      topCustomers[0].user_avatar ||
                      "https://via.placeholder.com/100"
                    }
                  />
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    <TrophyOutlined
                      style={{ color: "gold", fontSize: "20px" }}
                    />{" "}
                    {topCustomers[0].full_name}
                  </div>
                  <Text style={{ fontSize: "16px", color: "#222" }}>
                    💰 ${topCustomers[0].totalSpent.toLocaleString()}
                  </Text>
                  <div
                    style={{
                      height: "100px",
                      background: "#ffd700",
                      width: "80%",
                      margin: "auto",
                      marginTop: "10px",
                      borderRadius: "8px",
                    }}
                  />
                </Col>

                {/* 🥉 Hạng 3 - Bên phải, thấp hơn */}
                <Col
                  span={6}
                  style={{ textAlign: "center", marginTop: "30px" }}
                >
                  <Avatar
                    size={80}
                    src={
                      topCustomers[2].user_avatar ||
                      "https://via.placeholder.com/80"
                    }
                  />
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    <TrophyOutlined
                      style={{ color: "#cd7f32", fontSize: "18px" }}
                    />{" "}
                    {topCustomers[2].full_name}
                  </div>
                  <Text style={{ fontSize: "14px", color: "#555" }}>
                    💰 ${topCustomers[2].totalSpent.toLocaleString()}
                  </Text>
                  <div
                    style={{
                      height: "60px",
                      background: "#d9d9d9",
                      width: "80%",
                      margin: "auto",
                      marginTop: "10px",
                      borderRadius: "8px",
                    }}
                  />
                </Col>
              </Row>
            ) : (
              <h3 style={{ textAlign: "center", padding: "20px" }}>
                Không có đủ dữ liệu
              </h3>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default OrderStatistics;
