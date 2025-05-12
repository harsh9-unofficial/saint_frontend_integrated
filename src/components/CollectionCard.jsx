import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    title: "Classic Green Tee",
    price: "$29.99",
    category: "Shirt",
    image: "/images/Shirt.png",
  },
  {
    id: 2,
    title: "Floral Print Blouse",
    price: "$29.99",
    category: "Dress",
    image: "/images/Dress.png",
  },
  {
    id: 3,
    title: "Casual Denim Jacket",
    price: "$29.99",
    category: "Jacket",
    image: "/images/Jacket.png",
  },
  {
    id: 4,
    title: "Summer Dress",
    price: "$29.99",
    category: "T-Shirt",
    image: "/images/Tshirt.png",
  },
];

const CollectionCard = () => {
  return (
    <section className="container mx-auto py-10 px-4 ">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
        Our collections
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xl:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative">
              <Link to="/singleproduct">
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
                {product.price}
              </p>

              <div className="flex justify-between items-center gap-2">
                <button className="flex-1 bg-[#527557] text-[#F6F6F6] py-2 px-3 rounded cursor-pointer text-sm">
                  <Link to="/singleproduct">View Details</Link>
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

export default CollectionCard;
