import { NavLink } from "react-router-dom";
import {
  ChartBarSquareIcon as ChartBarIcon,
  RectangleStackIcon,
  VideoCameraIcon,
  Squares2X2Icon,
  FolderIcon,
  ShoppingBagIcon,
  UsersIcon,
  StarIcon,
  EnvelopeIcon,
  CameraIcon,
  InboxIcon,
  XMarkIcon as XIcon,
} from "@heroicons/react/24/outline";
import { Palette } from "lucide-react";

const Sidebar = ({ onClose }) => {
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: ChartBarIcon },
    { name: "Categories", path: "/admin/categories", icon: Squares2X2Icon },
    { name: "Collections", path: "/admin/collections", icon: FolderIcon },
    { name: "Colors", path: "/admin/colors", icon: Palette },
    { name: "Products", path: "/admin/products", icon: ShoppingBagIcon },
    { name: "Orders", path: "/admin/orders", icon: InboxIcon },
    { name: "Banner", path: "/admin/banner", icon: RectangleStackIcon },
    { name: "Video", path: "/admin/video", icon: VideoCameraIcon },
    { name: "Instagram", path: "/admin/insta", icon: CameraIcon },
    { name: "Users", path: "/admin/users", icon: UsersIcon },
    { name: "Reviews", path: "/admin/reviews", icon: StarIcon },
    { name: "Contact", path: "/admin/contact", icon: EnvelopeIcon },
  ];

  const handleNavClick = () => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-center w-full h-[110px] p-2">
        <img src="/images/Logo.png" alt="Logo" className="w-28" />
      </div>

      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="text-lg font-semibold">Admin Panel</div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={handleNavClick}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive
                  ? "bg-[#52755750] text-[#527557]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive
                      ? "text-[#527557]"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
