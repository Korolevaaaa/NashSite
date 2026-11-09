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
import TemplatePage from "../components/pages/TemplatePage";
import { CASES } from "../data/cases";
import { POSTS } from "../data/blog";
import { TEMPLATES } from "../data/templates";
import { DIRECTIONS } from "../data/content";

// path router (SEO-indexable real URLs; legacy #/x hashes redirect):
//   /admin                 → owner storefront tool
//   /napravlenie/<slug>    → direction landing page
//   /cases                 → all case studies
//   /case/<slug>           → single case page
//   /blog                  → post feed
//   /blog/<slug>           → single article
//   /template/<slug>       → storefront product page
//   /#<anchor>             → main one-pager section
type Route =
  | { name: "main"; anchor: string | null }
  | { name: "admin" }
  | { name: "direction"; slug: string }
  | { name: "cases" }
  | { name: "case"; slug: string }
  | { name: "blog" }
  | { name: "post"; slug: string }
  | { name: "template"; slug: string };

function routeOf(): Route {
  const p = window.location.pathname;
  const h = window.location.hash;
  // legacy: /#/blog/x → /blog/x (stарые ссылки и закладки)
  if (p === "/" && h.startsWith("#/")) {
    history.replaceState(null, "", h.slice(1));
    return routeOf();
  }
  if (p === "/admin") return { name: "admin" };
  if (p === "/cases") return { name: "cases" };
  if (p === "/blog") return { name: "blog" };
  let m = p.match(/^\/case\/([\w-]+)/);
  if (m) return { name: "case", slug: m[1] };
  m = p.match(/^\/blog\/([\w-]+)/);
  if (m) return { name: "post", slug: m[1] };
  m = p.match(/^\/napravlenie\/([\w-]+)/);
  if (m) return { name: "direction", slug: m[1] };
  m = p.match(/^\/template\/([\w-]+)/);
  if (m) return { name: "template", slug: m[1] };
  return { name: "main", anchor: h.length > 1 ? h : null };
}

const BASE_TITLE = "ZETRONIX — сайты и цифровые продукты для бизнеса";

function titleOf(r: Route): string {
  switch (r.name) {
    case "direction": {
      const d = DIRECTIONS.find((x) => x.slug === r.slug);
      return d ? `${d.title} — разработка от ZETRONIX` : "Направление — ZETRONIX";
    }
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
    case "template": {
      const t = TEMPLATES.find((x) => x.slug === r.slug);
      return t ? t.seoTitle : "Готовый макет — ZETRONIX";
    }
    default:
      return BASE_TITLE;
  }
}

export default function App() {
  const [route, setRoute] = useState(routeOf);

  useEffect(() => {
    const onNav = () => setRoute(routeOf());
    window.addEventListener("popstate", onNav);
    window.addEventListener("hashchange", onNav);

    // SPA-переходы: внутренние "/" ссылки без перезагрузки,
    // одиночные "#x" — плавный скролл по текущей странице
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (
        !href ||
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        /^(mailto:|tel:|https?:|javascript:)/i.test(href)
      )
        return;
      e.preventDefault();
      if (href.startsWith("#")) {
        if (href.length > 1)
          document
            .querySelector(href)
            ?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      history.pushState(null, "", href);
      onNav();
    };
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onNav);
      window.removeEventListener("hashchange", onNav);
      document.removeEventListener("click", onClick);
    };
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
      ) : route.name === "template" ? (
        <TemplatePage key={route.slug} slug={route.slug} />
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
