import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import API from "../../api";
import "./Auth.css";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "provider",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (activeTab === "login") {
        const res = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        if (res.data.token) {
          localStorage.setItem("userToken", res.data.token);
          localStorage.setItem("userName", res.data.user.name);
          navigate("/");
        }
      } else {
        const res = await API.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        if (res.data.token) {
          localStorage.setItem("userToken", res.data.token);
          localStorage.setItem("userName", res.data.user.name);
          navigate("/");
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || "Something went wrong.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-tabs">
            <button
              className={activeTab === "login" ? "active" : ""}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={activeTab === "register" ? "active" : ""}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {activeTab === "register" && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {activeTab === "register" && (
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="provider">Food Provider</option>
                <option value="receiver">Food Receiver</option>
                <option value="volunteer">Volunteer</option>
              </select>
            )}
            <button type="submit">
              {activeTab === "login" ? "Login" : "Register"}
            </button>
          </form>

          {message && <p className="auth-message">{message}</p>}
        </div>
      </section>
      
    </>
  );
}
