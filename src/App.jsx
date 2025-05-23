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
import Colors from "./Admin/pages/Colors";
import OrderSuccessfulPage from "./components/OrderSuccessfulPage";

const PublicLayout = () => {
  const location = useLocation();
  const hideRoutes = ["/login", "/signup"];

  const shouldHide = hideRoutes.includes(location.pathname);

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
        <Route path="/" element={<HomePage />} />
        <Route path="/newarrivals" element={<NewArrivalsPage />} />
        <Route path="/singleproduct/:id" element={<SingleProduct />} />
        <Route path="/ourstory" element={<OurStoryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/allproducts" element={<AllProductsPage />} />
        <Route path="/shop/:category" element={<ShopCategoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
        <Route path="/termsandconditions" element={<TermsPage />} />
        <Route path="/shippingpolicy" element={<ShippingPolicyPage />} />
        <Route path="/returnpolicy" element={<ReturnPolicyPage />} />
        <Route path="/collection/:collection" element={<CollectionPage />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/order-confirmation" element={<OrderSuccessfulPage />} />
      </Routes>

      {!shouldHide && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<PublicLayout />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Blogs />} />
          <Route path="collections" element={<Collections />} />
          <Route path="colors" element={<Colors />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="contact" element={<Contact />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
