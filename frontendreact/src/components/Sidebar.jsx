import { LayoutDashboard, Users, Settings } from "lucide-react"
import { NavLink } from "react-router-dom"

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-gray-200">

     <div className="h-16 flex items-center px-6 text-xl font-bold border-b border-gray-700">
        MyDashboard
      </div>

      <nav className="flex flex-col gap-2 p-4">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition ${
              isActive
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-800"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition ${
              isActive
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-800"
            }`
          }
        >
          <Users size={18} />
          Users
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition ${
              isActive
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-800"
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>

      </nav>

    </div>
  )
}