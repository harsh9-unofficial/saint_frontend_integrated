import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import axios from "axios";
import { USER_BASE_URL } from "../config";
import { toast } from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${USER_BASE_URL}/contacts/addContact`, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending message");
    }
  };

  return (
    <div className="px-4 py-10 lg:px-20 max-w-5xl mx-auto text-center">
      <div className="flex flex-col gap-6">
        {/* ContactUs Emails */}
        <p className="text-gray-700 mb-2 text-xl xl:text-2xl 2xl:text-3xl">
          for Customer Service, please email: <br />
          <a href="mailto:info@saint-thestore.com">
            info@saint-thestore.com
          </a>
        </p>
        <p className="text-gray-700 mb-4 text-xl xl:text-2xl 2xl:text-3xl">
          for Stockist Enquiries, PR and Collaboration, please email: <br />
          <a href="mailto:laura@saint-thestore.com">
            laura@saint-thestore.com
          </a>
          <br />
          alternatively, please fill out the form below
        </p>
      </div>

      {/* Icons */}
      <div className="flex justify-center space-x-6 py-10">
        <div className="bg-[#527557] text-white p-4 xl:p-5 rounded-full">
          <Phone />
        </div>
        <div className="bg-[#527557] text-white p-4 xl:p-5 rounded-full">
          <Mail />
        </div>
        <div className="bg-[#527557] text-white p-4 xl:p-5 rounded-full">
          <MapPin />
        </div>
      </div>

      {/* ContactUs Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#527557]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#527557]"
            required
          />
        </div>
        <textarea
          name="message"
          placeholder="Message"
          rows="6"
          value={formData.message}
          onChange={handleChange}
          className="border border-gray-300 p-4 w-full resize-none rounded focus:outline-none focus:ring-2 focus:ring-[#527557]"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-[#527557] cursor-pointer text-white py-4 px-6 rounded w-full hover:bg-[#3e5c42] transition"
        >
          SEND MESSAGE
        </button>
      </form>
    </div>
  );
};

export default ContactUs;