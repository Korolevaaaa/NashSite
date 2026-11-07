const EXPERTISE = [
  { label: "Сайты", href: "#services" },
  { label: "Дизайн интерфейсов", href: "#services" },
  { label: "AI и боты", href: "#services" },
];

export default function HeroCopy() {
  return (
    <div className="hero-copy">
      <div className="hero-intro">
        <p className="hero-kicker">Веб-студия ZETRONIX</p>

        <h1 className="hero-title">Сайты и цифровые продукты для бизнеса</h1>

        <p className="hero-sub">
          Проектируем интерфейсы, разрабатываем сайты и подключаем AI-инструменты.
        </p>
      </div>

      <div className="hero-actions">
        <a className="hero-primary" href="#contacts">
          Рассчитать смету
          <span aria-hidden="true">→</span>
        </a>

        <a className="hero-secondary" href="#portfolio">
          Смотреть примеры
          <span aria-hidden="true">→</span>
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
