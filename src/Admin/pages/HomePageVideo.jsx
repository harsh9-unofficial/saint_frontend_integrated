import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import HomePageVideoModal from "./HomePageVideoModal";
import { USER_BASE_URL } from "../../config";

const HomePageVideo = () => {
  const token = localStorage.getItem("token");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchHomePageVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${USER_BASE_URL}/video`);
      console.log("API Response:", response.data);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to fetch videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomePageVideos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await axios.delete(`${USER_BASE_URL}/video/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchHomePageVideos();
      } catch (error) {
        console.error("Error deleting video:", error);
        setError("Failed to delete video. Please try again.");
      }
    }
  };

  const filteredVideos = videos.filter((video) =>
    video.title
      ? video.title.toLowerCase().includes(searchTerm.toLowerCase())
      : searchTerm === "" ||
        video.videoUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAddButtonDisabled = videos.length > 0;

  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Homepage Videos
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#527557]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              if (!isAddButtonDisabled) {
                setCurrentVideo(null);
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
            <span>Add Homepage Video</span>
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No videos found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col w-full h-full"
            >
              <div className="overflow-hidden bg-gray-100">
                {video.videoUrl ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    muted
                    loop
                  >
                    <source
                      src={`${USER_BASE_URL.replace(
                        /\/$/,
                        ""
                      )}/${video.videoUrl.replace(/^\//, "")}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-400 text-sm">
                    No Video
                  </div>
                )}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 bg-white rounded-full shadow text-red-600 hover:bg-red-100 cursor-pointer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {video.title && (
                <div className="p-4">
                  <p className="text-gray-800 font-medium">{video.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <HomePageVideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        video={currentVideo}
        refreshHomePageVideo={fetchHomePageVideos}
      />
    </div>
  );
};

export default HomePageVideo;
