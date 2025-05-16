import HeroImage from "./HeroImage";
import Marquee from "./Marquee";
import CollectionCard from "./CollectionCard";
import FeaturedProducts from "./FeaturedProducts";
import ShopByCategory from "./ShopByCategory";
import FeatureSection from "./FeatureSection";
import ClothingVideo from "./ClothingVideo";
import ClothingSocialDisplay from "./ClothingSocialDisplay";

const HomePage = () => {
  return (
    <>
      <HeroImage />
      <Marquee />
      <CollectionCard />
      <FeatureSection />
      <FeaturedProducts />
      <ShopByCategory />
      <ClothingVideo />
      <ClothingSocialDisplay />
    </>
  );
};

export default HomePage;
