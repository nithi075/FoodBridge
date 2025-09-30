import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import RoleCards from "../../components/RoleCards/RoleCards";
import Stats from "../../components/Stats/Stats";
import Footer from "../../components/Footer/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <HowItWorks />
      <RoleCards />
      <Stats />
    
    </div>
  );
}
