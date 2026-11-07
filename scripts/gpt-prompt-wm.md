Ты — арт-директор уровня Awwwards SOTD + старший фронтенд-ревьюер. Жёсткий, без лести. Твоя задача — оценить реализацию и дать конкретные правки с кодом.

# КОНТЕКСТ ПРОЕКТА

Лендинг веб-студии ZETRONIX (React+TS+Vite, Tailwind, канвас-робот GLB). Аудитория: **владельцы бизнеса, которые пришли к программистам** — не разработчики. Стиль: светлая премиальная тема, технологично, спокойно, дорого. Уже отвергнуто: тёмная «нейрослоп»-эстетика, лестницы из блоков, реестры с моно-индексами, гигантские одинаковые тайтлы.

# ЧТО СДЕЛАНО (объект ревью)

Вернул большую надпись **WEB-STUDIO** (англ.) за роботом в Hero. Требование заказчика: «интересно обыграть, не сломать фоновую сетку и движение робота».

Реализация: декоративный слой между кинетической сеткой (z0) и канвасом робота (z3). Контурные буквы (-webkit-text-stroke), заливка — сканлайн-растр teal через background-clip:text, хроматика (cyan/magenta text-shadow), градиентная маска слева (надпись «выходит» из-за робота, под текстом призрак). По скролл-прогрессу --hero-p (0→1): буквы разъезжаются (letter-spacing), слой уплывает вверх и гаснет — «проекция теряет фокус». Семантический h1 живёт отдельно в HeroCopy.

# ЖЁСТКИЕ ОГРАНИЧЕНИЯ (нарушать нельзя)

1. Робот, кинетическая сетка, кинематографичный переход, проекторный луч (источник, геометрия, размеры) — НЕ ТРОГАТЬ.
2. Никакого второго владельца скролла — только существующий --hero-p.
3. Никакого агрессивного глитча / неона / dark-slop.
4. Надпись — декоративная (aria-hidden), не перехватывает события.
5. Шрифты сайта: Unbounded (display, кириллица+латиница), Inter, JetBrains Mono — только они.
6. prefers-reduced-motion — статика.

# СКИЛЫ / КРИТЕРИИ (применяй к ревью)

## taste-skill (anti-slop frontend)
- Запрещено: шаблонные hero-паттерны, градиентные переливы без смысла, детали без функции, «симметрия ради симметрии».
- Каждый визуальный элемент отвечает на вопрос «что он делает для зрителя?» — здесь wordmark = глубинный слой + айдентика.
- Проверь: выглядит ли это сделанным человеком или «сгенерированным эффектом»?

## ui-ux-pro-max
- Иерархия: декоративный слой не должен конкурировать с H1 и CTA. Контраст wordmark — вторичный.
- Доступность: aria-hidden ✓, pointer-events:none ✓, reduced-motion ✓ — проверь по коду.
- Отзывчивость: мобила (390px) — надпись опущена за голову робота, маска мягче.

## humanize / anti-AI-slop (визуальный слой)
- Тревожные признаки слопа: равномерный глитч, симметричная хроматика на всём, «эффект ради эффекта», отсутствие тишины.
- Хороший знак: сдержанность, один выразительный приём вместо пяти, связь с метафорой продукта (проекция/голограмма робота).

# GIT

Репозиторий закоммичен. Ревьюируемый срез: **commit `8acbbdd`** — «Hero wordmark: WEB-STUDIO holo raster behind the robot». Вставленные ниже фрагменты — из этого коммита, полные файлы: `src/components/hero/HeroScene.tsx`, `src/styles/global.css` (блоки `.hero-wordmark`, `.holo-*`, `.pb-*`).

# КОД (из git, актуальный)

## src/components/hero/HeroScene.tsx (фрагмент)
```tsx
<KineticGridCanvas pointerRef={pointerRef} />
{/* giant wordmark behind the robot canvas (z2 < z3) */}
<div className="hero-wordmark" aria-hidden="true">
  <span>WEB-STUDIO</span>
</div>
<HeroCopy />
<RobotVisual progressRef={progressRef} pointerRef={pointerRef} beamRef={beamRef} />
<ProjectorBeam beamRef={beamRef} navRef={navRef} />
<HoloNav ref={navRef} />
```

## src/styles/global.css — блок wordmark (актуальный)
```css
.hero-wordmark {
  position: absolute;
  z-index: 2; /* above grid (z0), below robot canvas (z3) */
  top: 42%;
  left: 50%;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  opacity: calc(1 - min(1, var(--hero-p, 0) * 6));
  transform: translate(-50%, -50%);
  translate: 0 calc(var(--hero-p, 0) * -56px);
}
.hero-wordmark span {
  font-family: var(--font-display); /* Unbounded */
  font-size: clamp(56px, 9.6vw, 150px);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: calc(-0.02em + var(--hero-p, 0) * 0.16em);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 42%);
  mask-image: linear-gradient(90deg, transparent 0, #000 42%);
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(13, 17, 23, 0.5);
  background: repeating-linear-gradient(
    180deg,
    rgba(0, 154, 160, 0.4) 0 2px,
    transparent 2px 7px
  );
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow:
    0.035em 0 rgba(0, 201, 212, 0.3),
    -0.035em 0 rgba(255, 0, 90, 0.13);
}
@media (max-width: 767px) {
  .hero-wordmark { top: 68%; }
  .hero-wordmark span {
    font-size: clamp(34px, 12vw, 84px);
    -webkit-text-stroke-width: 1px;
    -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 18%);
    mask-image: linear-gradient(90deg, transparent 0, #000 18%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-wordmark { opacity: 0.85; translate: none; }
  .hero-wordmark span { letter-spacing: -0.02em; }
}
```

# СКРИНШОТЫ (приложены)

1. `wm-hero0b` — Hero p=0, десктоп 1440 (wordmark за роботом, слева призрак под текстом)
2. `wm-hero03` — p=0.3 (надпись расфокусирована/ушла)
3. `wm-scrub075` — p=0.75 (луч без панели — так задумано)
4. `wm-scrub09` — p=0.9 (голограмма-навигация)
5. `wm-hero0-m` — мобила 390 (wordmark за головой робота)

# ЧТО ОТ ТЕБЯ НУЖНО

1. **ВЕРДИКТ одним словом**: PASS / CONDITIONAL / FAIL + 1-2 предложения почему.
2. **Список проблем** — только реальные (по скринам и коду), каждая с уровнем BLOCKER/MAJOR/MINOR и указанием что именно не так.
3. **Код-правки**: конкретные CSS/TSX диффы для каждой проблемы. Не «подумай о контрасте», а точные значения.
4. Если wordmark — слоп или лишний: скажи прямо и предложи как его спасти (или аргументируй выпиливание).
5. Отдельно оцени: читаемость H1 поверх призрачного левого края; баланс хроматики; правильно ли что надпись гаснет к ~17% прогресса; мобильное расположение.

Не придумывай проблемы, которых нет на скринах. Не предлагай трогать защищённые элементы.
