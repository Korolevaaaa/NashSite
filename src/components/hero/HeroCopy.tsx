import { ArrowUpRight } from "../ui/icons";

const EXPERTISE = [
  { label: "Сайты", href: "#services" },
  { label: "Дизайн интерфейсов", href: "#services" },
  { label: "AI и боты", href: "#services" },
];

export default function HeroCopy() {
  return (
    <div className="hero-copy">
      <div className="hero-intro">
        <p className="hero-status" role="status">
          <span className="hero-status__dot" aria-hidden="true" />
          Открыты для новых проектов
        </p>

        <h1 className="hero-title">
          Сайты и{" "}
          <span className="whitespace-nowrap md:whitespace-normal">цифровые продукты</span>{" "}
          <span className="whitespace-nowrap md:whitespace-normal">для бизнеса</span>
        </h1>

        <p className="hero-sub">
          Проектируем интерфейсы, разрабатываем сайты и подключаем{" "}
          <span className="whitespace-nowrap">AI-инструменты</span>.
        </p>
      </div>

      <div className="hero-actions" data-hero-cta>
        <a className="hero-primary" href="/#contacts">
          Обсудить проект
          <ArrowUpRight size={15} weight="bold" />
        </a>

        <a className="hero-secondary" href="/#cases">
          <span className="md:hidden">Примеры</span>
          <span className="hidden md:inline">Смотреть примеры</span>
          <ArrowUpRight size={15} weight="regular" />
        </a>
      </div>

      <nav className="hero-expertise" aria-label="Направления работы">
        <span className="hero-expertise__label">Направления</span>
        <ul>
          {EXPERTISE.map((e) => (
            <li key={e.label}>
              <a href={e.href}>{e.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
