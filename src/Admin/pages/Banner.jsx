import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import BannerModal from "./BannerModal";
import { USER_BASE_URL } from "../../config";

const Banner = () => {
  const token = localStorage.getItem("token");

  const [banners, setBanners] = useState([]); // Fixed variable name
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_BASE_URL}/banners`);
      console.log("API Response:", response.data);
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await axios.delete(`${USER_BASE_URL}/banners/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchBanner();
      } catch (error) {
        console.error("Error deleting banner:", error);
      }
    }
  };

  // Select the first banner or null if no banners exist
  const banner = banners.length > 0 ? banners[0] : null;

  // Check if a banner exists to disable the Add Banner button
  const isAddButtonDisabled = banners.length > 0;

  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Banner</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search banners..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#527557]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              if (!isAddButtonDisabled) {
                setCurrentBanner(null);
                setIsModalOpen(true);
              }
            }}
            disabled={isAddButtonDisabled}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isAddButtonDisabled
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#527557] text-white cursor-pointer"
            }`}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Banner</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : !banner ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No banners found</p>
        </div>
      ) : (
        <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col min-w-[200px]">
          <div className="overflow-hidden bg-gray-100 h-full">
            {banner.imageUrl ? (
              <img
                src={`${USER_BASE_URL}${banner.imageUrl}`}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No Image
              </div>
            )}

            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                onClick={() => handleDelete(banner.id)}
                className="p-2 bg-white rounded-full shadow text-red-600 hover:bg-red-100 cursor-pointer"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        banner={currentBanner}
        refreshBanner={fetchBanner}
      />
    </div>
  );
};

export default Banner;