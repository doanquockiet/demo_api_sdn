import React, { useEffect, useState } from "react";
import { Card, Table, Spin, Alert, Progress, Badge } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import {
  CheckCircleTwoTone,
  HourglassTwoTone,
  CloseCircleTwoTone,
  DollarCircleTwoTone,
} from "@ant-design/icons";

const COLORS = ["#1890ff", "#13c2c2", "#52c41a", "#faad14", "#ff4d4f"];

const OrderStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/order/statistics"
        );
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching order statistics:", error);
        setError("Failed to load order statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const columns = [
    {
      title: "Total Orders",
      dataIndex: "totalOrders",
      key: "totalOrders",
      render: (text) => (
        <Badge count={text} style={{ backgroundColor: "#52c41a" }} />
      ),
    },
    {
      title: "Total Revenue ($)",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (text) => (
        <strong style={{ color: "#1890ff" }}>${text.toFixed(2)}</strong>
      ),
    },
    {
      title: "Paid Orders",
      dataIndex: "paidOrders",
      key: "paidOrders",
      render: (text) => (
        <Badge count={text} style={{ backgroundColor: "#13c2c2" }} />
      ),
    },
    {
      title: "Pending Orders",
      dataIndex: "pendingOrders",
      key: "pendingOrders",
      render: (text) => (
        <Badge count={text} style={{ backgroundColor: "#faad14" }} />
      ),
    },
    {
      title: "Completed Orders",
      dataIndex: "completedOrders",
      key: "completedOrders",
      render: (text) => (
        <Badge count={text} style={{ backgroundColor: "#52c41a" }} />
      ),
    },
    {
      title: "Cancelled Orders",
      dataIndex: "cancelledOrders",
      key: "cancelledOrders",
      render: (text) => (
        <Badge count={text} style={{ backgroundColor: "#ff4d4f" }} />
      ),
    },
  ];

  const chartData = statistics
    ? [
        { name: "Total", value: statistics.totalOrders },
        { name: "Paid", value: statistics.paidOrders },
        { name: "Pending", value: statistics.pendingOrders },
        { name: "Completed", value: statistics.completedOrders },
        { name: "Cancelled", value: statistics.cancelledOrders },
      ]
    : [];

  const pieData = chartData.map((item, index) => ({
    ...item,
    fill: COLORS[index],
  }));

  return (
    <div
      style={{
        padding: 20,
        background: "linear-gradient(135deg, #e0f7fa, #ffebee)",
        minHeight: "100vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          title="📊 Order Statistics Dashboard"
          bordered
          style={{
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loading ? (
            <Spin tip="Loading statistics..." size="large" />
          ) : error ? (
            <Alert message={error} type="error" />
          ) : (
            <>
              <Table
                dataSource={[statistics]}
                columns={columns}
                pagination={false}
                rowKey="totalOrders"
                style={{ marginBottom: 20 }}
              />

              {/* Progress bars */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: 20,
                }}
              >
                <Card style={{ width: 200, textAlign: "center" }}>
                  <DollarCircleTwoTone
                    twoToneColor="#13c2c2"
                    style={{ fontSize: 24 }}
                  />
                  <p>Paid Orders</p>
                  <Progress
                    type="dashboard"
                    percent={
                      (statistics.paidOrders / statistics.totalOrders) * 100
                    }
                  />
                </Card>
                <Card style={{ width: 200, textAlign: "center" }}>
                  <HourglassTwoTone
                    twoToneColor="#faad14"
                    style={{ fontSize: 24 }}
                  />
                  <p>Pending Orders</p>
                  <Progress
                    type="dashboard"
                    percent={
                      (statistics.pendingOrders / statistics.totalOrders) * 100
                    }
                    status="active"
                  />
                </Card>
                <Card style={{ width: 200, textAlign: "center" }}>
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ fontSize: 24 }}
                  />
                  <p>Completed Orders</p>
                  <Progress
                    type="dashboard"
                    percent={
                      (statistics.completedOrders / statistics.totalOrders) *
                      100
                    }
                    status="success"
                  />
                </Card>
                <Card style={{ width: 200, textAlign: "center" }}>
                  <CloseCircleTwoTone
                    twoToneColor="#ff4d4f"
                    style={{ fontSize: 24 }}
                  />
                  <p>Cancelled Orders</p>
                  <Progress
                    type="dashboard"
                    percent={
                      (statistics.cancelledOrders / statistics.totalOrders) *
                      100
                    }
                    status="exception"
                  />
                </Card>
              </div>

              {/* Charts */}
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Card
                  title="📉 Order Overview (Bar Chart)"
                  bordered
                  style={{ width: "48%" }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card
                  title="📊 Order Breakdown (Pie Chart)"
                  bordered
                  style={{ width: "48%" }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        outerRadius={100}
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default OrderStatistics;
