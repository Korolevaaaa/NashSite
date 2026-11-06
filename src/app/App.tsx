import Boot from "../components/Boot";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroScene from "../components/hero/HeroScene";
import Services from "../components/sections/Services";
import Portfolio from "../components/sections/Portfolio";
import Contacts from "../components/sections/Contacts";

export default function App() {
  return (
    <>
      <Boot />
      <Header />
      <main>
        <HeroScene />
        <Services />
        <Portfolio />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
