import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sell from "./pages/sell";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";

function NotFound() {
  return <main className="container page-section empty-state"><h1>Page not found</h1><p>The page you're looking for doesn't exist.</p><a className="button button-primary" href="/">Go home</a></main>;
}

export default function App() {
  return <div className="app-shell"><Navbar /><div className="main-content"><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/marketplace" element={<Marketplace />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/sell" element={<Sell />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes></div><Footer /></div>;
}
