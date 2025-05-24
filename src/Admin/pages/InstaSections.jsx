import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import InstaSectionModal from "./InstaSectionsModal"; // Updated modal component
import { USER_BASE_URL } from "../../config";

const InstaSections = () => {
  const token = localStorage.getItem("token");

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_BASE_URL}/instasection`); // Updated endpoint
      console.log(response.data);

      setSections(response.data);
    } catch (error) {
      console.error("Error fetching Instagram sections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      try {
        await axios.delete(`${USER_BASE_URL}/instasection/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchSections();
      } catch (error) {
        console.error("Error deleting section:", error);
      }
    }
  };

  // Filter sections based on search term (search by link)
  const filteredSections = sections.filter((section) =>
    section.link.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Instagram Sections
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search sections by link..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#527557]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setCurrentSection(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#527557] cursor-pointer text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Section</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No sections found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="h-32 overflow-hidden">
                {/* Display image from imageUrl */}
                <img
                  src={`${USER_BASE_URL}${section.imageUrl}`}
                  alt="Instagram section"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "/placeholder-image.jpg")} // Fallback image
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => {
                      setCurrentSection(section);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white rounded-full shadow text-[#527557] hover:bg-[#52755759] cursor-pointer"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="p-2 bg-white rounded-full shadow text-red-600 hover:bg-red-100 cursor-pointer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-grow flex flex-col justify-between">
                
                <p className="text-gray-600 text-sm line-clamp-3">
                  Link:{" "}
                  <a
                    href={section.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {section.link}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <InstaSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        section={currentSection}
        refreshSections={fetchSections}
      />
    </div>
  );
};

export default InstaSections;
