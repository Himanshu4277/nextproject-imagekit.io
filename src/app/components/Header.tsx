"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toastConfig = {
    position: "top-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light" as const,
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Signed out successfully", toastConfig);
    } catch {
      toast.error("Failed to sign out", toastConfig);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-gray-900 to-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-white hover:text-blue-400 transition-colors"
          onClick={() => toast.info("Welcome to ImageKit ReelsPro", toastConfig)}
        >
          Video with AI
        </Link>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border transition-colors"
          >
            Menu
          </button>

          {isMenuOpen && (
            <ul className="absolute border border-gray-700 right-0 mt-2 w-56 bg-gray-800 text-white rounded-lg shadow-lg">
              {session ? (
                <>
                  <li className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                    {session.user?.email?.split("@")[0]}
                  </li>
                  <li>
                    <Link
                      href="/upload"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Video Upload
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
