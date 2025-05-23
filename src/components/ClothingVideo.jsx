import { useState } from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

const ClothingVideo = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <video
            id="clothing-video"
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            className="w-full object-cover"
            muted
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
      </div>
    </div>
  );
};

export default ClothingVideo;
