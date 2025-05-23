import React, { useState, useEffect } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "react-datepicker/dist/react-datepicker.css";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";

const CollectionModal = ({
  isOpen,
  onClose,
  collection,
  refreshCollections,
}) => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    images: [],
    categoryId: "",
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetching categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${USER_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        images: [],
        categoryId: collection.categoryId || "",
      });
      setPreviewImages(
        collection.images
          ? collection.images.map((img) => `${USER_BASE_URL}/${img}`)
          : []
      );
    } else {
      setFormData({
        name: "",
        images: [],
        categoryId: "",
      });
      setPreviewImages([]);
    }
  }, [collection]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, images: files }));
      setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    } else {
      setFormData((prev) => ({ ...prev, images: [] }));
      setPreviewImages([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    if (formData.categoryId) {
      formPayload.append("categoryId", formData.categoryId);
    }
    // Append each image file as `images[]`
    formData.images.forEach((image) => {
      formPayload.append("images", image); // Field name is "images"
    });

    try {
      if (collection) {
        // PUT request for updating collection
        await axios.put(
          `${USER_BASE_URL}/collections/${collection.id}`,
          formPayload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Collection Updated");
      } else {
        // POST request for creating new collection
        await axios.post(`${USER_BASE_URL}/collections`, formPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Collection Added");
      }
      refreshCollections();
      onClose();
    } catch (error) {
      console.error("Error saving collection:", error);
      toast.error("Something Went Wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            {collection ? "Edit Collection" : "Add New Collection"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              >
                <option value="">Select Category (Optional)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {collection ? "Update Images" : "Collection Images"}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-[#527557] hover:file:bg-[#527557]-100"
              />
              <div className="flex gap-2">
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-16 w-16 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white cursor-pointer ${
                isSubmitting ? "bg-[#527557] opacity-50" : "bg-[#527557]"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionModal;
