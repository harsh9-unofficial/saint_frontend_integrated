import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { USER_BASE_URL } from "../config";

const OrderSuccessfulPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !userId || !token) {
        setError("Invalid order or session. Please log in or try again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${USER_BASE_URL}/orders/getbyid/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrderDetails(response.data.order);
        setError("");
      } catch (err) {
        console.error(
          "Fetch Order Error:",
          err.response?.status,
          err.response?.data
        );
        setError(
          err.response?.data?.message || "Failed to load order details."
        );
        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, userId, token, navigate]);

  const calculateSubtotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="px-2 md:px-4 py-8 lg:py-12 bg-white text-gray-800 container mx-auto">
      <h2 className="text-3xl font-bold mb-2">Order Successful!</h2>
      <p className="text-sm text-gray-500 mb-8">
        Home / Cart / Checkout / Order Confirmation
      </p>

      {loading && (
        <p className="text-center text-gray-600">Loading order details...</p>
      )}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {!loading && !error && orderDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-8 gap-5 xl:gap-10">
          {/* Order Details */}
          <div className="lg:col-span-3 xl:col-span-5 space-y-6">
            <div className="border border-gray-300 p-6 rounded-md">
              <h3 className="text-xl font-semibold mb-4">
                Thank You for Your Order!
              </h3>
              <p className="text-gray-600 mb-4">
                Your order <span className="font-semibold">#{orderId}</span> has
                been placed successfully. You'll receive a confirmation email
                soon.
              </p>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Order Date:</span>{" "}
                  {new Date(orderDetails.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
                <p>
                  <span className="font-medium">Shipping Address:</span>{" "}
                  {orderDetails.streetAddress}, {orderDetails.apartment},{" "}
                  {orderDetails.city}, {orderDetails.state},{" "}
                  {orderDetails.zipCode}, {orderDetails.country}
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {orderDetails.paymentMethod === "online"
                    ? "Online Payment"
                    : "Cash on Delivery"}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border border-gray-300 p-6 rounded-md">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              {orderDetails.OrderItems?.length > 0 ? (
                orderDetails.OrderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2 md:gap-4 mb-6 border-b pb-4"
                  >
                    <img
                      src={`${USER_BASE_URL}${
                        item.ProductColors.Product?.Images[0].imageUrl ||
                        "/placeholder.jpg"
                      }`}
                      alt={item.ProductColors?.Product?.name || "Product"}
                      className="rounded-lg w-20 md:w-28 h-full object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <h4 className="text-lg font-semibold">
                        {item.ProductColors?.Product?.name || "N/A"}
                      </h4>
                      <p className="text-gray-600">
                        ₹ {item.price.toLocaleString()}
                      </p>
                      <p className="text-gray-400">
                        {item.ProductColors?.Color?.name || "N/A"} / Quantity:{" "}
                        {item.quantity}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items in this order.</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="border border-gray-300 p-6 rounded-md">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-right">
                <p>
                  Subtotal · {orderDetails.OrderItems?.length || 0} items{" "}
                  <span className="font-semibold ml-2">
                    ₹ {orderDetails.subtotal.toLocaleString()}
                  </span>
                </p>
                <p>
                  Tax{" "}
                  <span className="ml-2">
                    ₹ {orderDetails.tax.toLocaleString()}
                  </span>
                </p>
                <p className="text-lg font-semibold">
                  Total{" "}
                  <span className="ml-2">
                    ₹ {orderDetails.total.toLocaleString()}
                  </span>
                </p>
              </div>
              <Link
                to="/newarrivals"
                className="w-full mt-6 block bg-[#527557] text-[#F6F6F6] py-3 rounded-md cursor-pointer font-medium text-center hover:bg-[#3e5b41] transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSuccessfulPage;
