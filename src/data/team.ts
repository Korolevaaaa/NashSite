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
    roles: ["Веб-дизайнер", "Motion-дизайнер", "Creative developer"],
    photo: "/team/georgiy-drozdov.webp",
    alt: "Георгий Дроздов — веб-дизайнер и creative developer студии ZETRONIX",
  },
];
