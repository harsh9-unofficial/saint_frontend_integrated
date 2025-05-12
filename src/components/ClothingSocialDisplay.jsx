import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FaInstagram } from "react-icons/fa";

const ClothingCard = ({ image }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="keen-slider__slide relative h-64 overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
  const images = [
    "/images/Tshirt.png",
    "/images/Tshirt.png",
    "/images/Tshirt.png",
    "/images/Tshirt.png",
    "/images/Tshirt.png",
    "/images/Tshirt.png",
    "/images/Tshirt.png",
  ];

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
      <div ref={sliderRef} className="keen-slider px-4">
        {images.map((image, index) => (
          <ClothingCard key={index} image={image} />
        ))}
      </div>
    </div>
  );
};

export default ClothingSocialDisplay;
