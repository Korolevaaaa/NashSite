import { useEffect, useState } from "react";
import Boot from "../components/Boot";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroScene from "../components/hero/HeroScene";
import Services from "../components/sections/Services";
import Directions from "../components/sections/Directions";
import Cases from "../components/sections/Cases";
import Templates from "../components/sections/Templates";
import About from "../components/sections/About";
import Team from "../components/sections/Team";
import Competencies from "../components/sections/Competencies";
import Process from "../components/sections/Process";
import Faq from "../components/sections/Faq";
import Contacts from "../components/sections/Contacts";
import DirectionPage from "../components/pages/DirectionPage";
import StorefrontAdmin from "../components/pages/StorefrontAdmin";
import CasesPage from "../components/pages/CasesPage";
import CasePage from "../components/pages/CasePage";
import BlogPage from "../components/pages/BlogPage";
import BlogPostPage from "../components/pages/BlogPostPage";
import { CASES } from "../data/cases";
import { POSTS } from "../data/blog";

// tiny hash router:
//   #/admin                → owner storefront tool
//   #/napravlenie/<slug>   → direction landing page
//   #/cases                → all case studies
//   #/case/<slug>          → single case page
//   #/blog                 → post feed
//   #/blog/<slug>          → single article
//   #<anchor>              → main one-pager section
type Route =
  | { name: "main"; anchor: string | null }
  | { name: "admin" }
  | { name: "direction"; slug: string }
  | { name: "cases" }
  | { name: "case"; slug: string }
  | { name: "blog" }
  | { name: "post"; slug: string };

function routeOf(): Route {
  const h = window.location.hash;
  if (h === "#/admin") return { name: "admin" };
  if (h === "#/cases") return { name: "cases" };
  if (h === "#/blog") return { name: "blog" };
  let m = h.match(/^#\/case\/([\w-]+)/);
  if (m) return { name: "case", slug: m[1] };
  m = h.match(/^#\/blog\/([\w-]+)/);
  if (m) return { name: "post", slug: m[1] };
  m = h.match(/^#\/napravlenie\/([\w-]+)/);
  if (m) return { name: "direction", slug: m[1] };
  return { name: "main", anchor: h.length > 1 && !h.startsWith("#/") ? h : null };
}

const BASE_TITLE = "ZETRONIX — сайты и цифровые продукты для бизнеса";

function titleOf(r: Route): string {
  switch (r.name) {
    case "cases":
      return "Кейсы — ZETRONIX";
    case "case": {
      const c = CASES.find((x) => x.slug === r.slug);
      return c ? `${c.title || c.name} — кейс ZETRONIX` : "Кейс — ZETRONIX";
    }
    case "blog":
      return "Блог — ZETRONIX";
    case "post": {
      const p = POSTS.find((x) => x.slug === r.slug);
      return p ? `${p.title} — ZETRONIX` : "Статья — ZETRONIX";
    }
    default:
      return BASE_TITLE;
  }
}

export default function App() {
  const [route, setRoute] = useState(routeOf);

  useEffect(() => {
    const onHash = () => setRoute(routeOf());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.title = titleOf(route);
    if (route.name !== "main") {
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
      {route.name === "admin" ? (
        <StorefrontAdmin />
      ) : route.name === "direction" ? (
        <DirectionPage slug={route.slug} />
      ) : route.name === "cases" ? (
        <CasesPage />
      ) : route.name === "case" ? (
        <CasePage key={route.slug} slug={route.slug} />
      ) : route.name === "blog" ? (
        <BlogPage />
      ) : route.name === "post" ? (
        <BlogPostPage key={route.slug} slug={route.slug} />
      ) : (
        <main>
          <HeroScene />
          <Services />
          <Directions />
          <Cases />
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
