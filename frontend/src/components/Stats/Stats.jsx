import "./Stats.css";

export default function Stats() {
  return (
    <section className="stats">
      <h2>Impact So Far</h2>
      <div className="stat-grid">
        <div className="stat">
          <h3>500+</h3>
          <p>Meals Shared</p>
        </div>
        <div className="stat">
          <h3>200+</h3>
          <p>Volunteers</p>
        </div>
        <div className="stat">
          <h3>50+</h3>
          <p>Communities Reached</p>
        </div>
      </div>
    </section>
  );
}
