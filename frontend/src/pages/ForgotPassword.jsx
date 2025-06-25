import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setError("");
    setMessage("If this email exists, reset instructions have been sent.");

    // TODO: Connect to backend password reset request
    console.log("Password reset requested for:", email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="inline-flex mb-4">
        <a href="#" className="inline-flex flex-row items-center">
          <span className="leading-10 text-gray-800 text-4xl font-bold ml-1 uppercase">
            SwiftDrop
          </span>
        </a>
      </div>

      <div className="text-sm sm:text-base text-gray-600 my-4">
        Forgot your password? Reset it here.
      </div>

      <div className="rounded-md bg-white w-full max-w-sm sm:max-w-md border border-gray-200 shadow-md px-4 py-6 sm:p-8">
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}
        {message && (
          <p className="text-green-600 text-sm mb-4 text-center">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="email"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              Enter your registered email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-500 pl-3 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-indigo-400"
                placeholder="example@domain.com"
              />
            </div>
          </div>

          <div className="flex w-full mt-6">
            <button
              type="submit"
              className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 rounded py-2 w-full transition duration-150 ease-in"
            >
              <span className="mr-2 uppercase">Send Reset Link</span>
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
                  <path d="M4 4v16h16V4H4zm4 4h8v2H8V8zm0 4h6v2H8v-2z" />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center items-center mt-6">
        <Link
          to="/login"
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
              <path d="M3 12h18M12 5l7 7-7 7" />
            </svg>
          </span>
          <span className="ml-2">Back to Login</span>
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
