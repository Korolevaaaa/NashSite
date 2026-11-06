export default function HeroCopy() {
  return (
    <div className="hero-copy">
      <div className="hero-intro">
        <p className="hero-kicker">Веб-студия ZETRONIX</p>
        <h1 className="hero-title">Сайты и цифровые решения для бизнеса</h1>
        <p className="hero-sub">От идеи и дизайна до разработки и запуска.</p>
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
    </div>
  );
}
