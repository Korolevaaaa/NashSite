/* Сотрудники студии — карточки в секции «Команда» + Person JSON-LD.
   Фото: public/team/<slug>.webp (4:5, светлый фон, charcoal-свитер). */
export interface TeamMember {
  slug: string;
  name: string;
  roles: readonly string[];
  photo: string;
  alt: string;
}

export const TEAM: TeamMember[] = [
  {
    slug: "georgiy-drozdov",
    name: "Георгий Дроздов",
    roles: ["Веб-дизайнер", "Motion-дизайнер", "Frontend-разработчик", "Creative developer"],
    photo: "/team/georgiy-drozdov.webp",
    alt: "Георгий Дроздов — веб-дизайнер и frontend-разработчик студии ZETRONIX",
  },
  {
    slug: "asylzhan-akhunzhanov",
    name: "Асылжан Ахунджанов",
    roles: ["Full-stack разработчик"],
    photo: "/team/asylzhan-akhunzhanov.webp",
    alt: "Асылжан Ахунджанов — full-stack разработчик студии ZETRONIX",
  },
  {
    slug: "ivan-zyryanov",
    name: "Иван Зырянов",
    roles: ["Backend-разработчик"],
    photo: "/team/ivan-zyryanov.webp",
    alt: "Иван Зырянов — backend-разработчик студии ZETRONIX",
  },
];
