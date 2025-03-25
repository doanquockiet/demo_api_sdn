import React, { useState, useEffect } from "react";
import { DatePicker, Button, Card, Space, message } from "antd";
import axios from "axios";
import OrderTable from "../../components/ExportSatistics/BangDonHang";
import dayjs from "dayjs";

const { MonthPicker } = DatePicker;

const OrderStatistics = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null); // Mặc định là null để lấy tất cả dữ liệu
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [selectedYear, selectedMonth]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/export/order`, {
        params: {
          year: selectedYear || undefined, // Không gửi năm nếu selectedYear = null
          month: selectedMonth || undefined, // Không gửi tháng nếu selectedMonth = null
        },
      });

      if (res.data.success) {
        setOrders(res.data.data);
      } else {
        message.error("Không thể lấy dữ liệu đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu.");
    }
    setLoading(false);
  };

  const handleExport = () => {
    window.open(
      `http://localhost:8080/api/v1/export/order?year=${
        selectedYear || ""
      }&month=${selectedMonth || ""}&exportFile=true`
    );
  };

  return (
    <Card title="Thống Kê Đơn Hàng" bordered={false}>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker
          picker="year"
          onChange={(_, yearString) => setSelectedYear(yearString || null)}
          placeholder="Chọn Năm"
        />
        <MonthPicker
          onChange={(_, monthString) =>
            setSelectedMonth(monthString ? monthString.split("-")[1] : null)
          }
          placeholder="Chọn Tháng"
        />

        <Button type="primary" onClick={fetchOrders} loading={loading}>
          Lấy Dữ Liệu
        </Button>
        <Button
          type="default"
          onClick={handleExport}
          disabled={orders.length === 0}
        >
          Xuất Excel
        </Button>
      </Space>
      <OrderTable orders={orders} loading={loading} />
    </Card>
  );
};

export default OrderStatistics;
