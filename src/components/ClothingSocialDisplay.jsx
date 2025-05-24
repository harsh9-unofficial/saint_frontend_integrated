import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
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
      className="relative h-68 w-68 flex-shrink-0 mx-2.5 rounded-lg shadow-lg overflow-hidden"
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
  const [items, setItems] = useState([]);
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
          return { image: imagePath, link: item.link };
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
        <Marquee play={true} direction="left" speed={40} gradient={false}>
          {[...items, ...items].map((item, index) => (
            <ClothingCard
              key={`clothing-${index}`}
              image={item.image}
              link={item.link}
            />
          ))}
        </Marquee>
      )}
    </div>
  );
};

export default ClothingSocialDisplay;
