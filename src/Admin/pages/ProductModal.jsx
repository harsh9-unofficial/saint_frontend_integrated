import React, { useState, useEffect } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";

const ProductModal = ({ isOpen, onClose, product, refreshProducts }) => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    shortDescription: "",
    longDescription: "",
    suitableSurfaces: "",
    stock: 0,
    features: [],
    howToUse: [],
    images: [],
    volume: "",
    ingredients: "",
    scent: "",
    phLevel: "",
    shelfLife: "",
    madeIn: "",
    packaging: "",
    combos: false,
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
  const [howToUseInput, setHowToUseInput] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${USER_BASE_URL}/api/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, [token]);

  // Initialize form when product changes
  useEffect(() => {
    if (product) {
      console.log("Product data:", product);
      setFormData({
        name: product.name || "",
        suitableSurfaces: product.suitableSurfaces || "",
        categoryId: product.categoryId || "",
        price: product.price || "",
        shortDescription: product.shortDescription || "",
        longDescription: product.longDescription || "",
        stock: product.stock || 0,
        features: Array.isArray(product.features)
          ? product.features
          : product.features
          ? JSON.parse(product.features)
          : [],
        howToUse: Array.isArray(product.howToUse)
          ? product.howToUse
          : product.howToUse
          ? JSON.parse(product.howToUse)
          : [],
        images: [],
        volume: product.volume || "",
        ingredients: product.ingredients || "",
        scent: product.scent || "",
        phLevel: product.phLevel || "",
        shelfLife: product.shelfLife || "",
        madeIn: product.madeIn || "",
        packaging: product.packaging || "",
        combos: product.combos || false,
      });
      // Set preview images from existing product
      const existingImages = Array.isArray(product.images)
        ? product.images
        : product.images
        ? JSON.parse(product.images)
        : [];
      setPreviewImages(existingImages.map((img) => `${USER_BASE_URL}/${img}`));
    } else {
      setFormData({
        name: "",
        suitableSurfaces: "",
        categoryId: "",
        price: "",
        shortDescription: "",
        longDescription: "",
        stock: 0,
        features: [],
        howToUse: [],
        images: [],
        volume: "",
        ingredients: "",
        scent: "",
        phLevel: "",
        shelfLife: "",
        madeIn: "",
        packaging: "",
        combos: false,
      });
      setPreviewImages([]);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setFormData((prev) => ({ ...prev, images: files }));
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      if (formData.features.includes(featureInput.trim())) {
        toast.error("Feature already exists");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addHowToUse = () => {
    if (howToUseInput.trim()) {
      if (formData.howToUse.includes(howToUseInput.trim())) {
        toast.error("How to Use item already exists");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        howToUse: [...prev.howToUse, howToUseInput.trim()],
      }));
      setHowToUseInput("");
    }
  };

  const removeHowToUse = (index) => {
    setFormData((prev) => ({
      ...prev,
      howToUse: prev.howToUse.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!product && formData.howToUse.length === 0) {
      toast.error("At least one How to Use item is required");
      return;
    }
    if (!product && formData.features.length === 0) {
      toast.error("At least one feature is required");
      return;
    }
    if (!product && formData.images.length === 0) {
      toast.error("At least one image is required");
      return;
    }
    if (
      !formData.name ||
      !formData.categoryId ||
      !formData.price ||
      !formData.shortDescription ||
      !formData.longDescription ||
      !formData.suitableSurfaces ||
      !formData.ingredients
    ) {
      toast.error("All fields marked with * are required");
      return;
    }

    setIsSubmitting(true);

    // Append all fields explicitly
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("categoryId", formData.categoryId);
    formPayload.append("price", formData.price);
    formPayload.append("shortDescription", formData.shortDescription);
    formPayload.append("longDescription", formData.longDescription);
    formPayload.append("suitableSurfaces", formData.suitableSurfaces);
    formPayload.append("stock", formData.stock.toString());
    formPayload.append("features", JSON.stringify(formData.features));
    formPayload.append("howToUse", JSON.stringify(formData.howToUse));
    formPayload.append("volume", formData.volume || "");
    formPayload.append("ingredients", formData.ingredients);
    formPayload.append("scent", formData.scent || "");
    formPayload.append("phLevel", formData.phLevel || "");
    formPayload.append("shelfLife", formData.shelfLife || "");
    formPayload.append("madeIn", formData.madeIn || "");
    formPayload.append("packaging", formData.packaging || "");
    formPayload.append("combos", formData.combos.toString());

    formData.images.forEach((image) => {
      formPayload.append("images", image);
    });

    for (let pair of formPayload.entries()) {
      console.log(
        `${pair[0]}: ${pair[1] instanceof File ? "[File Object]" : pair[1]}`
      );
    }

    try {
      if (product) {
        await axios.put(
          `${USER_BASE_URL}/api/products/${product.id}`,
          formPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Product Updated");
      } else {
        const response = await axios.post(
          `${USER_BASE_URL}/api/products`,
          formPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Server response:", response.data);
        toast.success("Product Added");
      }
      refreshProducts();
      onClose();
    } catch (error) {
      console.error(
        "Error saving product:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6 cursor-pointer" />
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
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description *
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Description *
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features {product ? "(Optional)" : "*"}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add feature"
                className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-[#527557] text-white rounded-md cursor-pointer"
              >
                Add
              </button>
            </div>
            {formData.features.length === 0 && (
              <p className="text-sm text-gray-500">No features added yet.</p>
            )}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How to Use {product ? "(Optional)" : "*"}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={howToUseInput}
                onChange={(e) => setHowToUseInput(e.target.value)}
                placeholder="Add how to use item"
                className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
              <button
                type="button"
                onClick={addHowToUse}
                className="px-4 py-2 bg-[#527557] text-white rounded-md cursor-pointer"
              >
                Add
              </button>
            </div>
            {formData.howToUse.length === 0 && (
              <p className="text-sm text-gray-500">
                No how to use items added yet.
              </p>
            )}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.howToUse.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeHowToUse(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suitable Surfaces *
              </label>
              <input
                type="text"
                name="suitableSurfaces"
                value={formData.suitableSurfaces}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume
              </label>
              <input
                type="number"
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingredients *
              </label>
              <input
                type="text"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scent
              </label>
              <input
                type="text"
                name="scent"
                value={formData.scent}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                pH Level
              </label>
              <input
                type="number"
                name="phLevel"
                value={formData.phLevel}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="14"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shelf Life (months)
              </label>
              <input
                type="number"
                name="shelfLife"
                value={formData.shelfLife}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Made In
              </label>
              <input
                type="text"
                name="madeIn"
                value={formData.madeIn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Packaging
              </label>
              <input
                type="text"
                name="packaging"
                value={formData.packaging}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Combos
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="combos"
                  checked={formData.combos}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-[#527557] focus:ring-[#527557] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Combos</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images {product ? "(Optional for update)" : "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#5275574d] file:text-[#527557] file:cursor-pointer"
            />
            {previewImages.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-16 w-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
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
                isSubmitting ? "bg-[#8aa7ff]" : "bg-[#527557] "
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
