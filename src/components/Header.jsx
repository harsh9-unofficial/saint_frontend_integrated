import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuSearch, LuX } from "react-icons/lu";
import { CgShoppingBag } from "react-icons/cg";
import { FiUser } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { Menu, ChevronDown } from "lucide-react";
import Cart from "./Cart";
import { toast } from "react-hot-toast";

// Sample product data (replace with your API or actual data)
const sampleProducts = [
  { id: 1, name: "Classic Green Tee", price: 29999, image: "/images/Collection1.png" },
  { id: 2, name: "Yellow Dress", price: 49999, image: "/images/Collection2.png" },
  { id: 3, name: "Camo Jacket", price: 79999, image: "/images/Collection3.png" },
  { id: 4, name: "Black Dress", price: 59999, image: "/images/Collection4.png" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Check token, userId, and isAdmin from localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const shopRef = useRef(null);
  const collectionRef = useRef(null);
  const cartRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleDropdown = (menu) => {
    if (menu === "shop") {
      setShopOpen(!shopOpen);
      if (!shopOpen) setCollectionOpen(false);
    } else if (menu === "collection") {
      setCollectionOpen(!collectionOpen);
      if (!collectionOpen) setShopOpen(false);
    }
    setUserMenuOpen(false);
    setSearchOpen(false);
  };

  const toggleCart = () => {
    if (!userId) {
      toast.error("Please login for Add to Cart");
      return;
    }
    setCartOpen(!cartOpen);
    setUserMenuOpen(false);
    setSearchOpen(false);
  };

  const toggleUserMenu = () => {
    if (userId) {
      setUserMenuOpen(!userMenuOpen);
      setShopOpen(false);
      setCollectionOpen(false);
      setCartOpen(false);
      setSearchOpen(false);
    } else {
      navigate("/login");
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setShopOpen(false);
    setCollectionOpen(false);
    setCartOpen(false);
    setUserMenuOpen(false);
    if (!searchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Perform search (replace with API call if available)
    if (query.trim()) {
      const filtered = sampleProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }

    // Example API call (uncomment and customize)
    /*
    if (query.trim()) {
      fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data))
        .catch((err) => {
          console.error("Search error:", err);
          toast.error("Failed to search products");
        });
    } else {
      setSearchResults([]);
    }
    */
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    setUserMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    setShopOpen(false);
    setCollectionOpen(false);
    setCartOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    const getScrollbarWidth = () => {
      return window.innerWidth - document.documentElement.clientWidth;
    };

    if (cartOpen || searchOpen) {
      const scrollbarWidth = getScrollbarWidth();
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartOpen, userMenuOpen, searchOpen]);

  return (
    <header className="shadow-md relative top-0 z-50 bg-white">
      <div className="container mx-auto flex justify-between items-center px-2 py-3 md:py-5">
        {/* Left nav (Desktop) */}
        <div className="hidden md:flex space-x-6 lg:text-xl items-center">
          <Link
            to="/newarrivals"
            className="hover:text-[#527557] font-semibold"
          >
            New Arrivals
          </Link>
          <div ref={shopRef}>
            <button
              onClick={() => toggleDropdown("shop")}
              className="flex items-center hover:text-[#527557] font-semibold cursor-pointer"
            >
              Shop
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform duration-200 ${
                  shopOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {shopOpen && (
              <div className="absolute left-0 top-full w-full bg-white shadow-lg border-t z-40">
                <div className="container mx-auto px-4 py-4 grid grid-rows-3 grid-flow-col gap-4">
                  <Link
                    to="/allproducts"
                    className="hover:underline font-semibold"
                  >
                    All Product
                  </Link>
                  <Link
                    to="/shop/kids"
                    className="hover:underline font-semibold"
                  >
                    Kids
                  </Link>
                  <Link
                    to="/shop/man"
                    className="hover:underline font-semibold"
                  >
                    Man
                  </Link>
                  <Link
                    to="/shop/accessories"
                    className="hover:underline font-semibold"
                  >
                    Accessories
                  </Link>
                  <Link
                    to="/shop/woman"
                    className="hover:underline font-semibold"
                  >
                    Woman
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div ref={collectionRef}>
            <button
              onClick={() => toggleDropdown("collection")}
              className="flex items-center hover:text-[#527557] font-semibold cursor-pointer"
            >
              Collection
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform duration-200 ${
                  collectionOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {collectionOpen && (
              <div className="absolute left-0 top-full w-full bg-white shadow-xl border-t z-40">
                <div className="container mx-auto px-2 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link
                    to="/collection/classicgreentee"
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
                  <Link
                    to="/collection/yellowdress"
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
                  <Link
                    to="/collection/camojacket"
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
                  <Link
                    to="/collection/blackdress"
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
              </div>
            )}
          </div>
          <Link to="/ourstory" className="hover:text-[#527557] font-semibold">
            Our Story
          </Link>
        </div>

        {/* Center logo */}
        <div className="text-center text-green-800 font-bold lg:mr-35">
          <Link to="/">
            <img src="/images/Logo.png" alt="Saint" className="w-full" />
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSearch}
            className="hover:text-[#527557] cursor-pointer"
          >
            <LuSearch className="text-[24px] lg:text-[26px]" />
          </button>
          <button
            onClick={toggleCart}
            className="hover:text-[#527557] cursor-pointer"
          >
            <CgShoppingBag className="text-[24px] lg:text-[26px]" />
          </button>
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              className="hover:text-[#527557] cursor-pointer"
            >
              <FiUser className="text-[24px] lg:text-[26px] mt-2" />
            </button>
            {userId && userMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-[#527557] rounded-t-lg hover:text-white"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-[#527557] cursor-pointer hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            {mobileOpen ? <RxCross1 size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          searchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={toggleSearch}
        ></div>
        <div
          ref={searchRef}
          className="relative bg-white w-full max-w-3xl mx-auto mt-16 md:mt-20 p-4 md:p-6 rounded-lg shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <LuSearch className="text-gray-500 text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for products..."
              className="flex-1 text-lg border-none focus:outline-none"
              autoFocus
            />
            <button onClick={toggleSearch}>
              <LuX className="text-gray-500 text-xl hover:text-[#527557]" />
            </button>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 max-h-96 overflow-y-auto">
            {searchQuery.trim() && searchResults.length > 0 ? (
              searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-md"
                  onClick={toggleSearch}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="text-xs text-gray-500">Rs. {product.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))
            ) : searchQuery.trim() ? (
              <p className="text-sm text-gray-500 text-center">No products found</p>
            ) : (
              <p className="text-sm text-gray-500 text-center">Start typing to search</p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md border-t px-4 py-3 space-y-4 lg:text-xl z-50">
          <Link to="/newarrivals" className="block">
            New Arrivals
          </Link>
          <div>
            <button
              className="w-full flex justify-between items-center"
              onClick={() => toggleDropdown("shop")}
            >
              Shop
              <ChevronDown
                className={`transition-transform duration-200 ${
                  shopOpen ? "rotate-180" : ""
                }`}
                size={16}
              />
            </button>
            {shopOpen && (
              <div className="grid grid-cols-2 gap-2 mt-2 pl-2">
                <Link to="/allproducts" className="block text-gray-600">
                  All Product
                </Link>
                <Link to="/shop/kids" className="block text-gray-600">
                  Kids
                </Link>
                <Link to="/shop/man" className="block text-gray-600">
                  Man
                </Link>
                <Link to="/shop/accessories" className="block text-gray-600">
                  Accessories
                </Link>
                <Link to="/shop/woman" className="block text-gray-600">
                  Woman
                </Link>
              </div>
            )}
          </div>
          <div>
            <button
              className="w-full flex justify-between items-center"
              onClick={() => toggleDropdown("collection")}
            >
              Collection
              <ChevronDown
                className={`transition-transform duration-200 ${
                  collectionOpen ? "rotate-180" : ""
                }`}
                size={16}
              />
            </button>
            {collectionOpen && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Link
                  to="/collection/classicgreentee"
                  className="relative group"
                >
                  <img
                    src="/images/Collection1.png"
                    alt="Classic Green Tee"
                    className="rounded-lg w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-center p-2 rounded-lg">
                    <span className="text-white text-sm font-medium">
                      Classic Green Tee
                    </span>
                  </div>
                </Link>
                <Link to="/collection/yellowdress" className="relative group">
                  <img
                    src="/images/Collection2.png"
                    alt="Yellow Dress"
                    className="rounded-lg w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-center p-2 rounded-lg">
                    <span className="text-white text-sm font-medium">
                      Yellow Dress
                    </span>
                  </div>
                </Link>
                <Link to="/collection/camojacket" className="relative group">
                  <img
                    src="/images/Collection3.png"
                    alt="Camo Jacket"
                    className="rounded-lg w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-center p-2 rounded-lg">
                    <span className="text-white text-sm font-medium">
                      Camo Jacket
                    </span>
                  </div>
                </Link>
                <Link to="/collection/blackdress" className="relative group">
                  <img
                    src="/images/Collection4.png"
                    alt="Black Dress"
                    className="rounded-lg w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-center p-2 rounded-lg">
                    <span className="text-white text-sm font-medium">
                      Black Dress
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>
          <Link to="/ourstory" className="block">
            Our Story
          </Link>
        </div>
      )}
      {/* Cart Modal */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          ref={cartRef}
          className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ${
            cartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="overflow-y-auto h-full">
            <Cart onClose={toggleCart} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;