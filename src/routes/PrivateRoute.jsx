import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import '@ant-design/v5-patch-for-react-19';

const PrivateRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const modalShown = useRef(false); // Sử dụng useRef để theo dõi trạng thái modal

    useEffect(() => {
        if (!token && !allowedRoles.includes(role) && !modalShown.current) {
            modalShown.current = true; // Đánh dấu modal đã được hiển thị
            Modal.confirm({
                title: 'Thông báo',
                content: 'Bạn cần đăng nhập để truy cập.',
                okText: 'OK',
                cancelButtonProps: { style: { display: 'none' } },
                onOk: () => {
                    navigate('/login');
                },
            });
        }
    }, [token, role, allowedRoles, navigate]);

    if (!token || !allowedRoles.includes(role)) {
        return null; // Không render gì cho tới khi user xác nhận
    }

    return children;
};

export default PrivateRoute;