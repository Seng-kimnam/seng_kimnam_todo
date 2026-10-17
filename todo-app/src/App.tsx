import { Navigate, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import TodoPage from "./pages/TodoPage";
import UserDetailPage from "./pages/UserDetailPage";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import SignInForm from "./auth/SignInForm";
import RegisterForm from "./auth/RegisterForm";
import ForgetPasswordForm from "./auth/ForgetPasswordForm";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-500">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/todos" replace />} />

          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgetPasswordForm />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/todos" element={<TodoPage />} />
            <Route path="/profile" element={<UserDetailPage />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="text-7xl font-extrabold text-blue-600">404</div>
                <h2 className="text-xl font-bold text-slate-900 mt-4">
                  Page Not Found
                </h2>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  The page you are looking for doesn't exist or has been moved.
                </p>
                <Link
                  to="/todos"
                  className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                  Return to Dashboard
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
