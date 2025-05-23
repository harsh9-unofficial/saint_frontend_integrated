import { useState, useEffect } from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import axios from "axios";
import { USER_BASE_URL } from "../config";

const ClothingVideo = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Set initial state to true for auto-play
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${USER_BASE_URL}/video`);

        setVideoUrl(response.data[0].videoUrl);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load video");
        setIsLoading(false);
        console.error("Error fetching video:", err);
      }
    };

    fetchVideo();
  }, []);

  const handleTogglePlay = () => {
    const video = document.getElementById("clothing-video");
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full mx-auto pt-4 pb-10">
      <div className="">
        {isLoading ? (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200">
            <p>Loading video...</p>
          </div>
        ) : error ? (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <video
              id="clothing-video"
              src={`${USER_BASE_URL}${videoUrl}`}
              className="w-full object-cover"
              muted
              autoPlay // Add autoPlay to start video automatically
              loop // Optional: loop the video
            />
            {isHovered && (
              <div
                className="absolute inset-0 bg-black/30 bg-opacity-30 flex items-center justify-center cursor-pointer transition-opacity duration-300"
                onClick={handleTogglePlay}
              >
                {isPlaying ? (
                  <FaPauseCircle className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                ) : (
                  <FaPlayCircle className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothingVideo;
