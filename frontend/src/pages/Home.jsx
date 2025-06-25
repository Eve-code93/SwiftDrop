import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">SwiftDrop</h1>
        <div className="space-x-6 text-lg font-medium">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <a href="#how-it-works" className="hover:text-blue-600">
            How it works
          </a>
          <Link to="/register" className="hover:text-blue-600">
            Register
          </Link>
          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 py-20 md:py-32">
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Swift, stress-free <br /> parcel delivery.
          </h2>
          <p className="text-lg text-gray-600">
            Track your parcel every step of the journey.
          </p>
          <input
            type="text"
            placeholder="Enter your tracking number"
            className="w-full md:w-2/3 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-blue-400"
          />
        </div>

        <div className="md:w-1/2 mb-10 md:mb-0">
          <img
            src="/src/assets/Heropic.png" 
            alt="Delivery Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </section>
    </div>
  );
}

export default Home;
