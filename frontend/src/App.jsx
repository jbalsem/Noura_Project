import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Rewards from "./pages/Rewards";
import Navbar from "./components/Navbar";
import Categories from "./pages/Categories";
import Deals from "./pages/Deals";
import Locations from "./pages/Locations";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import AdminRoute from "./components/AdminRoute";
import AdminCategories from "./pages/AdminCategories";




export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
      </Routes>

    </BrowserRouter>
  );
}