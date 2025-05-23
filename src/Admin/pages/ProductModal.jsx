import React, { useState, useEffect } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";

const ProductModal = ({ isOpen, onClose, product, refreshProducts }) => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    basePrice: "",
    originalPrice: "",
    originalQty: "",
    purchaseQty: "",
    remainingQty: "",
    description: "",
    categoryId: "",
    collectionId: "",
    details: [],
    sizeFit: [],
    materialCare: [],
    shippingReturn: [],
    images: [],
    colors: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [colorInput, setColorInput] = useState({
    colorId: "",
    hexCode: "",
    name: "",
  });
  const [detailInput, setDetailInput] = useState("");
  const [sizeFitInput, setSizeFitInput] = useState("");
  const [materialCareInput, setMaterialCareInput] = useState("");
  const [shippingReturnInput, setShippingReturnInput] = useState("");

  // Fetch categories, collections, and colors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, collectionRes, colorRes] = await Promise.all([
          axios.get(`${USER_BASE_URL}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${USER_BASE_URL}/collections`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${USER_BASE_URL}/colors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCategories(categoryRes.data);
        setCollections(collectionRes.data);
        setAvailableColors(colorRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };
    if (token) fetchData();
  }, [token]);

  // Initialize form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        basePrice: product.basePrice || "",
        originalPrice: product.originalPrice || "",
        originalQty: product.originalQty || "",
        purchaseQty: product.purchaseQty || "",
        remainingQty: product.remainingQty || "",
        description: product.description || "",
        categoryId: product.categoryId || "",
        collectionId: product.collectionId || "",
        details: Array.isArray(product.details) ? product.details : [],
        sizeFit: Array.isArray(product.sizeFit) ? product.sizeFit : [],
        materialCare: Array.isArray(product.materialCare) ? product.materialCare : [],
        shippingReturn: Array.isArray(product.shippingReturn) ? product.shippingReturn : [],
        images: [],
        colors:
          product.ProductColors?.map((color) => ({
            colorId: color.Color.id,
            hexCode: color.Color.hexCode || "",
            name: color.Color.name || "",
          })) || [],
      });
      setPreviewImages(product.images?.map((img) => `${USER_BASE_URL}${img}`) || []);
    } else {
      setFormData({
        name: "",
        basePrice: "",
        originalPrice: "",
        originalQty: "",
        purchaseQty: "",
        remainingQty: "",
        description: "",
        categoryId: "",
        collectionId: "",
        details: [],
        sizeFit: [],
        materialCare: [],
        shippingReturn: [],
        images: [],
        colors: [],
      });
      setPreviewImages([]);
    }
    setIsSubmitting(false);
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const addColor = () => {
    if (colorInput.colorId && colorInput.hexCode && colorInput.name) {
      if (formData.colors.some((c) => c.colorId === parseInt(colorInput.colorId))) {
        toast.error("Color already added");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        colors: [
          ...prev.colors,
          {
            colorId: parseInt(colorInput.colorId),
            hexCode: colorInput.hexCode,
            name: colorInput.name,
          },
        ],
      }));
      setColorInput({ colorId: "", hexCode: "", name: "" });
    } else {
      toast.error("Please select a color");
    }
  };

  const removeColor = (index) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const addDetail = () => {
    if (detailInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        details: [...prev.details, detailInput],
      }));
      setDetailInput("");
    } else {
      toast.error("Please enter a detail");
    }
  };

  const removeDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const addSizeFit = () => {
    if (sizeFitInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        sizeFit: [...prev.sizeFit, sizeFitInput],
      }));
      setSizeFitInput("");
    } else {
      toast.error("Please enter size & fit info");
    }
  };

  const removeSizeFit = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizeFit: prev.sizeFit.filter((_, i) => i !== index),
    }));
  };

  const addMaterialCare = () => {
    if (materialCareInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        materialCare: [...prev.materialCare, materialCareInput],
      }));
      setMaterialCareInput("");
    } else {
      toast.error("Please enter material & care info");
    }
  };

  const removeMaterialCare = (index) => {
    setFormData((prev) => ({
      ...prev,
      materialCare: prev.materialCare.filter((_, i) => i !== index),
    }));
  };

  const addShippingReturn = () => {
    if (shippingReturnInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        shippingReturn: [...prev.shippingReturn, shippingReturnInput],
      }));
      setShippingReturnInput("");
    } else {
      toast.error("Please enter shipping & return info");
    }
  };

  const removeShippingReturn = (index) => {
    setFormData((prev) => ({
      ...prev,
      shippingReturn: prev.shippingReturn.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const missingFields = [];
    if (!formData.name) missingFields.push("Name");
    if (!formData.basePrice) missingFields.push("Base Price");
    if (!formData.originalPrice) missingFields.push("Original Price");
    if (!formData.originalQty) missingFields.push("Original Quantity");
    if (!formData.description) missingFields.push("Description");
    if (!formData.categoryId) missingFields.push("Category");
    if (!product && !formData.images.length) missingFields.push("Images");

    if (missingFields.length > 0) {
      toast.error(`Please fill the following required fields: ${missingFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("basePrice", formData.basePrice);
    formPayload.append("originalPrice", formData.originalPrice);
    formPayload.append("originalQty", formData.originalQty);
    formPayload.append("purchaseQty", formData.purchaseQty);
    formPayload.append("remainingQty", formData.remainingQty);
    formPayload.append("description", formData.description);
    formPayload.append("categoryId", formData.categoryId);
    formPayload.append("collectionId", formData.collectionId || "");
    formPayload.append("details", JSON.stringify(formData.details));
    formPayload.append("sizeFit", JSON.stringify(formData.sizeFit));
    formPayload.append("materialCare", JSON.stringify(formData.materialCare));
    formPayload.append("shippingReturn", JSON.stringify(formData.shippingReturn));
    if (formData.images.length > 0) {
      formData.images.forEach((image) => formPayload.append("images", image));
    }
    formPayload.append(
      "colors",
      JSON.stringify(formData.colors.map((c) => ({ colorId: c.colorId, name: c.name })))
    );

    try {
      if (product) {
        await axios.put(`${USER_BASE_URL}/products/${product.id}`, formPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product Updated");
      } else {
        await axios.post(`${USER_BASE_URL}/products`, formPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product Added");
      }
      refreshProducts();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price *</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price *</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                name="originalQty"
                value={formData.originalQty}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
              <select
                name="collectionId"
                value={formData.collectionId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              >
                <option value="">Select Collection</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={detailInput}
                onChange={(e) => setDetailInput(e.target.value)}
                placeholder="Add a detail"
                className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
              <button
                type="button"
                onClick={addDetail}
                className="px-4 py-2 bg-[#527557] text-white rounded-md cursor-pointer"
              >
                Add
              </button>
            </div>
            {formData.details.length === 0 && (
              <p className="text-sm text-gray-500">No details added yet.</p>
            )}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.details.map((detail, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span>{detail}</span>
                  <button
                    type="button"
                    onClick={() => removeDetail(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size & Fit</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={sizeFitInput}
                onChange={(e) => setSizeFitInput(e.target.value)}
                placeholder="Add size & fit info"
                className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
              <button
                type="button"
                onClick={addSizeFit}
                className="px-4 py-2 bg-[#527557] text-white rounded-md cursor-pointer"
              >
                Add
              </button>
            </div>
            {formData.sizeFit.length === 0 && (
              <p className="text-sm text-gray-500">No size & fit info added yet.</p>
            )}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.sizeFit.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeSizeFit(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material & Care</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={materialCareInput}
                onChange={(e) => setMaterialCareInput(e.target.value)}
                placeholder="Add material & care info"
                className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
              <button
                type="button"
                onClick={addMaterialCare}
                className="px-4 py-2 bg-[#527557] text-white rounded-md cursor-pointer"
              >
                Add
              </button>
            </div>
            {formData.materialCare.length === 0 && (
              <p className="text-sm text-gray-500">No material & care info added yet.</p>
            )}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.materialCare.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeMaterialCare(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping & Return</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={shippingReturnInput}
                onChange={(e) => setShippingReturnInput(e.target.value)}
                placeholder="Add shipping & return info"
                className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              />
              <button
                type="button"
                onClick={addShippingReturn}
                className="px-4 py-2 bg-[#527557] text-white rounded-md cursor-pointer"
              >
                Add
              </button>
            </div>
            {formData.shippingReturn.length === 0 && (
              <p className="text-sm text-gray-500">No shipping & return info added yet.</p>
            )}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.shippingReturn.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeShippingReturn(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colors *</label>
            <div className="flex items-center gap-2 mb-2">
              <select
                value={colorInput.colorId}
                onChange={(e) => {
                  const selectedColorId = e.target.value;
                  const selectedColor = availableColors.find(
                    (c) => c.id.toString() === selectedColorId
                  );
                  setColorInput({
                    colorId: selectedColorId,
                    hexCode: selectedColor ? selectedColor.hexCode : "",
                    name: selectedColor ? selectedColor.name : "",
                  });
                }}
                className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
              >
                <option value="">Select Color</option>
                {availableColors.length > 0 ? (
                  availableColors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No colors available
                  </option>
                )}
              </select>
              <div
                className="w-10 h-10 rounded border"
                style={{
                  backgroundColor: colorInput.hexCode || "#FFFFFF",
                }}
              />
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-[#527557] text-white rounded-md cursor-pointer"
              >
                Add
              </button>
            </div>
            {formData.colors.length === 0 && (
              <p className="text-sm text-gray-500">No colors added yet.</p>
            )}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: color.hexCode || "#FFFFFF" }}
                    />
                    <span>{color.name || "Unnamed Color"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images {product ? "" : "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-[#527557] file:cursor-pointer"
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
                isSubmitting ? "bg-gray-400" : "bg-[#527557]"
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