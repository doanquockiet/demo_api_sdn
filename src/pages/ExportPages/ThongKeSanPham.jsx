import React, { useState, useEffect } from "react";
import { DatePicker, Button, Card, Space, message } from "antd";
import axios from "axios";
import BangSanPham from "../../components/ExportSatistics/BangSanPham";

const { MonthPicker } = DatePicker;

const ThongKeSanPham = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null); // Mặc định là null để lấy tất cả dữ liệu
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedYear, selectedMonth]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/export/product`,
        {
          params: {
            year: selectedYear || undefined, // Không gửi nếu selectedYear = null
            month: selectedMonth || undefined, // Không gửi nếu selectedMonth = null
          },
        }
      );

      if (res.data.success) {
        setProducts(res.data.data);
      } else {
        message.error("Không thể lấy dữ liệu sản phẩm.");
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu.");
    }
    setLoading(false);
  };

  const handleExport = () => {
    window.open(
      `http://localhost:8080/api/v1/export/product?year=${
        selectedYear || ""
      }&month=${selectedMonth || ""}&exportFile=true`
    );
  };

  return (
    <Card title="Thống Kê Sản Phẩm" bordered={false}>
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

        <Button type="primary" onClick={fetchProducts} loading={loading}>
          Lấy Dữ Liệu
        </Button>
        <Button
          type="default"
          onClick={handleExport}
          disabled={products.length === 0}
        >
          Xuất Excel
        </Button>
      </Space>
      <BangSanPham products={products} loading={loading} />
    </Card>
  );
};

export default ThongKeSanPham;
