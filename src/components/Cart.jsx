import { useState, useEffect, useCallback, useMemo } from "react";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { USER_BASE_URL } from "../config";
const CartItem = ({ product, onUpdateQuantity, onRemove }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between border-b py-6 gap-2">
    <img
      src={`${USER_BASE_URL}${product.image}`}
      alt={product.name}
      className="w-full md:w-36 h-48 object-cover rounded"
      onError={(e) => {
        e.target.src = "/placeholder-image.jpg";
      }}
    />
    <div className="flex flex-col justify-between flex-1 w-full">
      <div className="flex flex-col mb-4 sm:mb-0 space-y-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-700 mt-1">{product.price}</p>
        <p className="text-sm text-gray-500 mt-1">{product.color}</p>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-2 border px-4 py-2">
          <button
            onClick={() =>
              onUpdateQuantity(product.cartId, product.quantity - 1)
            }
            className="px-2 text-xl"
            disabled={product.quantity <= 1}
          >
            -
          </button>
          <span className="px-2">{product.quantity}</span>
          <button
            onClick={() =>
              onUpdateQuantity(product.cartId, product.quantity + 1)
            }
            className="px-2 text-xl"
          >
            +
          </button>
        </div>
        <button
          onClick={() => onRemove(product.cartId)}
          className="text-sm text-gray-500 underline mt-2 sm:mt-0 sm:ml-4"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
);

const Cart = ({ onClose, isOpen }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const axiosInstance = useMemo(() => {
    return axios.create({
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  }, [token]);

  const fetchCartItems = useCallback(async () => {
    if (!userId || !token) {
      setLoading(false);
      setCartItems([]); // Ensure cartItems is empty for unauthenticated users
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${USER_BASE_URL}/cart/get/${userId}`
      );
      // Normalize response to always be an array
      const items = Array.isArray(response.data) ? response.data : [];
      setCartItems(items);
      setError(null);
    } catch (err) {
      console.error(
        "Fetch Cart Error:",
        err.response?.status,
        err.response?.data
      );
      setError(err.response?.data?.message || "Failed to load cart");
      setCartItems([]); // Reset cartItems on error
      toast.error("Failed to load cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId, token, axiosInstance]);

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen, fetchCartItems]);

  const handleUpdateQuantity = async (cartId, quantity) => {
    if (quantity < 1 || !userId || !token) {
      if (quantity < 1) {
        toast.error("Quantity cannot be less than 1.");
      } else {
        toast.error("Please log in to update cart.");
      }
      return;
    }
    try {
      const response = await axiosInstance.put(
        `${USER_BASE_URL}/cart/update/${cartId}`,
        {
          quantity,
        }
      );
      setCartItems(
        cartItems.map((item) =>
          item.cartId === cartId ? { ...item, ...response.data.cartItem } : item
        )
      );
      toast.success("Quantity updated successfully!");
    } catch (err) {
      console.error(
        "Update Quantity Error:",
        err.response?.status,
        err.response?.data
      );
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      } else {
        toast.error(
          "Failed to update quantity: " +
            (err.response?.data?.message || "Unknown error")
        );
      }
    }
  };

  const handleRemoveItem = async (cartId) => {
    if (!userId || !token) {
      toast.error("Please log in to remove items from cart.");
      return;
    }
    try {
      const response = await axiosInstance.delete(
        `${USER_BASE_URL}/cart/remove/${cartId}`
      );
      setCartItems(cartItems.filter((item) => item.cartId !== cartId));
      toast.success("Item removed from cart!");
    } catch (err) {
      console.error(
        "Remove Item Error:",
        err.response?.status,
        err.response?.data
      );
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      } else {
        toast.error(
          "Failed to remove item: " +
            (err.response?.data?.message || "Unknown error")
        );
      }
    }
  };

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) {
      return "₹ 0.00";
    }
    return cartItems
      .reduce((total, item) => {
        let price = item.price;
        if (typeof price === "string") {
          price = parseFloat(price.replace(/[^0-9.]/g, ""));
        } else if (typeof price !== "number") {
          console.error("Invalid price format:", price);
          return total;
        }
        const quantity = Number(item.quantity) || 0;
        return total + price * quantity;
      }, 0)
      .toLocaleString("en-IN", { style: "currency", currency: "INR" });
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        cartItems,
        total: calculateTotal(),
      },
    });
  };

  return (
    <div className="w-full mx-auto p-4 md:p-4">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold">Cart</h2>
        <button onClick={onClose} className="hover:text-[#527557]">
          <RxCross1 size={20} className="cursor-pointer" />
        </button>
      </div>

      {/* Login prompt for unauthenticated users */}
      {!token ? (
        <div className="flex flex-col items-center justify-center py-12">
          <img
            src="/images/login.jpg"
            alt="Login Required"
            className="w-32 h-32 mb-4"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
          <p className="text-lg font-semibold text-gray-700 mb-2">
            Please log in to view your cart
          </p>
          <Link
            to="/login"
            className="bg-[#527557] text-white px-6 py-2 rounded hover:bg-[#3e5b41] transition"
          >
            Log In
          </Link>
        </div>
      ) : (
        <>
          {loading && <p>Loading cart...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && cartItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <img
                src="/images/emptycart.png"
                alt="Empty Cart"
                className="w-32 h-32 mb-4"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Your cart is empty, please add items to your cart
              </p>
              <div className="flex gap-4">
                <Link
                  to="/allproducts"
                  className="bg-[#527557] text-white px-6 py-2 rounded hover:bg-[#3e5b41] transition"
                >
                  Shop All Products
                </Link>
                <Link
                  to="/newarrivals"
                  className="bg-[#527557] text-white px-6 py-2 rounded hover:bg-[#3e5b41] transition"
                >
                  New Arrivals
                </Link>
              </div>
            </div>
          )}
          {!loading && !error && cartItems.length > 0 && (
            <>
              {cartItems.map((item) => (
                <CartItem
                  key={item.cartId}
                  product={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
              <div className="mt-8 space-y-4 border-t pt-4">
                <p className="text-sm">Add order note</p>
                <p className="text-sm text-gray-500">
                  Taxes and shipping calculated at checkout
                </p>
                <button
                  onClick={handleCheckout}
                  className="bg-[#527557] text-white w-full px-6 py-3 text-lg rounded cursor-pointer"
                >
                  Checkout
                  <span className="ml-2 text-base font-semibold">
                    {calculateTotal()}
                  </span>
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
