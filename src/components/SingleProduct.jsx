import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RecentlyViewed from "./RecentlyViewed";
import { USER_BASE_URL } from "../config";

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [openAccordions, setOpenAccordions] = useState(["details"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${USER_BASE_URL}/products/${id}`,
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

        // Define custom size order
        const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

        // Sort ProductSizes by custom size order
        if (productData.ProductSizes && productData.ProductSizes.length > 0) {
          productData.ProductSizes.sort((a, b) => {
            const aIndex = sizeOrder.indexOf(a.name);
            const bIndex = sizeOrder.indexOf(b.name);
            // If both sizes are in sizeOrder, sort by their index
            if (aIndex !== -1 && bIndex !== -1) {
              return aIndex - bIndex;
            }
            // If a is not in sizeOrder, it goes to the end
            if (aIndex === -1) {
              return 1;
            }
            // If b is not in sizeOrder, it goes to the end
            if (bIndex === -1) {
              return -1;
            }
            return 0;
          });
        }

        setProduct(productData);
        setSelectedImage(productData.images[0] || "");

        // Set default color and size
        if (productData.ProductColors && productData.ProductColors.length > 0) {
          setSelectedColor(productData.ProductColors[0].id);
        }
        if (productData.ProductSizes && productData.ProductSizes.length > 0) {
          setSelectedSize(productData.ProductSizes[0].sizeId);
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

  const handleSizeClick = (sizeId) => {
    setSelectedSize(sizeId);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/cart",
        {
          productId: id,
          sizeId: selectedSize,
          colorIds: selectedColor ? [selectedColor] : [],
          quantity: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Product added to cart!");
    } catch (err) {
      console.error("Add to Cart Error:", err);
      alert(err.response?.data?.message || "Failed to add to cart");
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
      console.log("JSON Parse Error for:", str, "Error:", e.message);
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

  const selectedSizeData =
    Array.isArray(product.ProductSizes) && selectedSize
      ? product.ProductSizes.find((size) => size.sizeId === selectedSize)
      : null;
  const currentPrice = selectedSizeData
    ? selectedSizeData.originalPrice
    : product.basePrice;
  const showStrikethrough =
    selectedSizeData && product.basePrice !== currentPrice;

  const accordionSections = [
    {
      title: "Details",
      value: "details",
      content: (
        <ul className="text-sm text-gray-800 list-disc pl-4 sm:pl-5">
          {(() => {
            const items = parseAndCleanToArray(product.details);
            console.log("Rendered Details Items:", items);
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

  const isOutOfStock =
    Array.isArray(product.ProductSizes) && product.ProductSizes.length > 0
      ? product.ProductSizes.every((size) => size.stock === 0)
      : true;

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
                    src={`http://localhost:5000${src}`}
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
                  ? `http://localhost:5000${selectedImage}`
                  : "/placeholder-image.jpg"
              }
              alt="Selected"
              onError={handleImageError}
              className="w-full lg
            lg:w-[510px] xl:w-[600px] 2xl:w-[775px] lg:h-[758px] xl:h-[900px] rounded"
            />
          </div>

          <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="pt-4 flex flex-col gap-4 sm:gap-6">
              <span className="bg-red-700 rounded-full px-4 py-2 text-white font-medium w-fit text-xs sm:text-sm">
                {isOutOfStock ? "Sold out" : "In Stock"}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
                {product.name || "Unnamed Product"}
              </h1>
            </div>
            <div className="font-semibold flex flex-col-reverse md:flex-row">
              <span className="text-xl sm:text-2xl">
                Rs. {currentPrice ? currentPrice.toFixed(2) : "0.00"}
              </span>
              {showStrikethrough && (
                <span className="text-lg sm:text-xl md:text-2xl line-through text-gray-400 md:ml-2">
                  Rs. {product.basePrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-base sm:text-lg text-gray-600">
              {isOutOfStock
                ? "Coming soon, please add your name to be notified when this piece has landed online."
                : "Available now for purchase."}
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              {product.description &&
              product.description !== "2025-05-14T12:27:00.000Z"
                ? product.description
                : "A classic T-shirt made with premium materials for comfort and style."}
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              Made in {product.Category?.name || "Unknown"}.
            </p>

            <div>
              <h3 className="font-medium text-base sm:text-lg">Color</h3>
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
                    />
                  ))
                ) : (
                  <div>No colors available</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-base sm:text-lg mt-2 sm:mt-4">
                Size
              </h3>
              <div className="flex gap-2 mt-2 flex-wrap">
                {Array.isArray(product.ProductSizes) &&
                product.ProductSizes.length > 0 ? (
                  product.ProductSizes.map((size) => (
                    <button
                      key={size.sizeId}
                      onClick={() => handleSizeClick(size.sizeId)}
                      className={`border px-3 py-2 sm:px-4 sm:py-3 rounded text-xs sm:text-sm hover:bg-gray-100 ${
                        selectedSize === size.sizeId
                          ? "border-black bg-gray-100"
                          : "border-gray-400"
                      } ${
                        size.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={size.stock === 0}
                    >
                      {size.name || "Unknown Size"}
                    </button>
                  ))
                ) : (
                  <div>No sizes available</div>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3 sm:py-4 rounded mt-2 sm:mt-4 text-white text-sm sm:text-base ${
                isOutOfStock || !selectedSize
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#527557] cursor-pointer"
              }`}
              disabled={isOutOfStock || !selectedSize}
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