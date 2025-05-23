import React, { useState, useEffect } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { USER_BASE_URL } from "../config";
import toast from "react-hot-toast";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("Featured");
  const [selectedProductColors, setSelectedProductColors] = useState({});

  const location = useLocation();

  // Extract search keyword from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("search") || "";
    setSearchTerm(keyword);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productResponse = await axios.get(`${USER_BASE_URL}/products`);
        const productData = productResponse.data;

        const mappedProducts = productData.map((product) => {
          let productColors = [];
          if (
            Array.isArray(product.ProductColors) &&
            product.ProductColors.length > 0
          ) {
            productColors = product.ProductColors.map((color) => ({
              productColorId: color.id,
              colorId: color.Color.id,
              hexCode: color.Color.hexCode?.trim().toLowerCase() || "#527557",
              name: color.name || "Unknown",
            }));
          } else {
            productColors = [];
            console.warn(`No ProductColors for product ${product.id}`);
          }

          return {
            id: product.id,
            title: product.name,
            price: product.basePrice,
            category: product.Category?.name || "Unknown",
            colors: productColors,
            image: `${USER_BASE_URL}${
              product.images?.[0] || "/placeholder.jpg"
            }`,
          };
        });

        setProducts(mappedProducts);

        // Initialize selected colors
        const initialSelectedColors = {};
        mappedProducts.forEach((product) => {
          if (product.colors.length > 0) {
            initialSelectedColors[product.id] =
              product.colors[0].productColorId;
          }
        });
        setSelectedProductColors(initialSelectedColors);

        // Fetch colors
        const colorResponse = await axios.get(`${USER_BASE_URL}/colors`);
        const colorData = colorResponse.data.map((color) => ({
          id: color.id,
          hexCode: color.hexCode.trim().toLowerCase(),
          name: color.name || "Unknown",
        }));
        setColors(colorData);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products based only on searchTerm when present
  const filteredProducts = products.filter((product) => {
    if (searchTerm) {
      // Only apply search term filter if searchTerm exists
      return product.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    // Apply all filters when no search term
    const matchesCategory =
      selectedCategories.length > 0
        ? selectedCategories.includes(product.category)
        : true;
    const matchesColor =
      selectedColors.length > 0
        ? product.colors.some((color) => selectedColors.includes(color.colorId))
        : true;
    const matchMin = minPrice === "" || product.price >= parseFloat(minPrice);
    const matchMax = maxPrice === "" || product.price <= parseFloat(maxPrice);

    return matchesCategory && matchesColor && matchMin && matchMax;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (searchTerm) return 0; // Disable sorting when search term is present
    if (sortOption === "Price: Low to High") {
      return a.price - b.price;
    } else if (sortOption === "Price: High to Low") {
      return b.price - a.price;
    }
    return 0;
  });

  const handleAddToCart = async (productId) => {
    if (!localStorage.getItem("token")) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    const productColorId = selectedProductColors[productId];
    if (!productColorId) {
      toast.error("No valid color variant available for this product.");
      return;
    }

    try {
      const response = await axios.post(
        `${USER_BASE_URL}/cart/add`,
        {
          userId: localStorage.getItem("userId"),
          productColorId,
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
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-4 px-2 text-center">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-4 px-2 text-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-2">
      <h1 className="text-3xl font-semibold pt-6">All Products</h1>
      <p className="text-lg text-gray-500 pb-8">Home / All Products</p>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <aside className="w-full md:w-[34%] lg:w-[27%] xl:w-[23%] 2xl:w-[21%] space-y-6 border border-[#ccc] h-fit p-6">
          <div>
            <h3 className="font-semibold mb-2 text-2xl">Categories</h3>
            {["Man", "Woman", "Kids", "Accessories"].map((cat) => (
              <div key={cat} className="flex items-center gap-2 px-4 py-1">
                <input
                  type="checkbox"
                  id={cat}
                  className="scale-150 cursor-pointer"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => {
                    setSelectedCategories((prev) =>
                      prev.includes(cat)
                        ? prev.filter((c) => c !== cat)
                        : [...prev, cat]
                    );
                  }}
                  disabled={searchTerm}
                  title={
                    searchTerm ? "Category filtering is disabled on search" : ""
                  }
                />
                <label
                  htmlFor={cat}
                  className={`text-lg ${searchTerm ? "text-[#aaa]" : ""}`}
                >
                  {cat}
                </label>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-2xl">Colors</h3>
            <div className="flex gap-2 px-4 flex-wrap">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className={`w-7 h-7 rounded-full border-2 ${
                    searchTerm
                      ? "cursor-not-allowed border-transparent"
                      : selectedColors.includes(color.id)
                      ? "border-black cursor-pointer"
                      : "border-transparent cursor-pointer"
                  }`}
                  style={{ backgroundColor: color.hexCode }}
                  onClick={() => {
                    if (!searchTerm) {
                      setSelectedColors((prev) =>
                        prev.includes(color.id)
                          ? prev.filter((c) => c !== color.id)
                          : [...prev, color.id]
                      );
                    }
                  }}
                  title={
                    searchTerm ? "Color filtering is disabled on search" : ""
                  }
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-2xl">Price</h3>
            <div className="flex items-center py-2 w-full gap-2">
              <div className="flex flex-col w-1/2">
                <label htmlFor="min">Min</label>
                <input
                  type="number"
                  id="min"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className={`border border-[#ccc] py-2 px-4 rounded ${
                    searchTerm ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={searchTerm}
                  title={
                    searchTerm ? "Price filtering is disabled on search" : ""
                  }
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label htmlFor="max">Max</label>
                <input
                  type="number"
                  id="max"
                  placeholder="2000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className={`border border-[#ccc] py-2 px-4 rounded ${
                    searchTerm ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={searchTerm}
                  title={
                    searchTerm ? "Price filtering is disabled on search" : ""
                  }
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
            <input
              type="text"
              placeholder="Search Products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-[#ccc] p-2 rounded"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className={`w-full md:w-55 border border-[#ccc] p-2 rounded ${
                searchTerm ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={searchTerm}
              title={searchTerm ? "Sorting is disabled on search" : ""}
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 xl:gap-6">
            {sortedProducts.length === 0 ? (
              <p className="text-lg text-gray-600 col-span-full text-center">
                No products match the search term.
              </p>
            ) : (
              sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-500 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="relative">
                    <Link to={`/singleproduct/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 md:h-70 lg:h-75 xl:h-100 2xl:h-120"
                      />
                    </Link>
                    <span className="absolute bottom-2 left-2 bg-[#527557] text-[#F6F6F6] text-xs px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-2 md:p-4">
                    <h3 className="font-medium md:text-lg mb-1 truncate">
                      {product.title}
                    </h3>
                    <p className="text-green-700 text-sm md:text-base font-semibold">
                      ₹ {product.price}
                    </p>

                    <div className="hidden md:flex flex-col md:flex-row justify-between items-center gap-2 pt-2">
                      <button className="flex-1 bg-[#527557] text-[#F6F6F6] py-2 px-3 rounded cursor-pointer text-sm">
                        <Link to={`/singleproduct/${product.id}`}>
                          View Details
                        </Link>
                      </button>
                      <button
                        className="p-2 border border-[#527557] bg-[#527557] rounded cursor-pointer"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <FiShoppingBag className="text-[#F6F6F6]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
