import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { USER_BASE_URL } from "../config";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [isProfileHovering, setIsProfileHovering] = useState(false);
  const [isCoverHovering, setIsCoverHovering] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    productId: "",
    rating: 0,
    description: "",
  });
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ordersError, setOrdersError] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const statusOptions = [
    { value: 1, label: "Pending", color: "bg-blue-500" },
    { value: 2, label: "Processing", color: "bg-indigo-500" },
    { value: 3, label: "Shipped", color: "bg-purple-500" },
    { value: 4, label: "Delivered", color: "bg-green-500" },
    { value: 5, label: "Cancelled", color: "bg-red-500" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    navigate("/login");
  };

  const axiosInstance = useMemo(() => {
    return axios.create({
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  }, [token]);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchUserData();
    fetchOrders();
  }, [navigate, userId, profilePic, coverPic]);

  const fetchUserData = useCallback(async () => {
    if (!userId || !token) {
      toast.error("Please log in to view your profile.");
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${USER_BASE_URL}/users/${userId}`
      );
      setFormData({
        username: response.data.username || "",
        phone: response.data.phone || "",
        email: response.data.email || "",
      });
      setProfilePic(response.data.profileImageUrl || null);
      setCoverPic(response.data.coverImageUrl || null);
      setError(null);
    } catch (err) {
      setError("Failed to load profile data.");
      toast.error("Failed to load profile data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, token, axiosInstance]);

  const fetchOrders = useCallback(async () => {
    if (!userId || !token) {
      toast.error("Please log in to view your orders.");
      return;
    }
    try {
      setOrdersLoading(true);
      const response = await axiosInstance.get(
        `${USER_BASE_URL}/orders/userorder/${userId}`
      );

      const mappedOrders =
        response.data.orders?.map((order) => {
          const statusOption = statusOptions.find(
            (opt) => opt.value === order.status
          ) || {
            label: "Unknown",
            color: "bg-gray-500",
          };

          const trackingSteps = statusOptions
            .filter((opt) => opt.value <= 4)
            .map((opt) => ({
              status: opt.label,
              date: order.createdAt,
              completed: order.status === 5 ? false : opt.value <= order.status,
            }));

          const formattedTracking = trackingSteps.map((step) => ({
            status: step.status,
            date: new Date(step.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            completed: step.completed,
          }));

          const items =
            order.OrderItems?.map((item) => {
              const productId = item.ProductColors?.productId;
              if (!productId) {
                console.warn(
                  `Missing productId for OrderItem: ${JSON.stringify(item)}`
                );
              }
              return {
                name:
                  item.ProductColors?.Product?.name ||
                  item.ProductColors?.name ||
                  "Unknown Item",
                quantity: item.quantity || 1,
                price: Number(item.price).toLocaleString("en-IN"),
                total: Number(item.quantity * item.price).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                ),
                image: item.ProductColors?.Product?.Images?.[0]?.imageUrl
                  ? `${USER_BASE_URL}${item.ProductColors.Product.Images[0].imageUrl}`
                  : "/images/Collection2.png",
                productId: productId || null,
              };
            }) || [];

          return {
            id: order.id.toString(),
            placedDate:
              new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }) || "Unknown Date",
            status: statusOption.label,
            color: statusOption.color,
            subtotal: order.subtotal,
            tax: order.tax,
            total: Number(order.total).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            items,
            tracking: formattedTracking,
          };
        }) || [];

      setOrders(mappedOrders);
      setOrdersError(null);
    } catch (err) {
      setOrdersError("Failed to load orders.");
      toast.error("Failed to load orders. Please try again.");
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  }, [userId, token, axiosInstance]);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append(type === "profile" ? "profileImage" : "coverImage", file);

    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `${USER_BASE_URL}/users/${userId}/upload-${type}-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload response:", response.data);

      if (type === "profile") {
        setProfilePic(response.data.profileImage);
      } else {
        setCoverPic(response.data.coverImage);
      }
      toast.success(
        `${
          type === "profile" ? "Profile" : "Cover"
        } image uploaded successfully!`
      );
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      toast.error(
        `Failed to upload ${type === "profile" ? "profile" : "cover"} image.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!userId || !token) {
      toast.error("Please log in to update your profile.");
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.put(`${USER_BASE_URL}/users/${userId}`, formData);
      toast.success("Profile updated successfully!");
      setError(null);
    } catch (err) {
      setError("Failed to update profile.");
      toast.error("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
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

  const openReviewModal = (productId) => {
    if (!productId) {
      toast.error("Product ID not found for this item.");
      return;
    }
    setReviewForm({ productId, rating: 0, description: "" });
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewForm({ productId: "", rating: 0, description: "" });
    setSelectedItemForReview(null);
  };

  const handleReviewSubmit = async () => {
    if (!userId || !token) {
      toast.error("Please log in to submit a review.");
      return;
    }
    if (
      !reviewForm.productId ||
      reviewForm.rating === 0 ||
      !reviewForm.description
    ) {
      toast.error("Please provide a rating and description.");
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post(`${USER_BASE_URL}/ratings`, {
        productId: reviewForm.productId,
        userId,
        rating: reviewForm.rating,
        description: reviewForm.description,
      });
      toast.success(response.data.message || "Review submitted successfully!");
      closeReviewModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
      console.error("Review submit error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemSelectForReview = (order) => {
    const selectedItem = order.items.find(
      (item) => item.productId === parseInt(selectedItemForReview)
    );
    if (selectedItem) {
      openReviewModal(selectedItem.productId);
    } else {
      toast.error("Please select an item to review.");
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row container mx-auto px-4 py-4 md:py-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 lg:w-80 border border-gray-400 p-4 lg:p-6 flex flex-col justify-between h-fit">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div
              className="relative"
              onMouseEnter={() => setIsProfileHovering(true)}
              onMouseLeave={() => setIsProfileHovering(false)}
            >
              <label
                htmlFor="profile-upload-sidebar"
                className="cursor-pointer"
              >
                <img
                  src={`${USER_BASE_URL}${profilePic}` || "/images/avatar.png"}
                  alt="avatar"
                  className="w-16 sm:w-20 h-16 sm:h-20 rounded-full mb-2 object-cover"
                />
                {isProfileHovering && (
                  <div className="absolute top-0 left-0 w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center bg-black/50 bg-opacity-50 rounded-full">
                    <span className="text-white text-xs">Upload pic</span>
                  </div>
                )}
              </label>
              <input
                id="profile-upload-sidebar"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "profile")}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-base sm:text-lg font-semibold">
                {formData.username || "Krushant Vamja"}
              </h2>
            </div>
          </div>
          <nav className="w-full">
            <button
              onClick={() => setActiveTab("Profile")}
              className={`w-full text-left px-4 py-2 mb-2 cursor-pointer text-sm sm:text-base ${
                activeTab === "Profile"
                  ? "bg-[#527557] text-white"
                  : "text-gray-700"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("Order")}
              className={`w-full text-left px-4 py-2 cursor-pointer text-sm sm:text-base ${
                activeTab === "Order"
                  ? "bg-[#527557] text-white"
                  : "text-gray-700"
              }`}
            >
              Order
            </button>
          </nav>
        </div>
        <button
          className="mt-6 sm:mt-8 w-full bg-[#527557] text-white py-2 text-sm sm:text-base uppercase"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:px-2 space-y-6 sm:space-y-8">
        {activeTab === "Profile" ? (
          <>
            <div className="relative h-48 sm:h-64 md:h-92 lg:h-98">
              <div
                className="relative w-full h-40 sm:h-48 md:h-65 lg:h-70 bg-cover bg-center rounded-lg overflow-hidden mb-4 sm:mb-6 cursor-pointer"
                onMouseEnter={() => setIsCoverHovering(true)}
                onMouseLeave={() => setIsCoverHovering(false)}
              >
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer block w-full h-full"
                >
                  <img
                    src={
                      `${USER_BASE_URL}${coverPic}` ||
                      "/images/ProfileBanner.jpg"
                    }
                    alt="Cover Photo"
                    className="w-full h-40 sm:h-48 md:h-65 lg:h-70 py-4 md:py-0 bg-center rounded-lg overflow-hidden mb-4 sm:mb-6 object-cover"
                  />
                  {isCoverHovering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 bg-opacity-50">
                      <span className="text-white text-sm">Upload pic</span>
                    </div>
                  )}
                </label>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "cover")}
                  className="hidden"
                />
              </div>
              <div className="absolute bottom-0 md:left-8 lg:left-20 flex items-center">
                <div
                  className="relative cursor-pointer"
                  onMouseEnter={() => setIsProfileHovering(true)}
                  onMouseLeave={() => setIsProfileHovering(false)}
                >
                  <label
                    htmlFor="profile-upload-main"
                    className="cursor-pointer"
                  >
                    <img
                      src={
                        `${USER_BASE_URL}${profilePic}` || "/images/avatar.png"
                      }
                      alt="avatar"
                      className="w-20 sm:w-24 h-20 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full mr-0 sm:mr-4 object-cover"
                    />
                    {isProfileHovering && (
                      <div className="absolute top-0 left-0 w-20 sm:w-24 h-20 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex items-center justify-center bg-black/50 bg-opacity-50 rounded-full">
                        <span className="text-white text-xs">Upload pic</span>
                      </div>
                    )}
                  </label>
                  <input
                    id="profile-upload-main"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "profile")}
                    className="hidden"
                  />
                </div>
                <div className="py-4 ml-2 md:ml-0 text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
                    {formData.username || "Krushant Vamja"}
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-8 sm:space-y-10">
              <section>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 -mt-4">
                  Personal Information
                </h3>
                {loading && <p className="text-sm">Loading profile data...</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {!loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-3 sm:p-4 w-full text-sm sm:text-base"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-3 sm:p-4 w-full text-sm sm:text-base"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-3 sm:p-4 w-full text-sm sm:text-base"
                    />
                  </div>
                )}
              </section>

              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className={`bg-[#527557] text-white cursor-pointer px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-auto text-sm sm:text-base ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        ) : (
          <>
            {showTracking && selectedOrder ? (
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-0">
                    Tracking Details
                  </h3>
                  <button
                    onClick={handleBackToOrders}
                    className="bg-[#527557] text-white px-4 py-2 rounded cursor-pointer w-full sm:w-auto text-sm sm:text-base"
                  >
                    Back to Orders
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 border border-gray-200 rounded-lg p-3 sm:p-4 space-y-4 sm:space-y-0 sm:space-x-4 overflow-x-auto">
                  {selectedOrder.tracking.map((step, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center relative w-full sm:w-1/4 min-w-[120px]"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 z-10 ${
                          step.completed ? "bg-[#527557]" : "bg-gray-300"
                        }`}
                      >
                        {step.completed && (
                          <span className="text-white text-xs sm:text-sm">
                            ✔
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-center">
                        {step.status}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mb-6 sm:mb-8">
                  <h4 className="text-base sm:text-lg font-semibold mb-4">
                    ORDER ITEMS
                  </h4>
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                        <img
                          src={item.image}
                          alt="product"
                          className="w-16 sm:w-20 h-16 sm:h-20 rounded"
                        />
                        <div className="flex-1 space-y-2">
                          <h5 className="text-sm font-semibold">{item.name}</h5>
                          <p className="text-xs text-gray-500">
                            {item.quantity} x ₹ {item.price}
                          </p>
                          <p className="md:hidden text-sm font-semibold">
                            ₹ {item.total}
                          </p>
                        </div>
                      </div>
                      <p className="hidden md:block text-sm font-semibold">
                        ₹ {item.total}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-semibold">
                      Subtotal - {selectedOrder.items.length} items
                    </p>
                    <p className="text-sm font-semibold">
                      Rs.{" "}
                      {(Number(selectedOrder.subtotal) || 0).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm">Tax(5%)</p>
                    <p className="text-sm">
                      Rs.{(selectedOrder.tax || 0).toFixed(0)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm sm:text-md font-semibold">TOTAL</p>
                    <p className="text-sm sm:text-md font-semibold">
                      ₹ {selectedOrder.total}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 pt-6 sm:pt-8 md:pt-2">
                  Order History
                </h3>
                {ordersLoading && <p className="text-sm">Loading orders...</p>}
                {ordersError && (
                  <p className="text-red-500 text-sm">{ordersError}</p>
                )}
                {!ordersLoading && orders.length === 0 && (
                  <p className="text-sm">No orders found.</p>
                )}
                {!ordersLoading &&
                  orders?.map((order) => (
                    <div
                      key={order.id}
                      className="border p-3 sm:p-4 rounded-lg mb-4"
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
                            className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-opacity-10 ${order.color.replace(
                              "bg-",
                              "bg-opacity-10 text-"
                            )}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mr-1 sm:mr-2 ${order.color}`}
                            ></span>
                            {order.status}
                          </span>
                          <p className="text-sm sm:text-lg font-semibold">
                            ₹ {order.total}
                          </p>
                        </div>
                      </div>
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0"
                        >
                          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                            <img
                              src={item.image}
                              alt="product"
                              className="w-16 sm:w-20 h-16 sm:h-20 rounded"
                            />
                            <div className="flex-1 space-y-2">
                              <h5 className="text-sm font-semibold">
                                {item.name}
                              </h5>
                              <p className="text-xs text-gray-500">
                                {item.quantity} x ₹ {item.price}
                              </p>
                              <p className="md:hidden text-sm font-semibold">
                                ₹ {item.total}
                              </p>
                            </div>
                          </div>
                          <p className="hidden md:block text-sm font-semibold">
                            ₹ {item.total}
                          </p>
                        </div>
                      ))}
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                        <button
                          onClick={() => handleTrackPackage(order)}
                          className="bg-[#527557] text-white px-4 py-2 rounded cursor-pointer w-full sm:w-auto text-sm sm:text-base"
                        >
                          Track Package
                        </button>
                        {order.status === "Delivered" &&
                          order.items.some((item) => item.productId) && (
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                              <select
                                value={selectedItemForReview || ""}
                                onChange={(e) =>
                                  setSelectedItemForReview(e.target.value)
                                }
                                className="border border-gray-300 rounded p-2 text-sm sm:text-base w-full sm:w-auto"
                              >
                                <option value="">Select item to review</option>
                                {order.items
                                  .filter((item) => item.productId)
                                  .map((item, index) => (
                                    <option key={index} value={item.productId}>
                                      {item.name}
                                    </option>
                                  ))}
                              </select>
                              <button
                                onClick={() => handleItemSelectForReview(order)}
                                className={`bg-[#527557] text-white px-4 py-2 rounded cursor-pointer w-full sm:w-auto text-sm sm:text-base ${
                                  !selectedItemForReview
                                    ? "hover:cursor-not-allowed"
                                    : "hover:bg-[#426446]"
                                }`}
                                disabled={!selectedItemForReview}
                              >
                                Write a Review
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
              </>
            )}
          </>
        )}
      </main>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4 sm:mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold">
                Write a Review
              </h3>
              <button
                onClick={closeReviewModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 sm:w-6 h-5 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className={`text-xl sm:text-2xl ${
                      star <= reviewForm.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Review
              </label>
              <textarea
                id="description"
                name="description"
                value={reviewForm.description}
                onChange={handleReviewInputChange}
                rows="4"
                className="w-full border border-gray-300 rounded p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#527557]"
                placeholder="Write your review here..."
                aria-describedby="description-help"
              />
              <p id="description-help" className="text-xs text-gray-500 mt-1">
                Please share your experience with the product.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={closeReviewModal}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 text-sm sm:text-base w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={loading}
                className={`px-4 py-2 text-white bg-[#527557] rounded hover:bg-[#426446] text-sm sm:text-base w-full sm:w-auto ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
