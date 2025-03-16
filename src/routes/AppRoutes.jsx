import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Drinks from "../pages/Drinks";
import NotFound from "../pages/NotFound";
import AppLayout from "../components/AppLayout";
import AddDrink from "../components/AddDrink";
import UpdateDrink from "../components/UpdateDrink";
import ToppingList from "../components/ToppingList";
import { CartProvider } from "../context/CartContext";
import CheckoutPage from "../pages/CheckoutPage"
import HistoryCart from "../pages/HistoryCart"
import Login from "../pages/Login";
import DrinkDetail from "../pages/DrinkDetails";

const AppRoutes = () => {
  return (
    <Router>
      <CartProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/toppings" element={<ToppingList />} />
            <Route path="/login" element={<Login />} />

            <Route path="/drinks" element={<Drinks />} />
            <Route path="/add-drink" element={<AddDrink />} />
            <Route path="/update-drink/:id" element={<UpdateDrink />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/history-cart" element={<HistoryCart />} />
            <Route path="/drinks/:id" element={<DrinkDetail />} />
          </Routes>
        </AppLayout>
      </CartProvider>
    </Router>
  );
};

export default AppRoutes;