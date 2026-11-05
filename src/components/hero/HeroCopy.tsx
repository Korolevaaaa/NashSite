export default function HeroCopy() {
  return (
    <>
      {/* headline card */}
      <aside className="glass float-a order-1 w-[min(88vw,380px)] text-center lg:absolute lg:left-[clamp(16px,5vw,90px)] lg:top-1/2 lg:z-[6] lg:order-none lg:max-w-[340px] lg:-translate-y-[58%] lg:text-left">
        <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-accent-deep">
          {"// DIGITAL AGENCY"}
        </p>
        <h1 className="font-display text-[clamp(26px,2.6vw,34px)] font-bold leading-[1.12] tracking-[-0.01em]">
          Проектируем
          <br />
          цифровое{" "}
          <em className="bg-gradient-to-r from-accent-deep to-glow bg-clip-text not-italic text-transparent">
            будущее
          </em>
        </h1>
        <p className="mt-3.5 hidden text-[13.5px] leading-[1.55] text-ink-muted md:block">
          Сайты, интерфейсы и AI-продукты, которые выглядят как технологии
          завтрашнего дня — и продают сегодня.
        </p>
      </aside>

      {/* CTA card */}
      <aside className="glass float-b order-3 w-[min(88vw,380px)] text-center lg:absolute lg:right-[clamp(16px,5vw,90px)] lg:top-1/2 lg:z-[6] lg:order-none lg:max-w-[340px] lg:-translate-y-[42%] lg:text-left">
        <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-accent-deep">
          {"// START PROJECT"}
        </p>
        <p className="text-[13.5px] leading-[1.55] text-ink-muted">
          Обсудим задачу за 15 минут. Прототип первого экрана — бесплатно.
        </p>
        <a className="btn" href="#contacts">
          <span>Заказать сайт</span>
          <i className="btn-arrow">→</i>
        </a>
        <p className="mt-3.5 font-mono text-[10px] tracking-[0.1em] text-ink-faint">
          от 120 000 ₽ · срок от 2 недель
        </p>
      </aside>
    </>
  );
}
