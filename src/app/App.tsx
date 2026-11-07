import { useEffect, useState } from "react";
import Boot from "../components/Boot";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroScene from "../components/hero/HeroScene";
import Services from "../components/sections/Services";
import Directions from "../components/sections/Directions";
import Portfolio from "../components/sections/Portfolio";
import Templates from "../components/sections/Templates";
import About from "../components/sections/About";
import Team from "../components/sections/Team";
import Competencies from "../components/sections/Competencies";
import Process from "../components/sections/Process";
import Faq from "../components/sections/Faq";
import Contacts from "../components/sections/Contacts";
import DirectionPage from "../components/pages/DirectionPage";
import StorefrontAdmin from "../components/pages/StorefrontAdmin";

// tiny hash router: #/napravlenie/<slug> → direction landing page,
// #/admin → owner storefront tool, anything else → the main one-pager
function routeOf(): { dir: string | null; admin: boolean; anchor: string | null } {
  const h = window.location.hash;
  if (h === "#/admin") return { dir: null, admin: true, anchor: null };
  const m = h.match(/^#\/napravlenie\/([\w-]+)/);
  if (m) return { dir: m[1], admin: false, anchor: null };
  return { dir: null, admin: false, anchor: h.length > 1 && !h.startsWith("#/") ? h : null };
}

export default function App() {
  const [route, setRoute] = useState(routeOf);

  useEffect(() => {
    const onHash = () => setRoute(routeOf());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (route.dir || route.admin) {
      window.scrollTo(0, 0);
    } else if (route.anchor) {
      // coming back from a subpage to a section anchor
      const anchor = route.anchor;
      requestAnimationFrame(() => {
        document.querySelector(anchor)?.scrollIntoView();
      });
    }
  }, [route]);

  return (
    <>
      <Boot />
      <Header />
      {route.admin ? (
        <StorefrontAdmin />
      ) : route.dir ? (
        <DirectionPage slug={route.dir} />
      ) : (
        <main>
          <HeroScene />
          <Services />
          <Directions />
          <Portfolio />
          <Templates />
          <About />
          <Team />
          <Competencies />
          <Process />
          <Faq />
          <Contacts />
        </main>
      )}
      <Footer />
    </>
  );
}
