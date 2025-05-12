import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

// Pages
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import NewArrivalsPage from "./components/NewArrivalsPage";
import SingleProduct from "./components/SingleProduct";
import OurStoryPage from "./components/OurStoryPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Checkout from "./components/CheckoutPage";
import ContactUs from "./components/ContactUs";
import AllProductsPage from "./components/AllProductsPage";
import ShopCategoryPage from "./components/ShopCategoryPage";
import ProfilePage from "./components/ProfilePage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import TermsPage from "./components/TermsPage";
import ShippingPolicyPage from "./components/ShippingPolicyPage";
import ReturnPolicyPage from "./components/ReturnPolicyPage";
import Cart from "./components/Cart";

// Admin Pages
import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import Products from "./Admin/pages/Products";
import Blogs from "./Admin/pages/Categories";
import Contact from "./Admin/pages/Contact";
import Reviews from "./Admin/pages/Reviews";
import Users from "./Admin/pages/Users";
import Orders from "./Admin/pages/Orders";
import CollectionPage from "./components/CollectionPage";
import Collections from "./Admin/pages/Collections";

// Function to decode JWT token
// function decodeJwt(token) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error("Error decoding JWT:", error);
//     return null;
//   }
// }

// Function to check if token is expired and remove it
// function checkTokenExpiration() {
//   const token = localStorage.getItem("authToken"); // Adjust key as needed
//   if (!token) return;

//   const decoded = decodeJwt(token);
//   if (!decoded || !decoded.exp) {
//     localStorage.removeItem("authToken");
//     return;
//   }

//   const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
//   if (decoded.exp < currentTime) {
//     console.log("Token expired, removing from localStorage");
//     localStorage.removeItem("authToken");
//   }
// }

const PublicLayout = () => {
  const location = useLocation();
  const hideRoutes = ["/login", "/signup"];
  // const hideFooterRoutes = ["/login", "/signup"];

  const shouldHide = hideRoutes.includes(location.pathname);
  // const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!shouldHide && <Header />}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          className: "w-76",
          style: {
            background: "white",
            color: "#1f2937",
            padding: "14px 16px",
            borderRadius: "0.5rem",
            fontSize: "14px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #3b82f6",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#D1FAE5",
            },
            style: {
              borderLeft: "4px solid #10b981",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#FEE2E2",
            },
            style: {
              borderLeft: "4px solid #ef4444",
            },
          },
        }}
      />

      <Routes>
        {/* 30/04/2025 - Header & Footer also */}
        <Route path="/" element={<HomePage />} />
        {/* 01/05/2025 */}
        <Route path="/newarrivals" element={<NewArrivalsPage />} />
        <Route path="/singleproduct" element={<SingleProduct />} />
        <Route path="/ourstory" element={<OurStoryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* 02/05/2025 */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<ContactUs />} />
        {/* 05/05/2025 */}
        <Route path="/allproducts" element={<AllProductsPage />} />
        <Route path="/shop/:category" element={<ShopCategoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
        <Route path="/termsandconditions" element={<TermsPage />} />
        <Route path="/shippingpolicy" element={<ShippingPolicyPage />} />
        <Route path="/returnpolicy" element={<ReturnPolicyPage />} />
        {/* 06/05/2025 */}
        {/* <Route path="/cart" element={<Cart />} /> */}
        {/* 08/05/2025 */}
        <Route path="/collection/:collection" element={<CollectionPage />} />
        <Route path="/collections" element={<Collections />} />
      </Routes>

      {!shouldHide && <Footer />}
    </>
  );
};

function App() {
  // useEffect(() => {
  //   checkTokenExpiration(); // Run on mount
  //   const interval = setInterval(checkTokenExpiration, 60 * 1000); // Check every minute

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, []);

  return (
    <Router>
      <Routes>
        {/* Public Site Layout */}
        <Route path="/*" element={<PublicLayout />} />

        {/* Admin Panel Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="categories" element={<Blogs />} />
          <Route path="collections" element={<Collections />} />
          <Route path="users" element={<Users />} />
          <Route path="contact" element={<Contact />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
