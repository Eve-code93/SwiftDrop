import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token } = response.data;
      const decodedUser = jwtDecode(access_token);

      login({ token: access_token });

      // Role-based navigation
      if (decodedUser.role === "admin") navigate("/admin");
      else if (decodedUser.role === "agent") navigate("/agent");
      else if (decodedUser.role === "sender") navigate("/dashboard");
      else navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-100 via-pink-100 to-white px-4 py-8">
      {/* Logo */}
      <Link to="/" className="mb-6 text-4xl font-bold text-purple-700 hover:text-purple-800 transition">
        Swift<span className="text-pink-500">Drop</span>
      </Link>

      {/* Form Card */}
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login to Your Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center"
          >
            <svg
              className="h-5 w-5 mr-2 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Login
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-sm text-center space-y-2">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="text-purple-600 font-medium hover:underline">
              Register
            </Link>
          </p>
          <p>
            <Link to="/forgot-password/:token" className="text-pink-600 font-medium hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
