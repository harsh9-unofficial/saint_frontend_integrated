import React, { useState } from "react";
import RecentlyViewed from "./RecentlyViewed";

const thumbnails = [
  "/images/SPMain.jpg",
  "/images/SP1.jpg",
  "/images/SP2.jpg",
  "/images/SP3.jpg",
  "/images/SP4.jpg",
];

export default function SingleProduct() {
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedImage, setSelectedImage] = useState(thumbnails[0]);
  const [openAccordions, setOpenAccordions] = useState([]);

  const toggleAccordion = (section) => {
    setOpenAccordions((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section]
    );
  };

  return (
    <>
      <div className="p-4 container mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 md:gap-6 overflow-x-auto lg:overflow-y-auto">
              {thumbnails.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Thumbnail ${idx}`}
                  onClick={() => setSelectedImage(src)}
                  className={`w-21 h-21 xl:w-24 xl:h-24 object-cover cursor-pointer border rounded ${
                    selectedImage === src ? "border-black" : "border-gray-200"
                  }`}
                />
              ))}
            </div>
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full lg:w-[510px] xl:w-[600px] 2xl:w-[800px] lg:h-[85%] object-cover rounded"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-8">
            <div className="pt-4 md:pt-8 flex flex-col gap-6">
              <span className="bg-red-700 rounded-full px-2 py-1 text-white font-medium w-fit">
                Sold out
              </span>
              <h1 className="text-4xl font-semibold">Low-rise Tailored Pant</h1>
            </div>
            <div className="font-semibold flex flex-col-reverse md:flex-row">
              <span className="text-2xl ">Rs. 29,000.00</span>
              <span className="text-xl md:text-2xl line-through text-gray-400 md:ml-2">
                Rs. 39,000.00
              </span>
            </div>

            <p className="text-lg text-gray-600">
              Coming soon, please add your name to be notified when this piece
              has landed online.
            </p>
            <p className="text-lg text-gray-600">
              The Low-rise Tailored Pant in black, made in lightweight 100%
              Italian wool, a fitted low-rise cut, to a relaxed straight leg.
              Front cutaway pockets and double welt back pockets, finished with
              a satin bind.
            </p>
            <p className="text-lg text-gray-600">Made in Sydney, Australia.</p>

            <div>
              <h3 className="font-medium">Color</h3>
              <div className="flex gap-3 mt-2">
                {["#527557", "#DFAA3C", "#E2DBCB", "#862E3C", "#435462"].map(
                  (color) => (
                    <div
                      key={color}
                      onClick={() => handleColorClick(color)}
                      className={`w-11 h-11 rounded-sm border-2 cursor-pointer ${
                        selectedColors.includes(color)
                          ? "border-black"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mt-4">Size</h3>
              <div className="flex gap-2 mt-2">
                {["XS", "2XL", "S"].map((size, i) => (
                  <button
                    key={i}
                    className="border border-gray-400 px-4 py-3 rounded text-sm hover:bg-gray-100"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-[#527557] cursor-pointer text-white py-4 rounded mt-4">
              Add to Cart
            </button>

            {/* Custom Accordion */}
            <div className="mt-6 border-t pt-4 space-y-4">
              {[
                {
                  title: "Details",
                  value: "details",
                  content: (
                    <ul className="text-sm text-gray-600 list-disc pl-5">
                      <li>Classic, relaxed fit</li>
                      <li>French seams</li>
                      <li>Drop shoulders</li>
                      <li>Self-lined yoke</li>
                      <li>Inverted box pleat</li>
                      <li>Long sleeve</li>
                    </ul>
                  ),
                },
                {
                  title: "Size fit",
                  value: "fit",
                  content: "Details about size fitting...",
                },
                {
                  title: "Materials & Care",
                  value: "care",
                  content: "Care instructions and materials...",
                },
                {
                  title: "Shipping & Returns",
                  value: "shipping",
                  content: "Shipping and return policy...",
                },
              ].map((section) => (
                <div key={section.value}>
                  <button
                    className="w-full text-left font-medium text-lg flex justify-between items-center"
                    onClick={() => toggleAccordion(section.value)}
                  >
                    {section.title}
                    <span>
                      {openAccordions.includes(section.value) ? "-" : "+"}
                    </span>
                  </button>
                  {openAccordions.includes(section.value) && (
                    <div className="mt-2 text-sm text-gray-700">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <RecentlyViewed />
    </>
  );
}
