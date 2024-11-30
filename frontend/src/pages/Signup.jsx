import  { useState } from 'react';
import { UserIcon, MailIcon, LockIcon, UserPlusIcon } from 'lucide-react';
import axios from '../lib/axiosInstance';
import toast from 'react-hot-toast';
import {Link, useNavigate} from 'react-router-dom';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = (formData) => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('auth/signup', formData ,{
          withCredentials: true
        }) ;
        if (response.data.status) {
          const role = response.data?.role;
          localStorage.setItem("role", role);
          navigate("/login");
          window.location.reload();
        }
        
      } catch (error) {
        console.error('Signup failed:', error);
        // Handle error here
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-purple-50 rounded-full flex items-center justify-center">
              <UserPlusIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-center">Create Account</h2>
          <p className="text-sm text-gray-500 text-center">
            Please fill in your information to create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                {errors.firstName && <span className="text-red-500 text-sm mt-1">{errors.firstName}</span>}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                {errors.lastName && <span className="text-red-500 text-sm mt-1">{errors.lastName}</span>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              {errors.confirmPassword && <span className="text-red-500 text-sm mt-1">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Create Account
            </button>
            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link
              to={"/login"}
              type="button"
              className="text-purple-600 hover:underline"
            >
              Sign up
            </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}