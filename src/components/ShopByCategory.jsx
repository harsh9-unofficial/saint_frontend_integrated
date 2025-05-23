import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { USER_BASE_URL } from "../config";
import { toast } from "react-hot-toast";

const ShopByCategory = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          `${USER_BASE_URL}/collections/getCollections`
        );
        const parsedCollections = response.data.map((collection) => ({
          ...collection,
          images: JSON.parse(collection.images)[0],
        }));
        setCollections(parsedCollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
        toast.error("Failed to load collections");
      }
    };

    fetchCollections();
  }, []);

  return (
    <section className="container mx-auto py-10 px-2">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
        Shop By Collections
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {collections.length > 0 ? (
          collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collection/${collection.name}`}
              className="group text-center relative"
            >
              <div className="absolute inset-0 flex items-end justify-center p-2 xl:pb-4 2xl:pb-5 rounded-t-lg">
                <div className="lg:text-2xl font-medium text-white">
                  {collection.name}
                </div>
              </div>
              {collection.images ? (
                <img
                  src={`${USER_BASE_URL}/${collection.images}`}
                  alt={collection.name}
                  className="rounded-lg w-full h-full object-cover transition"
                />
              ) : (
                <div className="rounded-lg w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No collections available
          </p>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;