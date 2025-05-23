import { useEffect, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { USER_BASE_URL } from "../config";
import axios from "axios";

const RecentlyViewed = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${USER_BASE_URL}/products`);
        const data = response.data;

        const mappedProducts = data.map((product, index) => ({
          id: product.id,
          title: product.name,
          price: `₹  ${product.basePrice}`,
          category: product.Category.name,
          image: product.Images[0].imageUrl,
        }));

        setProducts(mappedProducts);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }
  return (
    <section className="container mx-auto py-10 px-2">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
        Recently Viewed Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xl:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl overflow-hidden border border-gray-500 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative">
              <Link to={`/singleproduct/${product.id}`}>
                <img
                  src={`${USER_BASE_URL}${product.image}`}
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
                {product.price}
              </p>

              <div className="hidden md:flex flex-col md:flex-row justify-between items-center gap-2 pt-2">
                <button className="flex-1 bg-[#527557] text-[#F6F6F6] py-2 px-3 rounded cursor-pointer text-sm">
                  <Link to={`/singleproduct/${product.id}`}>View Details</Link>
                </button>
                <button className="p-2 border border-[#527557] bg-[#527557] rounded cursor-pointer">
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

export default RecentlyViewed;
