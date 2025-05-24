import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FaInstagram } from "react-icons/fa";
import axios from "axios";
import { USER_BASE_URL } from "../config";

const ClothingCard = ({ image, link }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <div
      className="keen-slider__slide relative h-64 overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img src={image} alt="Clothing" className="w-full h-full object-cover" />
      {isHovered && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 cursor-pointer">
          <FaInstagram className="text-white text-3xl" />
        </div>
      )}
    </div>
  );
};

const ClothingSocialDisplay = () => {
  const [items, setItems] = useState([]); // Store both image URL and link
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${USER_BASE_URL}/instasection`);
        console.log(response.data);

        const formattedItems = response.data.map((item) => {
          const imagePath = item.imageUrl.startsWith("/")
            ? `${USER_BASE_URL}${item.imageUrl}`
            : item.imageUrl;
          return { image: imagePath, link: item.link }; // Store both image and link
        });

        setItems(formattedItems);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch images");
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 7.08,
      spacing: 20,
    },
    breakpoints: {
      "(max-width: 425px)": {
        slides: {
          perView: 1.1,
          spacing: 10,
        },
      },
      "(min-width: 425px) and (max-width: 768px)": {
        slides: {
          perView: 3.13,
          spacing: 10,
        },
      },
      "(min-width: 769px) and (max-width: 1024px)": {
        slides: {
          perView: 4.13,
          spacing: 12,
        },
      },
      "(min-width: 1025px) and (max-width: 1440px)": {
        slides: {
          perView: 5.12,
          spacing: 12,
        },
      },
    },
  });

  return (
    <div className="py-10">
      <h2 className="text-center text-2xl font-semibold mb-6">
        Stay Social with Us
      </h2>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center">No images available</div>
      ) : (
        <div ref={sliderRef} className="keen-slider px-4">
          {items.map((item, index) => (
            <ClothingCard key={index} image={item.image} link={item.link} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClothingSocialDisplay;
