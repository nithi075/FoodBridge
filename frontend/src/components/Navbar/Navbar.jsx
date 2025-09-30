import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const userRole = localStorage.getItem("role"); // null if not logged in
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          FoodBridge
        </Link>

        {/* Desktop Menu */}
        <ul className="nav-links desktop">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/donate">Donate</NavLink>
          </li>
          <li>
            <NavLink to="/community">Community</NavLink>
          </li>
          <li>
            <NavLink to="/request-food">Request Food</NavLink>
          </li>

          {/* User Icon or Login */}
          {userRole ? (
            <li className="user-dropdown" ref={dropdownRef}>
              <button
                className="user-icon-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUserCircle size={24} />
              </button>
              <div className={`dropdown-menu ${dropdownOpen ? "open" : ""}`}>
                <NavLink to="/profile" onClick={() => setDropdownOpen(false)}>
                  My Profile
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </li>
          ) : (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}
        </ul>

        {/* Hamburger Button for Mobile */}
        <button
          className="menu-toggle mobile"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars size={22} />
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          <FaTimes size={22} />
        </button>

        <div className="sidebar-user">
          <FaUserCircle size={30} />
          <span>{userRole ? userRole.toUpperCase() : "Guest"}</span>
        </div>

        <ul>
          <li>
            <NavLink to="/" onClick={() => setSidebarOpen(false)}>
              🏠 Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/donate" onClick={() => setSidebarOpen(false)}>
              🍽️ Donate
            </NavLink>
          </li>
          <li>
            <NavLink to="/community" onClick={() => setSidebarOpen(false)}>
              🏘️ Community
            </NavLink>
          </li>
          <li>
            <NavLink to="/request-food" onClick={() => setSidebarOpen(false)}>
              🍲 Request Food
            </NavLink>
          </li>

          <hr />

          {userRole ? (
            <>
              <li>
                <NavLink to="/profile" onClick={() => setSidebarOpen(false)}>
                  👤 My Profile
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setSidebarOpen(false);
                  }}
                >
                  🚪 Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/login" onClick={() => setSidebarOpen(false)}>
                🔑 Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </>
  );
}
