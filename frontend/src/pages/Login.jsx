import { useState } from "react";
import { LockIcon, MailIcon } from "lucide-react";
import axios from "../lib/axiosInstance";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAuth from "../contexts/AuthContext";

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const { updateRole } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (formData) => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email field cannot be empty";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      errors.email = "Invalid syntax for email";
    }
    if (!formData.password) {
      errors.password = "Password field cannot be empty";
    }
    return errors;
  };

  const handleSubmit = async () => {
    const errors = await validate(formData);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "auth/login",
          { email: formData.email, password: formData.password },
          {
            withCredentials: true,
          }
        );
        if (response.data.status) {
          const role = response.data?.role;
          localStorage.setItem("role", role);
          navigate("/");
          window.location.reload()

        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "somme error occured.");
        console.error("error : ", err?.response?.data?.message || err);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-purple-50 rounded-full flex items-center justify-center">
              <LockIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
          <p className="text-sm text-gray-500 text-center">
            Please enter your credentials to access your account
          </p>
        </div>

        <div className="mt-8">
          <form className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  onChange={handleChange}
                  id="email"
                  name="email"
                  value={formData.email}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
                {errors?.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors?.email}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  onChange={handleChange}
                  id="password"
                  name="password"
                  value={formData.password}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="mt-6 space-y-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>
          <p className="text-sm text-center text-gray-500">
            Don`t have an account?{" "}
            <Link
              to={"/signup"}
              type="button"
              className="text-purple-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
