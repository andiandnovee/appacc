import { FC, ReactElement, Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ToastProvider } from "./components/ui/Toast";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import PageLoading from "./components/ui/PageLoading";

import DashboardLayout from "./layouts/Dashboardlayout";

const Login = lazy(() => import("./pages/general/Login"));
const AuthCallback = lazy(() => import("./pages/auth/AuthCallback"));
const Home = lazy(() => import("./pages/general/Home"));
const Users = lazy(() => import("./pages/general/Users"));
const Settings = lazy(() => import("./pages/general/Settings"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const VendorManagement = lazy(() => import("./pages/invoice/VendorManagement"));
//import SapPoImportPage from "./pages/sap/SapPoImportPage";
const Stages = lazy(() => import("./pages/invoice/Stage"));
const Receipt = lazy(() => import("./pages/invoice/Receipt"));
const BusinessArea = lazy(() => import("./pages/invoice/BusArea"));
//import PphImportPage from "./pages/sap/PphImportPage";
const PphReportPage = lazy(() => import("./pages/invoice/PphReportPage"));
//import F53ImportPage from "./pages/sap/F53ImportPage";
const F53HelperPage = lazy(() => import("./pages/invoice/F53HelperPage"));
const VehicleLogbookPage = lazy(() => import("./pages/invoice/VehicleLogBook"));
const VehicleManagement = lazy(() => import("./pages/invoice/VehicleManagementPage"));
const CostCenterManagement = lazy(() => import("./pages/invoice/CostCenterManagementPage"));
const CustomerManagement = lazy(() => import("./pages/invoice/CustomerManagementPage"));
const StnkJournal = lazy(() => import("./pages/invoice/StnkJournal"));

const App: FC = (): ReactElement => {
  useEffect(() => {
    const preloader = document.getElementById("app-loading");
    preloader?.classList.add("is-hidden");
    const timeout = window.setTimeout(() => preloader?.remove(), 250);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<PageLoading />}>
            <Routes>
            {/* ── Public ──────────────────────────────── */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* ── Protected ───────────────────────────── */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="/invoice/f53-helper" element={<F53HelperPage />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/ref/vendors" element={<VendorManagement />} />
                <Route path="/ref/busa" element={<BusinessArea />} />
                {/* <Route
                  path="/utility/import-po"
                  element={<SapPoImportPage />}
                /> */}
                {/* <Route path="/utility/import-pph" element={<PphImportPage />} /> */}
                <Route path="/invoice/pph" element={<PphReportPage />} />
                {/* <Route path="/utility/import-f53" element={<F53ImportPage />} /> */}
                <Route path="/invoice/receipts" element={<Receipt />} />
                <Route path="/ref/stages" element={<Stages />} />
                <Route
                  path="/ref/cost-centers"
                  element={<CostCenterManagement />}
                />
                <Route path="/ref/customers" element={<CustomerManagement />} />

                {/* ── Kendaraan ── */}
                <Route
                  path="/vehicles/logbook"
                  element={<VehicleLogbookPage />}
                />
                <Route
                  path="/vehicles/manage"
                  element={<VehicleManagement />}
                />

                <Route
                  path="/vehicles/stnk-journal"
                  element={<StnkJournal />}
                />
              </Route>
            </Route>

            {/* ── Fallback ────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
