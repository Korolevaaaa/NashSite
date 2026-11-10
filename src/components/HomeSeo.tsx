import { useSeo } from "../hooks/useSeo";
import { TEAM } from "../data/team";

/** SEO-слой главной: canonical, OG и JSON-LD организации. */
export default function HomeSeo() {
  useSeo({
    description:
      "ZETRONIX — студия сайтов и цифровых продуктов. Лендинги, интернет-магазины, корпоративные сайты, боты и приложения. Разовая оплата, сайт остаётся вашим.",
    path: "/",
    title: "ZETRONIX — сайты и цифровые продукты для бизнеса",
    image: "/og.jpg",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ZETRONIX",
        url: "https://zetronix.ru",
        logo: "https://zetronix.ru/og.jpg",
        email: "noreply@zetronix.ru",
        description:
          "Студия сайтов и цифровых продуктов: разработка лендингов, интернет-магазинов, корпоративных сайтов, ботов и приложений.",
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ZETRONIX",
        url: "https://zetronix.ru",
        inLanguage: "ru",
      },
      ...TEAM.map((m) => ({
        "@context": "https://schema.org",
        "@type": "Person",
        name: m.name,
        image: `https://zetronix.ru${m.photo}`,
        jobTitle: m.roles.join(", "),
        worksFor: { "@type": "Organization", name: "ZETRONIX" },
      })),
    ],
  });
  return null;
}
