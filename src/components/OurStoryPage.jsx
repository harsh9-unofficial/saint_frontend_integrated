import { useState, useEffect } from "react";
import axios from "axios";
import { USER_BASE_URL } from "../config";
import toast from "react-hot-toast";

export default function OurStoryPage() {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`${USER_BASE_URL}/banners`);

        setImageUrl(response.data[0].imageUrl);
      } catch (err) {
        toast.error("Failed to fetch banner image");
      }
    };

    fetchBanner();
  }, []);

  return (
    <div className="px-4 pt-10 pb-16 container mx-auto">
      <h1 className="text-3xl font-semibold mb-2">Our Story</h1>
      <p className="text-sm text-gray-500 mb-6">Home / Our Story</p>

      <div className="rounded overflow-hidden mb-6">
        <img
          src={`${USER_BASE_URL}${imageUrl}`}
          alt="Our Story"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="space-y-4 text-gray-700 md:text-lg xl:text-xl">
        <p>
          A modernist womenswear company based in Australia that focuses on
          thoughtful, timeless, and locally-produced ready-to-wear. SAINT was
          established in 2020 by Designer Laura Howard.
        </p>

        <p>
          SAINT garments are produced in small runs by local craftspeople,
          artisans and family owned and operated manufacturers in Sydney,
          Australia. Made exclusively in premium 100% natural fibers sourced
          locally and internationally from European and Japanese suppliers.
        </p>

        <p>
          SAINT leather goods are made by SAINT designer's Father, on his
          property on the Mid-North Coast, Australia. Handmade by one set of
          hands using traditional leathersmith techniques.
        </p>

        <div>
          <h2 className="font-semibold text-lg md:text-xl xl:text-2xl mt-6">
            a note from Laura
          </h2>
          <p>
            My personal evolution of clothing (& all things consumerism) has
            been 'less and less and less'. I have found that the pieces I reach
            for years after purchase, are the classic shapes in high quality
            fabrics. I wanted to create a brand that designs by these
            principles. I hope you enjoy.
          </p>
        </div>

        <p>
          SAINT acknowledges the Traditional Custodians of country throughout
          Australia and their connections to land, sea and community. We pay our
          respect to their elders past and present and extend that respect to
          all Aboriginal and Torres Strait Islander peoples today.
        </p>

        <p>SAINT is run locally on Awabakal land.</p>
      </div>
    </div>
  );
}
