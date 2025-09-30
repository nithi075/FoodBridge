import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Track.css";

export default function Track() {
  return (
    <>
      <Navbar />
      <section className="track-section">
        <h1>Track Impact</h1>
        <p>See how your contributions are helping communities.</p>

        <div className="track-cards">
          <div className="track-card meals-card">
            <h2>12,430</h2>
            <p>Meals Shared</p>
          </div>
          <div className="track-card food-card">
            <h2>3,200 kg</h2>
            <p>Food Saved</p>
          </div>
          <div className="track-card cities-card">
            <h2>9 Cities</h2>
            <p>Active</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
