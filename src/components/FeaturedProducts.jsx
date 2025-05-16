import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    title: "Classic Green Tee",
    price: "$29.99",
    category: "Shirt",
    image: "/images/FP1.png",
  },
  {
    id: 2,
    title: "Floral Print Blouse",
    price: "$29.99",
    category: "Dress",
    image: "/images/FP2.png",
  },
  {
    id: 3,
    title: "Casual Denim Jacket",
    price: "$29.99",
    category: "Jacket",
    image: "/images/FP3.png",
  },
  {
    id: 4,
    title: "Summer Dress",
    price: "$29.99",
    category: "T-Shirt",
    image: "/images/FP4.png",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="container mx-auto py-10 px-2">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
        Featured Products
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
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 md:h-full object-"
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

export default FeaturedProducts;
