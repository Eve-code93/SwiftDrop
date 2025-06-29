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

      console.log("Login response:", response.data); // 👈 check what you're getting

      const { access_token } = response.data;

      const decodedUser = jwtDecode(access_token);
      console.log("Decoded JWT:", decodedUser); // 👈 check this too
      console.log("User role from token:", decodedUser.role); // 👈 Add this

      login({ token: access_token });

      // Redirect based on role from decoded token
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="inline-flex mb-4">
        <Link to="/" className="inline-flex flex-row items-center">
          <span className="leading-10 text-gray-800 text-4xl font-bold ml-1 uppercase">
            SwiftDrop
          </span>
        </Link>
      </div>

      <div className="text-sm sm:text-base text-gray-600 my-4">
        Login to your account
      </div>

      <div className="rounded-md bg-white w-full max-w-sm sm:max-w-md border border-gray-200 shadow-md px-4 py-6 sm:p-8">
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="email"
              className="mb-1 text-xs sm:text-sm text-gray-600"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm placeholder-gray-500 pl-3 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-indigo-400"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="password"
              className="mb-1 text-xs sm:text-sm text-gray-600"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm placeholder-gray-500 pl-3 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-indigo-400"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="flex w-full mt-6">
            <button
              type="submit"
              className="flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 rounded py-2 w-full transition duration-150 ease-in"
            >
              <span className="mr-2 uppercase">Login</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center items-center mt-6">
        <Link
          to="/register"
          className="text-indigo-500 hover:text-indigo-700 text-sm font-bold"
        >
          Don’t have an account? Register
        </Link>
        <Link
          to="/forgot-password/:token"
          className="ml-4 text-indigo-500 hover:text-indigo-700 text-sm font-bold"
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}

export default Login;
