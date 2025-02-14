import React, { Component } from "react";
import { Card, Spin, Typography, Row, Col, Tabs } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import axios from "axios";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

class RatingStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      ratingData: [],
      topDrinks: [],
      activeKey: "1",
      selectedMonth: new Date().getMonth() + 1, // Tháng hiện tại
      selectedYear: new Date().getFullYear(), // Năm hiện tại
      topDrinks: [],
    };
  }

  async componentDidMount() {
    await this.fetchRatingStatistics();
    await this.fetchTopRatedDrinks(
      this.state.selectedMonth,
      this.state.selectedYear
    );
  }

  fetchRatingStatistics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/rating/statistics",
        {
          headers: { "Cache-Control": "no-cache" },
        }
      );

      if (response.data) {
        const ratingData = Object.keys(
          response.data.rating_distribution || {}
        ).map((key) => ({
          name: `⭐ ${key} Sao`,
          value: response.data.rating_distribution[key],
        }));

        this.setState({ ratingData, loading: false });
      }
    } catch (error) {
      console.error("Lỗi khi lấy thống kê đánh giá:", error);
      this.setState({ loading: false });
    }
  };

  fetchTopRatedDrinks = async (month, year) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/rating/statistics/top-drinks?limit=5&month=${month}&year=${year}`,
        { headers: { "Cache-Control": "no-cache" } }
      );

      this.setState({ topDrinks: response.data || [] });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đồ uống được đánh giá cao:", error);
    }
  };

  handleFilterChange = (event, type) => {
    const value = parseInt(event.target.value, 10);
    this.setState({ [type]: value }, () =>
      this.fetchTopRatedDrinks(
        this.state.selectedMonth,
        this.state.selectedYear
      )
    );
  };

  handleTabChange = (key) => {
    this.setState({ activeKey: key });
  };

  render() {
    const {
      loading,
      ratingData,
      topDrinks,
      activeKey,
      selectedMonth,
      selectedYear,
    } = this.state;

    if (loading)
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin tip="Đang tải dữ liệu..." />
        </div>
      );

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF3333"];
    const currentYear = new Date().getFullYear();

    return (
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          📊 Thống kê Đánh Giá
        </Title>

        <Tabs defaultActiveKey="1" centered onChange={this.handleTabChange}>
          {/* Tab 1: Biểu đồ tròn - Phân bố điểm đánh giá */}
          <TabPane tab="📌 Phân bố điểm đánh giá" key="1">
            <Row justify="center">
              <Col span={24}>
                <Card
                  title="📌 Phân bố điểm đánh giá"
                  bordered
                  style={{ height: 450 }}
                >
                  <ResponsiveContainer
                    key={activeKey}
                    width="100%"
                    height={400}
                  >
                    <PieChart>
                      <Pie
                        data={ratingData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name, value }) => `${name}: ${value} lượt`}
                        animationBegin={100}
                        animationDuration={1000}
                      >
                        {ratingData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} lượt`, name]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <Text type="secondary">
                    **Mỗi màu đại diện cho một mức đánh giá từ ⭐1 đến ⭐5**.
                  </Text>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Biểu đồ cột - Top Đồ Uống Được Đánh Giá Cao */}
          <TabPane tab="🏆 Top Đồ Uống Được Đánh Giá Cao" key="2">
            <Row justify="center">
              <Col span={24}>
                <Card
                  title="🏆 Top Đồ Uống Được Đánh Giá Cao"
                  bordered
                  style={{ height: 500 }}
                >
                  {/* Dropdown chọn tháng & năm */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    {/* Chọn tháng */}
                    <select
                      style={{
                        padding: "8px",
                        fontSize: "16px",
                        borderRadius: "5px",
                      }}
                      onChange={(e) =>
                        this.handleFilterChange(e, "selectedMonth")
                      }
                      value={selectedMonth}
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Tháng {i + 1}
                        </option>
                      ))}
                    </select>

                    {/* Chọn năm */}
                    <select
                      style={{
                        padding: "8px",
                        fontSize: "16px",
                        borderRadius: "5px",
                      }}
                      onChange={(e) =>
                        this.handleFilterChange(e, "selectedYear")
                      }
                      value={selectedYear}
                    >
                      {[...Array(2)].map((_, i) => (
                        <option key={currentYear - i} value={currentYear - i}>
                          Năm {currentYear - i}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ResponsiveContainer
                    key={activeKey}
                    width="100%"
                    height={400}
                  >
                    <BarChart
                      data={topDrinks}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                    >
                      <XAxis
                        type="number"
                        domain={[1, 5]}
                        tickCount={5}
                        tickFormatter={(value) => `${value}⭐`}
                      />
                      <YAxis
                        dataKey="drink_name"
                        type="category"
                        width={180}
                        tick={{ fontSize: 12, fill: "#555" }}
                      />
                      <Tooltip
                        formatter={(value) => `${value.toFixed(2)} ⭐`}
                        contentStyle={{
                          background: "#fff",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="average_rating"
                        barSize={30}
                        animationBegin={200}
                        animationDuration={1200}
                      >
                        {topDrinks.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  <Text type="secondary">
                    **Chọn tháng và năm để xem top đồ uống được đánh giá cao
                    nhất trong thời gian đó.**
                  </Text>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default RatingStatistics;
