import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main content renders here */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Global footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SwiftDrop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
