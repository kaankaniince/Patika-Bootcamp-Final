import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShellLayout } from "../layout/appShellLayout";
import Home from "../pages/Home/Home";
import SignUp from "../pages/SignUp/SignUp";
import Cart from "../pages/Cart/CartDetail";
import Contact from "../pages/Contact/Contact";
import About from "../pages/About/About";
import Profile from "../pages/Profile/Profile";
import Login from "../pages/LogIn/LogIn";
import BookDetails from "../pages/Details/BookDetails";
import Category from "../pages/Category/Category";
import EditProfile from "../pages/EditProfile/EditProfile";
import { AppShellAdminLayout } from "../layout/appShellAdminLayout";
import { Customers } from "../pages/Customers/Customers";
import { Products } from "../pages/Products/Products";
import PrivateRoute from "./PrivateRoute"; // Adjust path if necessary
import Orders from "../pages/Orders/Orders";
import { useAuth } from "../store/AuthContext";

export default function AppRoutes() {
  const { user } = useAuth(); // Assuming your context provides the logged-in user info

  // Conditionally choose the layout based on the user role
  const isAdmin = user?.role === "admin"; // Check if the user is an admin

  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route element={isAdmin ? <AppShellAdminLayout /> : <AppShellLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Category" element={<Category />} />
          <Route path="/About" element={<About />} />
          <Route path="/Cart" element={<Cart />} />
          <Route
            path="/Profile"
            element={
              <PrivateRoute requiredRoles={["admin", "customer"]}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/Profile/:id"
            element={
              <PrivateRoute requiredRoles={["admin", "customer"]}>
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route path="/book/:slug" element={<BookDetails />} />
        </Route>

        {/* Admin Routes */}
        <Route element={isAdmin ? <AppShellAdminLayout /> : <AppShellLayout />}>
          <Route
            path="/Customers"
            element={
              <PrivateRoute requiredRole="admin">
                <Customers />
              </PrivateRoute>
            }
          />
          <Route
            path="/Products"
            element={
              <PrivateRoute requiredRole="admin">
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/Orders"
            element={
              <PrivateRoute requiredRole="admin">
                <Orders />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
