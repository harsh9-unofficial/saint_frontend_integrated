import { Link } from "react-router-dom";

const ShopByCategory = () => {
  return (
    <>
      {/* <div className="absolute left-0 top-full w-full bg-white shadow-xl border-t z-40"> */}
      <section className="container mx-auto py-10 px-4 ">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
          Shop By Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/collection/classic-green-tee"
            className="group text-center relative"
          >
            <div className="absolute inset-0 flex items-end justify-center p-2 xl:pb-4 2xl:pb-5 rounded-t-lg">
              <div className="lg:text-2xl font-medium text-white">
                Classic Green Tee
              </div>
            </div>
            <img
              src="/images/Collection1.png"
              alt="Classic Green Tee"
              className="rounded-lg w-full h-full object-cover transition"
            />
          </Link>

          {/* Original: Yellow Dress */}
          <Link
            to="/collection/yellow-dress"
            className="group text-center relative"
          >
            <div className="absolute inset-0 flex items-end justify-center p-2 xl:pb-4 2xl:pb-5 rounded-t-lg">
              <div className="lg:text-2xl font-medium text-white">
                Yellow Dress
              </div>
            </div>
            <img
              src="/images/Collection2.png"
              alt="Yellow Dress"
              className="rounded-lg w-full h-full object-cover transition"
            />
          </Link>

          {/* Original: Camo Jacket */}
          <Link
            to="/collection/camo-jacket"
            className="group text-center relative"
          >
            <div className="absolute inset-0 flex items-end justify-center p-2 xl:pb-4 2xl:pb-5 rounded-t-lg">
              <div className="lg:text-2xl font-medium text-white">
                Camo Jacket
              </div>
            </div>
            <img
              src="/images/Collection3.png"
              alt="Camo Jacket"
              className="rounded-lg w-full h-full object-cover transition"
            />
          </Link>

          {/* Original: Black Dress */}
          <Link
            to="/collection/black-dress"
            className="group text-center relative"
          >
            <div className="absolute inset-0 flex items-end justify-center p-2 xl:pb-4 2xl:pb-5 rounded-t-lg">
              <div className="lg:text-2xl font-medium text-white">
                Black Dress
              </div>
            </div>
            <img
              src="/images/Collection4.png"
              alt="Black Dress"
              className="rounded-lg w-full h-full object-cover transition"
            />
          </Link>
        </div>
      </section>
      {/* </div> */}
    </>
  );
};

export default ShopByCategory;
