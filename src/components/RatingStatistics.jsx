import React, { useState, useEffect } from "react";
import { Table, Card, Spin, Typography, Rate, Image, Row, Col } from "antd";
import axios from "axios";

const { Title } = Typography;

const RatingStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [allRatings, setAllRatings] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [topSelling, setTopSelling] = useState([]);

  // Quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Fetch dữ liệu từ API
  const fetchData = async (page = 1, size = 5) => {
    setLoading(true);
    try {
      const allRatingsRes = await axios.get(
        `http://localhost:8080/api/v1/ratingStatics/getAll?page=${page}&size=${size}`,
        { headers: { "Cache-Control": "no-cache", Pragma: "no-cache" } }
      );
      const topRatedRes = await axios.get(
        `http://localhost:8080/api/v1/ratingStatics/topRating?page=${page}&size=${size}`,
        { headers: { "Cache-Control": "no-cache", Pragma: "no-cache" } }
      );
      const topSellingRes = await axios.get(
        `http://localhost:8080/api/v1/ratingStatics/topSelling?page=${page}&size=${size}`,
        { headers: { "Cache-Control": "no-cache", Pragma: "no-cache" } }
      );

      setAllRatings(allRatingsRes.data || []);
      setTopRated(topRatedRes.data?.drinks || []);
      setTopSelling(topSellingRes.data?.drinks || []);
      setTotalRecords(allRatingsRes.data?.total || 0); // Cập nhật tổng số bản ghi
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dữ liệu khi component mount hoặc trang thay đổi
  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Hàm xử lý thay đổi trang
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Cấu hình cột cho bảng "Tất cả đánh giá"
  const allRatingsColumns = [
    { title: "Tên đồ uống", dataIndex: "drink_name", key: "drink_name" },
    {
      title: "Số lượt đánh giá",
      dataIndex: "totalRatings",
      key: "totalRatings",
    },
    {
      title: "Điểm trung bình",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (value) => <Rate allowHalf disabled value={value} />,
    },
  ];

  // Cấu hình cột cho bảng "Top Đồ Uống Được Đánh Giá Cao Nhất"
  const topRatedColumns = [
    {
      title: "Hình ảnh",
      dataIndex: "drink_image",
      key: "drink_image",
      render: (image) => <Image width={50} src={image} />,
    },
    { title: "Tên đồ uống", dataIndex: "drink_name", key: "drink_name" },
    {
      title: "Số lượt đánh giá",
      dataIndex: "totalRatings",
      key: "totalRatings",
    },
    {
      title: "Điểm trung bình",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (value) => <Rate allowHalf disabled value={value} />,
    },
    { title: "Giá", dataIndex: "drink_price", key: "drink_price" },
  ];

  // Cấu hình cột cho bảng "Top Đồ Uống Bán Chạy Nhất"
  const topSellingColumns = [
    {
      title: "Hình ảnh",
      dataIndex: "drink_image",
      key: "drink_image",
      render: (image) => <Image width={50} src={image} />,
    },
    { title: "Tên đồ uống", dataIndex: "drink_name", key: "drink_name" },
    {
      title: "Số lượng bán",
      dataIndex: "totalQuantitySold",
      key: "totalQuantitySold",
    },
    { title: "Giá", dataIndex: "drink_price", key: "drink_price" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        📊 Thống Kê Đánh Giá & Bán Hàng
      </Title>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {/* Danh sách tất cả đánh giá */}
            <Col span={24}>
              <Card
                title="📌 Tất Cả Đánh Giá"
                bordered
                style={{ background: "#fafafa" }}
              >
                <Table
                  bordered
                  dataSource={allRatings}
                  columns={allRatingsColumns}
                  rowKey="drink_name"
                  pagination={{
                    pageSize,
                    current: currentPage,
                    onChange: handleTableChange,
                  }}
                />
              </Card>
            </Col>

            {/* Top 5 Đồ Uống Được Đánh Giá Cao Nhất */}
            <Col span={12}>
              <Card
                title="🏆 Top 5 Đồ Uống Được Đánh Giá Cao Nhất"
                bordered
                style={{ background: "#e6f7ff" }}
              >
                <Table
                  bordered
                  dataSource={topRated}
                  columns={topRatedColumns}
                  rowKey="drink_id"
                  pagination={{
                    pageSize,
                    current: currentPage,
                    onChange: handleTableChange,
                  }}
                />
              </Card>
            </Col>

            {/* Top 5 Đồ Uống Bán Chạy Nhất */}
            <Col span={12}>
              <Card
                title="🔥 Top 5 Đồ Uống Bán Chạy Nhất"
                bordered
                style={{ background: "#fffbe6" }}
              >
                <Table
                  bordered
                  dataSource={topSelling}
                  columns={topSellingColumns}
                  rowKey="drink_id"
                  pagination={{
                    pageSize,
                    current: currentPage,
                    onChange: handleTableChange,
                  }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default RatingStatistics;
