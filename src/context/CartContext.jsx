import React, { createContext, useContext, useState, useEffect } from "react";

// Tạo context giỏ hàng
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  //Lấy giỏ hàng từ localStorage và sessionStorage khi ứng dụng khởi chạy
  useEffect(() => {
    // Lấy từ localStorage
    const storedCart = localStorage.getItem("cart");
    const storedTimestamp = localStorage.getItem("cartTimestamp");

    if (storedCart && storedTimestamp) {
      const now = new Date().getTime();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 ngày

      if (now - parseInt(storedTimestamp) < thirtyDays) {
        setCart(JSON.parse(storedCart)); // Load giỏ hàng nếu còn hạn sử dụng
      } else {
        localStorage.removeItem("cart"); // Xóa nếu quá hạn
        localStorage.removeItem("cartTimestamp");
      }
    }

    // Lấy từ sessionStorage
    const sessionCart = sessionStorage.getItem("cart");
    if (sessionCart) {
      setCart(JSON.parse(sessionCart));
    }
  }, []);

  // Hàm lưu giỏ hàng vào localStorage và sessionStorage
  const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartTimestamp", new Date().getTime().toString());
    sessionStorage.setItem("cart", JSON.stringify(cart));
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== productId);
      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.drink_price * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCart([]); // Xóa toàn bộ giỏ hàng
    localStorage.removeItem("cart");
    localStorage.removeItem("cartTimestamp");
    sessionStorage.removeItem("cart");
  };

  // Lưu đơn hàng vào lịch sử
  const saveOrderToHistory = (order) => {
    const history = JSON.parse(localStorage.getItem("orderHistory")) || [];
    history.push(order);
    localStorage.setItem("orderHistory", JSON.stringify(history));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        calculateTotal,
        clearCart,
        saveOrderToHistory,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
