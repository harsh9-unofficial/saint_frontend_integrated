import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RecentlyViewed from "./RecentlyViewed";
import { USER_BASE_URL } from "../config";
import toast from "react-hot-toast";

export default function SingleProduct() {
  const userId = localStorage.getItem("userId");
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openAccordions, setOpenAccordions] = useState(["details"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${USER_BASE_URL}/products/get/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.data || !response.data.images) {
          throw new Error("Invalid product data received");
        }
        const productData = response.data;

        setProduct(productData);
        setSelectedImage(productData.images[0] || "");

        // Set default color
        if (productData.ProductColors && productData.ProductColors.length > 0) {
          setSelectedColor(productData.ProductColors[0].id);
        }

        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch product. Please try again."
        );
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleColorClick = (colorId) => {
    setSelectedColor(colorId === selectedColor ? null : colorId);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color/size variant.");
      return;
    }

    try {
      const response = await axios.post(
        `${USER_BASE_URL}/cart/add`, // Updated to match cartRoutes.js
        {
          userId,
          productColorId: selectedColor,
          quantity: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Product added to cart!");
    } catch (err) {
      console.error("Add to Cart Error:", err);
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleImageError = (e) => {
    console.error(`Failed to load image: ${e.target.src}`);
    e.target.src = "/placeholder-image.jpg";
  };

  const toggleAccordion = (section) => {
    setOpenAccordions((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section]
    );
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (!product)
    return <div className="text-center py-10">Product not found</div>;

  const parseAndCleanToArray = (str) => {
    if (typeof str !== "string") return [];

    try {
      const parsed = JSON.parse(str);
      if (typeof parsed === "string") {
        return parsed.split(",").map((item) => item.trim());
      }
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim());
      }
      return String(parsed)
        .split(",")
        .map((item) => item.trim());
    } catch (e) {
      const cleaned = str
        .replace(/^"|"$/g, "")
        .replace(/\\"/g, '"')
        .replace(/\\+/g, "")
        .replace(/"/g, "")
        .replace(/\[/g, "")
        .replace(/\]/g, "")
        .trim();
      return cleaned.split(",").map((item) => item.trim());
    }
  };

  const currentPrice = product.originalPrice;
  const showStrikethrough = product.basePrice;

  const selectedColorName =
    selectedColor &&
    Array.isArray(product.ProductColors) &&
    product.ProductColors.find((color) => color.id === selectedColor)?.Color
      ?.name;

  const selectedSize =
    selectedColor &&
    Array.isArray(product.ProductColors) &&
    product.ProductColors.find((color) => color.id === selectedColor)?.size;

  const accordionSections = [
    {
      title: "Details",
      value: "details",
      content: (
        <ul className="text-sm text-gray-800 list-disc pl-4 sm:pl-5">
          {(() => {
            const items = parseAndCleanToArray(product.details);
            return items.length > 0 && items[0] !== "" ? (
              items.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>No details available</li>
            );
          })()}
        </ul>
      ),
    },
    {
      title: "Size fit",
      value: "fit",
      content: (
        <ul className="text-sm text-gray-800 list-disc pl-4 sm:pl-5">
          {(() => {
            const items = parseAndCleanToArray(product.sizeFit);
            return items.length > 0 && items[0] !== "" ? (
              items.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>No size fit information</li>
            );
          })()}
        </ul>
      ),
    },
    {
      title: "Materials & Care",
      value: "care",
      content: (
        <ul className="text-sm text-gray-800 list-disc pl-4 sm:pl-5">
          {(() => {
            const items = parseAndCleanToArray(product.materialCare);
            return items.length > 0 && items[0] !== "" ? (
              items.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>No material care information</li>
            );
          })()}
        </ul>
      ),
    },
    {
      title: "Shipping & Returns",
      value: "shipping",
      content: (
        <ul className="text-sm text-gray-800 list-disc pl-4 sm:pl-5">
          {(() => {
            const items = parseAndCleanToArray(product.shippingReturn);
            return items.length > 0 && items[0] !== "" ? (
              items.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>No shipping information</li>
            );
          })()}
        </ul>
      ),
    },
  ];

  const isOutOfStock = product.remainingQty === 0;

  return (
    <>
      <div className="p-2 sm:p-4 container mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden lg:overflow-y-auto">
              {Array.isArray(product.images) && product.images.length > 0 ? (
                product.images.map((src, idx) => (
                  <img
                    key={idx}
                    src={`${USER_BASE_URL}${src}`}
                    alt={`Thumbnail ${idx}`}
                    onClick={() => setSelectedImage(src)}
                    onError={handleImageError}
                    className={`w-21 h-21 xl:w-24 xl:h-24 cursor-pointer border rounded ${
                      selectedImage === src ? "border-black" : "border-gray-200"
                    }`}
                  />
                ))
              ) : (
                <div>No images available</div>
              )}
            </div>
            <img
              src={
                selectedImage
                  ? `${USER_BASE_URL}${selectedImage}`
                  : "/placeholder-image.jpg"
              }
              alt="Selected"
              onError={handleImageError}
              className="w-full lg:w-[510px] xl:w-[600px] 2xl:w-[775px] lg:h-[758px] xl:h-[900px] rounded"
            />
          </div>

          <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="pt-4 flex flex-col gap-4 sm:gap-6">
              <span className="bg-red-700 rounded-full px-4 py-2 text-white font-medium w-fit text-sm sm:text-base">
                {isOutOfStock ? "Sold out" : "In Stock"}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
                {product.name || "Unnamed Product"}
              </h1>
            </div>
            <div className="font-semibold flex flex-col-reverse md:flex-row">
              <span className="text-xl sm:text-2xl">
                ₹ {currentPrice ? currentPrice.toFixed(2) : "0.00"}
              </span>
              {showStrikethrough && (
                <span className="text-lg sm:text-xl md:text-2xl line-through text-gray-400 md:ml-2">
                  ₹ {product.basePrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-base sm:text-lg text-gray-600">
              {isOutOfStock
                ? "Coming soon, please wait for sometime."
                : "Available now for purchase."}
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              {product.description &&
              product.description !== "2025-05-14T12:27:00.000Z"
                ? product.description
                : "A classic T-shirt made with premium materials for comfort and style."}
            </p>
            <p className="text-base sm:text-lg text-gray-600">Made in India.</p>

            <div>
              <h3 className="font-medium text-base sm:text-lg">
                {selectedColorName
                  ? `Color: ${selectedColorName}${
                      selectedSize ? `, Size: ${selectedSize}` : ""
                    }`
                  : "Select Color/Size"}
              </h3>
              <div className="flex gap-2 sm:gap-3 mt-2">
                {Array.isArray(product.ProductColors) &&
                product.ProductColors.length > 0 ? (
                  product.ProductColors.map((color) => (
                    <div
                      key={color.id}
                      onClick={() => handleColorClick(color.id)}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-sm border-2 cursor-pointer ${
                        selectedColor === color.id
                          ? "border-black"
                          : "border-transparent"
                      }`}
                      style={{
                        backgroundColor: color.Color?.hexCode || "#ccc",
                      }}
                      title={`${color.Color?.name}${
                        color.size ? `, ${color.size}` : ""
                      }`}
                    />
                  ))
                ) : (
                  <div>No colors available</div>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3 sm:py-4 rounded mt-2 sm:mt-4 text-white text-sm sm:text-base ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#527557] cursor-pointer"
              }`}
              disabled={isOutOfStock}
            >
              Add to Cart
            </button>

            <div className="mt-4 sm:mt-6 border-t pt-4 space-y-4">
              {accordionSections.map((section) => (
                <div key={section.value}>
                  <button
                    className="w-full text-left font-medium text-base sm:text-lg flex justify-between items-center"
                    onClick={() => toggleAccordion(section.value)}
                  >
                    {section.title}
                    <span>
                      {openAccordions.includes(section.value) ? "-" : "+"}
                    </span>
                  </button>
                  {openAccordions.includes(section.value) && (
                    <div className="mt-2 text-sm text-gray-700">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <RecentlyViewed />
    </>
  );
}
