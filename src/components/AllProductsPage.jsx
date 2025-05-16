import { useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    title: "Olive Cotton T-Shirt",
    price: 799,
    category: "Kids",
    size: ["M", "L"],
    color: "#527557",
    image: "/images/FP1.png",
  },
  {
    id: 2,
    title: "Yellow Floral Kurti",
    price: 1199,
    category: "Woman",
    size: ["S", "M"],
    color: "#DFAA3C",
    image: "/images/FP2.png",
  },
  {
    id: 3,
    title: "Denim Casual Jacket",
    price: 2399,
    category: "Man",
    size: ["L", "XL"],
    color: "#435462",
    image: "/images/FP3.png",
  },
  {
    id: 4,
    title: "Beige Summer Dress",
    price: 1599,
    category: "Woman",
    size: ["XS", "S"],
    color: "#E2DBCB",
    image: "/images/FP4.png",
  },
  {
    id: 5,
    title: "Slim Fit Polo",
    price: 899,
    category: "Accessories",
    size: ["M"],
    color: "#527557",
    image: "/images/Shirt.png",
  },
  {
    id: 6,
    title: "Printed Anarkali",
    price: 1799,
    category: "Woman",
    size: ["S"],
    color: "#DFAA3C",
    image: "/images/Dress.png",
  },
  {
    id: 7,
    title: "Winter Hooded Jacket",
    price: 2999,
    category: "Man",
    size: ["XL"],
    color: "#435462",
    image: "/images/Jacket.png",
  },
  {
    id: 8,
    title: "Graphic Cotton Tee",
    price: 699,
    category: "Kids",
    size: ["S", "M"],
    color: "#E2DBCB",
    image: "/images/Tshirt.png",
  },
];

export default function AllProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Featured");

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative">
                  <Link to={`/singleproduct/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full object-cover"
                    />
                  </Link>
                  <span className="absolute bottom-2 left-2 bg-[#527557] text-[#F6F6F6] text-xs px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">{product.title}</h3>
                  <p className="text-green-700 font-semibold mb-4">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>

                  <div className="flex justify-between items-center gap-2">
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
