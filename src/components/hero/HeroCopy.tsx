export default function HeroCopy() {
  return (
    <div className="hero-copy">
      <div className="hero-intro">
        <p className="hero-kicker">Веб-студия ZETRONIX</p>

        <h1 className="hero-title">
          Сайты и цифровые продукты для бизнеса
        </h1>

        <p className="hero-sub">
          Проектируем интерфейсы, разрабатываем сайты и подключаем
          AI-инструменты.
        </p>
      </div>

      <div className="hero-actions">
        <a className="hero-primary" href="#contacts">
          Обсудить проект
          <span aria-hidden="true">↗</span>
        </a>

        <a className="hero-secondary" href="#portfolio">
          Смотреть работы
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="hero-expertise" aria-label="Направления работы">
        <span className="hero-expertise__label">Направления</span>
        <ul>
          <li>Сайты</li>
          <li>Дизайн интерфейсов</li>
          <li>AI и боты</li>
        </ul>
      </div>
    </div>
  );
}
