import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Drinks from "../pages/Drinks";
import NotFound from "../pages/NotFound";
import AppLayout from "../components/AppLayout";
import AddDrink from "../components/AddDrink";
import UpdateDrink from "../components/UpdateDrink";
<<<<<<< HEAD
import ToppingList from "../components/ToppingList";
import Login from "../pages/Login";
import Cookies from "js-cookie";
const AppRoutes = () => {
    const isAuthenticated = () => {
        return !!Cookies.get("token");
    };

    const PrivateRoute = ({ children }) => {
        return isAuthenticated() ? children : <Navigate to="/login" replace />;
    };
    return (
        <Router>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/drinks" element={<Drinks />} />
                    <Route path="/add-drink" element={<PrivateRoute><AddDrink /></PrivateRoute>} />
                    <Route path="/update-drink/:id" element={<UpdateDrink />} />
                    <Route path="/toppings" element={<ToppingList />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AppLayout>
        </Router>
    );
=======
import { CartProvider } from "../context/CartContext";
import CheckoutPage from "../pages/CheckoutPage";
import HistoryCart from "../pages/HistoryCart";
const AppRoutes = () => {
  return (
    <Router>
      <CartProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/drinks" element={<Drinks />} />
            <Route path="/add-drink" element={<AddDrink />} />
            <Route path="/update-drink/:id" element={<UpdateDrink />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/history-cart" element={<HistoryCart />} />
          </Routes>
        </AppLayout>
      </CartProvider>
    </Router>
  );
>>>>>>> 6fcdcf63c84ad826e46ec849c8c1c13dfe9c1015
};

export default AppRoutes;
