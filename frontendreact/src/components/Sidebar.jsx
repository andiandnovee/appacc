import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

export default function Sidebar() {

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isExpanded = !isCollapsed || isHovered       // ✅ logika tetap benar
  const sidebarWidth = isExpanded ? "w-64" : "w-16"

  return (
    <div
      className={`bg-gray-900 text-gray-200 min-h-screen transition-all duration-300 ${sidebarWidth}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">

        {isExpanded && (                              // ✅ ganti expanded → isExpanded
          <h1 className="font-bold text-lg">
            MyDashboard
          </h1>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)} // ✅ ganti setExpanded → setIsCollapsed
          className="text-gray-400 hover:text-white"
        >
          {isExpanded                                  // ✅ ganti expanded → isExpanded
            ? <ChevronLeft size={20} />
            : <ChevronRight size={20} />
          }
        </button>

      </div>

      {/* Menu */}
      <nav className="p-3 space-y-2">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition
            ${isActive ? "bg-gray-700 text-white" : "hover:bg-gray-800"}`
          }
        >
          <LayoutDashboard size={18} />
          {isExpanded && "Dashboard"}                  {/* ✅ */}
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition
            ${isActive ? "bg-gray-700 text-white" : "hover:bg-gray-800"}`
          }
        >
          <Users size={18} />
          {isExpanded && "Users"}                      {/* ✅ */}
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition
            ${isActive ? "bg-gray-700 text-white" : "hover:bg-gray-800"}`
          }
        >
          <Settings size={18} />
          {isExpanded && "Settings"}                   {/* ✅ */}
        </NavLink>

      </nav>

    </div>
  )
}