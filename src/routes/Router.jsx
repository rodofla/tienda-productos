// [EJERCICIO 2] Enrutamiento con y sin params
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import AdminProducts from "../pages/AdminProducts";
import AuthPage from "../pages/Auth";
import Home from "../pages/Home";
import MyOrders from "../pages/MyOrders";
import ProductDetail from "../pages/ProductDetail";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* sin params */}
        <Route path="/product/:id" element={<ProductDetail />} />{" "}
        {/* con params */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminProducts />} />{" "}
        {/* ruta protegida en UI */}
        <Route path="/mis-compras" element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  );
}
