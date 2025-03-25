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
import CheckoutPage from "../pages/CheckoutPage";
import HistoryCart from "../pages/HistoryCart";
import Login from "../pages/Login";
import DrinkDetail from "../pages/DrinkDetails";
import VerifyEmail from "../components/VerifyEmail";
import ForgotPassword from "../components/ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import RatingStatistics from "../components/RatingStatistics";

const AppRoutes = () => {
  return (
    <Router>
      <CartProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/drinks" element={<Drinks />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/toppings" element={<ToppingList />} />
            <Route
              path="/add-drink"
              element={
                <PrivateRoute allowedRoles={["staff"]}>
                  <AddDrink />
                </PrivateRoute>
              }
            />
            <Route
              path="/update-drink/:id"
              element={
                <PrivateRoute allowedRoles={["staff"]}>
                  <UpdateDrink />
                </PrivateRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <PrivateRoute allowedRoles={["customer"]}>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/history-cart"
              element={
                <PrivateRoute allowedRoles={["customer"]}>
                  <HistoryCart />
                </PrivateRoute>
              }
            />
            <Route path="/ratingStatic" element={<RatingStatistics />} />

            <Route path="/drinks/:id" element={<DrinkDetail />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/export*"
              element={
                <PrivateRoute allowedRoles={["staff"]}>
                  <ExportRoutes />
                </PrivateRoute>
              }
            />
          </Routes>
        </AppLayout>
      </CartProvider>
    </Router>
  );
};

export default AppRoutes;
