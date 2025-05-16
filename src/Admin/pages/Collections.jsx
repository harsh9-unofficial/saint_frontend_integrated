import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import CollectionsModal from "./CollectionsModal";
import { USER_BASE_URL } from "../../config";

const Collections = () => {
  const token = localStorage.getItem("token");

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_BASE_URL}/collections`);

      // Parse the images field for each collection
      const parsedCollections = response.data.map((collection) => ({
        ...collection,
        images: collection.images ? JSON.parse(collection.images) : [],
      }));
      setCollections(parsedCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      try {
        await axios.delete(`${USER_BASE_URL}/collections/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchCollections();
      } catch (error) {
        console.error("Error deleting collection:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Collections</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search collections..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#527557]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setCurrentBlog(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#527557] cursor-pointer text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Collection</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No collections found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {collections
            .filter((collection) =>
              collection.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((collection) => (
              <div
                key={collection.id}
                className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col min-h-[300px]"
              >
                <div className="overflow-hidden bg-gray-100 h-72">
                  {collection.images && collection.images.length > 0 ? (
                    <img
                      src={`${USER_BASE_URL}/${collection.images[0]}`}
                      alt={collection.name}
                      className="w-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentBlog(collection);
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-white rounded-full shadow text-[#527557] hover:bg-indigo-50 cursor-pointer"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(collection.id)}
                      className="p-2 bg-white rounded-full shadow text-red-600 hover:bg-red-100 cursor-pointer"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        {collection.Category?.name || "Uncategorized"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {collection.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <CollectionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collection={currentBlog}
        refreshCollections={fetchCollections}
      />
    </div>
  );
};

export default Collections;
