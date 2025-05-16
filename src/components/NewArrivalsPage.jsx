import React, { useState, useEffect } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { USER_BASE_URL } from "../config";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${USER_BASE_URL}/products`);
        const data = response.data;

        const mappedProducts = data.map((product) => ({
          id: product.id,
          title: product.name,
          price: product.basePrice,
          category: product.Category.name,
          size: product.sizes || ["M"],
          color: product.color || "#527557",
          image: `${USER_BASE_URL}${product.Images[0].imageUrl}`,
        }));

        console.log(mappedProducts);

        setProducts(mappedProducts);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCheckbox = (value, list, setter) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleColorClick = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const filteredProducts = products
    .filter((product) => {
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const matchSize =
        selectedSizes.length === 0 ||
        selectedSizes.some((size) => product.size.includes(size));
      const matchColor =
        selectedColors.length === 0 || selectedColors.includes(product.color);
      const matchMin = minPrice === "" || product.price >= parseFloat(minPrice);
      const matchMax = maxPrice === "" || product.price <= parseFloat(maxPrice);
      const matchSearch =
        searchTerm === "" ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchCategory &&
        matchSize &&
        matchColor &&
        matchMin &&
        matchMax &&
        matchSearch
      );
    })
    .sort((a, b) => {
      if (sortOption === "Price: Low to High") return a.price - b.price;
      if (sortOption === "Price: High to Low") return b.price - a.price;
      return 0; // Default (Featured)
    });

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
      <h1 className="text-3xl font-semibold pt-6">New Arrivals</h1>
      <p className="text-lg text-gray-500 pb-8">Home / New Arrivals</p>

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
                  className="scale-150"
                  onChange={() =>
                    handleCheckbox(
                      cat,
                      selectedCategories,
                      setSelectedCategories
                    )
                  }
                />
                <label htmlFor={cat} className="text-[#aaa] text-lg">
                  {cat}
                </label>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-2xl">Size</h3>
            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
              <div key={size} className="flex items-center gap-2 px-4 py-1">
                <input
                  type="checkbox"
                  id={size}
                  className="scale-150"
                  onChange={() =>
                    handleCheckbox(size, selectedSizes, setSelectedSizes)
                  }
                />
                <label htmlFor={size} className="text-[#aaa]">
                  {size}
                </label>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-2xl">Colors</h3>
            <div className="flex gap-2 px-4 flex-wrap">
              {["#527557", "#DFAA3C", "#E2DBCB", "#862E3C", "#435462"].map(
                (color) => (
                  <div
                    key={color}
                    onClick={() => handleColorClick(color)}
                    className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                      selectedColors.includes(color)
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                )
              )}
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
                  className="border border-[#ccc] py-2 px-4 rounded"
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
                  className="border border-[#ccc] py-2 px-4 rounded"
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
              className="w-full md:w-55 border border-[#ccc] p-2 rounded"
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xl:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-500 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative">
                  <Link to={`/singleproduct/${product.id}`}>
                    <img
                      src={`${product.image}`}
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
                    <button className="p-2 border border-[#527557] bg-[#527557] rounded cursor-pointer">
                      <FiShoppingBag className="text-[#F6F6F6]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
