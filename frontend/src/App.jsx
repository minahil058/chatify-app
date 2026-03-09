import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import "./App.css";

// Placeholder pages – replace with your real components if you have them
const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="page">
      <h1>Welcome to Chatify</h1>
      <p>{user ? `Logged in as ${user.username || user.email}` : "You are not logged in."}</p>
    </div>
  );
};

const LoginPage = () => (
  <div className="page">
    <h1>Login</h1>
    {/* Your login form goes here */}
  </div>
);

const SignUpPage = () => (
  <div className="page">
    <h1>Sign Up</h1>
    {/* Your signup form goes here */}
  </div>
);

const LoadingScreen = () => (
  <div className="page">
    <p>Loading Chatify...</p>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;

  return children;
};

const AppLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="app-root">
      <header className="app-header">
        <nav className="nav">
          <Link to="/" className="nav-logo">
            Chatify
          </Link>
          <div className="nav-links">
            {!user && (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="nav-link">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignUpPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
