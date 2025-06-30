import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white font-sans">
      {/* Navbar */}
      <nav className="bg-white px-6 py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="text-purple-600">Swift</span>Drop
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Register
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 font-medium shadow"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-8 mb-16 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                Lightning Fast
              </span>{" "}
              Deliveries
              <br />
              <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full inline-block mt-3 animate-bounce">
                Before you even hit refresh!
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-lg">
              Our hyper-efficient network delivers packages at warp speed.
            </p>

            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Enter tracking number"
                className="w-full p-4 pr-32 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 shadow"
              />
              <button className="absolute right-2 top-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:opacity-90 transition-all font-medium shadow">
                Track Now
              </button>
            </div>

            <div className="pt-6">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transform transition"
              >
                <span>Start Shipping Today</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://cdn.dribbble.com/users/645440/screenshots/16555994/media/0f0c2c8e6f8b4a5f8b5b5b5b5b5b5b5.png"
              alt="Delivery illustration"
              className="w-full max-w-lg rounded-xl transition-transform duration-500 hover:scale-105 shadow-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://cdn.dribbble.com/users/148670/screenshots/5311878/delivery.gif";
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["98%", "On-Time Delivery"],
            ["24/7", "Real-Time Tracking"],
            ["500+", "Cities Served"],
            ["30min", "Quickest Delivery"],
          ].map(([stat, label]) => (
            <div key={label} className="space-y-2">
              <div className="text-3xl font-bold text-purple-700">{stat}</div>
              <div className="text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: "📦",
                title: "Post Your Parcel",
                desc: "Create an account and schedule your pickup with just a few clicks.",
              },
              {
                icon: "🚚",
                title: "We Pick It Up",
                desc: "Our agent arrives at your doorstep to collect your package securely.",
              },
              {
                icon: "📍",
                title: "Track in Real-Time",
                desc: "Use our dashboard to follow your parcel every step of the way.",
              },
              {
                icon: "🎉",
                title: "Prompt Delivery",
                desc: "Your parcel is delivered quickly, safely, and with a smile.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-purple-50 p-6 rounded-lg shadow-sm hover:shadow-lg transition">
                <div className="text-4xl mb-4">{icon}</div>
                <h4 className="text-xl font-semibold text-purple-700 mb-2">{title}</h4>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-700 to-pink-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} <strong>SwiftDrop</strong> — Where speed meets reliability.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
