import { Search, Bell, ChevronDown, Moon, Sun } from "lucide-react";

import { useState } from "react";

import ThemeToggle from "./ThemeToggle";
export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleDark = () => {
    setDarkMode(!darkMode);

    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b flex items-center justify-between px-6">
      {/* Search */}

      <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-64">
        <Search size={18} className="text-gray-500" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 text-sm w-full"
        />
      </div>

      {/* Right menu */}

      <div className="flex items-center gap-6">
        {/* Dark mode toggle */}
        <ThemeToggle />

        {/* Notification */}

        <button className="relative text-gray-600 hover:text-black">
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
            3
          </span>
        </button>

        {/* Profile */}

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2"
          >
            <img
              src="https://i.pravatar.cc/40"
              className="w-8 h-8 rounded-full"
            />

            <span className="text-sm font-medium">Admin</span>

            <ChevronDown size={16} />
          </button>

          {/* Dropdown */}

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow">
              <a className="block px-4 py-2 hover:bg-gray-100">Profile</a>

              <a className="block px-4 py-2 hover:bg-gray-100">Settings</a>

              <a className="block px-4 py-2 hover:bg-gray-100">Logout</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
