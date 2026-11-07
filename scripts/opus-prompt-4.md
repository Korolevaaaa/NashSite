# РОЛЬ

Ты — арт-директор студии уровня Studio Freight / BASIC / Resn, проводишь жёсткий редизайн-ревью лендинга веб-студии ZETRONIX. Это уже ТРЕТИЙ твой аудит этой страницы. Прошлые твои правки внедрены — и клиент сказал: «Очень много кривых моментов, рассинхронных, нелепых, отпугивающих». Ты несёшь ответственность за результат наравне со мной.

**Запрещено соглашаться.** Твоя задача — найти всё кривое, несинхронное и нелепое, и доказать каждую претензию пикселями со скриншотов и строками кода. Если что-то хорошо — скажи коротко «ок» и двигайся дальше, не хвали.

# КЛЮЧЕВОЙ ПОВОРОТ: АУДИТОРИЯ

Прошлые раунды мы оба сделали ошибку: дизайн получился «для программистов, которые пришли к программистам». Моноширинные индексы, ghost-цифры, реестры с hairline, technical-ledger эстетика — это красиво глазу разработчика, но **клиент сайта — владелец бизнеса** (пекарня, логистика, клиника, e-commerce, B2B-услуги). Он пришёл заявку оставить, а не восхищаться керном JetBrains Mono.

Каждое решение оценивай вопросом: «Владелец сети химчисток поймёт это за 3 секунды и захочет написать?»

Дословные требования клиента:
- «сайт должен цеплять взгляд, аккуратно, гармонично»
- «не вот эти лестницы из блоков» — портфолио-каскад со сдвигом 56px и ступенчатая полка макетов ЗАПРЕЩЕНЫ, признаны нелепыми
- «дорого, со вкусом, уникально, не шаблонно и не слопово»
- «мягко, гармонично, не гиганскими блоками, не громоздко»

# НЕПРИКОСНОВЕННО (трогать запрещено, в критике не упоминать как кандидатов на переделку)

1. Hero: 3D-робот, кинетическая сетка фона, cinematic scroll-переход, cursor-интеракции.
2. Второй блок (навигация): концепция проектора из груди робота + голографическая навигация.
3. В hero-copy разрешены только: тексты, кнопки, их расположение/дизайн, шрифты.

# СКИЛЫ, ПО КОТОРЫМ РАБОТАЕМ (твой эталон — проверяй нарушения по ним)

## taste-skill (anti-slop frontend), ключевые обязательные правила:

- **Anti-Default Discipline:** никаких AI-purple градиентов, centered hero over dark mesh, трёх равных карточек, generic glassmorphism, Inter+slate-900 дефолтов.
- **Section-Layout-Repetition Ban:** одна композиционная семья — максимум ОДИН раз на страницу. На странице ≥4 разных семьи.
- **EYEBROW RESTRAINT (самое нарушаемое):** мелкий uppercase tracking-лейбл над заголовком — МАКСИМУМ 1 на 3 секции. Сейчас у нас kicker «NN · НАЗВАНИЕ» над КАЖДОЙ секцией — это механическое нарушение правила, проверь и признай.
- **SPLIT-HEADER BAN:** «слева заголовок + справа абзац-объяснение» запрещён как дефолт. Один фокусный месседж на секцию.
- **ZIGZAG ALTERNATION CAP:** максимум 2 чередующихся image+text split подряд.
- **Cards:** только когда elevation несёт реальную иерархию. Иначе border-t/divide-y/негативное пространство. Тени — тонированные, не чёрные.
- **SHAPE CONSISTENCY LOCK:** одна шкала радиусов на страницу. Проверь: у нас chip с радиусом, кнопки pill, тайлы sharp — соблюдено ли?
- **COLOR CONSISTENCY LOCK:** один акцент на всю страницу (у нас teal #00c9d4 — проверь, не размыт ли).
- **CTA:** текст на одной строке; один лейбл на один intent (у нас «Обсудить проект» в шапке и «Рассчитать смету» в hero — разные лейблы одного intent, нарушение? оцени); контраст AA.
- **Content density:** заголовок ≤8 слов + ≤25 слов подпись + один визуальный актив ИЛИ один CTA на секцию. Спеки >5 строк — не список с hairline, а группировка/карточки/табы.
- **Длинные списки:** >5 items с divide-y — «ленивый дефолт». У нас Directions = 7 строк реестра и Services = 5 строк. Признано или надо перегруппировать? Реши.
- **Div-based fake screenshots banned.** У нас в «Готовых макетах» пустые тайлы с CSS-сеткой = по сути fake-preview. Признай нарушением и скажи чем заменить.
- **Typography:** sans display (Manrope ок), italic/bold emphasis внутри семьи, никаких mixed-family. Контраст: body 4.5:1, large 3:1.
- **Motion:** каждая анимация отвечает на вопрос «что она сообщает». Marquee — максимум 1 на страницу. Motion должен быть motivated.
- **Page Theme Lock:** одна тема, секции не инвертируются.
- **Hero discipline:** headline ≤2 строки, subtext ≤20 слов, CTA без скролла, top-padding ≤6rem, макс 4 текстовых элемента.
- **Copy self-audit:** каждая видимая строка — грамотна, без AI-штампов.
- **Mobile:** у каждой мультиколонки явный <768px fallback; тач-цели ≥44px; hover-only поведение запрещено.

## ui-ux-pro-max (приоритеты проверки):

1. Accessibility: контраст 4.5:1, focus-visible, aria, keyboard nav — CRITICAL
2. Touch: 44×44px, 8px+ spacing — CRITICAL
3. Performance: CLS <0.1, reserve space — HIGH
4. Style consistency, иконки без эмодзи — HIGH
5. Layout: mobile-first, нет горизонтального скролла — HIGH
6. Typography: base 16px, lh 1.5, семантические токены — MEDIUM
7. Animation: 150–300ms, осмысленная, reduced-motion — MEDIUM
8. Forms: видимые лейблы, ошибки у поля — MEDIUM
9. Navigation: предсказуемая, deep links — HIGH

## humanize (нейрослоп в текстах — проверь весь видимый копирайт на скринах и в content.ts):

- Бан-лист вольной интерпретации под русский: «бесшовный», «комплексный», «в современном мире», «важно отметить», «позволяет», «является», «широкий спектр», «индивидуальный подход», «качественные решения», «воплощаем идеи», «под ключ» без конкретики, «надёжный партнёр», «команда профессионалов» — типовые строительно-агентские штампы.
- Негативные параллелизмы «не X, а Y», правило трёх, мини-афоризмы в концах абзацев, тезисные открыватели, канцелярит.
- Проверь: «Более 2 лет на рынке», «20+ проектов», описания услуг, FAQ — где звучит шаблонный агентский русский, дай замену текстом.

# КОД (актуальный, из git HEAD)

Дальше идут реальные файлы. Претензии подкрепляй номерами строк/селекторами. В рекомендациях — ГОТОВЫЙ КОД (полные CSS-блоки/JSX-фрагменты, не «добавь отступов»).



## FILE: src/styles/tokens.css
```
/* Design tokens — light "blueprint" palette of the current site.
   Values are initial, not a final approved brandbook. */
@theme {
  --color-bg: #f4f4f4;
  --color-ink: #0d1117;
  --color-ink-muted: rgba(13, 17, 23, 0.65);
  --color-ink-faint: rgba(13, 17, 23, 0.28);
  --color-line: rgba(13, 17, 23, 0.12);
  --color-accent: #00c9d4;
  --color-accent-deep: #009aa0;
  --color-glow: #00ffff; /* decorative glow only — not for body text */

  --font-display: "Manrope", sans-serif;
  --font-display-latn: "Space Grotesk", "Manrope", sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Consolas", monospace;
}

:root {
  --content-max: 1440px;
  --page-gutter: clamp(20px, 4vw, 64px);

  /* runtime vars driven by JS */
  --gx: -500px;
  --gy: -500px;
}

```

## FILE: src/styles/global.css
```
@import "tailwindcss";
@import "./tokens.css";

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-body);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* keyboard access */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 4px;
}

/* ============ HERO: sticky cinematic stage ============ */

/* outer runway — progress p = scrolled fraction of this section */
.hero-section {
  position: relative;
  height: 280vh;
}

.hero-stage {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

.kinetic-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

/* ---- editorial type system ---- */
:root {
  --z-ink: #151b20;
  --z-muted: #4e5b60;
  --z-action: #006b70;
}

/* ---- hero copy ---- */
.hero-copy {
  position: absolute;
  z-index: 6;
  inset: auto var(--page-gutter) clamp(62px, 10vh, 100px);
  max-width: none;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 32px;
  /* the empty part of the strip doesn't eat pointer events */
  pointer-events: none;
  /* fade+lift driven by --hero-p; no JS re-render needed */
  opacity: calc(1 - min(1, var(--hero-p, 0) * 7));
  translate: 0 calc(var(--hero-p, 0) * -44px);
}
.hero-stage.is-copy-out .hero-copy {
  pointer-events: none;
}
.hero-intro {
  max-width: 380px;
}
.hero-kicker {
  margin: 0 0 14px;
  color: var(--z-action);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.hero-title {
  margin: 0;
  color: var(--z-ink);
  font-family: var(--font-display);
  font-size: clamp(26px, 2.5vw, 36px);
  font-weight: 500;
  line-height: 1.13;
  letter-spacing: -0.035em;
  text-wrap: balance;
}
.hero-sub {
  max-width: 34ch;
  margin-top: 12px;
  color: var(--z-muted);
  font-size: 15px;
  line-height: 1.5;
}
.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  min-width: 212px;
  /* links stay clickable inside the non-interactive strip */
  pointer-events: auto;
}
.hero-primary,
.hero-secondary {
  min-height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 0 16px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  text-decoration: none;
  border-radius: 999px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}
.hero-primary {
  color: #fff;
  background: var(--z-ink);
  border: 1px solid var(--z-ink);
}
.hero-primary:hover {
  color: #fff;
  background: var(--z-action);
  border-color: var(--z-action);
}
.hero-secondary {
  color: var(--z-ink);
  border: 1px solid rgba(21, 27, 32, 0.32);
}
.hero-secondary:hover {
  color: var(--z-ink);
  border-color: var(--z-ink);
  background: rgba(255, 255, 255, 0.5);
}
.hero-primary:focus-visible,
.hero-secondary:focus-visible,
.site-header a:focus-visible {
  outline: 3px solid var(--z-action);
  outline-offset: 3px;
}

/* ---- robot: canvas + static fallback ---- */
.robot-visual {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}
.robot-canvas,
.robot-canvas canvas {
  position: absolute;
  inset: 0;
}
.robot-canvas {
  pointer-events: none; /* gaze comes from the shared stage listener */
}
.robot-fallback {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(52vw, 340px);
  transform: translate(-38%, -50%);
  height: auto;
  user-select: none;
  transition: opacity 0.6s ease;
}
.robot-visual.is-live .robot-fallback {
  opacity: 0;
}
@media (min-width: 1200px) {
  .robot-fallback {
    transform: translate(-8%, -50%); /* approx. the GLB hero slot */
  }
}
@media (max-width: 767px) {
  .robot-fallback {
    transform: translate(-50%, -44%);
    width: min(66vw, 300px);
  }
}

/* ---- screen-space projector beam (SVG fan chest→nav) ---- */
.projector-beam {
  position: absolute;
  inset: 0;
  z-index: 6; /* above the robot canvas, below .holo-nav (z7) */
  pointer-events: none;
}
.projector-beam svg {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.12s linear;
}

/* ---- holographic navigation (end state of the transition) ---- */
.holo-nav {
  position: absolute;
  z-index: 7;
  left: 30%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  visibility: hidden;
  translate: -18px 0;
  scale: 0.96;
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    translate 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    scale 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0.7s;
}
.hero-stage.is-nav .holo-nav {
  opacity: 1;
  visibility: visible;
  translate: 0 0;
  scale: 1;
}
.holo-panel {
  position: relative;
  min-width: min(380px, 62vw);
  padding: 30px 34px;
  border: 1px solid rgba(0, 201, 212, 0.35);
  border-radius: 16px;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.75), rgba(230, 252, 253, 0.55));
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.6) inset,
    0 18px 44px rgba(0, 140, 150, 0.14),
    0 0 34px rgba(0, 201, 212, 0.12);
}
.holo-panel::before {
  /* scanline sweep — decorative only */
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: repeating-linear-gradient(
    180deg,
    rgba(0, 201, 212, 0.045) 0 1px,
    transparent 1px 5px
  );
  pointer-events: none;
}
.holo-tag {
  display: block;
  margin-bottom: 16px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--color-accent-deep);
}
.holo-list {
  display: grid;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.holo-link {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 12px 12px;
  border-radius: 10px;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--color-ink);
  transition: background 0.25s, color 0.25s, translate 0.25s;
}
.holo-link:hover {
  background: rgba(0, 201, 212, 0.12);
  translate: 4px 0;
}
.holo-idx {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--color-ink-faint);
}
.holo-arrow {
  margin-left: auto;
  font-style: normal;
  color: var(--color-accent-deep);
  opacity: 0;
  transition: opacity 0.25s, translate 0.25s;
}
.holo-link:hover .holo-arrow {
  opacity: 1;
  translate: 3px 0;
}
.holo-cta {
  display: inline-block;
  margin-top: 20px;
  padding: 13px 22px;
  border-radius: 999px;
  border: 1px solid rgba(0, 154, 160, 0.5);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--color-accent-deep);
  transition: background 0.25s, color 0.25s, box-shadow 0.3s;
}
.holo-cta:hover {
  background: var(--color-accent-deep);
  color: #fff;
  box-shadow: 0 0 24px rgba(0, 201, 212, 0.4);
}

@media (max-width: 767px) {
  .hero-section {
    height: 230vh;
  }
  .hero-copy {
    inset: 112px var(--page-gutter) auto;
    align-items: start;
    flex-direction: column;
    gap: 18px;
  }
  .hero-intro {
    max-width: 300px;
  }
  .hero-kicker {
    margin-bottom: 8px;
    font-size: 11px;
  }
  .hero-title {
    font-size: clamp(25px, 6.5vw, 32px);
  }
  .hero-sub {
    margin-top: 8px;
    font-size: 14px;
  }
  .hero-actions {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    min-width: 0;
  }
  .hero-primary,
  .hero-secondary {
    min-height: 44px;
    padding: 0 12px;
    gap: 10px;
    font-size: 13px;
  }
  .site-header__inner {
    min-height: 78px;
    flex-wrap: wrap;
    gap: 0 12px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .site-logo {
    font-size: 16px;
  }
  .site-nav {
    order: 3;
    width: 100%;
    justify-content: space-between;
    gap: 12px;
  }
  .site-nav a {
    font-size: 12px;
    padding: 8px 0;
  }
  .site-header__cta {
    min-height: 44px;
    padding: 0 10px;
    gap: 10px;
    font-size: 12px;
  }
  .holo-nav {
    left: var(--page-gutter);
    right: var(--page-gutter);
    top: auto;
    bottom: 5vh;
    transform: none;
  }
  .holo-panel {
    min-width: 0;
  }
}

/* primary button — dark, quiet, same family as hero actions */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 26px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0;
  color: #fff;
  background: var(--z-ink);
  border: 1px solid var(--z-ink);
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}
.btn:hover {
  background: var(--z-action);
  border-color: var(--z-action);
}
.btn:focus-visible {
  outline: 3px solid var(--z-action);
  outline-offset: 3px;
}
.btn-arrow {
  font-style: normal;
}
.btn--big {
  font-size: 17px;
  padding: 18px 34px;
}

/* scroll hint */
.scroll-hint {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  opacity: calc(1 - min(1, var(--hero-p, 0) * 5));
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--color-ink-faint);
  display: flex;
  align-items: center;
  gap: 12px;
}
.scroll-hint-line {
  width: 60px;
  height: 1px;
  background: var(--color-ink-faint);
  position: relative;
  overflow: hidden;
  display: inline-block;
}
.scroll-hint-line::after {
  content: "";
  position: absolute;
  inset: 0;
  width: 20px;
  background: var(--color-glow);
  animation: scan 2s linear infinite;
}
@keyframes scan {
  from { left: -20px; }
  to { left: 60px; }
}

/* anchor targets must clear the fixed header */
section[id] {
  scroll-margin-top: 84px;
}

/* ============ SITE HEADER ============ */
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  background: rgba(244, 244, 244, 0.86);
  backdrop-filter: blur(12px) saturate(1.1);
  -webkit-backdrop-filter: blur(12px) saturate(1.1);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .site-header {
    background: #f4f4f4;
  }
}
.site-header.is-solid {
  background: rgba(244, 244, 244, 0.94);
  box-shadow: 0 1px 0 rgba(21, 27, 32, 0.13);
}
.site-header__inner {
  max-width: var(--content-max);
  min-height: 72px;
  margin: 0 auto;
  padding: 0 var(--page-gutter);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}
.site-logo {
  color: var(--z-ink);
  font: 700 18px / 1 var(--font-body);
  letter-spacing: -0.035em;
  text-decoration: none;
  white-space: nowrap;
}
.site-logo span {
  color: #5b666a;
  font-weight: 400;
}
.site-nav {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 42px);
}
.site-nav a {
  padding: 12px 0;
  color: #404c50;
  font: 500 13px / 1.3 var(--font-body);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}
.site-nav a:hover {
  color: var(--z-ink);
  border-color: var(--z-action);
}
.site-header__cta {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  padding: 0 15px;
  color: var(--z-ink);
  font: 500 13px / 1 var(--font-body);
  text-decoration: none;
  white-space: nowrap;
  border: 1px solid rgba(21, 27, 32, 0.35);
  border-radius: 999px;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}
.site-header__cta:hover {
  border-color: var(--z-ink);
  background: rgba(255, 255, 255, 0.55);
}

/* ============ SCROLL REVEAL ============ */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.7, 0.3, 1);
}
.reveal.is-in {
  opacity: 1;
  transform: none;
}

/* ============ BOOT PRELOADER ============ */
.boot {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: var(--color-bg);
  display: grid;
  place-items: center;
  transition: opacity 0.6s ease, visibility 0.6s;
}
.boot.is-done {
  opacity: 0;
  visibility: hidden;
}
.boot-bar {
  height: 2px;
  background: var(--color-line);
  border-radius: 2px;
  overflow: hidden;
}
.boot-bar-fill {
  display: block;
  height: 100%;
  width: 0;
  background: var(--color-glow);
  box-shadow: 0 0 12px var(--color-glow);
  transition: width 0.25s ease;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-hint-line::after {
    animation: none;
  }
  .hero-primary,
  .hero-secondary,
  .site-header,
  .site-nav a,
  .site-header__cta {
    transition: none;
  }
  .holo-nav,
  .hero-copy {
    transition: none;
  }
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* ==============================================
   Hero v2: left column centered, wordmark right
   ============================================== */

@media (min-width: 768px) {
  .hero-copy {
    inset: auto;

    /* left edge aligned with the header's inner edge */
    left: max(
      var(--page-gutter),
      calc(
        (100% - var(--content-max)) / 2
        + var(--page-gutter)
      )
    );

    top: 50%;
    width: min(560px, 40vw);
    transform: translateY(-50%);

    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;
  }

  .hero-intro {
    max-width: none;
  }

  .hero-title {
    font-size: clamp(37px, 3.6vw, 56px);
    line-height: 1.06;
    letter-spacing: -0.045em;
  }

  .hero-kicker {
    margin-bottom: 20px;
    font-size: 12px;
  }

  .hero-sub {
    max-width: 38ch;
    margin-top: 20px;
    font-size: 16px;
    line-height: 1.55;
  }

  .hero-actions {
    flex-direction: row;
    justify-content: flex-start;
    gap: 10px;
    margin-top: 28px;
  }

  .hero-primary,
  .hero-secondary {
    min-height: 52px;
    padding: 0 17px;
    gap: 24px;
  }
}

/* compact list of studio directions under the actions */
.hero-expertise {
  margin-top: 34px;
  padding-top: 18px;
  border-top: 1px solid rgba(21, 27, 32, 0.2);
}

.hero-expertise__label {
  display: block;
  color: #4e5b60;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-expertise ul {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
}

.hero-expertise li {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.01em;
}

.hero-expertise li a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border-left: 1px solid rgba(21, 27, 32, 0.2);
  color: #151b20;
  text-decoration: none;
  transition: color 0.2s ease;
}

.hero-expertise li:first-child a {
  padding-left: 0;
  border-left: none;
}

.hero-expertise li a:hover {
  color: var(--z-action);
}

/* tablet: robot takes more relative width — narrow the column,
   stack the buttons */
@media (min-width: 768px) and (max-width: 1100px) {
  .hero-copy {
    width: min(265px, 34vw);
  }

  .hero-title {
    font-size: clamp(34px, 4vw, 42px);
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    margin-top: 20px;
  }

  .hero-primary,
  .hero-secondary {
    min-height: 48px;
  }

  .hero-expertise {
    margin-top: 22px;
  }
}

@media (max-width: 767px) {
  .site-header__inner {
    padding-top: 6px;
    padding-bottom: 6px;
  }

  .hero-copy {
    top: 124px;
    gap: 0;
  }

  .hero-sub {
    max-width: 32ch;
  }

  .hero-actions {
    margin-top: 16px;
  }

  .hero-expertise {
    margin-top: 16px;
    padding-top: 10px;
  }

  .hero-expertise ul {
    margin-top: 6px;
  }

  .hero-expertise__label,
  .hero-expertise li {
    font-size: 12px;
  }
}

/* ==============================================
   ZT system — lower page (post-hero) design layer
   ============================================== */

:root {
  --z-line-soft: rgba(13, 17, 23, 0.08);
  --z-sec-pad: clamp(88px, 9vw, 128px);
  --z-sec-pad-dense: clamp(72px, 7.5vw, 96px);
}

.zt-sec {
  padding-block: var(--z-sec-pad);
}
.zt-sec--dense {
  padding-block: var(--z-sec-pad-dense);
}
.zt-kicker {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--z-action);
}
.zt-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(32px, 3.2vw, 46px);
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: var(--z-ink);
}
.zt-lead {
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.6;
  color: var(--z-muted);
  max-width: 56ch;
}
.zt-meta {
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.06em;
  color: var(--z-muted);
}

/* latin-only display tokens (Space Grotesk has no Cyrillic) */
.latn-display {
  font-family: var(--font-display-latn);
}

/* — services: row with teal rail, no card fill — */
.svc-row {
  position: relative;
}
.svc-row::before {
  content: "";
  position: absolute;
  left: -8px;
  top: -1px;
  bottom: -1px;
  width: 2px;
  background: var(--color-accent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}
.svc-title {
  transition:
    transform 0.24s cubic-bezier(0.16, 1, 0.3, 1),
    color 0.24s ease;
}
@media (hover: hover) {
  .svc-row:hover {
    background: rgba(0, 201, 212, 0.05);
  }
  .svc-row:hover::before {
    transform: scaleY(1);
  }
  .svc-row:hover .svc-title {
    transform: translateX(4px);
    color: var(--z-action);
  }
}
@media (hover: none) {
  .svc-row:active {
    background: rgba(0, 201, 212, 0.07);
  }
}

/* — directions registry: sibling dim + outline ghosts — */
.dir-ghost {
  font-family: var(--font-mono);
  color: transparent;
  -webkit-text-stroke: 1px rgba(13, 17, 23, 0.3);
  transition:
    -webkit-text-stroke-color 0.3s ease,
    color 0.3s ease;
}
@media (hover: hover) and (pointer: fine) {
  .dir-list:hover > li:not(:hover) {
    opacity: 0.42;
  }
  .dir-row:hover .dir-ghost,
  .dir-row:focus-visible .dir-ghost {
    -webkit-text-stroke-color: var(--z-action);
  }
  .dir-row .dir-arrow {
    transition:
      border-color 0.24s ease,
      color 0.24s ease,
      transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .dir-row:hover .dir-arrow,
  .dir-row:focus-visible .dir-arrow {
    border-color: var(--z-action);
    color: var(--z-action);
    transform: translate(2px, -2px);
  }
  .dir-row .dir-name {
    background-image: linear-gradient(var(--z-action), var(--z-action));
    background-size: 0% 1.5px;
    background-position: left bottom;
    background-repeat: no-repeat;
    transition: background-size 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .dir-row:hover .dir-name,
  .dir-row:focus-visible .dir-name {
    background-size: 100% 1.5px;
  }
}

/* — portfolio cascade: each row steps right — */
@media (min-width: 768px) {
  .case {
    margin-left: calc(var(--i, 0) * 56px);
  }
}

/* — templates: blueprint tile texture — */
.tile-grid {
  background-image:
    linear-gradient(rgba(13, 17, 23, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13, 17, 23, 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* — competencies chips — */
.zt-chip {
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1;
  color: var(--z-ink);
  border: 1px solid var(--color-line);
  padding: 8px 11px;
  border-radius: 4px;
  background: transparent;
}

/* — process progress rail (geometry measured from dot centers in JS) — */
.proc-rail {
  position: absolute;
  left: 5px;
  width: 1px;
  background: var(--color-line);
}
.proc-rail > i {
  display: block;
  width: 1px;
  height: 100%;
  background: var(--color-accent);
  transform-origin: top;
  transform: scaleY(0);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.proc-dot {
  position: absolute;
  left: 0;
  top: 7px;
  width: 11px;
  height: 11px;
  border-radius: 999px;
  border: 1.5px solid var(--z-action);
  background: var(--color-bg);
  transition: background-color 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}
.proc-step[data-active="true"] .proc-dot {
  background: var(--z-action);
}
.proc-step .proc-num {
  color: var(--z-muted);
  transition: color 0.24s ease;
}
.proc-step[data-active="true"] .proc-num {
  color: var(--z-action);
}

/* — faq animated accordion — */
.faq-item summary::-webkit-details-marker {
  display: none;
}
.faq-item summary {
  list-style: none;
}
.faq-plus {
  position: relative;
  width: 20px;
  height: 20px;
  flex: none;
  transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}
.faq-plus::before,
.faq-plus::after {
  content: "";
  position: absolute;
  background: var(--z-ink);
  left: 50%;
  top: 50%;
}
.faq-plus::before {
  width: 15px;
  height: 1.5px;
  transform: translate(-50%, -50%);
}
.faq-plus::after {
  width: 1.5px;
  height: 15px;
  transform: translate(-50%, -50%);
}
.faq-item[open] .faq-plus {
  transform: rotate(45deg);
}
.faq-item[open] .faq-plus::before,
.faq-item[open] .faq-plus::after {
  background: var(--z-action);
}
.faq-body {
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .svc-row::before,
  .svc-title,
  .dir-ghost,
  .dir-row .dir-arrow,
  .dir-row .dir-name,
  .proc-rail > i,
  .proc-dot,
  .faq-plus {
    transition: none !important;
  }
  .dir-list:hover > li:not(:hover) {
    opacity: 1;
  }
}

```

## FILE: src/data/content.ts
```
/* Content ported 1:1 from the previous static site.
   Values below are UNCONFIRMED — owner must verify prices, terms,
   stats and portfolio names before publishing. */

export const CONTACT_EMAIL = "noreply@zetronix.ru";

/* Confirmed by owner 2026-11-07: 2 years on market, 20+ shipped projects
   (not only websites). Do not add client counts — not tracked. */
export const STATS = [
  { value: 2, suffix: "", label: "года на рынке" },
  { value: 20, suffix: "+", label: "сданных проектов" },
] as const;

export const SERVICES = [
  {
    id: "S-01",
    title: "Веб-разработка",
    text: "Лендинги, корпоративные сайты и веб-приложения — от проектирования до запуска.",
    price: "от 20 000 ₽",
  },
  {
    id: "S-02",
    title: "Дизайн интерфейсов",
    text: "Фирменный стиль, дизайн-системы и прототипы в Figma. Минимализм, который не выглядит шаблоном.",
    price: "от 40 000 ₽",
  },
  {
    id: "S-03",
    title: "Боты",
    text: "Telegram-боты и сценарии для продаж, поддержки и записи. От простых автоответов до AI-ассистентов.",
    price: "от 5 000 ₽",
  },
  {
    id: "S-04",
    title: "Приложения",
    text: "Мобильные и веб-приложения, Telegram Mini Apps — личные кабинеты, каталоги и сервисы. Мини-приложения от 10–15 тыс.",
    price: "от 20 000 ₽",
  },
  {
    id: "S-05",
    title: "AI-интеграции",
    text: "Персонализация и автоматизация на базе нейросетей. Ваш сайт начинает работать как ZTRX-07.",
    price: "от 30 000 ₽",
  },
] as const;

export const WORKS = [
  { name: "NEOBANK", kind: "Финтех-платформа", year: "2026" },
  { name: "ORBITAL", kind: "Marketplace спутниковых данных", year: "2025" },
  { name: "BIO/TECH", kind: "Сайт лаборатории", year: "2025" },
  { name: "AERON", kind: "Конфигуратор дронов", year: "2024" },
] as const;

/* Business directions — each entry gets its own landing page
   (hash route #/napravlenie/<slug>) for SEO and Yandex Direct. */
export const DIRECTIONS = [
  {
    slug: "internet-magaziny",
    title: "Интернет-магазины",
    text: "Каталог, корзина и оплата без магазина-комбайна. Структура заточена под поисковый трафик.",
    price: "от 40 000 ₽",
    tiers: [
      { name: "До 100 товаров", price: "от 40 000 ₽" },
      { name: "До 500 товаров + фильтры", price: "от 80 000 ₽" },
      { name: "1000+ товаров, расширенный поиск", price: "от 150 000 ₽" },
    ],
    page: {
      lead: "Проектируем и разрабатываем интернет-магазины: каталог, карточки, корзина, оплата и личный кабинет. Без перегруза лишними модулями — только то, что продаёт.",
      tasks: [
        "Каталог с фильтрами и поиском",
        "Карточка товара, корзина и оформление заказа",
        "Интеграция оплаты и доставки",
        "SEO-структура категорий и посадочных страниц",
      ],
      cta: "Обсудить магазин",
    },
  },
  {
    slug: "korporativnye-sayty",
    title: "Корпоративные сайты",
    text: "Сайт, который отвечает на вопрос «почему вы» за десять секунд и приводит заявки.",
    price: "от 100 000 ₽",
    tiers: [
      { name: "Многостраничный сайт компании", price: "от 100 000 ₽" },
      { name: "Корпоративный портал (готовое решение)", price: "от 165 000 ₽" },
      { name: "Портал, кастомная разработка", price: "от 300 000 ₽" },
    ],
    page: {
      lead: "Корпоративный сайт — это структура, тексты и дизайн, которые объясняют бизнес и ведут к контакту. Собираем под ваши разделы: услуги, кейсы, команда, документы.",
      tasks: [
        "Архитектура разделов под реальную структуру компании",
        "Дизайн-система и фирменный стиль",
        "Администрирование без программиста",
        "Формы заявок и интеграция с почтой/CRM",
      ],
      cta: "Обсудить сайт",
    },
  },
  {
    slug: "landingi",
    title: "Лендинги и промо-страницы",
    text: "Одна страница — одно предложение. Делаем под контекстную рекламу и запуски.",
    price: "от 20 000 ₽",
    tiers: [
      { name: "Лендинг + базовое SEO", price: "от 20 000 ₽" },
      { name: "Лендинг + форма заявки", price: "от 30 000 ₽" },
      { name: "Лендинг + форма записи и уведомления", price: "от 45 000 ₽" },
    ],
    page: {
      lead: "Лендинг для конкретного оффера: один экран — одна мысль — одно действие. Подходит под Яндекс Директ, таргет и запуски продуктов.",
      tasks: [
        "Структура оффера и логика экранов",
        "Дизайн под конверсию, не под картинку",
        "Скорость загрузки и мобильная версия",
        "Подключение аналитики и целей",
      ],
      cta: "Обсудить лендинг",
    },
  },
  {
    slug: "veb-servisy",
    title: "Веб-сервисы и приложения",
    text: "Личные кабинеты, панели и внутренние инструменты — когда сайта уже недостаточно.",
    price: "от 250 000 ₽",
    tiers: [
      { name: "Чат-боты и AI-помощники", price: "от 30 000 ₽" },
      { name: "Онлайн-чат, веб-сокеты", price: "от 100 000 ₽" },
      { name: "Агрегаторы и доски объявлений", price: "от 250 000 ₽" },
      { name: "Кастомный веб-сервис, MVP", price: "от 250 000 ₽" },
      { name: "Образовательные платформы", price: "от 550 000 ₽" },
    ],
    page: {
      lead: "Когда нужен не сайт, а инструмент: личные кабинеты, дашборды, конфигураторы и внутренние сервисы. Проектируем интерфейс и пишем на React/TypeScript.",
      tasks: [
        "Проектирование сценариев и прототип",
        "Frontend на React и TypeScript",
        "Интеграции с API и внутренними системами",
        "AI-модули: ассистенты, поиск, автоматизация",
        "Сложные проекты: образовательные платформы, агрегаторы и доски объявлений",
      ],
      cta: "Обсудить сервис",
    },
  },
  {
    slug: "boty",
    title: "Боты",
    text: "Telegram-боты для продаж, поддержки и записи. От автоответов до AI-ассистентов.",
    price: "от 5 000 ₽",
    tiers: [
      { name: "Простой сценарий, частые вопросы", price: "от 5 000 ₽" },
      { name: "Бот с формами и уведомлениями", price: "от 20 000 ₽" },
      { name: "AI-ассистент", price: "от 30 000 ₽" },
    ],
    page: {
      lead: "Боты, которые принимают заявки, отвечают на вопросы и записывают клиентов — пока вы занимаетесь делом. Работают в Telegram, где ваша аудитория уже живёт.",
      tasks: [
        "Сценарии продаж и поддержки",
        "Формы заявок и запись с выбором времени",
        "Уведомления вам и клиенту",
        "AI-ответы на базе ваших материалов",
      ],
      cta: "Обсудить бота",
    },
  },
  {
    slug: "prilozheniya",
    title: "Приложения",
    text: "Мобильные и веб-приложения, Telegram Mini Apps — сервис внутри мессенджера.",
    price: "от 20 000 ₽",
    tiers: [
      { name: "Telegram Mini App", price: "от 10 000 ₽" },
      { name: "Мобильное приложение", price: "от 100 000 ₽" },
      { name: "Веб-приложение", price: "от 250 000 ₽" },
    ],
    page: {
      lead: "Приложения трёх уровней: быстрые мини-аппы внутри Telegram, мобильные приложения и полноценные веб-приложения с кабинетами и интеграциями.",
      tasks: [
        "Telegram Mini Apps — каталоги, запись, заказы",
        "Мобильные приложения под iOS и Android",
        "Веб-приложения на React и TypeScript",
        "Интеграции с ботами и платежами",
      ],
      cta: "Обсудить приложение",
    },
  },
  {
    slug: "bronirovanie",
    title: "Бронирование",
    text: "Сайты с онлайн-записью: номера, столики, техника, мастер-классы. Календарь и оплата.",
    price: "от 40 000 ₽",
    tiers: [
      { name: "Простой виджет записи", price: "от 20 000 ₽" },
      { name: "Запись с календарём и уведомлениями", price: "от 40 000 ₽" },
      { name: "Полная система с оплатой", price: "от 150 000 ₽" },
    ],
    page: {
      lead: "Онлайн-запись и бронирование для отелей, ресторанов, аренды техники и мастер-классов. Клиент выбирает дату и время, вы получаете заявку — без телефонных переговоров.",
      tasks: [
        "Календарь с выбором даты и времени",
        "Уведомления в Telegram и на почту",
        "Интеграция оплаты и предоплаты",
        "Админка для управления слотами",
      ],
      cta: "Обсудить бронирование",
    },
  },
] as const;

/* Ready-made layouts for sale — vitrine is being assembled,
   entries are presentation examples until real items land. */
export const TEMPLATES = [
  { id: "T-01", name: "Лендинг студии", kind: "Одностраничный · тёмная тема" },
  { id: "T-02", name: "Витрина магазина", kind: "Каталог + карточка · светлая тема" },
  { id: "T-03", name: "Сайт услуг", kind: "Многостраничный · редакционный" },
] as const;

export const ABOUT = {
  title: "О нас",
  lead: "ZETRONIX — небольшая веб-студия. Проектируем и разрабатываем сайты, интерфейсы и AI-инструменты — без бюрократии и лишних посредников между вами и теми, кто делает работу.",
  points: [
    { title: "Малая команда", text: "Дизайн, разработка и интеграции в одном контуре" },
    { title: "Показываем процесс", text: "Промежуточные результаты, а не исчезновение до финала" },
    { title: "Цена до старта", text: "Говорим о сроках и стоимости в начале, а не после" },
  ],
} as const;

/* Roles without invented people — team intros happen on calls.
   Owner to replace with real members later. */
export const TEAM_ROLES = [
  "Проектирование и UX",
  "Дизайн интерфейсов",
  "Frontend-разработка",
  "Backend и интеграции",
  "AI-инженерия",
  "3D и моушн",
] as const;

export const COMPETENCIES = [
  { title: "Дизайн", items: ["UX-исследование", "прототипы", "дизайн-системы", "Figma"] },
  { title: "Разработка", items: ["React", "TypeScript", "Vite", "REST API", "интеграции"] },
  { title: "AI", items: ["чат-боты", "ассистенты", "поиск по данным", "автоматизация"] },
  { title: "Запуск", items: ["деплой", "аналитика", "SEO-основа", "поддержка"] },
] as const;

export const PROCESS = [
  { n: "01", title: "Знакомство", text: "Короткий созвон или переписка: цели, аудитория, ограничения." },
  { n: "02", title: "Оценка", text: "Смета и сроки до старта. Фиксируем объём — без сюрпризов потом." },
  { n: "03", title: "Дизайн", text: "Прототип и визуальная концепция. Показываем, обсуждаем, правим." },
  { n: "04", title: "Разработка", text: "Вёрстка, интеграции и наполнение. Демо-стенд для проверки." },
  { n: "05", title: "Запуск", text: "Деплой, аналитика, передача доступов. Дальше — поддержка по договорённости." },
] as const;

export const FAQ = [
  {
    q: "Сколько стоит сайт?",
    a: "Ориентиры: лендинг — от 20 000 ₽, интернет-магазин — от 40 000 ₽, корпоративный сайт — от 100 000 ₽, веб-сервис — от 250 000 ₽. Точную смету считаем после короткого брифа и фиксируем до старта.",
  },
  {
    q: "Сколько времени занимает разработка?",
    a: "Ориентировочно: лендинг — от пары недель, многостраничный сайт — дольше. Точный срок называем после оценки и не растягиваем без причины.",
  },
  {
    q: "Можно ли доработать существующий сайт?",
    a: "Да. Сначала делаем короткий аудит и говорим, что разумнее: точечные правки или переработка отдельных разделов.",
  },
  {
    q: "Что с поддержкой после запуска?",
    a: "Остаёмся на связи: мелкие правки, обновления и развитие проекта — по отдельной договорённости. Для самостоятельной работы передаём доступы и инструкции.",
  },
  {
    q: "Делаете ли страницы под Яндекс Директ?",
    a: "Да — у каждого направления есть отдельная посадочная страница. Ведение самой рекламной кампании обсуждаем отдельно.",
  },
] as const;

export const NAV_LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#portfolio", label: "Портфолио" },
  { href: "#contacts", label: "Контакты" },
] as const;

export const TICKER_ITEMS =
  "WEB-DEVELOPMENT · UI/UX DESIGN · AI INTEGRATION · BRANDING · MOTION · 3D · ";

```

## FILE: src/components/hero/HeroCopy.tsx
```
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

```

## FILE: src/components/layout/Header.tsx
```
import { useEffect, useState } from "react";
import { NAV_LINKS } from "../../data/content";

export default function Header() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${solid ? " is-solid" : ""}`}>
      <nav className="site-header__inner" aria-label="Основная навигация">
        <a className="site-logo" href="#top">
          ZETRONIX<span>.RU</span>
        </a>

        <div className="site-nav">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <a className="site-header__cta" href="#contacts">
          Обсудить проект
          <span aria-hidden="true">→</span>
        </a>
      </nav>
    </header>
  );
}

```

## FILE: src/components/layout/Footer.tsx
```
import { CONTACT_EMAIL, DIRECTIONS } from "../../data/content";

export default function Footer() {
  const linkCls =
    "inline-flex min-h-[44px] items-center text-[15px] text-[var(--z-ink)] no-underline transition-colors hover:text-[var(--z-action)] md:min-h-0 md:py-1";

  return (
    <footer className="border-t border-line px-[var(--page-gutter)] py-16 font-body text-[13px] text-[var(--z-muted)]">
      <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-[16px] font-medium tracking-[-0.01em] text-[var(--z-ink)]">
            ZETRONIX<span className="text-[var(--z-action)]">.</span>RU
          </p>
          <p className="mt-3 max-w-[30ch] text-[14px] leading-[1.65]">
            Веб-студия. Сайты, интерфейсы и AI-инструменты.
          </p>
        </div>

        <nav aria-label="Разделы сайта">
          <p className="zt-meta uppercase tracking-[0.14em]">Разделы</p>
          <ul className="mt-4 space-y-1">
            {[
              ["#services", "Услуги"],
              ["#portfolio", "Портфолио"],
              ["#process", "Как мы работаем"],
              ["#faq", "Вопросы"],
            ].map(([href, label]) => (
              <li key={href}>
                <a className={linkCls} href={href}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Направления">
          <p className="zt-meta uppercase tracking-[0.14em]">Направления</p>
          <ul className="mt-4 space-y-1">
            {DIRECTIONS.map((d) => (
              <li key={d.slug}>
                <a className={linkCls} href={`#/napravlenie/${d.slug}`}>
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Связь">
          <p className="zt-meta uppercase tracking-[0.14em]">Связь</p>
          <ul className="mt-4 space-y-1">
            <li>
              <a className={linkCls} href="#contacts">
                Обсудить проект
              </a>
            </li>
            <li>
              <a className={linkCls} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-14 flex max-w-[var(--content-max)] flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-t border-line pt-6">
        <span className="zt-meta">© 2026 ZETRONIX.RU</span>
        <span className="zt-meta">Юридическая информация и реквизиты</span>
      </div>
    </footer>
  );
}

```

## FILE: src/components/sections/SectionHead.tsx
```
export default function SectionHead({
  kicker,
  title,
  sub,
  split = false,
}: {
  kicker: string;
  title: string;
  sub?: string;
  /** split: title block left, lead right-aligned on desktop */
  split?: boolean;
}) {
  if (split) {
    return (
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="zt-kicker">{kicker}</p>
          <h2 className="zt-title mt-4">{title}</h2>
        </div>
        {sub && <p className="zt-lead md:max-w-[38ch] md:pb-1 md:text-right">{sub}</p>}
      </header>
    );
  }
  return (
    <header>
      <p className="zt-kicker">{kicker}</p>
      <h2 className="zt-title mt-4">{title}</h2>
      {sub && <p className="zt-lead mt-3">{sub}</p>}
    </header>
  );
}

```

## FILE: src/components/sections/Services.tsx
```
import { SERVICES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Services() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="services"
      ref={ref}
      className={`reveal zt-sec--dense px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          kicker="01 · Услуги"
          title="Услуги"
          sub="Полный цикл, от идеи до запуска. Сайты, боты и приложения — одна команда."
        />

        <ul className="mt-12 border-t border-line">
          {SERVICES.map((s, i) => (
            <li
              key={s.id}
              className="svc-row grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-line py-9 md:grid-cols-[72px_minmax(300px,420px)_minmax(0,44ch)_auto]"
            >
              <span className="zt-meta text-[var(--z-action)]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="svc-title font-display text-[26px] font-medium leading-tight tracking-[-0.01em] text-[var(--z-ink)]">
                {s.title}
              </h3>
              <p className="max-w-[46ch] text-[15px] leading-[1.55] text-[var(--z-muted)]">
                {s.text}
              </p>
              <p className="zt-meta whitespace-nowrap text-[var(--z-action)] md:justify-self-end">
                {s.price}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/Directions.tsx
```
import { DIRECTIONS } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Directions() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="directions"
      ref={ref}
      className={`reveal zt-sec--dense px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          kicker="02 · Направления"
          title="Направления для бизнеса"
          sub="Под каждый тип проекта — отдельная страница для поиска и рекламы."
          split
        />

        <ul className="dir-list mt-12 border-t border-line">
          {DIRECTIONS.map((d, i) => (
            <li key={d.slug} className="border-b border-line transition-opacity duration-200">
              <a
                href={`#/napravlenie/${d.slug}`}
                className="dir-row grid grid-cols-[1fr_44px] items-center gap-x-5 py-7 no-underline outline-none md:grid-cols-[72px_minmax(300px,420px)_minmax(0,44ch)_auto_48px] md:gap-x-8"
                aria-label={`${d.title} — открыть страницу`}
              >
                <span
                  aria-hidden="true"
                  className="dir-ghost col-start-1 row-start-1 mb-2 text-[28px] font-medium leading-none md:col-auto md:row-auto md:mb-0 md:text-[40px]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-start-1 row-start-2 min-w-0 md:col-auto md:row-auto">
                  <span className="dir-name block w-fit pb-1 font-display text-[22px] font-medium tracking-[-0.01em] text-[var(--z-ink)] md:text-[28px]">
                    {d.title}
                  </span>
                  <span className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-0.5 text-[13px] leading-[1.55] text-[var(--z-muted)] md:hidden">
                    <span>{d.text}</span>
                    <span className="zt-meta shrink-0 text-[var(--z-action)]">{d.price}</span>
                  </span>
                </span>
                <span className="hidden max-w-[44ch] text-[15px] leading-[1.55] text-[var(--z-muted)] md:block">
                  {d.text}
                </span>
                <span className="zt-meta hidden whitespace-nowrap text-[var(--z-action)] md:block md:justify-self-end">
                  {d.price}
                </span>
                <span className="dir-arrow col-start-2 row-span-2 row-start-1 flex h-11 w-11 items-center justify-center self-start border border-line text-[14px] text-[var(--z-ink)] md:col-auto md:row-auto md:row-span-1 md:h-12 md:w-12 md:self-center">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/Portfolio.tsx
```
import { WORKS } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Portfolio() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="portfolio"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <div className="flex items-end justify-between gap-6">
          <SectionHead
            kicker="03 · Портфолио"
            title="Портфолио"
            sub="Направления и форматы, в которых работаем. Примеры оформления, реальные кейсы покажем на созвоне."
          />
          <p className="zt-meta hidden pb-2 md:block">04 примера</p>
        </div>

        <ul className="mt-12">
          {WORKS.map((w, i) => (
            <li
              key={w.name}
              style={{ "--i": i } as React.CSSProperties}
              className="case flex flex-col gap-3 border-b border-[var(--z-line-soft)] py-9 last:border-b-0 md:flex-row md:items-baseline md:justify-between"
            >
              <div>
                <span aria-hidden="true" className="mb-5 block h-px w-16 bg-line" />
                <h3 className="latn-display text-[clamp(28px,2.8vw,40px)] font-medium leading-none tracking-[-0.01em] text-[var(--z-ink)]">
                  {w.name}
                </h3>
              </div>
              <div className="md:text-right">
                <p className="text-[15px] text-[var(--z-muted)]">{w.kind}</p>
                <p className="zt-meta mt-2 text-[11px] uppercase tracking-[0.12em]">
                  {w.year} · пример оформления
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/Templates.tsx
```
import { CONTACT_EMAIL, TEMPLATES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Templates() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="templates"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          kicker="04 · Витрина"
          title="Готовые макеты"
          sub="Готовые решения: купить и запустить быстрее, чем проект с нуля. Витрина собирается, состав уточняем."
        />

        <div className="mt-14 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {TEMPLATES.map((t, i) => (
            <article
              key={t.id}
              className={`border border-line bg-[rgba(255,255,255,0.35)] ${
                i === 1 ? "md:mt-10" : i === 2 ? "md:mt-20" : ""
              }`}
            >
              <div className="tile-grid relative h-[220px] border-b border-[var(--z-line-soft)]">
                <span className="zt-meta absolute right-4 top-4">{t.id}</span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-[20px] font-medium text-[var(--z-ink)]">
                  {t.name}
                </h3>
                <p className="mt-2 text-[14px] text-[var(--z-muted)]">{t.kind}</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Уведомите о запуске макета ${t.id}`)}`}
                  className="zt-meta mt-4 inline-flex min-h-[44px] items-center text-[var(--z-action)] underline decoration-[rgba(0,107,112,0.4)] underline-offset-4 transition-colors hover:decoration-[var(--z-action)]"
                >
                  Скоро в продаже — сообщить мне
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/About.tsx
```
import { ABOUT } from "../../data/content";
import { useInView } from "../../hooks/useInView";

export default function About() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="about"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <p className="zt-kicker">05 · О нас</p>
        <p className="mt-8 max-w-[30ch] font-display text-[clamp(28px,3vw,40px)] font-normal leading-[1.22] tracking-[-0.01em] text-[var(--z-ink)]">
          ZETRONIX — небольшая веб-студия. Проектируем и разрабатываем сайты, интерфейсы
          и AI-инструменты —{" "}
          <span className="font-medium text-[var(--z-action)]">
            без бюрократии и лишних посредников
          </span>{" "}
          между вами и теми,{" "}
          <span className="font-medium text-[var(--z-action)]">кто делает работу</span>.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-line pt-8 md:grid-cols-3">
          {ABOUT.points.map((p, i) => (
            <div key={p.title}>
              <p className="zt-meta text-[var(--z-action)]">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-[20px] font-medium text-[var(--z-ink)]">
                {p.title}
              </h3>
              <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.55] text-[var(--z-muted)]">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/Team.tsx
```
import { TEAM_ROLES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Team() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="team"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          kicker="06 · Команда"
          title="Команда"
          sub="Компактная команда без прокладок: с вами говорят те, кто делает. Знакомим лично на созвоне."
        />

        <p className="mt-12 max-w-[46ch] font-display text-[clamp(22px,2.4vw,32px)] font-medium leading-[1.35] tracking-[-0.005em] text-[var(--z-ink)]">
          {TEAM_ROLES.map((r, i) => (
            <span key={r}>
              {i > 0 && (
                <span aria-hidden="true" className="mx-3 text-[var(--z-action)]">
                  /
                </span>
              )}
              {r}
            </span>
          ))}
        </p>

        <p className="mt-8 inline-flex items-baseline gap-3 border-b border-dashed border-[rgba(13,17,23,0.2)] pb-3">
          <span className="zt-meta">слот</span>
          <span className="text-[14px] text-[var(--z-muted)]">
            имена и фото добавим сюда после знакомства — сетка не меняется
          </span>
        </p>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/Competencies.tsx
```
import { COMPETENCIES } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

export default function Competencies() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="competencies"
      ref={ref}
      className={`reveal zt-sec--dense px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHead
          kicker="07 · Компетенции"
          title="Компетенции"
          sub="Чем занимаемся каждый день. Дипломы и сертификаты покажем на созвоне."
          split
        />

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {COMPETENCIES.map((c, i) => (
            <div key={c.title} className="border-t border-line pt-6">
              <p className="zt-meta text-[var(--z-action)]">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-[24px] font-medium text-[var(--z-ink)]">
                {c.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.items.map((t) => (
                  <li key={t} className="zt-chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/Process.tsx
```
import { useEffect, useRef, useState } from "react";
import { PROCESS } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

function useActiveStep(count: number) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setActive(Number((e.target as HTMLElement).dataset.step));
          }
        }),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.slice(0, count).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [count]);
  return { refs, active };
}

export default function Process() {
  const { ref, inView } = useInView<HTMLElement>();
  const { refs, active } = useActiveStep(PROCESS.length);
  const listRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLElement>(null);

  // rail spans first→last dot centers; fill ends at the active dot center
  useEffect(() => {
    const list = listRef.current;
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!list || !rail || !fill) return;

    const dotCy = (i: number) => {
      const li = list.querySelectorAll<HTMLElement>(".proc-step")[i];
      const dot = li?.querySelector<HTMLElement>(".proc-dot");
      return li && dot ? li.offsetTop + dot.offsetTop + dot.offsetHeight / 2 : 0;
    };

    const paint = () => {
      const first = dotCy(0);
      const last = dotCy(PROCESS.length - 1);
      rail.style.top = `${first}px`;
      rail.style.height = `${Math.max(0, last - first)}px`;
      fill.style.transform = `scaleY(${(dotCy(active) - first) / Math.max(1, last - first)})`;
    };

    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active]);

  return (
    <section
      id="process"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-1 gap-12 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:gap-20">
        <div className="self-start md:sticky md:top-28">
          <SectionHead
            kicker="08 · Процесс"
            title="Как мы работаем"
            sub="Пять этапов, от знакомства до запуска. Сроки и смета фиксируются до старта."
          />
          <p className="zt-meta mt-8">
            этап {String(active + 1).padStart(2, "0")} / {String(PROCESS.length).padStart(2, "0")}
          </p>
        </div>

        <ol ref={listRef} className="relative md:pl-10">
          <span ref={railRef} aria-hidden="true" className="proc-rail hidden md:block">
            <i ref={fillRef as React.RefObject<HTMLElement>} />
          </span>
          {PROCESS.map((s, i) => (
            <li
              key={s.n}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-step={i}
              data-active={i === active}
              aria-current={i === active ? "step" : undefined}
              className="proc-step relative pb-12 last:pb-0"
            >
              <span aria-hidden="true" className="proc-dot hidden md:block" style={{ left: "-40px" }} />
              <h3 className="font-display text-[22px] font-medium text-[var(--z-ink)]">
                <span className="proc-num mr-3 font-mono text-[12px] tracking-[0.08em]">{s.n}</span>
                {s.title}
              </h3>
              <p className="mt-2 max-w-[52ch] text-[15px] leading-[1.6] text-[var(--z-muted)]">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/Faq.tsx
```
import { useRef } from "react";
import { FAQ } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import SectionHead from "./SectionHead";

function FaqItem({ q, a }: { q: string; a: string }) {
  const dRef = useRef<HTMLDetailsElement>(null);
  const bRef = useRef<HTMLDivElement>(null);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const d = dRef.current!;
    const b = bRef.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const opts: KeyframeAnimationOptions = {
      duration: 240,
      easing: "cubic-bezier(0.16,1,0.3,1)",
    };
    if (d.open) {
      if (reduce) {
        d.open = false;
        return;
      }
      b.animate({ height: [`${b.scrollHeight}px`, "0px"], opacity: [1, 0] }, opts).onfinish = () => {
        d.open = false;
      };
    } else {
      d.open = true;
      if (!reduce) {
        b.animate({ height: ["0px", `${b.scrollHeight}px`], opacity: [0, 1] }, opts);
      }
    }
  };

  return (
    <details ref={dRef} className="faq-item border-b border-line">
      <summary
        onClick={toggle}
        className="flex w-full cursor-pointer items-center justify-between gap-6 py-7 text-left font-body text-[19px] font-medium tracking-[-0.01em] text-[var(--z-ink)]"
      >
        {q}
        <span aria-hidden="true" className="faq-plus" />
      </summary>
      <div ref={bRef} className="faq-body">
        <p className="max-w-[68ch] pb-7 pr-10 text-[15px] leading-[1.6] text-[var(--z-muted)]">
          {a}
        </p>
      </div>
    </details>
  );
}

export default function Faq() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="faq"
      ref={ref}
      className={`reveal zt-sec px-[var(--page-gutter)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-1 gap-12 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:gap-20">
        <div className="self-start md:sticky md:top-28">
          <SectionHead
            kicker="09 · Вопросы"
            title="Частые вопросы"
            sub="Сроки, стоимость, поддержка и другие важные моменты."
          />
        </div>

        <div className="border-t border-line">
          {FAQ.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

```

## FILE: src/components/sections/Contacts.tsx
```
import { CONTACT_EMAIL } from "../../data/content";
import { useInView } from "../../hooks/useInView";

export default function Contacts() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="contacts"
      ref={ref}
      className={`reveal px-[var(--page-gutter)] pb-[var(--z-sec-pad)] pt-[clamp(96px,11vw,144px)] ${inView ? "is-in" : ""}`}
    >
      <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-1 items-end gap-12 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="zt-kicker">10 · Контакты</p>
          <h2 className="mt-6 font-display text-[clamp(44px,5.6vw,72px)] font-medium leading-[1.02] tracking-[-0.02em] text-[var(--z-ink)]">
            Обсудим
            <br />
            ваш проект<span className="text-[var(--z-action)]">?</span>
          </h2>
          <p className="zt-lead mt-6 max-w-[44ch]">
            Расскажите о задаче, обсудим формат и следующие шаги. Отвечаем в тот же или
            следующий рабочий день.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group mt-10 inline-flex items-center gap-4 text-[clamp(24px,2.6vw,36px)] font-medium text-[var(--z-ink)] underline decoration-[rgba(13,17,23,0.24)] decoration-1 underline-offset-[10px] transition-colors hover:decoration-[var(--z-action)]"
          >
            {CONTACT_EMAIL}
            <svg
              className="text-[var(--z-action)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
        </div>

        <dl className="zt-meta space-y-2 md:pb-3 md:text-right">
          <div>
            <dt className="inline">ответ — </dt>
            <dd className="inline text-[var(--z-ink)]">тот же или следующий рабочий день</dd>
          </div>
          <div>
            <dt className="inline">смета и сроки — </dt>
            <dd className="inline text-[var(--z-ink)]">фиксируются до старта</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

```

# СКРИНШОТЫ

Приложены: desktop 1440×1080 всех секций (rd6-*.png) + mobile 390px ключевых. Hero показан для контекста — он вне скоупа.

# ФОРМАТ ОТВЕТА

1. **ВЕРДИКТ одним абзацем**: почему текущая страница отпугивает бизнес-клиента — главная системная причина.
2. **КРИТИЧЕСКИЙ СПИСОК** — каждый пункт: `[БЛОКЕР|СЕРЬЁЗНО|ПОЛИРОВКА]` — что именно криво (со ссылкой на скрин) — почему это вредит бизнес-клиенту — какое правило скила нарушено — **готовый код фикса**.
3. **ЦЕЛЬНАЯ СИСТЕМА**: если проблема системная (а она системная — клиент говорит «рассинхрон»), предложи единый визуальный язык для секций 3+: какой ритм, какая сетка, сколько вертикального воздуха, как именно каждая секция выглядит (по одной строке-схеме на секцию). Помни: разные композиции, но ОДИН почерк; цепляет взгляд; никаких лестниц; для бизнеса, не для программистов.
4. **ЧТО ОСТАВИТЬ** — что уже работает и не трогаем.
5. Проверь нарушения eyebrow-restraint (kicker на каждой секции), content density, shape-lock, «один лейбл на intent» — по скилам механически, отметь каждое.

Думай как человек, которому заплатят только если клиент скажет «дорого и хочется позвонить». Жёстко.
