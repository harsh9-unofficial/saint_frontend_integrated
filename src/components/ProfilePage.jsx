import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const [profilePic, setProfilePic] = useState("/images/Shirt.png");
  const [showTracking, setShowTracking] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Check for userId in localStorage when component mounts
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // Redirect to login page if userId is not found
      navigate("/login");
    }
  }, [navigate]);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTrackPackage = (order) => {
    setSelectedOrder(order);
    setShowTracking(true);
  };

  const handleBackToOrders = () => {
    setShowTracking(false);
    setSelectedOrder(null);
  };

  const orders = [
    {
      id: "ORD-12345",
      placedDate: "June 15, 2024",
      status: "Delivered",
      total: "29,000.00",
      items: [
        {
          name: "Classic Green Tee",
          quantity: 2,
          price: "29,999",
          total: "29,000.00",
        },
        {
          name: "Classic Green Tee",
          quantity: 2,
          price: "29,999",
          total: "29,000.00",
        },
      ],
      tracking: [
        { status: "Order Placed", date: "20 May, 2024", completed: true },
        { status: "Packed", date: "20 May, 2024", completed: true },
        { status: "Order Shipped", date: "20 May, 2024", completed: true },
        { status: "Order Delivered", date: "20 May, 2024", completed: true },
      ],
    },
    {
      id: "ORD-12346",
      placedDate: "June 15, 2024",
      status: "Cancel",
      total: "29,000.00",
      items: [
        {
          name: "Classic Green Tee",
          quantity: 2,
          price: "29,999",
          total: "29,000.00",
        },
        {
          name: "Classic Green Tee",
          quantity: 2,
          price: "29,999",
          total: "29,000.00",
        },
      ],
      tracking: [
        { status: "Order Placed", date: "20 May, 2024", completed: true },
        { status: "Packed", date: "20 May, 2024", completed: false },
        { status: "Order Shipped", date: "20 May, 2024", completed: false },
        { status: "Order Delivered", date: "20 May, 2024", completed: false },
      ],
    },
  ];

  // Render nothing or a loading state while redirecting
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col md:flex-row container mx-auto px-4 py-4 md:py-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 lg:w-80 border border-gray-400 p-4 lg:p-6 flex flex-col justify-between h-fit">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative">
              <img
                src={profilePic}
                alt="avatar"
                className="w-20 h-20 rounded-full mb-2"
              />
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-semibold">Krushant Vamja</h2>
              <p className="text-sm text-gray-500 mb-6">Front-end Developer</p>
            </div>
          </div>
          <nav className="w-full">
            <button
              onClick={() => setActiveTab("Profile")}
              className={`w-full text-left px-4 py-2 mb-2 cursor-pointer ${
                activeTab === "Profile"
                  ? "bg-[#527557] text-white"
                  : "text-gray-700"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("Order")}
              className={`w-full text-left px-4 py-2 cursor-pointer ${
                activeTab === "Order"
                  ? "bg-[#527557] text-white"
                  : "text-gray-700"
              }`}
            >
              Order
            </button>
          </nav>
        </div>
        <button className="mt-8 w-full bg-[#527557] text-white py-2 uppercase">
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:px-2 space-y-8">
        {activeTab === "Profile" ? (
          <>
            {/* Cover Photo */}
            <div className="relative h-63 md:h-92 lg:h-98">
              <div className="w-full h-full bg-cover bg-center rounded-lg overflow-hidden mb-6">
                <img
                  src="/images/HeroImg.jpg"
                  alt="Cover Photo"
                  className="w-full h-48 md:h-65 lg:h-70 py-4 md:py-0 bg-center rounded-lg overflow-hidden mb-6"
                />
                <label
                  htmlFor="cover-pic-upload"
                  className="absolute h-48 md:h-65 lg:h-70 rounded-lg inset-0 flex items-center justify-center bg-black/35 cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                >
                  <span className="text-white text-sm">Edit Cover Photo</span>
                </label>
                <input
                  id="cover-pic-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        document.querySelector(".bg-cover img").src =
                          e.target.result;
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div className="absolute bottom-0 md:left-8 lg:left-20 flex items-center">
                <div className="relative">
                  <img
                    src={profilePic}
                    alt="avatar"
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full mr-0 sm:mr-4"
                  />
                  <label
                    htmlFor="profile-pic-upload-main"
                    className="absolute inset-0 flex items-center justify-center bg-black/35 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <span className="text-white text-sm">Edit</span>
                  </label>
                  <input
                    id="profile-pic-upload-main"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </div>
                <div className="py-4 ml-2 md:ml-0 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Krushant Vamja
                  </h2>
                  <p className="text-sm sm:text-md text-gray-500">
                    Front-end Developer
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              {/* Personal Info */}
              <section>
                <h3 className="text-xl font-semiboldvilla mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Username"
                    className="border border-gray-300 p-4 w-full"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="border border-gray-300 p-4 w-full"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="border border-gray-300 p-4 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Password"
                    className="border border-gray-300 p-4 w-full"
                  />
                </div>
              </section>

              <button className="bg-[#527557] text-white cursor-pointer px-6 py-4">
                Save Change
              </button>
            </div>
          </>
        ) : (
          <>
            {showTracking && selectedOrder ? (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold mb-2 sm:mb-0">
                    Tracking Details
                  </h3>
                  <button
                    onClick={handleBackToOrders}
                    className="bg-[#527557] text-white px-4 py-2 rounded cursor-pointer w-full sm:w-auto"
                  >
                    Back to Orders
                  </button>
                </div>

                {/* Tracking Timeline */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border border-gray-200 rounded-lg p-4 space-y-6 sm:space-y-0 sm:space-x-4">
                  {selectedOrder.tracking.map((step, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center relative w-full sm:w-1/4"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 z-10 ${
                          step.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        {step.completed && (
                          <span className="text-white text-sm">✔</span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-center">
                        {step.status}
                      </p>
                      <p className="text-xs text-gray-500">{step.date}</p>
                    </div>
                  ))}
                </div>

                {/* Order Items */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">ORDER ITEMS</h4>
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <img
                          src="/images/Collection2.png"
                          alt="product"
                          className="w-20 h-20 rounded"
                        />
                        <div className="flex-1 space-y-2">
                          <h5 className="text-sm font-semibold">{item.name}</h5>
                          <p className="text-xs text-gray-500">
                            {item.quantity} x Rs. {item.price}
                          </p>
                          <p className="md:hidden text-sm font-semibold">
                            {item.total}
                          </p>
                        </div>
                      </div>
                      <p className="hidden md:block text-sm font-semibold">
                        {item.total}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Subtotal and Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-semibold">
                      Subtotal - {selectedorder.items.length} items
                    </p>
                    <p className="text-sm font-semibold">
                      Rs.{" "}
                      {(
                        selectedOrder.items.reduce(
                          (acc, item) =>
                            acc + parseFloat(item.total.replace(/,/g, "")),
                          0
                        ) * 2
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm">Tax</p>
                    <p className="text-sm">10%</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-md font-semibold">TOTAL</p>
                    <p className="text-md font-semibold">
                      Rs. {selectedOrder.total}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4 pt-8 md:pt-2">
                  Order History
                </h3>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border p-2 sm:p-4 rounded-lg mb-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Order #{order.id}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Placed on {order.placedDate}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <span
                          className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-1 sm:mr-2 ${
                              order.status === "Delivered"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {order.status}
                        </span>
                        <p className="text-sm sm:text-lg font-semibold">
                          Rs. {order.total}
                        </p>
                      </div>
                    </div>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-4 w-full sm:w-auto">
                          <img
                            src="/images/Collection2.png"
                            alt="product"
                            className="w-20 h-20 rounded"
                          />
                          <div className="flex-1 space-y-2">
                            <h5 className="text-sm font-semibold">
                              {item.name}
                            </h5>
                            <p className="text-xs text-gray-500">
                              {item.quantity} x Rs. {item.price}
                            </p>
                            <p className="md:hidden text-sm font-semibold">
                              {item.total}
                            </p>
                          </div>
                        </div>
                        <p className="hidden md:block text-sm font-semibold">
                          {item.total}
                        </p>
                      </div>
                    ))}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                      <button
                        onClick={() => handleTrackPackage(order)}
                        className="bg-[#527557] text-white px-4 py-2 rounded cursor-pointer w-full sm:w-auto"
                      >
                        Track Package
                      </button>
                      <button className="bg-[#527557] text-white px-4 py-2 rounded cursor-pointer w-full sm:w-auto">
                        Write a Review
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}