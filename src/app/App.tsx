import { useEffect, useState } from "react";
import Boot from "../components/Boot";
import Header from "../components/layout/Header";
import MobileChrome from "../components/mobile/MobileChrome";
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
import DirectionPage, { NichePage } from "../components/pages/DirectionPage";
import StorefrontAdmin from "../components/pages/StorefrontAdmin";
import HomeSeo from "../components/HomeSeo";
import CasesPage from "../components/pages/CasesPage";
import CasePage from "../components/pages/CasePage";
import BlogPage from "../components/pages/BlogPage";
import BlogPostPage from "../components/pages/BlogPostPage";
import TemplatePage from "../components/pages/TemplatePage";
import TemplatesPage from "../components/pages/TemplatesPage";
import NapravleniePage from "../components/pages/NapravleniePage";
import PartnerPage from "../components/pages/PartnerPage";
import { PrivacyPage, OfferPage } from "../components/pages/LegalPage";
import LeadModal from "../components/LeadModal";
import PartnerBadge from "../components/PartnerBadge";
import { activePartner, captureRef } from "../utils/refSource";
import { CASES } from "../data/cases";
import { POSTS } from "../data/blog";
import { TEMPLATES } from "../data/templates";
import { DIRECTIONS, NICHES } from "../data/content";

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
  | { name: "partner" }
  | { name: "privacy" }
  | { name: "oferta" }
  | { name: "direction"; slug: string }
  | { name: "directions" }
  | { name: "niche"; slug: string }
  | { name: "cases" }
  | { name: "case"; slug: string }
  | { name: "blog" }
  | { name: "post"; slug: string }
  | { name: "template"; slug: string }
  | { name: "templates" };

function routeOf(): Route {
  const p = window.location.pathname;
  const h = window.location.hash;
  // legacy: /#/blog/x → /blog/x (stарые ссылки и закладки)
  if (p === "/" && h.startsWith("#/")) {
    history.replaceState(null, "", h.slice(1));
    return routeOf();
  }
  if (p === "/admin") return { name: "admin" };
  if (p === "/partner") return { name: "partner" };
  if (p === "/privacy") return { name: "privacy" };
  if (p === "/oferta") return { name: "oferta" };
  if (p === "/cases") return { name: "cases" };
  if (p === "/blog") return { name: "blog" };
  if (p === "/templates") return { name: "templates" };
  if (p === "/napravlenie") return { name: "directions" };
  let m = p.match(/^\/case\/([\w-]+)/);
  if (m) return { name: "case", slug: m[1] };
  m = p.match(/^\/blog\/([\w-]+)/);
  if (m) return { name: "post", slug: m[1] };
  m = p.match(/^\/napravlenie\/([\w-]+)/);
  if (m) return { name: "direction", slug: m[1] };
  m = p.match(/^\/dlya\/([\w-]+)/);
  if (m) return { name: "niche", slug: m[1] };
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
    case "niche": {
      const n = NICHES.find((x) => x.slug === r.slug);
      return n ? `${n.title} — разработка от ZETRONIX` : "Ниша — ZETRONIX";
    }
    case "directions":
      return "Направления разработки — цены и примеры | ZETRONIX";
    case "templates":
      return "Готовые сайты и макеты — купить от 20 000 ₽ | ZETRONIX";
    case "cases":
      return "Кейсы — ZETRONIX";
    case "case": {
      const c = CASES.find((x) => x.slug === r.slug);
      return c
        ? (c.seoTitle ?? `${c.title || c.name} — кейс ZETRONIX`)
        : "Кейс — ZETRONIX";
    }
    case "blog":
      return "Блог — ZETRONIX";
    case "partner":
      return "Кабинет партнёра — ZETRONIX";
    case "privacy":
      return "Политика конфиденциальности — ZETRONIX";
    case "oferta":
      return "Публичная оферта — ZETRONIX";
    case "post": {
      const p = POSTS.find((x) => x.slug === r.slug);
      return p ? (p.seoTitle ?? `${p.title} — ZETRONIX`) : "Статья — ZETRONIX";
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
  const [partner] = useState(() => {
    captureRef();
    return activePartner();
  });
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadContext, setLeadContext] = useState("Обсудить проект");

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
      if (!href || a.target === "_blank" || a.hasAttribute("download")) return;
      // mailto-CTA → лид-форма (источник прикрепляется автоматически)
      if (/^mailto:/i.test(href)) {
        e.preventDefault();
        const label = a.textContent?.trim() ?? "";
        setLeadContext(label && !label.includes("@") ? label : "Обсудить проект");
        setLeadOpen(true);
        return;
      }
      if (/^(tel:|https?:|javascript:)/i.test(href)) return;
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
      // in-page anchors on subpages (/napravlenie#otrasli) scroll to target
      const h = window.location.hash;
      if (h.length > 1) {
        requestAnimationFrame(() => {
          document
            .querySelector(h)
            ?.scrollIntoView({ behavior: "smooth" });
        });
      } else {
        window.scrollTo(0, 0);
      }
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
      {route.name !== "admin" && route.name !== "partner" && <MobileChrome />}
      {route.name === "admin" ? (
        <StorefrontAdmin />
      ) : route.name === "partner" ? (
        <PartnerPage />
      ) : route.name === "privacy" ? (
        <PrivacyPage />
      ) : route.name === "oferta" ? (
        <OfferPage />
      ) : route.name === "direction" ? (
        <DirectionPage slug={route.slug} />
      ) : route.name === "niche" ? (
        <NichePage slug={route.slug} />
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
      ) : route.name === "templates" ? (
        <TemplatesPage />
      ) : route.name === "directions" ? (
        <NapravleniePage />
      ) : (
        <main>
          <HomeSeo />
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
      {partner && route.name !== "admin" && route.name !== "partner" && (
        <PartnerBadge partner={partner} />
      )}
      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        context={leadContext}
      />
    </>
  );
}
