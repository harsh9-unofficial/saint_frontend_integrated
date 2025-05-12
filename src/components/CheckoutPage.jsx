import React, { useState } from "react";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Low-rise Tailored Pant",
      price: 29000,
      quantity: 1,
      image: "/images/Collection2.png",
      color: "Olive",
      size: "6",
    },
    {
      id: 2,
      name: "High-waist Formal Trousers",
      price: 20200,
      quantity: 1,
      image: "/images/Collection2.png",
      color: "Black",
      size: "8",
    },
  ]);

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
    setProducts((prev) =>
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
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="px-2 md:px-4 py-8 lg:py-12 bg-white text-gray-800 container mx-auto">
      <h2 className="text-3xl font-bold mb-2">Check Out</h2>
      <p className="text-sm text-gray-500 mb-8">Home / Cart / Check out</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-8 gap-5 xl:gap-10">
        {/* Shipping Information */}
        <div className="lg:col-span-3 xl:col-span-5 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="input border border-gray-300 p-4"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="input border border-gray-300 p-4"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="input border border-gray-300 p-4"
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="input border border-gray-300 p-4"
            />
          </div>

          {/* Shipping Address */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Street Address"
                className="border border-gray-300 p-4 w-full sm:col-span-2"
              />
              <input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                className="border border-gray-300 p-4 w-full sm:col-span-2"
              />
              <input
                type="text"
                placeholder="City"
                className="border border-gray-300 p-4 w-full"
              />
              <select
                name="state"
                className={`input w-full border border-gray-300 p-4`}
              >
                <option value="Select State">State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="ZIP Code"
                className="border border-gray-300 p-4 w-full"
              />

              <select className="input w-full border border-gray-300 p-4">
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
              {/* Online Payment option */}
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

              {/* Cash on Delivery option */}
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
            Your info will be saved to a Shop account. By continuing, you agree
            to Shop's Terms of Service and acknowledge the Privacy Policy.
          </p>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2 xl:col-span-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-start gap-2 md:gap-4 mb-6 border-b pb-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg w-35 md:w-40 h-55"
              />
              <div className="flex-1 space-y-3 md:py-4">
                <h4 className="text-2xl font-semibold">{product.name}</h4>
                <div className="flex flex-col md:flex-row md:items-center justify-between md:gap-2 md:mt-2">
                  <p className="text-gray-600">
                    Rs. {product.price.toLocaleString()}
                  </p>
                  <p className="text-gray-400">
                    {product.color} / {product.size}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-2">
                  <div className="w-fit border px-2 py-1 md:py-2 flex items-center">
                    <button
                      onClick={() => handleQuantityChange(product.id, "dec")}
                      className="px-3"
                    >
                      -
                    </button>
                    <span className="px-3">{product.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product.id, "inc")}
                      className="px-3"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="text-lg text-gray-400 underline text-left"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {products.length > 0 ? (
            <div className="mt-6 text-right space-y-2">
              <p>
                Subtotal · {products.length} items{" "}
                <span className="font-semibold ml-2">
                  ₹{subtotal.toLocaleString()}
                </span>
              </p>
              <p>
                Tax <span className="ml-2">₹{tax.toLocaleString()}</span>
              </p>
              <button className="w-full mt-4 bg-[#527557] text-[#F6F6F6] py-3 rounded-md cursor-pointer font-medium">
                Pay ₹{total.toLocaleString()}
              </button>
            </div>
          ) : (
            <p className="mt-6 text-center text-gray-500">No items to order.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
