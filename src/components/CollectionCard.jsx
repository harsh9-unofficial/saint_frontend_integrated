import { useState, useEffect } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast"; // Import toast
import { USER_BASE_URL } from "../config";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

const CollectionCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductColors, setSelectedProductColors] = useState({});
  const [colors, setColors] = useState([]);

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
              productColorId: color.id, // Numeric ID from ProductColors
              colorId: color.colorId || null,
              hexCode: color.hexCode?.trim().toLowerCase() || "#527557",
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

        // Initialize selected colors to the first productColorId
        const initialSelectedColors = {};
        mappedProducts.forEach((product) => {
          if (product.colors.length > 0) {
            initialSelectedColors[product.id] =
              product.colors[0].productColorId; // Pehla productColorId
          }
        });
        setSelectedProductColors(initialSelectedColors);

        // Fetch colors for sidebar
        const colorResponse = await axios.get(`${USER_BASE_URL}/colors`);
        const colorData = colorResponse.data.map((color) => ({
          id: color.id,
          hexCode: color.hexCode.trim().toLowerCase(),
          name: color.name || "Unknown",
        }));
        setColors(colorData);

        setLoading(false);
        // toast.success("Products and colors fetched successfully!");
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
        toast.error("Failed to fetch data.");
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!token || !userId) {
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
          userId,
          productColorId, // Numeric ID jaega
          quantity: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <section className="container mx-auto py-10 px-2">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
        Our collections
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xl:gap-6">
        {products?.map((product) => (
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
                  <Link to={`/singleproduct/${product.id}`}>View Details</Link>
                </button>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="p-2 border border-[#527557] bg-[#527557] rounded cursor-pointer"
                >
                  <FiShoppingBag className="text-[#F6F6F6]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionCard;
