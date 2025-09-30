import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Donate from "./pages/Donate/Donate";
import Community from "./pages/Community/Community";
import RequestFood from "./pages/RequestFood/RequestFood";
import Auth from "./pages/Auth/Auth"; 
import PrivateRoute from "./components/PrivateRoute";

import { useEffect } from "react";

import "./App.css";

function App() {
  // Global safe message handler
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        // Only handle messages your app expects
        if (!event.data || !event.data.type) return;

        // Example handling
        if (event.data.type === "MY_APP_MESSAGE") {
          console.log("Received:", event.data.payload);
        }
      } catch (err) {
        // Ignore errors from disconnected ports (extensions)
        console.warn("Ignored message error:", err);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Auth />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/donate"
          element={
            <PrivateRoute>
              <Donate />
            </PrivateRoute>
          }
        />
        <Route
          path="/community"
          element={
            <PrivateRoute>
              <Community />
            </PrivateRoute>
          }
        />
        <Route
          path="/request-food"
          element={
            <PrivateRoute>
              <RequestFood />
            </PrivateRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
