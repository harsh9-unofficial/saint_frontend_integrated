import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_BASE_URL } from "../config";
import { toast } from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${USER_BASE_URL}/users/login`, {
        email: formData.email,
        password: formData.password,
      });

      toast.success("Logged in successfully! Redirecting...");
      localStorage.setItem("token", response.data.token);

      // Store data based on isAdmin status
      if (response.data.isAdmin) {
        localStorage.setItem("isAdmin", response.data.isAdmin.toString());
        localStorage.removeItem("userId");
      } else {
        localStorage.setItem("userId", response.data.user.id);
        localStorage.removeItem("isAdmin");
      }

      // Redirect based on isAdmin status
      const redirectRoute = response.data.isAdmin ? "/admin" : "/";
      setTimeout(() => navigate(redirectRoute), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="hidden md:w-1/2 bg-[#527557] text-[#F6F6F6] p-10 md:flex flex-col justify-center items-start space-y-4">
        <h2 className="md:text-3xl xl:text-5xl font-semibold">Welcome back!</h2>
        <p className="md:text-xl xl:text-2xl">
          We're glad to see you again—log in to continue where you left off.
          Your journey awaits, just a click away.
        </p>
      </div>

      {/* Right Panel */}
      <div className="md:w-1/2 h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-xl space-y-10">
          <div className="flex justify-center">
            <Link to="/">
              <img
                src="/images/Logo.png"
                alt="Saint Store"
                className="text-center"
              />
            </Link>
          </div>
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
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

            <div className="flex flex-col gap-3">
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

            <button
              type="submit"
              className="w-full bg-[#527557] text-white py-4 px-4 rounded cursor-pointer text-xl hover:bg-[#3e5c42] transition"
            >
              Log in
            </button>
          </form>

          <p className="text-center text-xl text-[#527557] mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-[#527557]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
