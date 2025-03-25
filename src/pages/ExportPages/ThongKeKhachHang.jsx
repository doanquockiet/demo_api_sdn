import React, { useState, useEffect } from "react";
import { DatePicker, Button, Card, Space, message } from "antd";
import axios from "axios";
import BangKhachHang from "../../components/ExportSatistics/BangKhachHang";

const { MonthPicker } = DatePicker;

const ThongKeKhachHang = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null); // Mặc định là null để lấy tất cả dữ liệu
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [selectedYear, selectedMonth]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/export/customer`,
        {
          params: {
            year: selectedYear || undefined, // Không gửi nếu selectedYear = null
            month: selectedMonth || undefined, // Không gửi nếu selectedMonth = null
          },
        }
      );

      if (res.data.success) {
        setCustomers(res.data.data);
      } else {
        message.error("Không thể lấy dữ liệu khách hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu.");
    }
    setLoading(false);
  };

  const handleExport = () => {
    window.open(
      `http://localhost:8080/api/v1/export/customer?year=${
        selectedYear || ""
      }&month=${selectedMonth || ""}&exportFile=true`
    );
  };

  return (
    <Card title="Thống Kê Khách Hàng" bordered={false}>
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

        <Button type="primary" onClick={fetchCustomers} loading={loading}>
          Lấy Dữ Liệu
        </Button>
        <Button
          type="default"
          onClick={handleExport}
          disabled={customers.length === 0}
        >
          Xuất Excel
        </Button>
      </Space>
      <BangKhachHang customers={customers} loading={loading} />
    </Card>
  );
};

export default ThongKeKhachHang;
