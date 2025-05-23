import "./Marquee.css";

const Marquee = () => {
  return (
    <div className="bg-[#527557] overflow-hidden whitespace-nowrap text-[#F6F6F6] h-8 xl:h-12 flex items-center">
      <div className="marquee inline-block whitespace-nowrap">
        <span className="mx-8 md:text-lg xl:text-xl">
          Discover our latest arrivals with up to 30% off on selected items.
        </span>
        <span className="mx-8 md:text-lg xl:text-xl">
          Discover our latest arrivals with up to 30% off on selected items.
        </span>
        <span className="mx-8 md:text-lg xl:text-xl">
          Discover our latest arrivals with up to 30% off on selected items.
        </span>
        <span className="mx-8 md:text-lg xl:text-xl">
          Discover our latest arrivals with up to 30% off on selected items.
        </span>
      </div>
    </div>
  );
};

export default Marquee;
