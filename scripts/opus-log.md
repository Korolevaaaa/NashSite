

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


---
## 2026-11-07T09:30:54.691Z — scripts/opus-prompt-4.md

# ВЕРИКТ

Страница отпугивает не деталями, а голосом: она разговаривает с владельцем химчисток языком внутренней спецификации студии. Десять секций собраны из трёх одинаковых приёмов — моно-кикер, дублирующий заголовок («01 · УСЛУГИ» → «Услуги»), реестровая строка с hairline и моно-индексом, и отложенное доказательство («реальные кейсы покажем на созвоне», «витрина собирается», «сетка не меняется»). Бизнес-клиент видит не оферту, а черновик внутреннего документа: цены — самым нечитаемым кеглем на странице (12px mono), доказательств ноль, вместо портфолио — лестница из названий, вместо витрины — пустые тайлы и признание «состав уточняем». «Рассинхрон», который чувствует клиент, — это отсутствие ритма: секции не чередуют плотность и воздух по логике, а просто повторяют один и тот же ledger-блок с произвольными паддингами (`zt-sec` / `zt-sec--dense` без системы). Плюс два самоубийственных артефакта: контакт `noreply@` и плашка «слот … сетка не меняется» в продакшене.

---

# КРИТИЧЕСКИЙ СПИСОК

### 1. [БЛОКЕР] Контактный email — `noreply@zetronix.ru`
Скрин Contacts + Footer + Templates: главный CTA страницы — `mailto:noreply@zetronix.ru`. «Noreply» буквально означает «не отвечай». Владелец пекарни, который решился написать, отправляет письмо в ящик-пустышку. Это не дизайн, это потерянная выручка на каждом CTA.
Правило: ui-ux-pro-max §9 (navigation/CTA предсказуемость) + copy self-audit.
Фикс (`src/data/content.ts`):
```ts
// Владелец подтверждает рабочий ящик ДО деплоя. noreply в продакшене = потерянные лиды.
export const CONTACT_EMAIL = "hello@zetronix.ru";
```
И во всех mailto добавь тему, чтобы письмо не падало пустым (`Contacts.tsx`, `Templates.tsx`):
```tsx
href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Заявка с сайта zetronix.ru")}`}
```

### 2. [БЛОКЕР] Портфолио-каскад («лестница из блоков») — запрещён клиентом дословно
Скрин Portfolio: NEOBANK на x≈57, ORBITAL на x≈113, BIO/TECH на x≈169 — ступени по 56px. Клиент сказал «не вот эти лестницы» — и лестница осталась в коде.
Код-пруф: `global.css`
```css
@media (min-width: 768px) {
  .case { margin-left: calc(var(--i, 0) * 56px); }
}
```
+ `Portfolio.tsx` `style={{ "--i": i }}`. Плюс тик-штрих `h-px w-16 bg-line` над каждым именем — немотивированная риска, и моно-счётчик «04 примера» справа.
Правило: прямое требование клиента + Section-Layout-Repetition Ban (третья секция подряд в семье «реестровые строки»).
Фикс — убрать каскад, перейти на честную сетку 2×2 с плоскими тонированными обложками (НЕ fake-скриншоты; слоты под реальные снимки, `aspect-ratio` резервирует место → CLS 0):
```css
/* global.css: УДАЛИТЬ блок .case margin-left и .tile-grid */
.case-grid { display: grid; grid-template-columns: 1fr; gap: 32px; margin-top: 56px; }
@media (min-width: 768px) { .case-grid { grid-template-columns: 1fr 1fr; gap: 44px 32px; } }
.case-card__cover {
  aspect-ratio: 4 / 3;               /* резерв под реальный снимок, CLS = 0 */
  border-radius: var(--r-card);
  background: var(--cover, rgba(0, 201, 212, 0.10));
  display: grid; place-items: center;
}
.case-card:nth-child(2) .case-card__cover { --cover: rgba(21, 27, 32, 0.06); }
.case-card:nth-child(3) .case-card__cover { --cover: rgba(0, 107, 112, 0.10); }
.case-card:nth-child(4) .case-card__cover { --cover: rgba(21, 27, 32, 0.10); }
.case-card__mark { font-size: clamp(28px, 3vw, 44px); letter-spacing: -0.02em; color: var(--z-ink); opacity: .85; }
.case-card__meta { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; margin-top: 14px; }
.case-card__title { font-size: 18px; font-weight: 600; color: var(--z-ink); }
.case-card__kind  { font-size: 14px; color: var(--z-muted); }
.case-card__year  { margin-left: auto; font-size: 13px; color: var(--z-muted); font-variant-numeric: tabular-nums; }
```
```tsx
<ul className="case-grid">
  {WORKS.map((w) => (
    <li key={w.name} className="case-card">
      {/* НЕДЕЛЯ ВЛАДЕЛЬЦУ: вставить <img src={w.shot} alt={`${w.name} — ${w.kind}`} /> внутрь cover */}
      <div className="case-card__cover" aria-hidden="true">
        <span className="case-card__mark latn-display">{w.name}</span>
      </div>
      <div className="case-card__meta">
        <h3 className="case-card__title latn-display">{w.name}</h3>
        <p className="case-card__kind">{w.kind}</p>
        <p className="case-card__year">{w.year}</p>
      </div>
    </li>
  ))}
</ul>
```
Сабзаголовок заменить с «примеры оформления, реальные кейсы покажем на созвоне» на: «Четыре формата, в которых мы сильнее всего. Полные версии с цифрами — на первом созвоне.»

### 3. [БЛОКЕР] «Готовые макеты»: ступенчатая полка + fake-тайлы + внутренний статус в продакшене
Скрин Templates: карточки сдвинуты `md:mt-10 / md:mt-20` (вторая запрещённая клиентом лестница), тайлы 220px — пустая CSS-сетка (div-based fake preview), подзаголовок публикует внутренний статус: «Витрина собирается, состав уточняем». CTA «Скоро в продаже — сообщить мне» ведёт mailto на noreply. Секция целиком — шум для клиента, который пришёл за сайтом для своего бизнеса.
Правила: Div-based fake screenshots banned; прямое требование клиента; copy self-audit.
Фикс — секция схлопывается в один широкий баннер-полку без тайлов и без ступеней:
```css
.tpl-banner {
  display: grid; gap: 32px;
  padding: clamp(28px, 4vw, 48px);
  border: 1px solid var(--z-line);
  border-radius: var(--r-card);
  background: rgba(255, 255, 255, 0.5);
}
@media (min-width: 900px) { .tpl-banner { grid-template-columns: minmax(280px, 380px) 1fr; gap: 48px; } }
.tpl-list { display: flex; flex-direction: column; }
.tpl-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; padding: 14px 0; border-top: 1px solid var(--z-line-soft); }
.tpl-row:first-child { border-top: 0; }
.tpl-name { font-family: var(--font-display); font-size: 17px; font-weight: 500; color: var(--z-ink); }
.tpl-kind { font-size: 13px; color: var(--z-muted); }
.tpl-notify {
  margin-left: auto; min-height: 44px; display: inline-flex; align-items: center;
  padding: 0 18px; border: 1px solid var(--z-line); border-radius: var(--r-pill);
  font-size: 13px; font-weight: 500; color: var(--z-action); text-decoration: none;
  transition: background .2s ease, color .2s ease, border-color .2s ease;
}
.tpl-notify:hover { background: var(--z-action); border-color: var(--z-action); color: #fff; }
```
```tsx
<div className="tpl-banner">
  <div>
    <h2 className="zt-title">Готовые макеты</h2>
    <p className="zt-lead mt-4">Запуск за одну-две недели вместо долгого проектирования. Сейчас готовы три формата, остальные в работе.</p>
  </div>
  <ul className="tpl-list">
    {TEMPLATES.map((t) => (
      <li key={t.id} className="tpl-row">
        <span className="tpl-name">{t.name}</span>
        <span className="tpl-kind">{t.kind}</span>
        <a className="tpl-notify"
           href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Сообщите, когда появится: " + t.name)}`}>
          Сообщить мне
        </a>
      </li>
    ))}
  </ul>
</div>
```

### 4. [БЛОКЕР] Team: служебная плашка «слот … сетка не меняется» в продакшене
Скрин Team: пунктирная строка «имена и фото добавим сюда после знакомства — сетка не меняется». Это комментарий верстальчика о раскладке, опубликованный как контент. Владелец клиники читает это как «сайт недоделан».
Фикс (`Team.tsx`) — удалить блок целиком:
```tsx
{/* УДАЛИТЬ:
<p className="mt-8 inline-flex items-baseline gap-3 border-b border-dashed ...">
  <span className="zt-meta">слот</span> ...
</p>
*/}
```
Сабзаголовок секции: вместо «Знакомим лично на созвоне» → «Шесть ролей закрывают проект целиком. С вами говорят те, кто делает работу.»

### 5. [СЕРЬЁЗНО] Kicker дублирует заголовок на всех 10 секциях
Скрины Services/Directions/Portfolio/Team/Competencies: «01 · УСЛУГИ» → «Услуги», «06 · КОМАНДА» → «Команда», «07 · КОМПЕТЕНЦИИ» → «Компетенции». Строка не несёт информации — это нумерация секций для разработчика. Признано: механическое нарушение EYEBROW RESTRAINT (1 на 3 секции; у нас 10 из 10).
Фикс — `SectionHead.tsx` переписывается, kicker становится опциональным и остаётся ровно на двух секциях ниже hero (hero + 2 = бюджет на 10 секций):
```tsx
export default function SectionHead({
  title,
  sub,
  eyebrow,
}: {
  title: string;
  sub?: string;
  eyebrow?: string; // ставить ТОЛЬКО там, где заголовок без него двусмыслен
}) {
  return (
    <header className="max-w-[760px]">
      {eyebrow && <p className="zt-kicker mb-4">{eyebrow}</p>}
      <h2 className="zt-title">{title}</h2>
      {sub && <p className="zt-lead mt-4">{sub}</p>}
    </header>
  );
}
```
Проп `split` удаляется из компонента и из всех вызовов (см. пункт 6). Вызовы: `kicker` убирается везде; `eyebrow="Для вашего бизнеса"` остаётся только в Directions, `eyebrow="Следующий шаг"` — только в Contacts.

### 6. [СЕРЬЁЗНО] SPLIT-HEADER использован как дефолт дважды
Скрины Directions и Competencies: заголовок слева + абзац справа, причём абзац выровнен `text-right` — русский абзац с рваным левым краем читается плохо сам по себе, а композиция запрещена скилом как дефолт.
Код-пруф: `SectionHead.tsx` ветка `split`, вызовы в `Directions.tsx` и `Competencies.tsx` (`md:text-right`).
Фикс: после переписывания SectionHead (п.5) ветки `split` не существует; обе секции получают обычный левый head с одним фокусным сообщением.

### 7. [СЕРЬЁЗНО] Одна композиционная семья на три секции: реестровые строки
Services (5 строк), Directions (7 строк), Portfolio (4 строки) — один и тот же приём: hairline-строка, моно-индекс слева, цена/мета справа. Section-Layout-Repetition Ban: семья ≤1 раза. Для клиента это три экрана одного прайса без иерархии — взгляд не цепляется ни за что.
Фикс: Services остаётся единственной секцией-реестром (это её честный жанр — прайс), но без индексов; Directions уходит в мозаику 12 колонок; Portfolio — в сетку 2×2 (п.2).
`Directions.tsx` + CSS:
```css
.dir-grid {
  display: grid; grid-template-columns: repeat(12, 1fr);
  gap: 1px; background: var(--z-line-soft);      /* hairline-сетка без border-магии */
  border-block: 1px solid var(--z-line-soft);
  margin-top: 56px;
}
.dir-cell { background: var(--color-bg); grid-column: span 12; }
@media (min-width: 768px) {
  .dir-cell:nth-child(1), .dir-cell:nth-child(2),
  .dir-cell:nth-child(6), .dir-cell:nth-child(7) { grid-column: span 6; }
  .dir-cell:nth-child(3), .dir-cell:nth-child(4),
  .dir-cell:nth-child(5) { grid-column: span 4; }
}
.dir-cell__link {
  display: flex; flex-direction: column; gap: 10px; height: 100%;
  padding: 26px 28px 22px; text-decoration: none;
  transition: background .2s ease;
}
.dir-cell__link:hover, .dir-cell__link:focus-visible { background: rgba(0, 201, 212, 0.05); }
.dir-cell__title { font-family: var(--font-display); font-size: 22px; font-weight: 500; letter-spacing: -0.01em; color: var(--z-ink); }
.dir-cell__text  { font-size: 14px; line-height: 1.55; color: var(--z-muted); }
.dir-cell__foot  { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 16px; }
.dir-cell__price { font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--z-ink); }
.dir-cell__arrow {
  width: 40px; height: 40px; flex: none;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--z-line); border-radius: var(--r-pill);
  color: var(--z-action); transition: background .2s, color .2s, border-color .2s;
}
.dir-cell__link:hover .dir-cell__arrow { background: var(--z-action); border-color: var(--z-action); color: #fff; }
```
```tsx
<ul className="dir-grid">
  {DIRECTIONS.map((d) => (
    <li key={d.slug} className="dir-cell">
      <a className="dir-cell__link" href={`#/napravlenie/${d.slug}`} aria-label={`${d.title} — открыть страницу`}>
        <h3 className="dir-cell__title">{d.title}</h3>
        <p className="dir-cell__text">{d.text}</p>
        <span className="dir-cell__foot">
          <span className="dir-cell__price">{d.price}</span>
          <span className="dir-cell__arrow" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </span>
      </a>
    </li>
  ))}
</ul>
```
Ghost-цифры (`dir-ghost`, `-webkit-text-stroke`) удаляются вместе со старыми стилями — владелец химчисток не считывает контурный «03» ни как навигацию, ни как ценность. Мобильный fallback: `span 12` даёт одну колонку, вся строка — тач-цель.

### 8. [СЕРЬЁЗНО] Моно-шрифт как голос интерфейса ниже hero
Цены («от 20 000 ₽» — 12px JetBrains Mono, letter-spacing 0.06em), индексы «01…05», «04 примера», «этап 02 / 05», dl в Contacts, колонки футера. Цена — главная коммерческая цифра страницы — набрана наименее читаемым стилем. Это и есть «дизайн для программистов».
Правило: Typography (base 16, читаемость) + аудитория-поворот.
Фикс (`global.css`):
```css
.zt-meta {
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.45;
  letter-spacing: 0.01em;
  color: var(--z-muted);
}
.price {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--z-ink);
  white-space: nowrap;
}
.proc-step .proc-num {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
}
.zt-chip {
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1;
  padding: 8px 14px;
  border-radius: var(--r-pill);
}
```
В `Services.tsx` цена: `<p className="price md:justify-self-end">{s.price}</p>`; в `Process.tsx` счётчик: `<p className="zt-meta mt-8">Этап {active + 1} из {PROCESS.length}</p>`. JetBrains Mono ниже hero не используется вообще (в hero и holo-nav — неприкосновенно).

### 9. [СЕРЬЁЗНО] Разные лейблы одного intent
Header: «Обсудить проект» → `#contacts`; hero primary: «Рассчитать смету» → `#contacts`; footer: «Обсудить проект». Два лейбла, одна цель, калькулятора сметы на странице нет — обещание «рассчитать» не выполнено ничем.
Правило: CTA — один лейбл на один intent.
Фикс (`HeroCopy.tsx`, правка текста разрешена):
```tsx
<a className="hero-primary" href="#contacts">
  Обсудить проект
  <span aria-hidden="true">→</span>
</a>
```
Обещание сметы переезжает в текст: в Contacts dl уже есть «смета и сроки — фиксируются до старта» — этого достаточно.

### 10. [СЕРЬЁЗНО] Мобильная навигация: тач-цели 31px
Мобильный скрин шапки: `.site-nav a { font-size: 12px; padding: 8px 0; }` → высота цели ≈ 12×1.3 + 16 ≈ 31px при норме 44px. Палец владельца логистики попадает в «Портфолио» через раз.
Правило: ui-ux-pro-max Touch CRITICAL.
Фикс (`global.css`, внутри `@media (max-width: 767px)`):
```css
.site-nav a {
  font-size: 13px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 0;
}
```

### 11. [СЕРЬЁЗНО] Копирайт: агентские штампы и внутренние статусы
- Services sub: «Полный цикл, от идеи до запуска… — одна команда» → «полный цикл» и «одна команда» — штампы из бан-листа («под ключ», «команда профессионалов»).
- About: негативный параллелизм «без бюрократии и лишних посредников» + два teal-акцента в одном предложении (акцент размыт, COLOR LOCK).
- Directions sub: «отдельная страница для поиска и рекламы» — внутренняя SEO-архитектура, клиенту непродающая.
- Portfolio sub / Team sub / Competencies sub: трижды «покажем на созвоне» — системный отказ давать доказательство здесь и сейчас.
- Statement About: 34 слова при лимите 25.
Фиксы текстом:
- Services sub → «Сайты, боты и приложения. Цена справа — стартовый пакет, точную смету считаем после брифа.»
- Directions sub → «Семь направлений, в которых мы работаем каждый день. В каждом — свои сроки, цены и примеры.»
- About statement → «ZETRONIX — небольшая веб-студия. Проектируем и разрабатываем сайты, интерфейсы и AI-инструменты. Вы говорите <accent>напрямую с теми, кто проектирует и собирает</accent>.» (один акцент)
- Competencies sub → «Стек и практики, которые мы применяем в каждом проекте.»
- Team sub → см. п.4.

### 12. [ПОЛИРОВКА] Форма-хаос: 0 / 4px / 999px на одной странице
Тайлы и `dir-arrow` — острые углы, `zt-chip` — 4px, кнопки — 999px. SHAPE CONSISTENCY LOCK нарушен ниже hero (holo-nav не трогаем — неприкосновенно).
Фикс (`tokens.css` + применения):
```css
:root {
  --r-pill: 999px;  /* кнопки, ссылки-пилюли, чипы, стрелки */
  --r-card: 12px;   /* контейнеры: баннеры, обложки */
}
```
Чипы и стрелки уже переведены на pill в п.7–8; баннер Templates и обложки кейсов получают `--r-card`; острых углов ниже hero не остаётся.

### 13. [ПОЛИРОВКА] Мёртвый текст в футере
Скрин Footer: «Юридическая информация и реквизиты» — span, выглядящий ссылкой, без href. Либо страница, либо ничего.
Фикс (`Footer.tsx`): удалить span до появления страницы `/legal`; оставить `<span className="zt-meta">© 2026 ZETRONIX.RU</span>`.

### 14. [ПОЛИРОВКА] Вертикальный ритм без логики
`zt-sec--dense` стоит на Services, Directions, Competencies и нигде больше — паттерна нет, секции сливаются в серую массу без границ.
Фикс (`global.css`): один паддинг + hairline-разделитель каждой секции — лента читается как страницы, а не как бесконечность:
```css
.zt-sec,
.zt-sec--dense {
  padding-block: clamp(76px, 8vw, 112px);
  border-top: 1px solid var(--z-line-soft);
}
```

---

# ЦЕЛЬНАЯ СИСТЕМА (секции 3+)

Почерк: **«тихий коммерческий редакторский»**. Одна лента на фоне `#f4f4f4`, секции разделены одной hairline сверху (п.14), один паддинг-ритм, заголовок Manrope 32–46 слева, lead Inter 17 ≤25 слов, **ни одного моно-индекса и ни одной ghost-цифры**, цена — Inter 600 tabular-nums, ровно один teal-акцент на секцию, доказательство вместо обещания. Композиции разные, почерк один:

- **Services** — прайс-лист: строки без индексов, название+описание слева, цена Inter 600 справа; hover — teal-рэйл (уже есть, ок).
- **Directions** — мозаика 12 колонок 6/6·4/4/4·6/6 из hairline-ячеек gap:1px, внутри ячейки название→строка→цена+стрелка-pill.
- **Portfolio** — сетка 2×2 карточек с плоскими тонированными обложками 4:3 (слоты под реальные снимки владельца), мета в одну строку под обложкой.
- **Templates** — один широкий баннер-панель `--r-card`: слева заголовок+оффер, справа три строки-позиции с pill-CTA «Сообщить мне».
- **About** — statement в 8 колонок с одним акцентом; ниже hairline и три принципа в ряд без нумерации.
- **Team** — абзац ролей через teal-слэши (ок) + одна честная строка про первый созвон; без плашек-слотов.
- **Competencies** — 2×2 с border-t, чипы Inter pill, без индексов.
- **Process** — sticky-колонка + рейл с точками: единственная «техническая» метафора, которую владелец читает как таймлайн, — оставляем.
- **FAQ** — sticky-лево + аккордеон, без изменений.
- **Contacts** — крупный вопрос + email (рабочий!) + dl справа Inter; eyebrow «Следующий шаг».

Воздух: 76–112px между секциями, 56px от head до контента, 44–56px внутри групп. Никаких ступеней, сдвигов и каскадов: все сетки выровнены по общей 12-колоночной базе с `--page-gutter`.

---

# ЧТО ОСТАВИТЬ

- Hero целиком и holo-nav с проектором — ок, вне критики.
- Process: рейл, точки, sticky — мотивированный motion, ок.
- FAQ: механика аккордеона и тайминг 240ms — ок.
- Teal-рэйл на hover в Services — ок, переносится как семейный приём.
- `:focus-visible` глобально и outline 3px — ок.
- Pairing Manrope/Inter и hairline-язык разделителей — ок, теперь системно.
- Reveal 0.7s и reduced-motion-блоки — ок.

---

# МЕХАНИЧЕСКИЕ ПРОВЕРКИ ПО СКИЛАМ

- **Eyebrow restraint:** нарушено тотально — kicker на 10/10 секций (+hero). После фикса: hero + Directions + Contacts = 3 на 11 блоков, норма соблюдена.
- **Content density:** About statement 34 слова (>25) — нарушено, сокращено (п.11). Portfolio: head + строки + счётчик «04 примера» = лишний текстовый элемент — удалён (п.2). Templates: head + 3 карточки + 3 CTA + статус — перегруз, схлопнуто в баннер (п.3). Остальные секции в лимите — ок.
- **Shape lock:** нарушено (0/4/999) — приведено к шкале 999/12/0 (п.12).
- **Color lock:** teal размыт четырьмя оттенками (`#00c9d4`, `#009aa0`, `#006b70`, `#00ffff`); ниже hero после фикса работают только `--z-action` для текста/акцентов и 5%-подложка hover; glow остаётся исключительно в hero/holo (неприкосновенно).
- **Один лейбл на intent:** нарушено («Обсудить проект» / «Рассчитать смету») — унифицировано (п.9).
- **Div-based fake screenshots:** нарушено (тайлы Templates) — секция пересобрана без превью (п.3).
- **Long lists divide-y:** Directions 7 строк — нарушено, переведено в мозаику (п.7); Services 5 строк — на границе, оставлен как прайс осознанно.
- **Marquee:** 0 отрисованных — ок, не добавлять.
- **Zigzag cap:** 0 — ок.
- **Touch 44px:** мобильная навигация 31px — нарушено, исправлено (п.10); остальные цели ≥44 — ок.
- **Контраст:** `--z-muted` и `--z-action` на `#f4f4f4` дают ≥5.9:1 — ок; проблема была в кегле 12px mono, а не в контрасте — устранена (п.8).

Итог для клиента после этих правок: страница говорит «вот что мы делаем, вот сколько это стоит, вот примеры, вот как связаться» — человеческим шрифтом, без внутренних комментариев и без лестниц. После внедрения жду от владельца не «рассинхронно», а «сколько стоит мой магазин».

_usage: _


---
## 2026-11-07T09:41:23.929Z — scripts/opus-prompt-5.md

**1. Вердикт по секциям**
- Services — PASS: строки с hairline, цена справа читается как прайс, sub снимает вопрос «это окончательная цена?».
- Directions — PASS: мозаика 6/6·4/4/4·6/6 читается, hairline-gap аккуратный, цена + стрелка-pill прижаты к низу карточек.
- Portfolio — FAIL: обложки — пустые тонированные слоты с именем по центру; доказательств работы клиента нет.
- Templates — PASS: banner с lead слева и тремя строками с pill-CTA справа; честная формулировка про старт продаж не отпугивает.
- About — PASS: один teal-акцент, три опоры под hairline, ничего лишнего.
- Team — PASS: роли одной строкой через слеши, мета-pro созвон вместо плашки; читается как договорённость, а не витрина.
- Competencies — PASS: четыре группы с pill-чипами, моно только там, где разрешено.
- Process — PASS: таймлайн с текущим шагом, «Этап 3 из 5» читается как индикатор, плашек нет.
- FAQ — PASS: пять вопросов с плюсами, hairline, заголовок слева — всё чисто.
- Contacts — FAIL: главный контактный адрес noreply@zetronix.ru — адрес с семантикой «не отвечай» в момент конверсии.
- Footer — PASS: мёртвый span удалён, четыре колонки; почтовая ссылка чинится фиксом блокера №1.
- Mobile (секции 3+) — PASS: nav ≥44px, карточки складываются без потерь, meta портфолио в одну строку.
- Hero-copy — N/A: в кадр не попала, hero вне скоупа.

**2. Остаточные блокеры**
1. **noreply@ как единственный контакт во всех mailto** (крупная ссылка в Contacts, колонка СВЯЗЬ в футере, три CTA «Сообщить мне» в Templates). Клиент видит адрес, который буквально означает «не отвечай»; письмо туда уходит в пустоту — конверсия мертва при полностью верной вёрстке. Фикс (после подтверждения владельца, ты уже поднимаешь вопрос): глобальная замена токена в шаблоне `noreply@zetronix.ru` → отвечаемый ящик (например `hello@zetronix.ru`): `sed -i 's/noreply@zetronix\.ru/hello@zetronix.ru/g' index.html` — видимый текст в Contacts и футере обновится сам (текстовая нода равна адресу), три mailto в Templates сохранят темы (`?subject=Сообщите, когда появится: {name}`).
2. **Портфолио без доказательств работы**: четыре тонированных прямоугольника с именем читаются как «сайт в разработке», клиент не видит ни одного экрана продукта. Фикс в уже готовые слоты 4:3: `.case-cover{position:relative;aspect-ratio:4/3;overflow:hidden;border-radius:var(--r-card)}` и внутрь каждой обложки `<img src="/img/cases/neobank.png" alt="NEOBANK — финтех-платформа" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center">`; центрированный span с именем убрать после появления img (мета-строка имя/категория/год остаётся снизу).

Явно не блокеры: моно JetBrains в zt-kicker двух секций — нарушением не считаю, это осознанный класс-решение, оставляем; пустое место внизу карточки Templates и «Этап 3 из 5» — вкусовщина, не трогаем.

**3. Вся страница** — не FAIL: оба блокера локальные (контактный адрес и контент обложек), каркас, ритм и типографика готовы к публикации сразу после их закрытия.

_usage: _


---
## 2026-11-07T10:32:21.866Z — scripts/opus-prompt-9.md

```css
/* ───────────── 7 — hero-copy: статус-строка вместо кикера ───────────── */

/* Разметка:
   <p class="hero-status" role="status">
     <span class="hero-status__dot" aria-hidden="true"></span>
     Открыты для проектов · 2 слота в Q1 2026
   </p>
*/

.hero-status {
  display: inline-flex;
  align-items: center;
  gap: .65em;
  margin: 0 0 clamp(14px, 2vw, 22px);
  font-family: var(--font-mono, "JetBrains Mono", ui-monospace, monospace);
  font-size: clamp(11px, 1.05vw, 13px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: rgb(255 255 255 / .62);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.hero-status__dot {
  flex: 0 0 auto;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent, #6ee7b7);
  animation: hero-status-pulse 2.6s cubic-bezier(.4, 0, .2, 1) infinite;
}

@keyframes hero-status-pulse {
  0%   { box-shadow: 0 0 0 0   rgb(110 231 183 / .55); }
  70%  { box-shadow: 0 0 0 9px rgb(110 231 183 / 0);   }
  100% { box-shadow: 0 0 0 0   rgb(110 231 183 / 0);   }
}

@media (prefers-reduced-motion: reduce) {
  .hero-status__dot { animation: none; }
}

@media (max-width: 560px) {
  .hero-status {
    white-space: normal;
    letter-spacing: .1em;
    line-height: 1.35;
    align-items: flex-start;
  }
  .hero-status__dot { margin-top: .45em; }
}
```

```css
/* ───────────── 8 — Scrim под hero-copy ───────────── */

:root {
  /* подставь реальный токен фона, если он уже есть */
  --scrim-rgb: 6 8 12;
}

.hero-copy {
  position: relative;
  isolation: isolate; /* держит z-index:-1 внутри, не уводит под фон страницы */
}

.hero-copy::before {
  content: "";
  position: absolute;
  inset: -14% -22% -16% -18%;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(75% 92% at 15% 45%,
      rgb(var(--scrim-rgb) / .94) 0%,
      rgb(var(--scrim-rgb) / .78) 40%,
      rgb(var(--scrim-rgb) / .28) 68%,
      rgb(var(--scrim-rgb) / 0)  88%),
    linear-gradient(105deg,
      rgb(var(--scrim-rgb) / .82) 0%,
      rgb(var(--scrim-rgb) / .45) 55%,
      rgb(var(--scrim-rgb) / 0)  85%);
  -webkit-mask-image: radial-gradient(100% 100% at 50% 50%, #000 0%, #000 55%, transparent 100%);
          mask-image: radial-gradient(100% 100% at 50% 50%, #000 0%, #000 55%, transparent 100%);
  filter: blur(14px);
  will-change: transform;
}

@media (max-width: 768px) {
  .hero-copy::before {
    inset: -10% -14% -12% -12%;
    filter: blur(8px); /* на мобиле дешевле */
  }
}

/* Если hero-copy лежит в overflow:hidden или линии сетки — отдельный слой выше по z-index,
   ::before использовать нельзя. Тогда:

   <div class="hero__scrim" aria-hidden="true"></div>

   .hero { position: relative; }
   .hero__scrim {
     position: absolute; inset: 0; z-index: 1; pointer-events: none;
     background: radial-gradient(60% 80% at 22% 50%,
       rgb(var(--scrim-rgb) / .92) 0%, rgb(var(--scrim-rgb) / .6) 45%, rgb(var(--scrim-rgb) / 0) 80%);
     -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 52%, transparent 78%);
             mask-image: linear-gradient(90deg, #000 0%, #000 52%, transparent 78%);
   }
   .hero-copy { position: relative; z-index: 2; }
*/
```

```css
/* ───────────── 9 — Шрифты ───────────── */

:root {
  --font-display: "Unbounded", "Inter", system-ui, sans-serif;
  --font-body:    "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}

/* Unbounded: только два веса — 500 и 700, грузим вариативным диапазоном (один файл)
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400..600&family=JetBrains+Mono:wght@400..500&family=Unbounded:wght@400..700&display=swap">
*/

/* Где применять */
.hero-title {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -.035em;
  line-height: .98;
  text-wrap: balance;
}

.zt-title {
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -.02em;
  line-height: 1.08;
  text-wrap: balance;
}

/* mono остаётся: hero-микротекст, статус, holo, цифры/метки */
.hero-status,
.hero-eyebrow,
.hero-meta,
.holo {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

/* body */
body,
p,
li,
button,
input,
textarea {
  font-family: var(--font-body);
}
```

```bash
# Space Grotesk — удаляем полностью. Найти остатки:
grep -rn -iE 'space[ _-]?grotesk|SpaceGrotesk|font-grotesk' \
  --include='*.{html,css,js,jsx,ts,tsx,scss,astro,vue}' .
```

Замена по назначению: заголовки → `var(--font-display)`; мелкие uppercase-лейблы и цифры → `var(--font-mono)`; интерфейсный текст и кнопки → `var(--font-body)`. Отдельного `--font-grotesk` не оставляем — иначе он всплывёт обратно.

Оговорка про `.zt-title`: если это не заголовок секции, а мелкий надзаголовок-лейбл, Unbounded туда не ставить — оставить `--font-mono`. Тогда display работает только на `.hero-title` и заголовках секций.

_usage: _


---
## 2026-11-07T11:28:35.108Z — scripts/opus-prompt-10.md

## Рассинхрон и нелепости (конкретные места)

1. **Инверсия состояний скраба.** На кадре, подписанном `scrub 0.75` («панели ещё нет»), панель стоит полностью материализованная, с веером и dashed-линией. На кадре `scrub 0.9` («панель материализована») панели нет вообще, веера нет тоже — остались четыре бесхозных кому-луча: горизонтальный ≈(450–620, 222), вертикальный, обрезанный правым краем вьюпорта ≈(1395, 330–500), и два горизонтальных под роботом ≈(1000–1160, 785) и (995–1160, 838). Либо порог `NAV_ON` привязан не к тому значению, либо видимость панели инвертирована. Это не «голограмма появляется», это «голограмма исчезает вместо появления».
2. ** best.fragments вне слоя луча.** На кадре с панелью над ней висит оторванный Г-образный луч: горизонталь ≈(550–720, 110) + вертикаль ≈(725, 140–300), не соединённые ни с эмиттером на груди, ни с панелью. На hero- Rest-кадре те же кому плавают посреди секции: ≈(505–655, 390) и яркая с головой-точкой ≈(1215–1370, 447). Луч живёт своей жизнью вне окна навигации.
3. **Луч бьёт выше центра панели.** Dashed-линия и ось веера идут по y≈420 (высота груди робота), оптический центр панели y≈449, строка «02 Портфолио» y≈434. Луч попадает в пустой зазор между строками 01 и 02 — «прожектор светит в промежуток».
4. **Пустой вьюпорт.** Кадр между контактами и админкой — сплошное серое поле под шапкой: ни disclosure, ни слотов, ни заголовка. Значит существует позиция скролла/якоря, где пользователь видит ничего. Either слоты заперты в `0fr` и секция схлопнулась, либо якорь уводит в мёртвую зону между snap-точками.
5. **Полоса-обмылок под шапкой.** На портфолио и витрине между низом sticky-header (y≈72) и линией y≈127 видна полоса другого тона + двойная hairline-граница. Секция не доезжает до шапки: scroll-margin/snap остановка раньше границы секции.
6. **Двойные этикетки.** Портфолио: имя проекта внутри cover (NEOBANK) и то же имя жирным в подписи под cover. Витрина: бейдж «Макет» в углу + водяной знак «MAKET» по центру + при этом имени шаблона на cover нет вообще (placeholder безымянный, вопреки спеке «tinted placeholder с именем»). Контакты: абзац «Отвечаем в тот же или следующий рабочий день» и mono-строка «ответ — тот же или следующий рабочий день» — одно и то же дважды.
7. **`noreply@zetronix.ru` как главный контакт.** Noreply буквально означает «не отвечай сюда». Весь mailto-флоу (бриф, CTA карточек, empty state) ведёт на адрес, который семантически отказывает в ответе. Это не стиль, это баг смысла.
8. **«Финтех-платформа · 2026».** Работа датирована будущим годом относительно выхода сайта. Выглядит как фабрикация сильнее, чем честный placeholder.
9. **Админка: разбалансировка формы.**Row-1 держит 6 полей, row-2 — одинокий select «Статус» слева и пустота на 5 колонок справа. Disabled-кнопка «Добавить подкатегорию» — серая заливка (#9xx) с белым текстом: контраст ниже допустимого и визуально спорит с чёрной активной кнопкой рядом.
10. **Недопоставленные кадры.** В списке обещаны competencies, about, diplomas (открытый, 6 слотов) и templates-m; фактически приложен пустой кадр и админка. Открытый disclosure со слотами я не вижу ни на одном пикселе — вердикт по дипломам и мобильной витрине дать не могу, это не PASS, это отсутствие доказательства.

## Заслуживает ли панель вердикта «голограмма»

Нет. На-кадре это светлая карточка с уголками: фон равномерный непрозрачно-бледный, сканлайны на 1x не читаются, sweep-градиент в стоп-кадре не виден, хроматической бахромы на-labels нет, edge-glow нет. Corner-тики есть — и всё. Голограмма на светлой теме обязана отличаться от карточки тремя признаками: просвечиваемость (фон полупрозрачный + blur), видимая структура растра, светящаяся кромка. Сейчас выполнен ноль из трёх.

## Что бы я вырезал ещё

- Водяной знак «MAKET» и бейдж «Макет» одновременно (оставить одно, лучше имя шаблона на cover).
- Дубль имени в подписи карточки портфолио.
- Дубль строки ответа в контактах.
- Commу-лучи в rest-состоянии hero (это не «атмосфера», это мусор трансформации).
- Полосу-обмылок: убрать border-top секции, оставив одну hairline через inset box-shadow.

## Код-фиксы

**1. Один источник правды для скраба (инверсия + мусор вне окна):**

```js
const NAV_BEAM = 0.70, NAV_ON = 0.80, MAT = 0.64;
function setFrame(p){
  const beamWin = p >= NAV_BEAM - 0.02;              // луч включается с 0.70
  const navOn   = p >= NAV_ON;                        // панель только с 0.80
  root.classList.toggle('beam-on', beamWin);
  root.classList.toggle('is-nav', navOn);
  // всё, что относится к лучу, существует ТОЛЬКО внутри окна
  root.style.setProperty('--beam-vis', beamWin ? 1 : 0);
}
```

```css
.pb-line, .pb-packets, .pb-ring, .pb-lock, .holo-sweep-debris{
  opacity: var(--beam-vis, 0);
  visibility: calc(var(--beam-vis, 0)) == 0 ? hidden : visible;
}
/* ни одной кому в rest-состоянии hero */
```

**2. Fragments только внутри слоя луча, от координат эмиттера:**

```css
.beam-layer{ position:absolute; inset:0; pointer-events:none; }
.beam-layer > *{ position:absolute; left:var(--ex); top:var(--ey);
  transform-origin:0 0; }
.pb-line{ width:var(--blen); height:2px; transform:rotate(var(--bang)); }
```

```js
// каждый кадр: эмиттер = треугольник на груди, цель = центр панели
const e = emitter.getBoundingClientRect();
const t = panel.getBoundingClientRect();
root.style.setProperty('--ex', e.left + e.width/2 + 'px');
root.style.setProperty('--ey', e.top  + e.height/2 + 'px');
root.style.setProperty('--beam-y', t.top + t.height/2 + 'px');
root.style.setProperty('--bang',
  Math.atan2(t.top + t.height/2 - (e.top+e.height/2), t.left - e.left) + 'rad');
```

**3. Луч в центр панели, а не в зазор:** панель получает `--beam-y`, dashed и ось веера берут его, а не y груди:

```css
.pb-line, .pb-fan{ top: calc(var(--beam-y) - var(--ey)); }
```

**4. Голограмма вместо карточки (три признака):**

```css
.holo{
  background:
    repeating-linear-gradient(0deg,
      rgba(18,157,168,.07) 0 1px, transparent 1px 3px),   /* растр виден на 1x */
    linear-gradient(180deg, rgba(232,246,248,.62), rgba(232,246,248,.42));
  backdrop-filter: blur(3px) saturate(1.15);              /* просвечиваемость */
  box-shadow:
    inset 0 0 0 1px rgba(18,157,168,.30),
    inset 0 0 28px rgba(18,157,168,.12),                  /* светящаяся кромка */
    0 16px 44px -20px rgba(18,157,168,.38);
}
.holo .nav-item{ text-shadow: .5px 0 rgba(255,0,120,.18), -.5px 0 rgba(0,180,255,.18); }
```

**5. Обмылок под шапкой:**

```css
.section{ scroll-margin-top: var(--nav-h); border-top:0;
  box-shadow: inset 0 1px 0 var(--line); min-height:60vh; }
```

**6. Пустой вьюпорт дипломов:**

```css
.disclosure{ display:grid; grid-template-rows:0fr; transition:grid-template-rows .4s; }
.disclosure[data-open="true"]{ grid-template-rows:1fr; }
.disclosure > *{ overflow:hidden; min-height:0; }
#diplomas{ min-height:70vh; }   /* якорь никогда не даёт пустой экран */
```

**7. Админ-сетка и disabled:**

```css
.adm-form{ display:grid; grid-template-columns:repeat(12,1fr); gap:16px; }
.adm-form .f-name{grid-column:span 4} .adm-form .f-cat{grid-column:span 2}
.adm-form .f-sub{grid-column:span 2}  .adm-form .f-type{grid-column:span 2}
.adm-form .f-price{grid-column:span 1}.adm-form .f-cover{grid-column:span 1}
.adm-form .f-status{grid-column:span 2}   /* статус в ту же строку */
.btn[disabled]{ background:transparent; color:var(--muted);
  box-shadow: inset 0 0 0 1px var(--line); }   /* не серая заливка */
```

**8. Контент-правки (одной заменой):**

```diff
- noreply@zetronix.ru   → hello@zetronix.ru   (все mailto: бриф, CTA, empty state)
- «Финтех-платформа · 2026» → «· 2025»
- cover-имя в портфолио УДАЛИТЬ (имя живёт в подписи)
- бейдж «Макет» УДАЛИТЬ, watermark «MAKET» заменить именем шаблона на cover
- mono-строку «ответ — тот же…» в контактах УДАЛИТЬ (дубль абзаца)
```

**Итог:** PASS по геометрии веера, роботy, сеткам 1/2/3/4 и честности админки. НЕ PASS по скраб-синхронизации, rest-чистоте hero, «голографичности» панели, кадру дипломов и контактному адресу. После фиксов 1–8 переснять пару 0.75/0.9 и дипломы — только тогда аудит закроется.

_usage: _
