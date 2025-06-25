import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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
      // TODO: Replace this with actual API call later
      const mockResponse = {
        user: {
          id: 1,
          name: "Edwin",
          password: "password123",
          email: "edwin@example.com",
          role: "user", // Change to 'agent' or 'admin' to test other dashboards
        },
        token: "mock-token",
      };

      // Save to auth context
      login(mockResponse);

      // Redirect based on role
      const role = mockResponse.user.role;
      if (role === "admin") navigate("/admin");
      else if (role === "agent") navigate("/agent");
      else navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
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
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              Email:
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-500 pl-3 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-indigo-400"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="password"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              Password:
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-500 pl-3 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-indigo-400"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="flex w-full mt-6">
            <button
              type="submit"
              className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 rounded py-2 w-full transition duration-150 ease-in"
            >
              <span className="mr-2 uppercase">Login</span>
              <span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center items-center mt-6">
        <Link
          to="/register"
          className="inline-flex items-center font-bold text-indigo-500 hover:text-indigo-700 text-sm text-center"
        >
          <span>
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
          </span>
          <span className="ml-2">Don't have an account? Register</span>
        </Link>
        <Link
          to="/forgot-password"
          className="ml-4 inline-flex items-center font-bold text-indigo-500 hover:text-indigo-700 text-sm text-center"
        >
          <span>
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
          </span>
          <span className="ml-2">Forgot Password?</span>
        </Link>
      </div>
    </div>
  );
}

export default Login;
