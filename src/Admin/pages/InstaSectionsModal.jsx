import React, { useState, useEffect } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";

const InstaSectionModal = ({ isOpen, onClose, section, refreshSections }) => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    link: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (section) {
      setFormData({
        link: section.link,
      });
      console.log(section.imageUrl);
      setPreview(section.imageUrl); // Set preview for existing section
      setSelectedFile(null); // Reset selected file for updates
    } else {
      setFormData({
        link: "",
      });
      setPreview(null);
      setSelectedFile(null);
    }
  }, [section]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (only images)
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file (e.g., JPG, PNG)");
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      // Generate preview URL for the selected image
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate link
    if (!formData.link || !validateUrl(formData.link)) {
      toast.error("Please enter a valid Link URL");
      setIsSubmitting(false);
      return;
    }

    try {
      if (section) {
        // Update existing InstaSection
        const updateFormData = new FormData();
        updateFormData.append("link", formData.link);
        if (selectedFile) {
          updateFormData.append("image", selectedFile); // Use 'image' to match backend middleware
        }

        const response = await axios.put(
          `${USER_BASE_URL}/instasection/${section.id}`,
          updateFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Section Updated");
      } else {
        // Create new InstaSection
        if (!selectedFile) {
          toast.error("Please upload an image");
          setIsSubmitting(false);
          return;
        }

        const createFormData = new FormData();
        createFormData.append("image", selectedFile); // Use 'image' to match backend middleware
        createFormData.append("link", formData.link);

        const response = await axios.post(
          `${USER_BASE_URL}/instasection`,
          createFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Section Added");
      }

      refreshSections();
      onClose();
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error(error.response?.data?.error || "Something Went Wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview && selectedFile) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, selectedFile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            {section ? "Edit Section" : "Add New Section"}
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
            {/* Image Upload Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required={!section} // Required only for new sections
              />
              {/* Image Preview */}
              {preview && (
                <div className="mt-2">
                  <img
                    src={preview.startsWith("blob:") ? preview : `${USER_BASE_URL}${preview}`}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")} // Fallback image
                  />
                </div>
              )}
            </div>

            {/* Link Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link *
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                placeholder="https://example.com"
                required
              />
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
              {isSubmitting ? "Saving..." : "Save Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstaSectionModal;