import React, { useState } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";

const BannerModal = ({ isOpen, onClose, refreshBanner }) => {
  const token = localStorage.getItem("token");
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!banner) {
      toast.error("Please select an image");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("image", banner); // Changed to "image"

      await axios.post(`${USER_BASE_URL}/banners/upload`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Banner Uploaded");
      refreshBanner();
      onClose();
      setBanner(null);
      setPreview(null);
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Something Went Wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Upload Banner</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image *
              </label>
              <input
                type="file"
                name="image" // Changed to "image" for consistency
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>
            {preview && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                <img
                  src={preview}
                  alt="Banner Preview"
                  className="max-w-full h-48 object-contain rounded-md"
                />
              </div>
            )}
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
              {isSubmitting ? "Uploading..." : "Upload Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerModal;