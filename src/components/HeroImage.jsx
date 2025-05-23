import { useState, useEffect } from "react";
import axios from "axios";
import { USER_BASE_URL } from "../config";

const HeroImage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`${USER_BASE_URL}/banners`);

        setImageUrl(response.data[0].imageUrl);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch banner image");
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <img
      src={`${USER_BASE_URL}${imageUrl}`}
      alt="Hero Image"
      className="w-full object-cover"
    />
  );
};

export default HeroImage;
