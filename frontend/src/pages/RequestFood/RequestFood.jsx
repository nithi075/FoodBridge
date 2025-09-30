import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import API from "../../api";
import "./RequestFood.css";

export default function RequestFood() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    meals: "",
    location: "",
    notes: "",
    coordinates: [],
  });

  const [message, setMessage] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);

  // Donors and filters
  const [donors, setDonors] = useState([]);
  const [filter, setFilter] = useState({ location: "", minMeals: "" });
  const [loadingNearby, setLoadingNearby] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const donorsPerPage = 5;

  // Fetch all donors on mount
  useEffect(() => {
    const fetchAllDonors = async () => {
      try {
        const res = await API.get("/request/all");
        setDonors(res.data);
      } catch (err) {
        console.error("Error fetching donors:", err);
      }
    };
    fetchAllDonors();
  }, []);

  // Form input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Use browser location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const resGeo = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18`
          );
          const data = await resGeo.json();
          const preciseAddress =
            data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setFormData((prev) => ({
            ...prev,
            location: preciseAddress,
            coordinates: [longitude, latitude],
          }));
        } catch {
          setFormData((prev) => ({
            ...prev,
            location: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            coordinates: [longitude, latitude],
          }));
        }
      },
      () => alert("Unable to fetch location. Enter manually."),
      { enableHighAccuracy: true }
    );
  };

  // Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coordinates.length)
      return alert("Please use your location first!");

    try {
      const res = await API.post("/request/create", formData);
      if (res.status === 201) {
        setMessage("✅ Request submitted successfully!");
        setFormData({
          name: "",
          phone: "",
          meals: "",
          location: "",
          notes: "",
          coordinates: [],
        });
        setOverlayOpen(false);

        // Refresh donor list
        const donorsRes = await API.get("/request/all");
        setDonors(donorsRes.data);
        setCurrentPage(1);
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error submitting request.");
    }
  };

  // Filter donors
  const filteredDonors = donors.filter((d) => {
    const locationMatch = filter.location
      ? d.location.toLowerCase().includes(filter.location.toLowerCase())
      : true;
    const mealsMatch = filter.minMeals ? d.meals >= parseInt(filter.minMeals) : true;
    return locationMatch && mealsMatch;
  });

  // Pagination calculations
  const indexOfLastDonor = currentPage * donorsPerPage;
  const indexOfFirstDonor = indexOfLastDonor - donorsPerPage;
  const currentDonors = filteredDonors.slice(indexOfFirstDonor, indexOfLastDonor);
  const totalPages = Math.ceil(filteredDonors.length / donorsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Fetch nearby donors
  const fetchNearbyDonors = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    setLoadingNearby(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const res = await API.get(
            `/request/nearby?lat=${latitude}&lng=${longitude}`
          );
          setDonors(res.data);
          setCurrentPage(1);
        } catch (err) {
          console.error("Error fetching nearby donors:", err);
        } finally {
          setLoadingNearby(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLoadingNearby(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <>
      <Navbar />

      <section className="request-section">
        <h1>Request Food</h1>
        <p className="subheading">
          Fill the form and connect with local donors.
        </p>

        <button
          className="open-request-btn"
          onClick={() => setOverlayOpen(true)}
        >
          Request Food
        </button>

        {/* Overlay Form */}
        {overlayOpen && (
          <div className="request-overlay">
            <div className="request-form-container">
              <button
                className="close-btn"
                onClick={() => setOverlayOpen(false)}
              >
                ✖
              </button>
              <h2>Request Food</h2>
              <form className="request-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  placeholder="Number of Meals"
                  name="meals"
                  value={formData.meals}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="use-location-btn"
                  onClick={handleUseMyLocation}
                >
                  {formData.coordinates.length ? "Location Set" : "Use My Location"}
                </button>
                <textarea
                  placeholder="Notes / Special Requirements"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
                <button type="submit">Submit Request</button>
                {message && <p className="request-message">{message}</p>}
              </form>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="donation-filters">
          <h3>Filter Donors</h3>
          <div className="filter-inputs">
            <input
              type="text"
              placeholder="Filter by Location"
              value={filter.location}
              onChange={(e) =>
                setFilter({ ...filter, location: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Min Meals"
              value={filter.minMeals}
              onChange={(e) =>
                setFilter({ ...filter, minMeals: e.target.value })
              }
            />
            <button onClick={fetchNearbyDonors}>
              {loadingNearby ? "Loading..." : "Nearby"}
            </button>
          </div>
        </div>

        {/* Donors List */}
        {currentDonors.length ? (
          <div className="donor-cards">
            {currentDonors.map((d) => (
              <div key={d._id} className="donor-card">
                <div className="donor-card-header">
                  <h3>{d.name}</h3>
                  <span className="donor-meals">{d.meals} meal(s)</span>
                </div>
                <p className="donor-location">📍 {d.location}</p>
                <p className="donor-phone">📞 {d.phone}</p>
                {d.notes && <p className="donor-notes">📝 {d.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No donors found.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>

      
    </>
  );
}
