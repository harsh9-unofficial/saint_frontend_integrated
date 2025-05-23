import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_BASE_URL } from "../config";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    repassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.repassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Prepare data for backend (exclude repassword)
    const { username, email, phone, password } = formData;

    try {
      const response = await axios.post(`${USER_BASE_URL}/users/signup`, {
        username,
        email,
        phone,
        password,
      });


      toast.success("Account created successfully! Redirecting to login...");
      localStorage.setItem("token", response.data.token);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating account");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="hidden md:w-1/2 bg-[#527557] text-[#F6F6F6] p-10 md:flex flex-col justify-center items-start space-y-4">
        <h2 className="md:text-3xl xl:text-5xl font-semibold">
          Join the community!
        </h2>
        <p className="md:text-xl xl:text-2xl">
          Create your account and unlock a world of personalized experiences. It
          only takes a moment to get started—let's go!
        </p>
      </div>

      {/* Right Panel */}
      <div className="md:w-1/2 h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-xl space-y-2 md:space-y-6">
          <div className="flex justify-center">
            <Link to="/">
              <img
                src="/images/Logo.png"
                alt="Saint Store"
                className="text-center"
              />
            </Link>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="username"
                className="block text-lg font-semibold text-[#527557]"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your name"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 w-full border border-[#527557] rounded px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="block text-lg font-semibold text-[#527557]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full border border-[#527557] rounded px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="phonenumber"
                className="block text-lg font-semibold text-[#527557]"
              >
                Phone Number
              </label>
              <input
                id="phonenumber"
                type="number"
                name="phone"
                placeholder="Enter your number"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full border border-[#527557] rounded px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="block text-lg font-semibold text-[#527557]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full border border-[#527557] rounded px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="repassword"
                className="block text-lg font-semibold text-[#527557]"
              >
                Re-Password
              </label>
              <input
                id="repassword"
                type="password"
                name="repassword"
                placeholder="Confirm your password"
                value={formData.repassword}
                onChange={handleChange}
                className="mt-1 w-full border border-[#527557] rounded px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#527557]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#527557] text-white py-4 px-4 rounded cursor-pointer text-xl hover:bg-[#3e5c42] transition"
            >
              Sign up
            </button>
          </form>

          <p className="text-center text-xl text-[#527557] mt-4">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#527557]">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
