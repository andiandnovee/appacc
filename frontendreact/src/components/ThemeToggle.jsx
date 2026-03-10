import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(prev => !prev)}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}