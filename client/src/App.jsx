import "./App.css";
import "izitoast/dist/css/iziToast.min.css";
import "react-quill/dist/quill.snow.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import DetailProduct from "./pages/product/DetailProduct";
import Cart from "./pages/user/cart/Cart";
import Profile from "./pages/user/Profile";
import Order from "./pages/user/order/Orders";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import UsersPage from "./pages/admin/users/UsersPage";
import ProductsPage from "./pages/admin/products/ProductsPage";
import OrdersPage from "./pages/admin/orders/OrdersPage";
import ReportPage from "./pages/admin/report/ReportPage";
import LoginPage from "./components/login/LoginPage";
import Signup from "./components/signup/Signup";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./state/api/authApi";
import Confirm from "./pages/product/Confirm";
import AddProduct from "./pages/admin/products/AddProduct";
import EditProduct from "./pages/admin/products/EditProduct";
import SettingPage from "./pages/admin/setting/SettingPage";
import ChatPage from "./pages/admin/chat/ChatPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const load = localStorage.getItem("login");

    if (load) {
      dispatch(loadUser());
    }
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/daftar" element={<Signup />} />

        <Route path="/" element={<Home />} />

        <Route path="/:name" element={<DetailProduct />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/order" element={<Order />} />

        <Route path="/confirmation" element={<Confirm />} />

        <Route path="/admin-dashboard" element={<Dashboard />} />

        <Route path="/admin-pelanggan" element={<UsersPage />} />

        <Route path="/admin-produk" element={<ProductsPage />} />

        <Route path="/admin-produk/tambah" element={<AddProduct />} />

        <Route path="/admin-produk/edit/:name" element={<EditProduct />} />

        <Route path="/admin-pesanan" element={<OrdersPage />} />

        <Route path="/admin-laporan" element={<ReportPage />} />

        <Route path="/admin-setting" element={<SettingPage />} />

        <Route path="/admin-pesan" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
