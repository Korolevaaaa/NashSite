

---
## 2026-11-07T07:58:17.026Z — scripts/opus-prompt-1.md



_usage: {"prompt_tokens":11005,"completion_tokens":8192,"total_tokens":19197,"prompt_tokens_details":{"cached_tokens":0},"completion_tokens_details":{"reasoning_tokens":8192}}_


---
## 2026-11-07T08:25:50.332Z — scripts/opus-prompt-1.md

# ВЕРДИКТ

Сначала — что уже хорошо, чтобы ты не сломал это правками:

- **Цены моно-шрифтом в #006b70** — 5.72:1 на #f4f4f4, единственный случай, где моно работает как данные, а не как декор. Не трогать.
- **Sibling-dim в «Направлениях»** — управление фокусом без тёмной заливки. Ровно то, что просил клиент. Оставить.
- **FAQ на `details/summary`** — нативная семантика и клавиатура из коробки. Оставить.
- **«Как мы работаем»: sticky + рельс** — единственная секция с пространственным нарративом. Скелет оставить.
- **Единая волосяная линия rgba(13,17,23,.12)** как единственный разделитель — никаких теней и «elevated card». Это дисциплина, не бедность.

Теперь проблемы. Цифры снял с твоих же скриншотов 1440px.

**Системные:**

1. **Десять пиков громкости подряд.** Заголовки секций: Услуги ≈96px, Направления ≈80px, Портфолио ≈96px, Макеты ≈96px, Команда ≈96px, Компетенции ≈96px, Процесс ≈80px, FAQ ≈80px, Контакты 110px. Когда всё кричит на 100%, не слышно ничего — это и есть «взгляд режет и теряется» словами клиента.
2. **Один и тот же шаблон шапки ×10:** гигант-тайтл слева → muted-лид → пустота ≈90px → волосяная линия. Композиционной разницы между секциями нет вообще, клиент это увидел раньше тебя.
3. **Три реестра подряд** (Услуги, Направления, Портфолио) с одной анатомией «индекс + имя + описание + мета». Близнецы в разном макияже.
4. **Правая половина экрана не работает:** Портфолио, О нас, Контакты, Макеты — контент прижат к левым 45–55%, справа мёртвый воздух. Асимметрия без напряжения = недогруженная полоса.
5. **Микро-контраст ниже AA:** «ПРИМЕР ОФОРМЛЕНИЯ» ≈10px в rgba(13,17,23,.35) ≈ 2.3:1; заголовки колонок футера («РАЗДЕЛЫ», «СВЯЗЬ») там же; «SCROLL». Это осмысленный текст, не декор — провал WCAG AA.
6. **Раздутые строки:** строка Услуги ≈250px высотой при ≈114px контента (тайтл 42 + 2 строки + цена). 55% строки — воздух внутри строки. 5 строк = ≈1250px скролла ни о чём.
7. **Декор громче смысла:** ghost-цифра 64px против кликабельного тайтла 28px в Направлениях (в 2.3×); T-01 64px против названия макета 20px (в 3.2×). Иерархия перевёрнута.
8. **Тупики:** «Готовые макеты» без цены и без выхода; Портфолио без действия; Команда без слотов под имена — секции заканчиваются в никуда.
9. **Тач-цели:** ссылки футера и строка «Направления» в hero ≈22–24px высотой на мобиле — меньше 44px.
10. **focus-visible не виден ни на одном скриншоте** — клавиатурный пользователь получает UA-обводку или ничего.
11. **Мера текста:** описания в Услуги ≈740px при 16px = до 90 знаков в строке, порог 75 превышен.
12. **Контакты 110px громче hero (≈64px) в 1.7×** — финал громче увертюры; email 40px при этом не читается как главная цель секции.
13. **Манифест 58px × 7 строк без единого акцента внутри** — монотонный крик, запоминаемость ноль.
14. **Стена ролей 46px без иерархии и без слотов под имена** — когда придут имена, композицию придётся ломать.
15. **Рельс процесса: 5 одинаковых пустых кружков** — нет состояния прогресса; sticky-колонка держит тайтл 80px вместо того, чтобы работать навигатором.
16. **Hero-copy:** лестница из 4 строк («Сайты и / цифровые / продукты / для бизнеса»), дубль CTA-лейбла с шапкой в одном вьюпорте, полоса «Направления» без разделителей при 14px.
17. **Текстура тайлов rgba(13,17,23,≈.05)** читается как артефакт сжатия, а не паттерн.

---

# ДИЗАЙН-СИСТЕМА НИЖНЕЙ ЧАСТИ

Ключевые решения в формате Триггер → Решение → Причина → Доказательство:

1. Клиент: «режет глаз» → тайтлы секций 96→46px, единственный пик страницы — Контакты 72px → один пик = одна кульминация → ступени шкалы 1.25–1.35, соседние уровни различимы без линейки.
2. Запрет тёмного hover → tint rgba(0,201,212,.05) + рельс 2px слева → фокус на строке без заливки карточки → контраст tint к фону ≈1.05: это свет, а не «чёрная слоповая хуйня».
3. Моно-ярлыки 2.3:1 → перевод в #4e5b60 → AA для текста ≤12px → 6.4:1 посчитано по luminance.
4. Строки 250px → padding-block 32px → строка ≈150px → 5 строк экономят ≈500px скролла.

**Токены и база (вставить как `zt-tokens.css`):**

```css
:root{
  --bg:#f4f4f4; --ink:#0d1117; --ink-2:#151b20; --muted:#4e5b60;
  --line:rgba(13,17,23,.12); --line-soft:rgba(13,17,23,.08);
  --acc-text:#006b70; --acc-deco:#00c9d4;
  --ease:cubic-bezier(.16,1,.3,1);
  --fs-mono:12px; --fs-body:16px; --fs-lead:17px;
  --sec-pad:clamp(88px,9vw,128px);
  --sec-pad-dense:clamp(72px,7.5vw,96px);
}
.zt-wrap{max-width:1440px;margin-inline:auto;padding-inline:clamp(20px,5.5vw,80px)}
.zt-sec{padding-block:var(--sec-pad)}
.zt-sec--dense{padding-block:var(--sec-pad-dense)}
.zt-kicker{font:500 var(--fs-mono)/1.2 "JetBrains Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--acc-text)}
.zt-title{font-family:"Space Grotesk",sans-serif;font-weight:500;font-size:clamp(32px,3.2vw,46px);line-height:1.08;letter-spacing:-.01em;color:var(--ink)}
.zt-lead{font:400 var(--fs-lead)/1.6 "Inter",sans-serif;color:var(--muted);max-width:56ch}
.zt-meta{font:400 var(--fs-mono)/1.4 "JetBrains Mono",monospace;color:var(--muted);letter-spacing:.06em}
:focus-visible{outline:2px solid var(--acc-text);outline-offset:3px;border-radius:2px}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
}
```

**Типографическая шкала (desktop):**

| Уровень | Кегль | Шрифт | Роль |
|---|---|---|---|
| kicker | 12 mono | JetBrains Mono, ls .14em | номер+имя секции, #006b70 |
| meta | 11–12 mono | JetBrains Mono | цены, статусы, индексы |
| body | 15–16 | Inter | описания, мера ≤62ch |
| lead | 17 | Inter, #4e5b60 | лид секции, мера ≤56ch |
| row-title | 24–28 | Space Grotesk 500 | имена строк |
| card-title | 20 | Space Grotesk 500 | тайтлы тайлов |
| sub | 32 | Space Grotesk 500 | стена ролей, email-сосед |
| section | clamp(32, 3.2vw, 46) | Space Grotesk 500 | тайтл секции |
| manifesto | clamp(28, 3vw, 40) | Space Grotesk 400 | манифест |
| display | clamp(44, 5.6vw, 72) | Space Grotesk 500 | только Контакты |
| hero | clamp(40, 4.4vw, 62) | Space Grotesk 500 | только hero |

**Иерархия внутри секции:** kicker (12 mono teal) → title (46 ink) → lead (17 muted, ≤56ch) → контент → meta (12 mono muted). Отступы: kicker→title 16px, title→lead 12px, lead→контент 48px, между строками контента — волосяная линия.

**Trade-off сдержанности (сознательно НЕ делаем):** никаких теней и elevation; никаких цветных подложек секций — воздух только через padding; никаких иконок кроме стрелки и плюса; никаких scale-ховеров текста и градиентных заголовков; никаких marquee/параллакса типографики — движение только reveal (240ms) и прогресс рельса; скругления только pill-кнопки и 4px у чипов.

**Hover ≠ touch:** все hover-эффекты обёрнуты в `@media (hover:hover)`; на таче строки дают `:active` tint rgba(0,201,212,.07).

---

# РИТМ И ПОРЯДОК

Порядок секций не меняю (SEO и воронка), модулирую плотность и шапки. Правило: две плотные подряд допустимы только при разной анатомии строк; два «воздушных» подряд обязаны различаться типом набора (манифест vs стена).

| # | Секция | Паттерн | padding-block | Шапка | Плотность |
|---|---|---|---|---|---|
| 1 | Услуги | A: строки с активным рельсом | dense 72–96 | стек слева + kicker | плотная |
| 2 | Направления | B: link-реестр, sibling-dim | dense 72–96 | сплит-строка (тайтл слева, лид справа) | плотная |
| 3 | Портфолио | C: каскад со сдвигом | 88–128 | стек + mono-счётчик справа | средняя |
| 4 | Макеты | D: лестница-полка с CTA | 88–128 | стек + mono-бейдж | средняя |
| 5 | О нас | E: манифест с акцентами + триада | 88–128 | без тайтла: манифест и есть тайтл | воздух |
| 6 | Команда | F: укрощённая стена | 88–128 | стек слева | воздух |
| 7 | Компетенции | G: матрица 2×2 с чипами | dense 72–96 | сплит-строка | плотная |
| 8 | Процесс | H: sticky + прогресс-рельс | 88–128 | sticky-колонка | средняя |
| 9 | FAQ | I: аккордеон с анимацией | 88–128 | sticky-колонка | средняя |
| 10 | Контакты | J: display + правая мета-колонка | 96–144 | kicker + display | воздух |
| 11 | Футер | K: 4 колонки | 64 | без шапки | плотная мелко |

Убираем унифицированные ≈240px padding-top сверху — секции входят на clamp-значениях из таблицы, страница теряет «пусто-пусто-таблица».

---

# СПЕКИ ПО СЕКЦИЯМ

## 1. Услуги — паттерн A «строки с активным рельсом»

Сломано: строки 250px, тайтл 42px спорит с тайтлом секции, описание 90 знаков, hover не указан после запрета заливки.
Решение: строка ≈150px, грид `[56px | 1fr | 46ch | auto]`, тайтл 26px, hover = tint 5% + рельс 2px #00c9d4 слева + сдвиг тайтла 4px. Рельс декоративный (non-text), поэтому #00c9d4 легален.

```css
.svc-row{position:relative}
.svc-row::before{content:"";position:absolute;left:0;top:-1px;bottom:-1px;width:2px;
  background:var(--acc-deco);transform:scaleY(0);transform-origin:top;
  transition:transform .24s var(--ease)}
.svc-title{transition:transform .24s var(--ease)}
@media (hover:hover){
  .svc-row:hover{background:rgba(0,201,212,.05)}
  .svc-row:hover::before{transform:scaleY(1)}
  .svc-row:hover .svc-title{transform:translateX(4px)}
}
@media (hover:none){ .svc-row:active{background:rgba(0,201,212,.07)} }
```

```tsx
<section className="zt-sec zt-sec--dense">
  <div className="zt-wrap">
    <p className="zt-kicker">01 · Услуги</p>
    <h2 className="zt-title mt-4">Услуги</h2>
    <p className="zt-lead mt-3">Полный цикл, от идеи до запуска. Сайты, боты и приложения — одна команда.</p>
    <ul className="mt-12 border-t border-[rgba(13,17,23,.12)]">
      {services.map((s, i) => (
        <li key={s.title}
          className="svc-row grid grid-cols-1 md:grid-cols-[56px_minmax(0,1fr)_minmax(0,46ch)_auto]
                     gap-x-8 gap-y-2 items-baseline py-8 md:px-6
                     border-b border-[rgba(13,17,23,.12)]">
          <span className="zt-meta text-[#006b70]">0{i + 1}</span>
          <h3 className="svc-title font-['Space_Grotesk'] text-[26px] leading-tight font-medium text-[#0d1117]">{s.title}</h3>
          <p className="text-[15px] leading-[1.55] text-[#4e5b60] max-w-[46ch]">{s.desc}</p>
          <p className="zt-meta text-[#006b70] whitespace-nowrap">{s.price}</p>
        </li>
      ))}
    </ul>
  </div>
</section>
```

## 2. Направления — паттерн B «link-реестр с sibling-dim»

Сломано: ghost 64px громче ссылки 28px; мёртвая зона ≈200px между описанием и ценой; шапка-близнец Услуги.
Решение: ghost становится контурной цифрой 40px (text-stroke 1px rgba(13,17,23,.30)) — легче тайтла; вся строка — `<a>` со stretched-семантикой; чип 48px остаётся фокус-точкой; шапка — сплит-строка.

```css
.reg:hover .reg-row{opacity:.42}
.reg-row{opacity:1;transition:opacity .2s var(--ease)}
.reg-row:hover,.reg-row:focus-visible{opacity:1}
.ghost{font-family:"JetBrains Mono",monospace;color:transparent;
  -webkit-text-stroke:1px rgba(13,17,23,.30)}
@media (hover:hover){
  .reg-row:hover .chip-arrow{border-color:var(--acc-text)}
  .reg-row:hover .chip-arrow svg{transform:translate(2px,-2px)}
}
.chip-arrow svg{transition:transform .2s var(--ease)}
```

```tsx
<section className="zt-sec zt-sec--dense">
  <div className="zt-wrap">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <p className="zt-kicker">02 · Направления</p>
        <h2 className="zt-title mt-4">Направления для бизнеса</h2>
      </div>
      <p className="zt-lead md:max-w-[38ch] md:text-right md:pb-1">Под каждый тип проекта — отдельная страница для поиска и рекламы.</p>
    </div>
    <div className="reg mt-12 border-t border-[rgba(13,17,23,.12)]">
      {dirs.map((d, i) => (
        <a key={d.slug} href={d.slug}
          className="reg-row grid grid-cols-1 md:grid-cols-[72px_minmax(0,1.05fr)_minmax(0,44ch)_auto_48px]
                     gap-x-8 gap-y-2 items-center py-7
                     border-b border-[rgba(13,17,23,.12)]">
          <span aria-hidden className="ghost text-[40px] leading-none">0{i + 1}</span>
          <h3 className="font-['Space_Grotesk'] text-[28px] leading-tight font-medium text-[#0d1117]">{d.title}</h3>
          <p className="text-[15px] leading-[1.55] text-[#4e5b60] max-w-[44ch]">{d.desc}</p>
          <p className="zt-meta text-[#006b70] whitespace-nowrap">{d.price}</p>
          <span className="chip-arrow hidden md:flex h-12 w-12 items-center justify-center
                           border border-[rgba(13,17,23,.12)] text-[#0d1117]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5"/></svg>
          </span>
        </a>
      ))}
    </div>
  </div>
</section>
```

## 3. Портфолио — паттерн C «каскад»

Сломано: третий реестр подряд; ярлык 2.3:1; правые 50% пусты.
Решение: каждая следующая строка сдвинута на 56px вправо (`--i`) — движение без блоков; волосяные линии укорочены до ширины строки; мета собрана в правую стопку (тип 15px muted + статус 11px mono **#4e5b60**, 6.4:1); шапка получает mono-счётчик справа, заполняющий пустоту. Строки не ссылки и не выглядят кликабельными — честность сохраняем.

```css
.case{--i:0}
@media (min-width:768px){ .case{margin-left:calc(var(--i) * 56px)} }
```

```tsx
<section className="zt-sec">
  <div className="zt-wrap">
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="zt-kicker">03 · Портфолио</p>
        <h2 className="zt-title mt-4">Портфолио</h2>
        <p className="zt-lead mt-3 max-w-[46ch]">Направления и форматы, в которых работаем. Примеры оформления, реальные кейсы покажем на созвоне.</p>
      </div>
      <p className="zt-meta hidden md:block pb-2">04 примера</p>
    </div>
    <ul className="mt-12">
      {cases.map((c, i) => (
        <li key={c.name} style={{ '--i': i } as React.CSSProperties}
          className="case flex flex-col md:flex-row md:items-baseline md:justify-between
                     gap-3 py-9 border-b border-[rgba(13,17,23,.08)] last:border-b-0">
          <div>
            <span aria-hidden className="block w-16 h-px bg-[rgba(13,17,23,.12)] mb-5" />
            <h3 className="font-['Space_Grotesk'] text-[clamp(28px,2.8vw,40px)] leading-none font-medium tracking-[-.01em] text-[#0d1117]">{c.name}</h3>
          </div>
          <div className="md:text-right">
            <p className="text-[15px] text-[#4e5b60]">{c.type}</p>
            <p className="zt-meta mt-2 text-[11px] uppercase tracking-[.12em] text-[#4e5b60]">Пример оформления</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
</section>
```

## 4. Готовые макеты — паттерн D «лестница-полка»

Сломано: три одинаковых карточки (slop-паттерн); 60% тайла — пустая текстура; T-01 64px громче тайтла 20px; тупик без CTA.
Решение: вертикальная лестница (0 / 40px / 80px); текстура 220px с сеткой 32px при rgba(13,17,23,.08) — теперь читается как паттерн; номер T-01 — 12px mono в углу; внизу появляется выход: ссылка-якорь на контакты min-h 44px.

```css
.tile-grid{background-image:
  linear-gradient(rgba(13,17,23,.08) 1px,transparent 1px),
  linear-gradient(90deg,rgba(13,17,23,.08) 1px,transparent 1px);
  background-size:32px 32px}
```

```tsx
<section className="zt-sec">
  <div className="zt-wrap">
    <p className="zt-kicker">04 · Витрина</p>
    <h2 className="zt-title mt-4">Готовые макеты</h2>
    <p className="zt-lead mt-3">Готовые решения: купить и запустить быстрее, чем проект с нуля. Витрина собирается, состав уточняем.</p>
    <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {templates.map((t, i) => (
        <article key={t.id}
          className={`border border-[rgba(13,17,23,.12)] bg-[rgba(255,255,255,.35)]
                      ${i === 1 ? 'md:mt-10' : i === 2 ? 'md:mt-20' : ''}`}>
          <div className="tile-grid relative h-[220px] border-b border-[rgba(13,17,23,.08)]">
            <span className="zt-meta absolute top-4 right-4">T-0{i + 1}</span>
          </div>
          <div className="p-6">
            <h3 className="font-['Space_Grotesk'] text-[20px] font-medium text-[#0d1117]">{t.title}</h3>
            <p className="mt-2 text-[14px] text-[#4e5b60]">{t.meta}</p>
            <a href="#contacts"
              className="zt-meta mt-4 inline-flex min-h-[44px] items-center text-[#006b70]
                         underline decoration-[rgba(0,107,112,.4)] underline-offset-4
                         hover:decoration-[#006b70]">
              Скоро в продаже — сообщить мне
            </a>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>
```

## 5. О нас — паттерн E «манифест с акцентами»

Сломано: 58px × 7 строк монотонно; ragged-правый край до 1370px; правые 35% пусты; принципы ниже — невидимки.
Решение: кегль clamp(28,3vw,40), max-w 30ch, две фразы-акцента в #006b70 weight 500 (5.72:1, легально для текста); принципы — триада колонок с волосяной линией сверху и mono-индексом.

```tsx
<section className="zt-sec">
  <div className="zt-wrap">
    <p className="zt-kicker">05 · О нас</p>
    <p className="mt-8 font-['Space_Grotesk'] font-normal text-[clamp(28px,3vw,40px)] leading-[1.22]
                  tracking-[-.01em] text-[#0d1117] max-w-[30ch]">
      ZETRONIX — небольшая веб-студия. Проектируем и разрабатываем сайты, интерфейсы и AI-инструменты —{' '}
      <span className="font-medium text-[#006b70]">без бюрократии и лишних посредников</span> между вами и теми,{' '}
      <span className="font-medium text-[#006b70]">кто делает работу</span>.
    </p>
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-[rgba(13,17,23,.12)] pt-8">
      {principles.map((p, i) => (
        <div key={p.title}>
          <p className="zt-meta text-[#006b70]">0{i + 1}</p>
          <h3 className="mt-3 font-['Space_Grotesk'] text-[20px] font-medium text-[#0d1117]">{p.title}</h3>
          <p className="mt-3 text-[15px] leading-[1.55] text-[#4e5b60] max-w-[36ch]">{p.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

## 6. Команда — паттерн F «укрощённая стена»

Сломано: 46px без иерархии; нет слотов под имена — композиция сломается, когда они придут.
Решение: стена до clamp(22,2.4vw,32), max-w 46ch, слэши #006b70 aria-hidden; под стеной — пунктирная строка-слот mono 12px, которая примет имена без смены сетки: сейчас это честная заглушка, позже — данные.

```tsx
<section className="zt-sec">
  <div className="zt-wrap">
    <p className="zt-kicker">06 · Команда</p>
    <h2 className="zt-title mt-4">Команда</h2>
    <p className="zt-lead mt-3 max-w-[46ch]">Компактная команда без прокладок: с вами говорят те, кто делает. Знакомим лично на созвоне.</p>
    <p className="mt-12 font-['Space_Grotesk'] font-medium text-[clamp(22px,2.4vw,32px)] leading-[1.35]
                  tracking-[-.005em] text-[#0d1117] max-w-[46ch]">
      {roles.map((r, i) => (
        <React.Fragment key={r}>
          {i > 0 && <span aria-hidden className="text-[#006b70] mx-3">/</span>}
          {r}
        </React.Fragment>
      ))}
    </p>
    <p className="mt-8 inline-flex items-baseline gap-3 border-b border-dashed
                  border-[rgba(13,17,23,.20)] pb-3">
      <span className="zt-meta">слот</span>
      <span className="text-[14px] text-[#4e5b60]">имена и фото добавим сюда после знакомства — сетка не меняется</span>
    </p>
  </div>
</section>
```

## 7. Компетенции — паттерн G «матрица 2×2 с чипами»

Сломано: четвёртый реестр; перечень в одну строку 16pxется как хвост строки, а не как список навыков.
Решение: 2×2, каждая ячейка с волосяной линией сверху; перечень — моно-чипы 12px в hairline-рамке radius 4px (светлые, не карточки).

```css
.chip{font:400 12px/1 "JetBrains Mono",monospace;color:#151b20;
  border:1px solid var(--line);padding:7px 10px;border-radius:4px;background:transparent}
```

```tsx
<section className="zt-sec zt-sec--dense">
  <div className="zt-wrap">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <p className="zt-kicker">07 · Компетенции</p>
        <h2 className="zt-title mt-4">Компетенции</h2>
      </div>
      <p className="zt-lead md:max-w-[38ch] md:text-right md:pb-1">Чем занимаемся каждый день. Дипломы и сертификаты покажем на созвоне.</p>
    </div>
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
      {competencies.map((c, i) => (
        <div key={c.area} className="border-t border-[rgba(13,17,23,.12)] pt-6">
          <p className="zt-meta text-[#006b70]">0{i + 1}</p>
          <h3 className="mt-3 font-['Space_Grotesk'] text-[24px] font-medium text-[#0d1117]">{c.area}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {c.items.map(t => <li key={t} className="chip">{t}</li>)}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>
```

## 8. Как мы работаем — паттерн H «sticky + прогресс-рельс»

Сломано: 5 одинаковых пустых кружков — нет прогресса; sticky держит тайтл 80px.
Решение: тайтл 46px; рельс получает заливку #00c9d4 (декор, non-text) по активному шагу; активная точка заливается #006b70; mono-счётчик «этап 02 / 05» в sticky-колонке обновляется — sticky начинает работать навигатором.

```css
.proc-rail{position:absolute;left:5px;top:6px;bottom:6px;width:1px;background:var(--line)}
.proc-rail>i{display:block;width:1px;height:100%;background:var(--acc-deco);
  transform-origin:top;transform:scaleY(var(--p,0));transition:transform .3s var(--ease)}
.proc-dot{width:11px;height:11px;border-radius:999px;border:1.5px solid var(--acc-text);
  background:var(--bg);transition:background-color .24s var(--ease)}
.proc-step[data-active="true"] .proc-dot{background:var(--acc-text)}
```

```tsx
// zt-motion.ts
import { useEffect, useRef, useState } from 'react';
export function useActiveStep(count: number) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      }),
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    refs.current.slice(0, count).forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, [count]);
  return { refs, active };
}
```

```tsx
function Process() {
  const { refs, active } = useActiveStep(steps.length);
  return (
    <section className="zt-sec">
      <div className="zt-wrap grid grid-cols-1 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-16">
        <div className="md:sticky md:top-28 self-start">
          <p className="zt-kicker">08 · Процесс</p>
          <h2 className="zt-title mt-4">Как мы работаем</h2>
          <p className="zt-lead mt-3">Пять этапов, от знакомства до запуска. Сроки и смета фиксируются до старта.</p>
          <p className="zt-meta mt-8">этап 0{active + 1} / 0{steps.length}</p>
        </div>
        <ol className="relative pl-10" style={{ '--p': (active + 1) / steps.length } as React.CSSProperties}>
          <span aria-hidden className="proc-rail"><i /></span>
          {steps.map((s, i) => (
            <li key={s.title} ref={el => { refs.current[i] = el; }} data-step={i} data-active={i === active}
              className="proc-step relative pb-12 last:pb-0">
              <span aria-hidden className="proc-dot absolute -left-10 top-[6px] ml-[0px]" style={{ left: '-40px' }} />
              <h3 className="font-['Space_Grotesk'] text-[22px] font-medium text-[#0d1117]">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-[#4e5b60] max-w-[52ch]">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

## 9. FAQ — паттерн I «аккордеон с анимацией»

Сломано: плюс 16px тоньше волосяной линии; зона клика не очевидна; открытие мгновенное.
Решение: summary py-7 (цель ≈76px), вопрос 19px; плюс 20px из двух баров 1.5px, поворот 45° за 240ms фирменной кривой; высота анимируется WAAPI с уважением к reduced-motion; семантика `details/summary` сохранена.

```css
summary::-webkit-details-marker{display:none}
.faq-plus{position:relative;width:20px;height:20px;flex:none;transition:transform .24s var(--ease)}
.faq-plus::before,.faq-plus::after{content:"";position:absolute;background:var(--ink-2);left:50%;top:50%}
.faq-plus::before{width:16px;height:1.5px;transform:translate(-50%,-50%)}
.faq-plus::after{width:1.5px;height:16px;transform:translate(-50%,-50%)}
details[open] .faq-plus{transform:rotate(45deg)}
.faq-body{overflow:hidden}
```

```tsx
function FaqItem({ q, a }: { q: string; a: string }) {
  const dRef = useRef<HTMLDetailsElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const d = dRef.current!, b = bRef.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const opts: KeyframeAnimationOptions = { duration: 240, easing: 'cubic-bezier(0.16,1,0.3,1)' };
    if (d.open) {
      if (reduce) { d.open = false; return; }
      b.animate({ height: [`${b.scrollHeight}px`, '0px'], opacity: [1, 0] }, opts)
        .onfinish = () => { d.open = false; };
    } else {
      d.open = true;
      if (!reduce) b.animate({ height: ['0px', `${b.scrollHeight}px`], opacity: [0, 1] }, opts);
    }
  };
  return (
    <details ref={dRef} className="border-b border-[rgba(13,17,23,.12)]">
      <summary onClick={toggle}
        className="flex w-full cursor-pointer items-center justify-between gap-6 py-7
                   text-left text-[19px] font-medium text-[#0d1117]">
        {q}<span aria-hidden className="faq-plus" />
      </summary>
      <div ref={bRef} className="faq-body">
        <p className="pb-7 pr-10 text-[15px] leading-[1.6] text-[#4e5b60] max-w-[68ch]">{a}</p>
      </div>
    </details>
  );
}
```

Шапка FAQ: sticky-колонка слева с kicker «09 · Вопросы» и тайтлом 46px (было 80) — липкость сохраняем, гиганта убираем.

## 10. Контакты — паттерн J «display + правая мета»

Сломано: 110px громче hero; правые 55% пусты; email 40px проигрывает тайтлу.
Решение: display clamp(44,5.6vw,72) — единственный пик страницы, но ниже hero-робота по суммарному весу; знак «?» в #006b70 оставить (конкретная удача: единственная цветовая точка в типографике); email 32–36px с underline-offset 10px и стрелкой; справа — mono-мета стопкой, закрывающая пустоту текстом, который уже есть в копии (ничего не выдумываю).

```tsx
<section className="zt-sec pt-[clamp(96px,11vw,144px)]">
  <div className="zt-wrap grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-end gap-12">
    <div>
      <p className="zt-kicker">10 · Контакты</p>
      <h2 className="mt-6 font-['Space_Grotesk'] font-medium text-[clamp(44px,5.6vw,72px)]
                     leading-[1.02] tracking-[-.02em] text-[#0d1117]">
        Обсудим<br />ваш проект<span className="text-[#006b70]">?</span>
      </h2>
      <p className="zt-lead mt-6 max-w-[44ch]">Расскажите о задаче, обсудим формат и следующие шаги. Отвечаем в тот же или следующий рабочий день.</p>
      <a href="mailto:noreply@zetronix.ru"
        className="group mt-10 inline-flex items-center gap-4
                   text-[clamp(24px,2.6vw,36px)] font-medium text-[#0d1117]
                   underline decoration-[rgba(13,17,23,.24)] decoration-1 underline-offset-[10px]
                   hover:decoration-[#006b70]">
        noreply@zetronix.ru
        <svg className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
          width="22" height="22" viewBox="0 0 16 16" fill="none" style={{ color: '#006b70' }}>
          <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </a>
    </div>
    <dl className="zt-meta space-y-2 md:text-right md:pb-3">
      <div><dt className="inline text-[#4e5b60]">ответ — </dt><dd className="inline text-[#151b20]">тот же или следующий рабочий день</dd></div>
      <div><dt className="inline text-[#4e5b60]">смета и сроки — </dt><dd className="inline text-[#151b20]">фиксируются до старта</dd></div>
    </dl>
  </div>
</section>
```

## 11. Футер — паттерн K

Сломано: ярлыки колонок ≈2.3:1; ссылки ≈22px по высоте на таче.
Решение: ярлыки в #4e5b60 (6.4:1); ссылки `max-md:min-h-[44px] inline-flex items-center`; остальное не трогаем — 4 колонки здесь уместны.

```tsx
<footer className="border-t border-[rgba(13,17,23,.12)] py-16">
  <div className="zt-wrap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
    {columns.map(col => (
      <nav key={col.title} aria-label={col.title}>
        <p className="zt-meta uppercase tracking-[.14em] text-[#4e5b60]">{col.title}</p>
        <ul className="mt-4 space-y-1">
          {col.links.map(l => (
            <li key={l.href}>
              <a href={l.href}
                className="inline-flex min-h-[44px] items-center md:min-h-0 md:py-1
                           text-[15px] text-[#151b20] hover:text-[#006b70]">{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    ))}
  </div>
  <div className="zt-wrap mt-14 flex flex-col md:flex-row justify-between gap-3 border-t border-[rgba(13,17,23,.12)] pt-6">
    <p className="zt-meta">© 2026 ZETRONIX.RU</p>
    <p className="zt-meta">Юридическая информация и реквизиты</p>
  </div>
</footer>
```

---

# HERO-COPY (только текст/кнопки/типографика)

Сломано: лестница 4 строк из-за колонки ≈400px; лейбл «Обсудить проект» дублируется с шапкой в одном вьюпорте — две одинаковые CTA конкурируют; полоса «Направления» без разделителей при 14px; «SCROLL» ниже AA.
Решение: колонка 600px + `text-wrap:balance` → 2 ровные строки; hero-primary меняет лейбл на конкретное действие («Рассчитать смету» — это этап 02 процесса, всё честно), secondary честно называет содержимое портфолио («Смотреть примеры», там именно примеры); направления получают вертикальные волосяные разделители и тач-высоту 44px.

```tsx
<div className="hero-copy max-w-[600px]">
  <p className="zt-kicker">Веб-студия Zetronix</p>
  <h1 className="mt-6 font-['Space_Grotesk'] font-medium text-[clamp(40px,4.4vw,62px)]
                 leading-[1.05] tracking-[-.02em] text-[#0d1117]
                 max-w-[17ch] [text-wrap:balance]">
    Сайты и цифровые продукты для бизнеса
  </h1>
  <p className="mt-6 text-[17px] leading-[1.6] text-[#4e5b60] max-w-[44ch]">
    Проектируем интерфейсы, разрабатываем сайты и подключаем AI-инструменты.
  </p>
  <div className="mt-9 flex flex-wrap gap-4">
    <a href="#contacts"
      className="inline-flex h-[52px] items-center gap-3 rounded-full bg-[#0d1117] px-7
                 text-[15px] font-medium text-[#f4f4f4] transition-colors duration-200
                 hover:bg-[#151b20]">
      Рассчитать смету
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5"/></svg>
    </a>
    <a href="#portfolio"
      className="inline-flex h-[52px] items-center gap-3 rounded-full px-7
                 border border-[rgba(13,17,23,.12)] text-[15px] font-medium text-[#0d1117]
                 transition-colors duration-200 hover:border-[rgba(13,17,23,.32)] hover:bg-[rgba(13,17,23,.04)]">
      Смотреть примеры
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: '#4e5b60' }}><path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5"/></svg>
    </a>
  </div>
  <div className="mt-12 border-t border-[rgba(13,17,23,.12)] pt-4">
    <div className="flex flex-wrap items-stretch">
      <span className="zt-meta inline-flex items-center pr-6 uppercase tracking-[.14em] text-[#4e5b60]">Направления</span>
      {['Сайты', 'Дизайн интерфейсов', 'AI и боты'].map(t => (
        <a key={t} href="#services"
          className="inline-flex min-h-[44px] items-center border-l border-[rgba(13,17,23,.12)]
                     px-5 text-[14px] text-[#151b20] hover:text-[#006b70]">{t}</a>
      ))}
    </div>
  </div>
</div>
```

Индикатор SCROLL: оставить, но `aria-hidden="true"` и цвет #4e5b60 — он декоративный дубль скролла, незачем ему проваливать контраст.

---

**Чек-лист приёмки:** ни одного тайтла секции выше 46px кроме Контакты 72px; ни одной строки выше 160px; все mono-ярлыки ≥4.5:1; все тач-цели ≥44px; hover-эффекты только внутри `@media (hover:hover)`; reveal ≤260ms с stagger 60ms и полным откатом на `prefers-reduced-motion`; пять разных композиционных паттернов (A, C, D, G, H) подтверждены визуально непохожими силуэтами. Принеси скриншоты после внедрения — буду душить дальше, но уже по другому списку.

_usage: _


---
## 2026-11-07T08:47:57.965Z — scripts/opus-prompt-2.md

## Существенные

**1. Space Grotesk не содержит кириллицы — «переключение тайтлов» не состоялось, а в смешанных строках появился второй шрифт.**
У Space Grotesk сабсеты latin / latin-ext / vietnamese. Все кириллические тайтлы («Услуги», «Как мы работаем», H1 hero) молча падают в fallback, то есть визуально остались Inter — скрин hero и section-тайтлов это подтверждает (нейтральный гротеск, никакой характерной пластики SG). Зато там, где в строке есть латиница, fallback виден как ошибка набора: стена команды («Frontend-», «Backend», «UX», «AI», «3D» набраны SG, кириллица — fallback-ом, разная ширина/апроши в одной строке) и манифест («ZETRONIX —» против остального текста). Латиница же в портфолио (NEOBANK, ORBITAL, BIO/TECH) сидит в SG и выглядит отлично — то есть шрифт работает выборочно и ломает смешанные строки.
Проверка одной строкой: `document.fonts.check('500 40px "Space Grotesk"', 'АБВ') // false`.
Фикс — развести роли: SG только для латинских дисплейных токенов, кириллическим тайтлам дать дисплейный шрифт с кириллицей (Manrope или Golos Text):

```css
:root{
  --font-display: "Manrope", system-ui, sans-serif;          /* кириллические тайтлы */
  --font-display-latn: "Space Grotesk", "Manrope", sans-serif; /* NEOBANK, ORBITAL, 01–05, T-01 */
}
.zt-title, .hero-title, .manifest, .team-wall, .contacts-display{
  font-family: var(--font-display); font-weight: 600; letter-spacing: -.02em;
}
.latn-display{ font-family: var(--font-display-latn); } /* повесить на имена проектов и ghost-цифры */
```

Из всех стеков, где рендерится кириллица, `"Space Grotesk"` убрать полностью — иначе mixed-line вернётся.

**2. Sticky-шапка полупрозрачная без blur — контент просвечивает сквозь навигацию.**
Скрины process/contacts/footer: чипы компетенций и гигантское «Обсудим ваш проект?» читаются сквозь строку лого и меню (особенно футерный скрин, где H1 72px проходит прямо по лого). Это не «воздух», это падение читаемости навигации.
Фикс:

```css
.site-header{
  background: color-mix(in srgb, var(--bg) 86%, transparent);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))){
  .site-header{ background: var(--bg); }
}
```

**3. Mobile: декоративные teal-штрихи hero лежат поверх шапки и строки навигации.**
На mobile-hero штрих пересекает строку «Услуги / Портфолио / Контакты» (тап-цели!) и ещё один выходит в правый верхний угол поверх пилюли. Декор не должен конкурировать с контролами.
Фикс:

```css
.hero{ position: relative; overflow: clip; }
.hero > .hero-art, .hero .streak{ z-index: 0; pointer-events: none; }
.site-header{ z-index: 50; }
@media (max-width: 640px){ .streak{ display: none; } } /* на 390px они всё равно не читаются как композиция */
```

**4. Процесс: геометрия рельса не сходится с точками.**
Заливка (scaleY) проходит сквозь активную точку 02 и обрывается примерно на полпути к точке 03 — читается как «мы между этапами 2 и 3». Базовая серая линия при этом продолжается на ~64px ниже последней точки 05. Оба хвоста — мимо оптики таймлайна.
Фикс (высоты от центров точек, а не от блоков):

```js
const steps = [...document.querySelectorAll('.proc-step')];
const dot = s => s.querySelector('.proc-dot');
const cy = el => el.offsetTop + el.offsetHeight / 2;
function sizeRail(){
  rail.style.top = cy(dot(steps[0])) + 'px';
  rail.style.height = (cy(dot(steps.at(-1))) - cy(dot(steps[0]))) + 'px';
  paint(active);
}
function paint(i){
  fill.style.height = (cy(dot(steps[i])) - cy(dot(steps[0]))) + 'px';
  counter.textContent = `этап 0${i + 1} / 05`;
}
```

**5. Футер обещает страницы, которых нет в IA.**
Колонка «Направления» содержит 7 ссылок, в секции «Направления» строк 5. «Приложения» дублирует «Веб-сервисы и приложения», а «Бронирование» не существует нигде на странице — это битый или фантазийный href. Плюс «Юридическая информация и реквизиты»: если за этим нет документа, ссылка ведёт в никуда.
Фикс: синхронизировать футер с секцией (5 ссылок 1:1 с row 01–05); «Бронирование» либо удалить, либо добавить строкой 06 в «Направления» + услугой — но только если это реальный оффер. Юр. ссылке дать реальный href или снять `<a>`.

## Средние

**6. Разные grid-шаблоны строк в соседних секциях + сбитые выравнивания в «Услугах».**
Замер по скринам: описание в «Услугах» стартует с x≈775, в «Направлениях» — с x≈737; индекс «01» в услугах утоплен на x≈82, тогда как ghost в направлениях стоит заподлицо с контейнером (x≈57); цена «от 20 000 ₽» заканчивается на x≈1355 при границе контейнера 1383 (висит 28px). Вертикали колонок не продолжаются из секции в секцию, левый край «гуляет». Заодно: высота строк услуг ~120px при спеке ≈150px.
Фикс — общий шаблон первых трёх колонок:

```css
@media (min-width: 1024px){
  :root{ --row-cols: 56px minmax(220px, 30%) minmax(260px, 1fr); }
  .svc-row{ display:grid; grid-template-columns: var(--row-cols) auto; column-gap:24px; min-height:150px; }
  .dir-row{ display:grid; grid-template-columns: var(--row-cols) auto 48px; column-gap:24px; }
  .svc-index, .dir-ghost{ justify-self:start; padding:0; margin:0; }
  .svc-price{ justify-self:end; }
}
```

**7. Mobile «Направления»: ghost-колонка съедает ~85px из 390 и центруется вслепую.**
Контент сжат до ~200px (описание в 4 строки), при этом контурный номер болтается по вертикали центра многострочного блока. На мобильном ghost должен быть подписью над тайтлом, а не колонкой.
Фикс:

```css
@media (max-width: 640px){
  .dir-row{ grid-template-columns: 1fr 44px; column-gap:16px; }
  .dir-ghost{ grid-column:1; grid-row:1; font-size:28px; line-height:1; margin-bottom:8px; }
  .dir-title{ grid-column:1; grid-row:2; }
  .dir-desc { grid-column:1; grid-row:3; }
  .dir-price{ grid-column:1; grid-row:4; }
  .dir-chip { grid-column:2; grid-row:2; align-self:start; }
}
```

**8. «Скоро в продаже — сообщить мне» → #contacts — обещание без механизма.**
В контактах нет ни формы, ни чекбокса «уведомить»: пользователь приходит и видит только mailto. CTA обещает действие, которого нет.
Фикс (минимальный, честный): mailto с пресетом темы по каждому макету:

```html
<a class="tpl-cta" href="mailto:noreply@zetronix.ru?subject=%D0%A3%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%B8%D1%82%D0%B5%20%D0%BE%20%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%D0%B5%20%D0%BC%D0%B0%D0%BA%D0%B5%D1%82%D0%B0%20T-01">
  Скоро в продаже — сообщить мне
</a>
```

**9. Стрелка ↗ на внутренних якорях.**
«Рассчитать смету» и «Смотреть примеры» скроллят по странице, но несут глиф внешней ссылки; тот же ↗ стоит на mailto/внешних ссылках. Семантика мотива размывается. Оставить ↗ только для mailto/external, внутренним дать → (поворот текущей иконки на 45° по часовой):

```css
.btn-internal .ico, .site-header .btn .ico{ transform: rotate(45deg); } /* ↗ → → */
```

## Мелкое / не проверено статикой

**10. dl-мета в контактах на мобильном.** Скрона 390 нет, а right-align моно-строк на 390px гарантированно даст рваные переносы. Превентивно:

```css
@media (max-width: 640px){
  .contacts-meta{ text-align:left; justify-self:start; margin-top:24px; }
  .contacts-meta dd{ max-width:32ch; }
}
```

**11. Не проверяемо по статичным скринам (пришли запись или прогони сам):** tint 5% и teal-тайтл на hover строки услуг; sibling-dim 0.42 и диагональный сдвиг чипа в направлениях; раскрытие FAQ 240ms и поворот плюса; instant-поведение при reduced-motion; min-h 44 у ссылок футера на таче. По коду верю, по приёмке — нет.

## По отступлениям

1. Tailwind-идиома вместо `.zt-*` — ок, переиспользуемые kicker/title/lead/meta оставлены верно.
2. Пилюли hero оставлены — согласен, форма фирменная; но пункт 9 выше всё равно чиним (иконки, не форма).
3. Заголовки триады — ок, это подписи к существующему тексту, не новые факты.
4. SCROLL-хинт — ок.
5. Убрал левый рельс у «Направлений» — ок, дифференциация секций читается: рельс теперь действительно принадлежит «Услугам» и «Процессу».

## Что объективно хорошо

- Портфолио: каскад 0/56/112 + волосяные линии + правая мета-стопка + латиница в Space Grotesk — единственное место, где SG работает по назначению, и выглядит это точно.
- Компетенции: моно-чипы 12px radius 4 дают секции фактуру без картотечности; матрица 2×2 с волосными линиями сверху ячейки — чисто.
- Манифест с двумя teal-фразами: акценты стоят на смысловых узлах, а не на случайных словах.

Итого: блокеров два — кириллица в дисплейном стеке и просвечивающая шапка; оба чинятся за полчаса без переверстки. Остальное — доводка геометрии и честность ссылок.

_usage: _


---
## 2026-11-07T09:09:18.293Z — scripts/opus-prompt-3.md

Принял поправку по направлениям: на полном скрине видно разделитель после 05 и начало следующих строк — 7 строк подтверждаю, футер синхронизирован, битых ссылок нет. Мой подсчёт в раунде 2 был по обрезанному скрину, снимаю замечание.

По списку_fixes: кириллица в дисплее (Manrope) единообразна, латиница только в именах портфолио; шапка непрозрачна/блюр — контент и иглы под ней не просвечивают; колонки в «Услугах» и «Направлениях» бьются по x (тайтл, описание, цена на одних координатах, колонка цены зарезервирована под чип — читается как намеренное решение); mobile-направления и словарь стрелок соответствуют договорённости.

Осталась одна проблема — ровно там, где был блокер:

1. **Process: рельса нет вообще.** На скрине process видны точки (01 контур, 02 залита, «этап 02 / 05»), но между центрами точек нет ни серой базы, ни teal-заливки 01→02. Симптом «линия исчезла полностью» после перехода на JS-замеры обычно означает, что вертикальному элементу ставят размер не по той оси: прогрессу пишется `width` (или `scaleX`), при `height: 0` рельса схлопывается в ноль. Fix:

```css
.process-list { position: relative; }
.process-rail { position: absolute; width: 2px; border-radius: 1px; background: #d6dadb; }
.process-rail__fill { position: absolute; top: 0; left: 0; width: 100%; height: 0; background: var(--teal); }
.process-dot { position: relative; z-index: 1; background: var(--bg); } /* кольцо маскирует рельсу внутри */
.process-dot--active { background: var(--teal); }
```

```js
// в колбэке ResizeObserver
const list  = document.querySelector('.process-list');
const dots  = [...list.querySelectorAll('.process-dot')];
const base  = list.getBoundingClientRect();
const c     = dots.map(d => { const r = d.getBoundingClientRect(); return r.top - base.top + r.height / 2; });
const active = dots.findIndex(d => d.classList.contains('process-dot--active'));

rail.style.top    = c[0] + 'px';
rail.style.height = (c.at(-1) - c[0]) + 'px';   // база: центр 01 → центр 05
fill.style.height = (c[active] - c[0]) + 'px';  // прогресс: height, не width
```

Плюс мелочь в том же фиксе: кольца точек полупрозрачные внутри — без `background: var(--bg)` на точке линия будет просвечивать сквозь центры колец 01/03/04/05.

Всё остальное принято. Вердикт: приёмка держится на одном пункте выше — после фикса рельсы нужен один повторный скрин секции process, дальше релиз без дополнительных условий.

Следующим приоритетом, не блокируя релиз: `prefers-reduced-motion` для анимаций рельса/точек, `aria-current="step"` на активном этапе и `contain: layout paint` на шапке с блюром для слабых GPU.

_usage: _
