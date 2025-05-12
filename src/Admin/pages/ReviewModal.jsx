import React, { useState, useEffect } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";

const ReviewModal = ({ isOpen, onClose, review, refreshReviews }) => {
  const [formData, setFormData] = useState({
    productId: "",
    rating: 0,
    description: "",
  });
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch products for dropdown
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${USER_BASE_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  // Initialize form when review changes and fetch products
  useEffect(() => {
    fetchProducts();
    if (review) {
      setFormData({
        productId: review.productId || "",
        rating: review.rating || 0,
        description: review.description || "",
      });
    } else {
      setFormData({
        productId: "",
        rating: 0,
        description: "",
      });
    }
  }, [review]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        onClick={() => handleRatingChange(i + 1)}
        onMouseEnter={() => setHoverRating(i + 1)}
        onMouseLeave={() => setHoverRating(0)}
        className={`cursor-pointer text-2xl ${
          (hoverRating || formData.rating) > i
            ? "text-yellow-400"
            : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      toast.error("Please log in to submit a review");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        productId: formData.productId,
        userId,
        rating: formData.rating,
        description: formData.description,
      };

      if (review) {
        // Update existing review
        await axios.put(`${USER_BASE_URL}/api/ratings/${review.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Review Updated");
      } else {
        // Create new review
        await axios.post(`${USER_BASE_URL}/api/ratings`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Review Added");
      }
      refreshReviews();
      onClose();
    } catch (error) {
      console.error("Error saving review:", error);
      toast.error("Something Went Wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            {review ? "Edit Review" : "Add New Review"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product *
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating *
            </label>
            <div className="flex gap-1">{renderStars()}</div>
            {formData.rating === 0 && (
              <p className="mt-1 text-sm text-red-600">Rating is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formData.rating === 0}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting || formData.rating === 0
                  ? "bg-indigo-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;