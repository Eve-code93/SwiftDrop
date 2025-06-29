import { Link } from "react-router-dom";


function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 shadow-sm bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white">
        <h1 className="text-2xl font-bold">SwiftDrop</h1>
        <div className="space-x-6 text-lg font-medium">
          <Link to="/" className="hover:text-yellow-300">
            Home
          </Link>
          <a href="#how-it-works" className="hover:text-yellow-300">
            How it works
          </a>
          <Link to="/register" className="hover:text-yellow-300">
            Register
          </Link>
          <Link to="/login" className="hover:text-yellow-300">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 py-20 md:py-32 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-800 drop-shadow">
            Swift, stress-free <br /> parcel delivery.
          </h2>
          <p className="text-lg text-gray-700">
            Track your parcel every step of the journey with ease.
          </p>

          
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <img
            src="/src/assets/Heropic.png"
            alt="Delivery Illustration"
            className="w-full max-w-md mx-auto drop-shadow-xl"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-8 py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">How It Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-12">
          Sending and tracking parcels has never been easier. Just follow three
          simple steps to get started with SwiftDrop.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <img
              src="/src/assets/login.svg"
              alt="Register"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">1. Register or Login</h3>
            <p className="text-gray-600">
              Create an account or sign in to access your dashboard and manage
              your parcels.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <img
              src="/src/assets/register.jpg"
              alt="Send Parcel"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">2. Send a Parcel</h3>
            <p className="text-gray-600">
              Fill in the parcel details, choose a destination, and our agents
              will handle the rest.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <img
              src="/src/assets/track-icon.png"
              alt="Track"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">
              3. Track in Real Time
            </h3>
            <p className="text-gray-600">
              Monitor the progress of your parcel from pickup to delivery.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
