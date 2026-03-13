import React from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import axios from "axios";
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

const SignUpPage = () => {
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/auth/signup", formData, {
        withCredentials: true,
      });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Left Side - Form */}
        <div className="signup-form-section">
          <div className="signup-form-wrapper">
            <div className="signup-logo">
              <svg viewBox="0 0 24 24" fill="none" className="chat-icon">
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Sign up for a new account</p>

            {error && <div className="signup-error">{error}</div>}

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" className="input-icon">
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" className="input-icon">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="22,6 12,13 2,6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="johndoe@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" className="input-icon">
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 11V7a5 5 0 0 1 10 0v4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="signup-button"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="signup-footer">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="signup-illustration">
          <div className="illustration-content">
            {/* Clouds */}
            <div className="cloud cloud-1">
              <svg viewBox="0 0 100 60" fill="currentColor">
                <path d="M25,50 Q15,50 15,40 Q15,30 25,30 Q25,15 40,15 Q55,15 55,30 Q65,25 75,30 Q85,35 85,45 Q85,50 75,50 Z" />
              </svg>
            </div>
            <div className="cloud cloud-2">
              <svg viewBox="0 0 100 60" fill="currentColor">
                <path d="M25,50 Q15,50 15,40 Q15,30 25,30 Q25,15 40,15 Q55,15 55,30 Q65,25 75,30 Q85,35 85,45 Q85,50 75,50 Z" />
              </svg>
            </div>
            <div className="cloud cloud-3">
              <svg viewBox="0 0 100 60" fill="currentColor">
                <path d="M25,50 Q15,50 15,40 Q15,30 25,30 Q25,15 40,15 Q55,15 55,30 Q65,25 75,30 Q85,35 85,45 Q85,50 75,50 Z" />
              </svg>
            </div>

            {/* People with phones */}
            <div className="people-group">
              {/* Person 1 */}
              <div className="person person-1">
                <div className="chat-bubble bubble-1">
                  <div className="bubble-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="person-body">
                  <div className="person-head"></div>
                  <div className="person-torso"></div>
                  <div className="person-legs"></div>
                  <div className="phone"></div>
                </div>
              </div>

              {/* Person 2 */}
              <div className="person person-2">
                <div className="person-body">
                  <div className="person-head"></div>
                  <div className="person-torso"></div>
                  <div className="person-legs"></div>
                  <div className="phone"></div>
                </div>
              </div>

              {/* Person 3 */}
              <div className="person person-3">
                <div className="chat-bubble bubble-2">
                  <div className="bubble-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="person-body">
                  <div className="person-head"></div>
                  <div className="person-torso"></div>
                  <div className="person-legs"></div>
                  <div className="phone"></div>
                </div>
              </div>

              {/* Dog */}
              <div className="dog">
                <div className="dog-body"></div>
                <div className="dog-head"></div>
                <div className="dog-tail"></div>
              </div>
            </div>

            <h2 className="illustration-title">Start Your Journey Today</h2>

            <div className="feature-badges">
              <span className="badge">Free</span>
              <span className="badge">Easy Setup</span>
              <span className="badge">Private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
