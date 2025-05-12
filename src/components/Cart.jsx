import React from "react";
import { RxCross1, RxPlus } from "react-icons/rx";
import { Link } from "react-router-dom";

const CartItem = ({ product }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between border-b py-6 gap-2">
    {/* Image */}
    <img
      src={product.image}
      alt={product.name}
      className="w-full md:w-36 h-48 object-cover rounded"
    />

    {/* Details */}
    <div className="flex flex-col justify-between flex-1 w-full">
      <div className="flex flex-col mb-4 sm:mb-0 space-y-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-700 mt-1">Rs. {product.price}</p>
        <p className="text-sm text-gray-500 mt-1">{product.variant}</p>
      </div>

      <div className="flex justify-between ">
        {/* Quantity controls */}
        <div className="flex items-center space-x-2 border px-4 py-2">
          <button className="px-2 text-xl">-</button>
          <span className="px-2">{product.quantity}</span>
          <button className="px-2 text-xl">+</button>
        </div>

        {/* Remove */}
        <button className="text-sm text-gray-500 underline mt-2 sm:mt-0 sm:ml-4">
          Remove
        </button>
      </div>
    </div>
  </div>
);

const Cart = ({ onClose }) => {
  const cartItems = [
    {
      name: "Low-rise Tailored Pant",
      price: "29,000.00",
      variant: "Olive / 6",
      quantity: 1,
      image: "/images/Collection2.png",
    },
    {
      name: "Low-rise Tailored Pant",
      price: "29,000.00",
      variant: "Olive / 6",
      quantity: 1,
      image: "/images/Collection2.png",
    },
  ];

  return (
    <div className="w-full mx-auto p-4 md:p-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold">Cart</h2>
        <div className="flex items-center gap-2">
          <RxPlus size={24} className="cursor-pointer" />
          <button onClick={onClose} className="hover:text-[#527557]">
            <RxCross1 size={20} className="cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Cart Items */}
      {cartItems.map((item, index) => (
        <CartItem key={index} product={item} />
      ))}

      {/* Footer */}
      <div className="mt-8 space-y-4 border-t pt-4">
        <p className="text-sm">Add order note</p>
        <p className="text-sm text-gray-500">
          Taxes and shipping calculated at checkout
        </p>
        <div className="flex justify-between items-center">
          <Link to="/checkout">
            <button className="bg-[#527557] text-white px-6 py-3 rounded cursor-pointer">
              Checkout
            </button>
          </Link>
          <span className="text-lg font-semibold">₹49,200.00</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
