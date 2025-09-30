import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <section className="how">
      <h2>How It Works</h2>
      <div className="steps">
        <div className="step">
          <span className="icon">🍲</span>
          <p>Food Providers share surplus</p>
        </div>
        <div className="step">
          <span className="icon">🤝</span>
          <p>Volunteers pick up</p>
        </div>
        <div className="step">
          <span className="icon">🏠</span>
          <p>Food Receivers get meals</p>
        </div>
      </div>
    </section>
  );
}
