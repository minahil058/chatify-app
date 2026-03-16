import React from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { api } from "./lib/api.js";
import "./App.css";

// ===== CHAT HOME PAGE =====
const DEFAULT_AVATAR = (name = "?") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f4c75&color=ffffff&size=128&bold=true`;

const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("chats"); // 'chats' | 'contacts'
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  // Fetch all users/contacts
  React.useEffect(() => {
    api
      .get("/api/users")
      .then(res => setContacts(res.data || []))
      .catch(() => setContacts([]));
  }, []);

  // Fetch messages when a user is selected
  React.useEffect(() => {
    if (!selectedUser) return;
    api
      .get(`/api/messages/${selectedUser._id}`)
      .then(res => setMessages(res.data || []))
      .catch(() => setMessages([]));
  }, [selectedUser]);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = async () => {
    await api.post("/api/auth/logout", {}).catch(() => {});
    logout();
    navigate("/login");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || isSending) return;
    const text = newMessage.trim();
    setNewMessage("");
    setIsSending(true);
    const tempMsg = { _id: Date.now(), senderId: user._id, text, createdAt: new Date().toISOString(), pending: true };
    setMessages(prev => [...prev, tempMsg]);
    try {
      const res = await api.post(`/api/messages/send/${selectedUser._id}`, { text });
      setMessages(prev => prev.map(m => m._id === tempMsg._id ? res.data : m));
    } catch {
      setMessages(prev => prev.filter(m => m._id !== tempMsg._id));
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredContacts = contacts; // Can add search later

  return (
    <div className="chat-root">
      {/* ===== LEFT SIDEBAR ===== */}
      <aside className="chat-sidebar">
        {/* My Profile */}
        <div className="sidebar-profile">
          <img
            src={user?.profilePic || DEFAULT_AVATAR(user?.fullName)}
            alt={user?.fullName}
            className="sidebar-avatar"
            onError={e => { e.target.src = DEFAULT_AVATAR(user?.fullName); }}
          />
          <div className="sidebar-profile-info">
            <p className="sidebar-profile-name">{user?.fullName || "You"}</p>
            <p className="sidebar-profile-status">
              <span className="status-dot online" /> Online
            </p>
          </div>
          <button className="icon-btn" title="Logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="sidebar-tabs">
          <button
            className={`sidebar-tab ${activeTab === "chats" ? "active" : ""}`}
            onClick={() => setActiveTab("chats")}
          >Chats</button>
          <button
            className={`sidebar-tab ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >Contacts</button>
        </div>

        {/* User List */}
        <div className="sidebar-list">
          {filteredContacts.length === 0 && (
            <div className="sidebar-empty">No contacts yet</div>
          )}
          {filteredContacts.map(contact => (
            <div
              key={contact._id}
              className={`sidebar-item ${selectedUser?._id === contact._id ? "active" : ""}`}
              onClick={() => setSelectedUser(contact)}
            >
              <div className="sidebar-item-avatar-wrap">
                <img
                  src={contact.profilePic || DEFAULT_AVATAR(contact.fullName)}
                  alt={contact.fullName}
                  className="sidebar-item-avatar"
                  onError={e => { e.target.src = DEFAULT_AVATAR(contact.fullName); }}
                />
                <span className={`status-dot ${contact.isOnline ? "online" : "offline"}`} />
              </div>
              <div className="sidebar-item-info">
                <p className="sidebar-item-name">{contact.fullName}</p>
                <p className="sidebar-item-status">{contact.isOnline ? "online" : "offline"}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ===== MAIN CHAT PANEL ===== */}
      <main className="chat-main">
        {!selectedUser ? (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="chat-empty-title">Welcome to Chatify</h2>
            <p className="chat-empty-sub">Select a contact to start chatting</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                <div className="chat-header-avatar-wrap">
                  <img
                    src={selectedUser.profilePic || DEFAULT_AVATAR(selectedUser.fullName)}
                    alt={selectedUser.fullName}
                    className="chat-header-avatar"
                    onError={e => { e.target.src = DEFAULT_AVATAR(selectedUser.fullName); }}
                  />
                  <span className={`status-dot ${selectedUser.isOnline ? "online" : "offline"}`} />
                </div>
                <div>
                  <p className="chat-header-name">{selectedUser.fullName}</p>
                  <p className="chat-header-status">{selectedUser.isOnline ? "Online" : "Offline"}</p>
                </div>
              </div>
              <button className="icon-btn" title="Close" onClick={() => setSelectedUser(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="chat-no-messages">No messages yet. Say hi! 👋</div>
              )}
              {messages.map(msg => {
                const isMine = msg.senderId === user?._id || msg.senderId?._id === user?._id;
                return (
                  <div key={msg._id} className={`chat-bubble-row ${isMine ? "mine" : "theirs"}`}>
                    {!isMine && (
                      <img
                        src={selectedUser.profilePic || DEFAULT_AVATAR(selectedUser.fullName)}
                        className="bubble-avatar"
                        alt=""
                        onError={e => { e.target.src = DEFAULT_AVATAR(selectedUser.fullName); }}
                      />
                    )}
                    <div className={`chat-bubble ${isMine ? "bubble-mine" : "bubble-theirs"} ${msg.pending ? "bubble-pending" : ""}`}>
                      {msg.image && <img src={msg.image} alt="attachment" className="bubble-image" />}
                      {msg.text && <span>{msg.text}</span>}
                      <span className="bubble-time">{formatTime(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form className="chat-input-bar" onSubmit={handleSend}>
              <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                disabled={isSending}
              />
              <button type="submit" className="chat-send-btn" disabled={isSending || !newMessage.trim()}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

const HomePage = ChatPage;



const LoginPage = () => {
  const [formData, setFormData] = React.useState({
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
      const res = await api.post("/api/auth/login", formData);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container signup-container">
        {/* Left Side - Form */}
        <div className="signup-form-section">
          <div className="signup-form-wrapper">
            <div className="signup-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <svg viewBox="0 0 24 24" fill="none" className="chat-icon" style={{ width: '36px', height: '36px', color: '#00C2CB' }}>
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ fontSize: '28px', fontWeight: 'bold', marginLeft: '12px', color: '#f0f6fc', letterSpacing: '-0.5px' }}>Chatify</span>
            </div>
            <h1 className="signup-title">Welcome Back</h1>
            <p className="signup-subtitle">Login to access your account</p>

            {error && <div className="signup-error">{error}</div>}

            <form onSubmit={handleSubmit} className="signup-form">
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
                    placeholder="Enter your email"
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
                  />
                </div>
              </div>

              <button
                type="submit"
                className="signup-button login-button"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="login-footer-link">
              <button 
                type="button" 
                className="secondary-button" 
                onClick={() => navigate('/signup')}
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="signup-illustration login-illustration-bg">
          <div className="illustration-content">
            <img src="/login_illustration.png" alt="Login Illustration" className="login-illustration-img" />
            <h2 className="illustration-title" style={{ marginTop: '30px' }}>Connect Anytime, Anywhere</h2>
            <div className="feature-badges">
              <span className="badge">Secure</span>
              <span className="badge">Fast</span>
              <span className="badge">Reliable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
      const res = await api.post("/api/auth/signup", formData);
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
            <div className="signup-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <svg viewBox="0 0 24 24" fill="none" className="chat-icon" style={{ width: '36px', height: '36px', color: '#00C2CB' }}>
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ fontSize: '28px', fontWeight: 'bold', marginLeft: '12px', color: '#f0f6fc', letterSpacing: '-0.5px' }}>Chatify</span>
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
  );
}

export default App;
