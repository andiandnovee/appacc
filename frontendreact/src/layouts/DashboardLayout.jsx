import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-950">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>

    </div>
  )
}