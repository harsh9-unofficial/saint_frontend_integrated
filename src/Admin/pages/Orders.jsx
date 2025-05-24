import React, { useState, useEffect } from "react";
import {
  EyeIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Assume userId is stored in localStorage
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const statusOptions = [
    { value: 1, label: "Pending" },
    { value: 2, label: "Processing" },
    { value: 3, label: "Shipped" },
    { value: 4, label: "Delivered" },
    { value: 5, label: "Cancelled" },
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_BASE_URL}/orders/getallorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Transform and sort the orders
      const transformedOrders = response.data.orders?.map((order) => ({
        ...order,
        OrderItems: order.OrderItems?.map((item) => ({
          ...item,
          Product: {
            name: item.ProductColors.Product.name,
            price: item.price,
            images: item.ProductColors.Product.Images.map(
              (img) => img.imageUrl
            ),
          },
        })),
      }));

      // Sort orders by createdAt (descending: newest first)
      const sortedOrders = transformedOrders.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setOrders(sortedOrders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, userId, navigate]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${USER_BASE_URL}/orders/updatestatus/${orderId}`,
        { status: parseInt(newStatus) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: response.data.order.status, // Update status
              }
            : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Error updating order status");
      console.error("Error updating order status:", error);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.OrderItems.some((item) =>
        item.Product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateTotal = (items) => {
    return items
      .reduce((sum, item) => sum + item.Product.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Manage Orders
        </h1>
        <div className="w-full sm:w-auto flex-grow sm:max-w-md">
          <input
            type="text"
            placeholder="Search by Order ID or Product Name..."
            className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-10 w-10 text-gray-400 animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-base sm:text-lg">No orders found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-3 py-2">
                        <ul className="list-none text-gray-600">
                          {order.OrderItems.map((item) => (
                            <li
                              key={item.id}
                              className="mb-1 flex items-center"
                            >
                              <span>{item.Product.name}</span>

                              {item.Product.images?.length > 0 && (
                                <img
                                  src={`${USER_BASE_URL}${item.Product.images[0]}`}
                                  alt={item.Product.name}
                                  className="inline-block h-20 ml-2 rounded"
                                />
                              )}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center font-medium">
                        <button
                          onClick={() => openModal(order)}
                          className="text-[#527557] cursor-pointer"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {currentItems.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow p-5 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Order ID: {order.id}
                  </h3>
                  <button
                    onClick={() => openModal(order)}
                    className="text-[#527557]"
                    title="View Details"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                      className="ml-2 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Items:
                  </p>
                  <ul className="list-none text-sm text-gray-600">
                    {order.OrderItems?.map((item) => (
                      <li
                        key={item.id}
                        className="mb-3 flex items-center space-x-3"
                      >
                        <div>
                          {item.Product.images?.length > 0 && (
                            <img
                              src={`${USER_BASE_URL}${item.Product.images[0]}`}
                              alt={item.Product.name}
                              className="h-16 rounded object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p>{item.Product.name}</p>
                          <p>₹ {item.Product.price.toFixed(2)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for Order Details */}
          {isModalOpen && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Order Details - ID: {selectedOrder.id}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6 cursor-pointer" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-md font-medium text-gray-600">
                        Order Date
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-md font-medium text-gray-600">
                        Status
                      </p>
                      <p className="text-sm text-gray-900">
                        {
                          statusOptions.find(
                            (opt) => opt.value === selectedOrder.status
                          )?.label
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-md font-medium text-gray-600">
                        Customer
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.firstName || "N/A"}{" "}
                        {selectedOrder.lastName || "N/A"} (
                        {selectedOrder.email || "N/A"})
                      </p>
                    </div>
                    <div>
                      <p className="text-md font-medium text-gray-600">
                        Shipping Address
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.streetAddress || "Not provided"} {", "}
                        {selectedOrder.apartment || "Not provided"} {", "}
                        {selectedOrder.city || "Not provided"} {", "}
                        {selectedOrder.state || "Not provided"} {", "}
                        {selectedOrder.zipCode || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-md font-medium text-gray-600 mb-2">
                        Items
                      </p>
                      <div className="space-y-4">
                        {selectedOrder.OrderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-4 border-b pb-2"
                          >
                            {item.Product.images?.length > 0 && (
                              <img
                                src={`${USER_BASE_URL}${item.Product.images[0]}`}
                                alt={item.Product.name}
                                className="h-20 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="text-md font-medium text-gray-900">
                                {item.Product.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-sm text-gray-600">
                                Price: ₹ {item.Product.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Subtotal: ₹
                                {(item.Product.price * item.quantity).toFixed(
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Order Total
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹ {calculateTotal(selectedOrder.OrderItems)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-[#527557] text-white rounded-lg cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-3 bg-white border-t rounded-b-lg gap-6">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredOrders.length)}
                </span>{" "}
                of <span className="font-medium">{filteredOrders.length}</span>{" "}
                results
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-2 py-1 text-sm border rounded flex items-center ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <div className="flex flex-wrap space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-2 sm:px-3 py-1 text-sm border rounded ${
                          currentPage === pageNum
                            ? "bg-indigo-50 text-indigo-600 border-indigo-500"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2 sm:px-3 py-1 text-sm">...</span>
                  )}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-2 sm:px-3 py-1 text-sm border rounded hover:bg-gray-50`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 text-sm border rounded flex items-center ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
