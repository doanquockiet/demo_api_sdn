import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Drinks from "../pages/Drinks";
import NotFound from "../pages/NotFound";
import AppLayout from "../components/AppLayout";
import AddDrink from "../components/AddDrink";
import UpdateDrink from "../components/UpdateDrink";
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
};

export default AppRoutes;
