import "./RoleCards.css";
import provider from "../../assets/provider.jpg";
import receiver from "../../assets/receiver.jpg";
import volunteer from "../../assets/volunteer.jpg";

export default function RoleCards() {
  const roles = [
    { img: provider, title: "Food Provider" },
    { img: receiver, title: "Food Receiver" },
    { img: volunteer, title: "Volunteer" },
  ];

  return (
    <section className="roles">
      <h2>Choose Your Role</h2>
      <div className="role-grid">
        {roles.map((r, i) => (
          <div className="role-card" key={i}>
            <img src={r.img} alt={r.title} />
            <h3>{r.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
