import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuSearch, LuX } from "react-icons/lu";
import { CgShoppingBag } from "react-icons/cg";
import { FiUser } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { Menu, ChevronDown } from "lucide-react";
import { IoArrowForward } from "react-icons/io5";
import Cart from "./Cart";
import { toast } from "react-hot-toast";
import axios from "axios";
import { USER_BASE_URL } from "../config";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [collections, setCollections] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const shopRef = useRef(null);
  const collectionRef = useRef(null);
  const cartRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          `${USER_BASE_URL}/collections/getCollections`
        );
        const parsedCollections = response.data.map((collection) => ({
          ...collection,
          images: JSON.parse(collection.images)[0],
        }));
        setCollections(parsedCollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
        toast.error("Failed to load collections");
      }
    };

    fetchCollections();
  }, []);

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
      toast.error("Please Login to Access Cart");
      return;
    }
    setIsCartOpen(!isCartOpen);
    setUserMenuOpen(false);
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const toggleUserMenu = () => {
    if (userId) {
      setUserMenuOpen(!userMenuOpen);
      setShopOpen(false);
      setCollectionOpen(false);
      setIsCartOpen(false);
      setSearchOpen(false);
      setMobileOpen(false);
    } else {
      navigate("/login");
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setShopOpen(false);
    setCollectionOpen(false);
    setIsCartOpen(false);
    setUserMenuOpen(false);
    setMobileOpen(false);
    if (!searchOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowResults(false);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      const filtered = collections.filter((collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
      navigate(`/allproducts?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
      setShowResults(false);
      setMobileOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSearchSubmit();
    }
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
    setIsCartOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setShowResults(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest("button[aria-label='toggle mobile menu']")
      ) {
        setMobileOpen(false);
      }
    };

    const getScrollbarWidth = () => {
      return window.innerWidth - document.documentElement.clientWidth;
    };

    if (isCartOpen || searchOpen || mobileOpen) {
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
  }, [isCartOpen, userMenuOpen, searchOpen, mobileOpen]);

  return (
    <header className="shadow-md relative top-0 z-50 bg-white">
      <div className="container mx-auto flex justify-between items-center px-2 py-3 md:py-5">
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
                    onClick={() => setShopOpen(false)}
                  >
                    All Product
                  </Link>
                  <Link
                    to="/shop/kids"
                    className="hover:underline font-semibold"
                    onClick={() => setShopOpen(false)}
                  >
                    Kids
                  </Link>
                  <Link
                    to="/shop/man"
                    className="hover:underline font-semibold"
                    onClick={() => setShopOpen(false)}
                  >
                    Man
                  </Link>
                  <Link
                    to="/shop/accessories"
                    className="hover:underline font-semibold"
                    onClick={() => setShopOpen(false)}
                  >
                    Accessories
                  </Link>
                  <Link
                    to="/shop/woman"
                    className="hover:underline font-semibold"
                    onClick={() => setShopOpen(false)}
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
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      to={`/collection/${collection.name}`}
                      className="group text-center relative"
                      onClick={() => setCollectionOpen(false)}
                    >
                      <div className="absolute inset-0 flex items-end justify-center p-2 xl:pb-4 2xl:pb-5 rounded-t-lg">
                        <div className="lg:text-2xl font-medium text-white">
                          {collection.name}
                        </div>
                      </div>
                      {collection.images ? (
                        <img
                          src={`${USER_BASE_URL}/${collection.images}`}
                          alt={collection.name}
                          className="rounded-lg w-full h-full object-cover transition"
                        />
                      ) : (
                        <div className="rounded-lg w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link to="/ourstory" className="hover:text-[#527557] font-semibold">
            Our Story
          </Link>
        </div>
        <div className="text-center text-green-800 font-bold lg:mr-35">
          <Link to="/">
            <img src="/images/Logo.png" alt="Saint" className="w-full" />
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-3">
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
            aria-label="toggle mobile menu"
          >
            {mobileOpen ? <RxCross1 size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
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
          <div className="flex items-center gap-1">
            <LuSearch className="text-gray-500 text-2xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              placeholder="Search for collections..."
              className="flex-1 text-lg border-none focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSearchSubmit}
              className="text-gray-500 text-xl hover:text-[#527557]"
            >
              <IoArrowForward className="text-gray-500 text-2xl hover:text-[#527557] cursor-pointer" />
            </button>
            <button onClick={toggleSearch}>
              <LuX className="text-gray-500 text-2xl hover:text-[#527557] cursor-pointer" />
            </button>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 max-h-96 overflow-y-auto">
            {showResults && searchQuery.trim() && searchResults.length > 0 ? (
              searchResults.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collection/${collection.name}`}
                  className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-md"
                  onClick={toggleSearch}
                >
                  {collection.images ? (
                    <img
                      src={`${USER_BASE_URL}/${collection.images}`}
                      alt={collection.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{collection.name}</p>
                  </div>
                </Link>
              ))
            ) : showResults && searchQuery.trim() ? (
              <p className="text-sm text-gray-500 text-center">
                No collections found
              </p>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                Type and press Enter or click arrow to search
              </p>
            )}
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-md border-t px-4 py-3 space-y-4 lg:text-xl z-50"
        >
          <Link
            to="/newarrivals"
            className="block"
            onClick={() => setMobileOpen(false)}
          >
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
                <Link
                  to="/allproducts"
                  className="block text-gray-600"
                  onClick={() => {
                    setShopOpen(false);
                    setMobileOpen(false);
                  }}
                >
                  All Product
                </Link>
                <Link
                  to="/shop/kids"
                  className="block text-gray-600"
                  onClick={() => {
                    setShopOpen(false);
                    setMobileOpen(false);
                  }}
                >
                  Kids
                </Link>
                <Link
                  to="/shop/man"
                  className="block text-gray-600"
                  onClick={() => {
                    setShopOpen(false);
                    setMobileOpen(false);
                  }}
                >
                  Man
                </Link>
                <Link
                  to="/shop/accessories"
                  className="block text-gray-600"
                  onClick={() => {
                    setShopOpen(false);
                    setMobileOpen(false);
                  }}
                >
                  Accessories
                </Link>
                <Link
                  to="/shop/woman"
                  className="block text-gray-600"
                  onClick={() => {
                    setShopOpen(false);
                    setMobileOpen(false);
                  }}
                >
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
                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    to={`/collection/${collection.name}`}
                    className="relative group"
                    onClick={() => {
                      setCollectionOpen(false);
                      setMobileOpen(false);
                    }}
                  >
                    {collection.images ? (
                      <img
                        src={`${USER_BASE_URL}/${collection.images}`}
                        alt={collection.name}
                        className="rounded-lg w-full object-cover"
                      />
                    ) : (
                      <div className="rounded-lg w-full h-32 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-end justify-center p-2 rounded-lg">
                      <span className="text-white text-sm font-medium">
                        {collection.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/ourstory"
            className="block"
            onClick={() => setMobileOpen(false)}
          >
            Our Story
          </Link>
        </div>
      )}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 opacity-100">
          <div
            ref={cartRef}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 translate-x-0"
          >
            <div className="overflow-y-auto h-full">
              <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;