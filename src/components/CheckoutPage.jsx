import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { USER_BASE_URL } from "../config";
import axios from "axios";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const { cartItems: initialCartItems = [], total: passedTotal = "₹ 0.00" } =
    location.state || {};

  const [cartItems, setCartItems] = useState(initialCartItems);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    waistSize: "",
    thighsSize: "",
    fullLength: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "india",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const indianStates = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const handleQuantityChange = (id, type) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "inc"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce((total, item) => {
    let price = item.price;
    if (typeof price === "string") {
      price = parseFloat(price.replace(/[^0-9.]/g, ""));
    }
    return total + price * item.quantity;
  }, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("Please log in to place an order.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      userId,
      cartItems: cartItems.map((item) => ({
        productColorId: item.id, // Use id as productColorId
        quantity: item.quantity,
        price: item.price,
        color: item.color || item.variant,
        size: item.size,
      })),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      waistSize: formData.waistSize,
      thighsSize: formData.thighsSize,
      fullLength: formData.fullLength,
      streetAddress: formData.streetAddress,
      apartment: formData.apartment,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      paymentMethod,
      subtotal,
      tax,
      total,
    };

    try {
      const response = await axios.post(
        `${USER_BASE_URL}/orders/create`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }, // Assume token from AuthContext
        }
      );
      toast.success("Order successfull");
      navigate("/order-confirmation", {
        state: { orderId: response.data.orderId },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 md:px-4 py-8 lg:py-12 bg-white text-gray-800 container mx-auto">
      <h2 className="text-3xl font-bold mb-2">Check Out</h2>
      <p className="text-sm text-gray-500 mb-8">Home / Cart / Check out</p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-8 gap-5 xl:gap-10">
          {/* Shipping Information */}
          <div className="lg:col-span-3 xl:col-span-5 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="input border border-gray-300 p-4"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="input border border-gray-300 p-4"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="input border border-gray-300 p-4"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="input border border-gray-300 p-4"
              />
              <input
                type="text"
                name="waistSize"
                value={formData.waistSize}
                onChange={handleInputChange}
                placeholder="Waist Size (in cm)"
                className="input border border-gray-300 p-4"
              />
              <input
                type="text"
                name="thighsSize"
                value={formData.thighsSize}
                onChange={handleInputChange}
                placeholder="Thighs Size (in cm)"
                className="input border border-gray-300 p-4"
              />
              <input
                type="text"
                name="fullLength"
                value={formData.fullLength}
                onChange={handleInputChange}
                placeholder="Full Length (in cm)"
                className="input border border-gray-300 p-4"
              />
            </div>

            {/* Shipping Address */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  className="border border-gray-300 p-4 w-full sm:col-span-2"
                  required
                />
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc. (optional)"
                  className="border border-gray-300 p-4 w-full sm:col-span-2"
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="border border-gray-300 p-4 w-full"
                  required
                />
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="input w-full border border-gray-300 p-4"
                  required
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="ZIP Code"
                  className="border border-gray-300 p-4 w-full"
                  required
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="input w-full border border-gray-300 p-4"
                  required
                >
                  <option value="">Country</option>
                  <option value="india">India</option>
                  <option value="usa">USA</option>
                  <option value="uk">UK</option>
                </select>
              </div>
            </section>

            {/* Payment Method */}
            <div className="space-y-6 border-t border-gray-300 pt-6">
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <div className="space-y-4">
                <label
                  className={`flex items-center gap-2 border border-gray-300 p-4 ${
                    paymentMethod === "online" ? "text-black" : "text-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="accent-black"
                  />
                  <span>Online payment</span>
                </label>
                <label
                  className={`flex items-center gap-2 border border-gray-300 p-4 ${
                    paymentMethod === "cod" ? "text-black" : "text-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-black"
                  />
                  <span>Cash on delivery</span>
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Your info will be saved to a Shop account. By continuing, you
              agree to Shop's Terms of Service and acknowledge the Privacy
              Policy.
            </p>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 xl:col-span-3">
            {cartItems?.length > 0 ? (
              cartItems?.map((product) => (
                <div
                  key={product.id}
                  className="flex items-start gap-2 md:gap-4 mb-6 border-b pb-4"
                >
                  <img
                    src={`${USER_BASE_URL}${product.image}`}
                    alt={product.name}
                    className="rounded-lg w-35 md:w-40 h-55"
                  />
                  <div className="flex-1 space-y-3 md:py-4">
                    <h4 className="text-2xl font-semibold">{product.name}</h4>
                    <div className="flex flex-col md:flex-row md:items-center justify-between md:gap-2 md:mt-2">
                      <p className="text-gray-600">
                        Rs.{" "}
                        {(typeof product.price === "string"
                          ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
                          : product.price
                        ).toLocaleString()}
                      </p>
                      <p className="text-gray-400">
                        {product.color || product.variant}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-2">
                      <div className="w-fit border px-2 py-1 md:py-2 flex items-center">
                        <button
                          onClick={() =>
                            handleQuantityChange(product.id, "dec")
                          }
                          className="px-3"
                        >
                          -
                        </button>
                        <span className="px-3">{product.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(product.id, "inc")
                          }
                          className="px-3"
                        >
                          +
                        </button>
                      </div>
                      {/* <button
                        onClick={() => handleRemove(product.id)}
                        className="text-lg text-gray-400 underline text-left"
                      >
                        Remove
                      </button> */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-6 text-center text-gray-500">
                No items to order.
              </p>
            )}

            {cartItems.length > 0 && (
              <div className="mt-6 text-right space-y-2">
                <p>
                  Subtotal · {cartItems.length} items{" "}
                  <span className="font-semibold ml-2">
                    ₹ {subtotal.toLocaleString()}
                  </span>
                </p>
                <p>
                  Tax <span className="ml-2">₹ {tax.toLocaleString()}</span>
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-4 bg-[#527557] text-[#F6F6F6] py-3 rounded-md cursor-pointer font-medium ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : `Pay ₹ ${total.toLocaleString()}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
