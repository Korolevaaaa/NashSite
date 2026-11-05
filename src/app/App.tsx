import { useEffect } from "react";
import Boot from "../components/Boot";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroScene from "../components/hero/HeroScene";
import Ticker from "../components/Ticker";
import Services from "../components/sections/Services";
import Portfolio from "../components/sections/Portfolio";
import Contacts from "../components/sections/Contacts";

export default function App() {
  // magnetic buttons — ported from the original script.js
  useEffect(() => {
    const buttons = document.querySelectorAll<HTMLElement>(".btn");
    const cleanups = [...buttons].map((btn) => {
      const onMove = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.22;
        const dy = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = `translate(${dx}px, ${dy - 2}px)`;
      };
      const onLeave = () => {
        btn.style.transform = "";
      };
      btn.addEventListener("pointermove", onMove);
      btn.addEventListener("pointerleave", onLeave);
      return () => {
        btn.removeEventListener("pointermove", onMove);
        btn.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <Boot />
      <Header />
      <main>
        <HeroScene />
        <Ticker />
        <Services />
        <Portfolio />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
