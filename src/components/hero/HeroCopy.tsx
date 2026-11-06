export default function HeroCopy() {
  return (
    <div className="hero-copy">
      <p className="hero-tag">{"// WEB-STUDIO ZETRONIX"}</p>
      <h1 className="hero-title">
        Проектируем{" "}
        <em className="bg-gradient-to-r from-accent-deep to-glow bg-clip-text not-italic text-transparent">
          цифровое будущее
        </em>
      </h1>
      <p className="hero-sub">
        Сайты, интерфейсы, боты и AI-автоматизация — от идеи до запуска.
      </p>
      <div className="hero-actions">
        <a className="btn" href="#contacts">
          <span>Обсудить проект</span>
          <i className="btn-arrow">→</i>
        </a>
        <a className="hero-secondary" href="#portfolio">
          Смотреть работы
        </a>
      </div>
    </div>
  );
}
