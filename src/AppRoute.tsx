import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import UserRegistration from "./components/auth/userRegistration";
import Dashboard from "./components/dashboard/Dashboard";
import LoginAuthGuard from "./guard/LoginAuthGuard";
import AuthGuard from "./guard/AuthGuard";
import Auth from "./components/auth/Auth";
function AppRoute() {
    return (
        <Router>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="auth" />} />
                    <Route path="/auth/*" element={<LoginAuthGuard><Auth/></LoginAuthGuard>} />
                    <Route path="/dashboard/*" element={<AuthGuard><Dashboard/></AuthGuard>} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </AppLayout>
      </Router>
  )
}
export default AppRoute