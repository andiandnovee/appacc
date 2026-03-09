import { Outlet } from "react-router-dom"

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-2">
          <a href="/" className="block hover:text-blue-400">
            Dashboard
          </a>

          <a href="/about" className="block hover:text-blue-400">
            About
          </a>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  )
}