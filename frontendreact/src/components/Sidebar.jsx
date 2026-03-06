import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">

      <h2 className="text-xl font-bold mb-6">
        Admin Panel
      </h2>

      <nav className="space-y-2">

        <Link
          to="/"
          className="block p-2 rounded hover:bg-gray-700"
        >
          Home
        </Link>

        <Link
          to="/about"
          className="block p-2 rounded hover:bg-gray-700"
        >
          About
        </Link>

      </nav>

    </div>
  )
}
