import React, { useState, useEffect } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";
import { SketchPicker } from "react-color"; // Import color picker

const ColorsModal = ({ isOpen, onClose, color, refreshColors }) => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    hexCode: "#000000", // Default hex code
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false); // Toggle color picker visibility

  useEffect(() => {
    if (color) {
      setFormData({
        name: color.name,
        hexCode: color.hexCode || "#000000", // Use existing hexCode or default
      });
    } else {
      setFormData({
        name: "",
        hexCode: "#000000",
      });
    }
  }, [color]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color) => {
    setFormData((prev) => ({ ...prev, hexCode: color.hex }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (color) {
        await axios.put(
          `${USER_BASE_URL}/colors/${color.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Color Updated");
      } else {
        await axios.post(`${USER_BASE_URL}/colors`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Color Added");
      }
      refreshColors();
      onClose();
    } catch (error) {
      console.error("Error saving color:", error);
      toast.error("Something Went Wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            {color ? "Edit Color" : "Add New Color"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>

            {/* Color Picker Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color *
              </label>
              <div className="flex items-center gap-3">
                {/* Color Preview Swatch */}
                <div
                  className="w-10 h-10 rounded-md border cursor-pointer"
                  style={{ backgroundColor: formData.hexCode }}
                  onClick={() => setShowColorPicker((prev) => !prev)}
                />
                {/* Hex Code Input */}
                <input
                  type="text"
                  name="hexCode"
                  value={formData.hexCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                  placeholder="#000000"
                  required
                />
              </div>
              {/* Color Picker (shown when swatch is clicked) */}
              {showColorPicker && (
                <div className="absolute z-10 mt-2">
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowColorPicker(false)}
                  />
                  <SketchPicker
                    color={formData.hexCode}
                    onChangeComplete={handleColorChange}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-white bg-[#527557] cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Color"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorsModal;