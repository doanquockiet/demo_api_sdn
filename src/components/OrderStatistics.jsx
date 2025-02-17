import React, { useState, useEffect } from "react";
import { Card, Col, Row, Spin, Table, Select, Space, Statistic } from "antd";
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
} from "recharts";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");
const { Option } = Select;

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

          {/* Biểu đồ đồ uống bán chạy */}
          <Card
            title={`Top 3 Đồ Uống Bán Chạy Nhất (${
              month ? `Tháng ${month}` : "Cả Năm"
            })`}
            style={{ marginTop: 20 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              {topDrinks.length ? (
                <BarChart data={topDrinks}>
                  <XAxis dataKey="drink_name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalSold" fill="#82ca9d" name="Số Lượng Bán" />
                </BarChart>
              ) : (
                <h3 style={{ textAlign: "center" }}>
                  Không có dữ liệu bán hàng
                </h3>
              )}
            </ResponsiveContainer>
          </Card>

          <Card
            title={`Top 3 Khách Hàng Chi Tiêu Nhiều Nhất (${
              month ? `Tháng ${month}` : "Cả Năm"
            })`}
            style={{ marginTop: 20 }}
          >
            {topCustomers.length === 0 ? (
              <h3 style={{ textAlign: "center" }}>Không có dữ liệu</h3>
            ) : (
              <Table
                dataSource={topCustomers.map((customer, index) => ({
                  ...customer,
                  key: index, // ✅ Fix lỗi hiển thị nếu _id bị sai
                }))}
                columns={[
                  {
                    title: "Khách Hàng",
                    dataIndex: "user_name",
                    key: "user",
                    render: (text) => text || "Không có tên",
                  },
                  {
                    title: "Tổng Chi Tiêu ($)",
                    dataIndex: "totalSpent",
                    key: "totalSpent",
                    render: (value) => `$${value.toLocaleString()}`,
                  },
                ]}
                pagination={false}
              />
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default OrderStatistics;
