import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import ColorsModal from "./ColorsModal";
import { USER_BASE_URL } from "../../config";

const Colors = () => {
  const token = localStorage.getItem("token");

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(null); // Renamed for clarity
  const [searchTerm, setSearchTerm] = useState("");

  const fetchColors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_BASE_URL}/colors`);
      setColors(response.data);
    } catch (error) {
      console.error("Error fetching colors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        await axios.delete(`${USER_BASE_URL}/colors/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchColors();
      } catch (error) {
        console.error("Error deleting color:", error);
      }
    }
  };

  // Filter colors based on search term
  const filteredColors = colors.filter((color) =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Colors</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search colors..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#527557]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setCurrentColor(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#527557] cursor-pointer text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Color</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : filteredColors.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No colors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
          {filteredColors.map((color) => (
            <div
              key={color.id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="h-32 overflow-hidden">
                {/* Display color swatch using hexCode */}
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: color.hexCode || "#FFFFFF" }}
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => {
                      setCurrentColor(color);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white rounded-full shadow text-[#527557] hover:bg-[#52755759] cursor-pointer"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(color.id)}
                    className="p-2 bg-white rounded-full shadow text-red-600 hover:bg-red-100 cursor-pointer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-grow flex flex-col justify-between">
                <h3 className="text-lg font-semibold line-clamp-2">
                  {color.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  Hex: {color.hexCode || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ColorsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        color={currentColor}
        refreshColors={fetchColors}
      />
    </div>
  );
};

export default Colors;
