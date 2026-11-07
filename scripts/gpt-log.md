

---
## 2026-11-07T13:45:50.777Z — gpt-6-astra — scripts/gpt-prompt-wm.md

## CONDITIONAL

Идея работает: wordmark действительно находится в глубине, робот его перекрывает, а H1 остаётся главным. Но текущая реализация переусложнена хроматикой, а заявленное «разъезжание и потеря фокуса» почти не видно: надпись просто исчезает уже к `p ≈ 0.17`.

## Проблемы

### 1. MAJOR — заявленная анимация фактически сводится к fade-out

Сейчас:

```css
opacity: calc(1 - min(1, var(--hero-p, 0) * 6));
letter-spacing: calc(-0.02em + var(--hero-p, 0) * 0.16em);
translate: 0 calc(var(--hero-p, 0) * -56px);
```

При `p = 0.167` opacity уже равен нулю. За это время:

- `letter-spacing` меняется всего на `0.027em`;
- слой уходит вверх только примерно на `9px`;
- пользователь не успевает увидеть ни расхождение букв, ни потерю фокуса.

То есть в коде заявлен один эффект, а на скринах фактически виден обычный короткий fade.

### Правка

Растянуть фазу эффекта до `p ≈ 0.29`, но сохранить полное исчезновение к скриншоту `p=0.3`.

```diff
 .hero-wordmark {
+  --wm-phase: clamp(0, calc(var(--hero-p, 0) * 3.4), 1);

   position: absolute;
   z-index: 2;
   top: 42%;
   left: 50%;
   width: 100%;
   text-align: center;
   white-space: nowrap;
   pointer-events: none;
   user-select: none;
-  opacity: calc(1 - min(1, var(--hero-p, 0) * 6));
+  opacity: calc(1 - var(--wm-phase));
   transform: translate(-50%, -50%);
-  translate: 0 calc(var(--hero-p, 0) * -56px);
+  translate: 0 calc(var(--wm-phase) * -56px);
 }

 .hero-wordmark span {
   font-family: var(--font-display);
   font-size: clamp(56px, 9.6vw, 150px);
   font-weight: 700;
   line-height: 0.9;
-  letter-spacing: calc(-0.02em + var(--hero-p, 0) * 0.16em);
+  letter-spacing: calc(-0.02em + var(--wm-phase) * 0.15em);
 }
```

Промежуточное поведение после правки:

- `p=0` — плотный wordmark;
- `p≈0.15` — уже заметное расхождение букв и движение вверх;
- `p≈0.25` — слабый расфокусированный остаток;
- `p=0.3` — wordmark исчезает;
- `p=.75` и `p=.9` — чистая сцена под навигацию.

Это всё ещё один владелец скролла: используется тот же `--hero-p`.

---

### 2. MAJOR — мобильная маска не[Error] The upstream provider is temporarily unavailable. Try again shortly.

_usage: {"completion_tokens":888,"prompt_tokens":2866,"total_tokens":3754,"completion_tokens_details":{"reasoning_tokens":284,"accepted_prediction_tokens":0,"audio_tokens":0,"rejected_prediction_tokens":0,"image_tokens":0},"cost":0.026952,"prompt_tokens_details":{"audio_tokens":0,"cached_tokens":0,"cache_write_tokens":0,"video_tokens":0},"is_byok":false}_


---
## 2026-11-07T14:29:14.927Z — gpt-6-astra — scripts/gpt-prompt-wm.md

## ВЕРДИКТ

**CONDITIONAL.** Концепт рабочий: wordmark действительно функционирует как слой проекции и не ломает робота или сетку. Но сейчас он слишком рано исчезает, а на мобильном расположен на уровне визора и читается как баннер, а не как проекция за роботом.

## Проблемы

### MAJOR — wordmark гаснет слишком рано

```css
opacity: calc(1 - min(1, var(--hero-p, 0) * 6));
```

При `--hero-p: 0.166` opacity уже равен нулю. Это не «проекция теряет фокус», а короткий fade-in/fade-out в самом начале сцены. При этом заявленные разъезд букв и уход вверх почти не успевают считаться зрителем.

При `p=0.3` надпись по-прежнему должна уже исчезнуть — это соответствует скриншоту. Но исчезать она должна ближе к `p≈0.28`, а не к `p≈0.17`.

### MAJOR — мобильная композиция слишком буквальная

`top: 68%` ставит wordmark примерно на уровень головы. На скриншоте он проходит через линию визора и по бокам читается как горизонтальный заголовок. Слой действительно находится за canvas робота благодаря `z-index`, но визуально он не «опущен за голову».

### MAJOR — мобильная маска не мягче, а резче

Сейчас:

```css
-webkit-mask-image: linear-gradient(90deg, transparent 0, #000 18%);
```

Вся маска раскрывается на первых 18% ширины, после чего текст почти полностью видим. Это жёсткий обрезающий градиент. Для мобильного требовалась более мягкая проекция, а не более короткий fade.

### MINOR — призрачный край входит в зону H1

H1 читается: тёмный сплошной текст явно сильнее светлого raster wordmark. Это не accessibility-проблема и не блокер.

Но на десктопе `WEB-STUDIO` физически проходит под правой частью строк H1. Получается лишняя текстура в зоне основного сообщения. Левую призрачную часть сохранять нужно, но её раскрытие стоит растянуть.

## CSS-правки

```diff
 .hero-wordmark {
   position: absolute;
   z-index: 2;
   top: 42%;
   left: 50%;
   width: 100%;
   text-align: center;
   white-space: nowrap;
   pointer-events: none;
   user-select: none;
-  opacity: calc(1 - min(1, var(--hero-p, 0) * 6));
+  /* Исчезает примерно к p=0.286, а не к p=0.167 */
+  opacity: calc(1 - min(1, var(--hero-p, 0) * 3.5));
   transform: translate(-50%, -50%);
   translate: 0 calc(var(--hero-p, 0) * -56px);
 }

 .hero-wordmark span {
   font-family: var(--font-display);
   font-size: clamp(56px, 9.6vw, 150px);
   font-weight: 700;
   line-height: 0.9;
   letter-spacing: calc(-0.02em + var(--hero-p, 0) * 0.16em);
-  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 42%);
-  mask-image: linear-gradient(90deg, transparent 0, #000 42%);
+  -webkit-mask-mode: alpha;
+  mask-mode: alpha;
+  -webkit-mask-image: linear-gradient(
+    90deg,
+    transparent 0%,
+    rgba(0, 0, 0, 0.12) 22%,
+    rgba(0, 0, 0, 0.42) 52%,
+    #000 76%
+  );
+  mask-image: linear-gradient(
+    90deg,
+    transparent 0%,
+    rgba(0, 0, 0, 0.12) 22%,
+    rgba(0, 0, 0, 0.42) 52%,
+    #000 76%
+  );
   color: transparent;
   -webkit-text-stroke: 1.5px rgba(13, 17, 23, 0.5);
   background: repeating-linear-gradient(
     180deg,
     rgba(0, 154, 160, 0.4) 0 2px,
@@
 @media (max-width: 767px) {
-  .hero-wordmark { top: 68%; }
+  .hero-wordmark { top: 72%; }

   .hero-wordmark span {
     font-size: clamp(34px, 12vw, 84px);
     -webkit-text-stroke-width: 1px;
-    -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 18%);
-    mask-image: linear-gradient(90deg, transparent 0, #000 18%);
+    -webkit-mask-image: linear-gradient(
+      90deg,
+      transparent 0%,
+      rgba(0, 0, 0, 0.1) 22%,
+      rgba(0, 0, 0, 0.36) 46%,
+      #000 70%
+    );
+    mask-image: linear-gradient(
+      90deg,
+      transparent 0%,
+      rgba(0, 0, 0, 0.1) 22%,
+      rgba(0, 0, 0, 0.36) 46%,
+      #000 70%
+    );
   }
 }
```

TSX менять не нужно. Текущая структура правильная:

```tsx
<div className="hero-wordmark" aria-hidden="true">
  <span>WEB-STUDIO</span>
</div>
```

`aria-hidden`, `pointer-events: none` и отдельный существующий `--hero-p` соблюдены. Добавлять отдельный scroll listener, `role`, обработчики или интерактивность нельзя.

## Отдельная оценка

### Читаемость H1

**Хорошая, но не идеально чистая.** H1 остаётся главным: он тёмный, плотный и контрастирует с бледным wordmark. Однако raster-текст заходит под правую часть H1, поэтому на крупных экранах появляется ненужная текстура в зоне сообщения. Более длинная маска из патча это исправляет, не убивая призрачный левый край.

### Баланс хроматики

**В целом правильный.** Cyan доминирует, magenta слабее:

```css
rgba(0, 201, 212, 0.3)
rgba(255, 0, 90, 0.13)
```

Это не симметричный glitch и не neon-slop. Магента работает как вторичный оптический сдвиг. Усиливать её нельзя. Убирать wordmark из-за хроматики тоже не нужно.

### Исчезновение к 17% прогресса

**Нет, слишком рано.** Математически текущий множитель `6` делает wordmark невидимым уже при `p=1/6`. После патча с `3.5` он будет сохраняться до `p≈0.286`, но на `p=0.3` всё ещё исчезнет — поэтому существующий скриншот `wm-hero03` не будет сломан.

### Мобильное расположение

**Текущая идея правильная, исполнение неточное.** Робот действительно перекрывает центральную часть надписи, но wordmark сидит на уровне лица и слишком хорошо читается по бокам. `top: 72%` опускает его за голову, а широкая alpha-маска превращает левый край из жёсткого обрезания в мягкий остаточный след.

## Wordmark — слоп или нет

**Не слоп и не лишний. Выпиливать не нужно.** Здесь есть понятная функция: глубина, проекция, айдентика и связь с роботом. Слопом он становится только в момент, когда эффект существует сам по себе: слишком ранний fade и жёсткая мобильная маска превращают его в декоративный баннер.

После этих трёх правок wordmark остаётся оправданным слоем, а не эффектом ради эффекта.

_usage: {"completion_tokens":10187,"prompt_tokens":8841,"total_tokens":19028,"completion_tokens_details":{"reasoning_tokens":8286,"accepted_prediction_tokens":0,"audio_tokens":0,"rejected_prediction_tokens":0,"image_tokens":0},"prompt_tokens_details":{"cached_tokens":8704,"audio_tokens":0,"cache_write_tokens":0,"video_tokens":0},"cost":0.146704,"is_byok":false}_
