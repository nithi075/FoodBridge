import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import API from "../../api"; // baseURL: http://localhost:5000/api
import foodDonation from "../../assets/foodDonation.jpg";
import "./Donate.css";

export default function Donate() {
  const [formData, setFormData] = useState({
    foodName: "",
    quantityNumber: 1,
    quantityUnit: "plates",
    expiryTime: "",
    contactNumber: "",
    address: "",
    city: "",
    district: "",
    state: "",
    country: "India",
    geo: { type: "Point", coordinates: [0, 0] },
  });

  const [message, setMessage] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState({ quantity: "", location: "" });
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const donationsPerPage = 5;

  // Fetch all donations
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await API.get("/food");
        setDonations(res.data);
      } catch (err) {
        console.error(err);
        setDonations([]);
      }
    };
    fetchAll();
  }, []);

  // Fetch nearby donations on location filter change
  useEffect(() => {
    const fetchNearby = async () => {
      if (!filter.location) return;
      try {
        const res = await API.get("/food/nearby-donations", {
          params: { city: filter.location.trim() },
        });
        setDonations(res.data);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setDonations([]);
      }
    };
    fetchNearby();
  }, [filter.location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");

    setFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`
          );
          const data = await res.json();
          const addr = data.address;

          const city = addr.city || addr.town || addr.village || "";
          const district = addr.county || "";
          const state = addr.state || "";
          const country = addr.country || "India";
          const address = `${addr.house_number || ""} ${addr.road || ""}`.trim() || data.display_name;

          setFormData((prev) => ({
            ...prev,
            address,
            city,
            district,
            state,
            country,
            geo: { type: "Point", coordinates: [longitude, latitude] },
          }));

          setFilter((prev) => ({ ...prev, location: city }));
        } catch (err) {
          console.error(err);
          setFormData((prev) => ({
            ...prev,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            geo: { type: "Point", coordinates: [longitude, latitude] },
          }));
        } finally {
          setFetchingLocation(false);
        }
      },
      (err) => {
        alert("Unable to fetch your location. Please enter manually.");
        setFetchingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.foodName ||
      !formData.quantityNumber ||
      !formData.expiryTime ||
      !formData.city ||
      !formData.state ||
      !formData.contactNumber
    ) {
      setMessage("Please fill all required fields!");
      return;
    }

    try {
      const response = await API.post("/food/add", {
        foodName: formData.foodName,
        quantityNumber: formData.quantityNumber,
        quantityUnit: formData.quantityUnit,
        expiryTime: formData.expiryTime,
        contactNumber: formData.contactNumber,
        location: {
          address: formData.address,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          country: formData.country,
          geo: formData.geo,
        },
      });

      if (response.status === 201) {
        setMessage("✅ Donation recorded!");
        setFormData({
          foodName: "",
          quantityNumber: 1,
          quantityUnit: "plates",
          expiryTime: "",
          contactNumber: "",
          address: "",
          city: "",
          district: "",
          state: "",
          country: "India",
          geo: { type: "Point", coordinates: [0, 0] },
        });
        setOverlayOpen(false);

        const res = await API.get("/food");
        setDonations(res.data);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Something went wrong.");
    }
  };

  // Filter & pagination
  const filteredDonations = donations.filter((d) => {
    const quantityMatch = filter.quantity ? d.quantityNumber >= parseInt(filter.quantity) : true;
    const locationMatch = filter.location
      ? d.location?.city?.toLowerCase().includes(filter.location.toLowerCase())
      : true;
    return quantityMatch && locationMatch;
  });

  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = filteredDonations.slice(indexOfFirstDonation, indexOfLastDonation);
  const totalPages = Math.ceil(filteredDonations.length / donationsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Navbar />

      <section className="donate-section">
        <h1>Donate Food</h1>
        <p className="subheading">
          Help reduce food waste and feed those in need.
        </p>

        <div className="donation-filters">
          <input
            type="number"
            min="1"
            placeholder="Meals Needed"
            value={filter.quantity}
            onChange={(e) => { setFilter({ ...filter, quantity: e.target.value }); setCurrentPage(1); }}
          />
          <input
            type="text"
            placeholder="City"
            value={filter.location}
            onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          />
          <button className="open-donate-btn" onClick={() => setOverlayOpen(true)}>Donate Now</button>
        </div>

        <div className="donation-cards">
          {currentDonations.length > 0 ? (
            currentDonations.map((d, i) => (
              <div key={i} className="donation-card">
                <h3>{d.foodName}</h3>
                <p>📍 {d.location?.city || "N/A"}</p>
                <p>🏠 {d.location?.address || "N/A"}</p>
                <p>🍽 {d.quantityNumber} {d.quantityUnit}</p>
                <p>📞 {d.contactNumber || "N/A"}</p>
                <p>Expires: {new Date(d.expiryTime).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>No donations found.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}

        {overlayOpen && (
          <div className="donate-overlay">
            <div className="donate-form-container">
              <button className="close-btn" onClick={() => setOverlayOpen(false)}>✖</button>
              <h2>Donate Food</h2>
              <form className="donate-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="Food Name" name="foodName" value={formData.foodName} onChange={handleChange} required />
                <input type="number" min="1" placeholder="Quantity" name="quantityNumber" value={formData.quantityNumber} onChange={handleChange} required />
                <select name="quantityUnit" value={formData.quantityUnit} onChange={handleChange}>
                  <option value="plates">Plates</option>
                  <option value="kg">Kg</option>
                  <option value="liters">Liters</option>
                </select>
                <input type="datetime-local" name="expiryTime" value={formData.expiryTime} onChange={handleChange} required />
                <input type="tel" placeholder="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                <input type="text" placeholder="City" name="city" value={formData.city} onChange={handleChange} required />
                <input type="text" placeholder="District" name="district" value={formData.district} onChange={handleChange} />
                <input type="text" placeholder="State" name="state" value={formData.state} onChange={handleChange} />
                <input type="text" placeholder="Country" name="country" value={formData.country} onChange={handleChange} />
                <input type="text" placeholder="Address" name="address" value={formData.address} onChange={handleChange} />
                <button type="button" className="use-location-btn" onClick={handleUseMyLocation} disabled={fetchingLocation}>
                  {fetchingLocation ? "Fetching..." : "Use My Location"}
                </button>
                <button type="submit">Submit Donation</button>
                {message && <p className="donate-message">{message}</p>}
              </form>
            </div>
          </div>
        )}

        <div className="donate-illustration">
          <img src={foodDonation} alt="Food donation" />
        </div>
      </section>

      
    </>
  );
}
