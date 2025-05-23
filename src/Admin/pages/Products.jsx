import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import ProductModal from "./ProductModal";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {product.images && product.images.length > 0 ? (
            <img
              src={`${USER_BASE_URL}${product.images[0]}`}
              alt={product.name}
              className="w-full h-80 md:h-120 lg:h-140 xl:h-150 2xl:h-140"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Category</h2>
            <p className="text-gray-500">{product.Category?.name || "-"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Collection</h3>
            <p className="text-gray-500">{product.Collection?.name || "-"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Base Price</h3>
            <p className="text-gray-500">{product.basePrice || "-"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Colors</h3>
            {product.ProductColors.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-500">
                {product.ProductColors.map((color, index) => (
                  <li key={index}>{color.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">-</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Sizes</h3>
            {product.ProductSizes?.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-500">
                {product.ProductSizes.map((size, index) => (
                  <li key={index}>
                    {size.name} (Stock: {size.originalQty}) - Original Price: {size.originalPrice}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">-</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Description</h3>
            <p className="text-gray-500">{product.description || "-"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Details</h3>
            {product.details?.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-500">
                {product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No details available for this product.
              </p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Size & Fit</h3>
            {product.sizeFit?.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-500">
                {product.sizeFit.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No size & fit information available.
              </p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Material & Care
            </h3>
            {product.materialCare?.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-500">
                {product.materialCare.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No material &替代 care information available.
              </p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Shipping & Return
            </h3>
            {product.shippingReturn?.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-500">
                {product.shippingReturn.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No shipping & return information available.
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#527557] text-white rounded-lg hover:bg-[#426146] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  // Fetch products
  const fetchProducts = async () => {
    if (!token) {
      setError("Please log in to view products");
      toast.error("Authentication required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${USER_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const parsedProducts = response.data.map((product) => {
        const parseArray = (data) => {
          try {
            if (typeof data === "string") {
              const parsed = JSON.parse(data);
              return Array.isArray(parsed) ? parsed : [];
            }
            return Array.isArray(data) ? data : [];
          } catch (error) {
            console.error("Error parsing JSON:", error, "Data:", data);
            return [];
          }
        };

        return {
          ...product,
          images: product.images || [],
          Colors: product.Colors || [],
          Sizes: product.Sizes || [],
          Category: product.Category || { name: "-" },
          Collection: product.Collection || { name: "-" },
          details: parseArray(product.details),
          sizeFit: parseArray(product.sizeFit),
          materialCare: parseArray(product.materialCare),
          shippingReturn: parseArray(product.shippingReturn),
        };
      });

      setProducts(parsedProducts);
      setFilteredProducts(parsedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      const message =
        error.response?.data?.message || "Failed to load products";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter((product) =>
      [
        product.name,
        product.Category?.name,
        product.Collection?.name,
        product.description,
        product.basePrice?.toString(),
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${USER_BASE_URL}/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product deleted");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
      }
    }
  };

  // Retry fetch on error
  const handleRetry = () => {
    fetchProducts();
  };

  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by name, category, collection, description, or price..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#527557]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setCurrentProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#527557] text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="text-center py-10">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 flex items-center justify-center gap-2 bg-[#527557] text-white px-4 py-2 rounded-lg mx-auto"
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span>Retry</span>
          </button>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow flex flex-col min-h-[300px]"
            >
              <div className="overflow-hidden bg-gray-100 h-72">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`${USER_BASE_URL}${product.images[0]}`}
                    alt={product.name}
                    className="w-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}

                <div className="absolute top-3 right-3 flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      setCurrentProduct(product);
                      setTimeout(() => {
                        setIsDetailsModalOpen(true);
                      }, 0);
                    }}
                    className="p-2 bg-white rounded-full shadow text-blue-600 hover:bg-blue-100 cursor-pointer"
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white rounded-full shadow text-[#527557] hover:bg-[#dbe7dc] cursor-pointer"
                    title="Edit"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 bg-white rounded-full shadow text-red-600 hover:bg-red-100 cursor-pointer"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {product.Category?.name || "Uncategorized"}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {product.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={currentProduct}
        refreshProducts={fetchProducts}
        token={token}
      />

      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        product={currentProduct}
      />
    </div>
  );
};

export default Products;
