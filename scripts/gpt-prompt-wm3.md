Жёсткий ревью-раунд, третий. Ты уже дважды видел этот wordmark (ZETRONIX hero, светлая премиальная тема, аудитория — бизнес-клиенты). Заказчик посмотрел на твой PASS и сказал: «надпись супер слоповая, пластиковая, хочется её разъебать». Он прав был: scanline-залив в контуре — клипарт.

# ЧТО ПОМЕНЯЛОСЬ (commit `f7c0f43`)

Полностью пересобрана стилистика. Убрано: scanline-растр, маджента, равномерная хроматика. Теперь:

```css
.hero-wordmark {
  /* слой между сеткой z0 и роботом z3; mask — как раньше */
  opacity: calc(1 - min(1, var(--hero-p, 0) * 3.5));
  translate: 0 calc(var(--hero-p, 0) * -56px);
  filter: blur(calc(var(--hero-p, 0) * 3px));
}
.hero-wordmark span {
  /* матовая чернильная заливка, плотнее к базовой линии */
  color: transparent;
  background: linear-gradient(180deg, rgba(13,17,23,0.06), rgba(13,17,23,0.21));
  -webkit-background-clip: text;
  letter-spacing: calc(-0.015em + var(--hero-p, 0) * 0.1em);
}
.hero-wordmark span::before { /* cyan-эхо, уходит влево-вверх */
  content: "WEB-STUDIO"; position: absolute; inset: 0; color: transparent;
  -webkit-text-stroke: 1px rgba(0,154,160,0.55);
  translate: calc(-1px - var(--hero-p,0) * 14px) calc(var(--hero-p,0) * -6px);
}
.hero-wordmark span::after { /* чернильное эхо, уходит вправо-вниз */
  content: "WEB-STUDIO"; position: absolute; inset: 0; color: transparent;
  -webkit-text-stroke: 1px rgba(21,27,32,0.28);
  translate: calc(1px + var(--hero-p,0) * 14px) calc(var(--hero-p,0) * 6px);
}
```

Идея: в покое — тихий водяной знак с едва заметной кромкой; при скролле эхо-слои расходятся + blur — как проектор, у которого разъехалось сведение лучей.

# СКРИНШОТЫ

1. `wm-v3-hero0` — p=0: водяной знак за роботом
2. `wm-v3-p15` — p=0.15: эхо разъехались, blur, полу-фейд — «проекция теряет сведение»

# НУЖНО

Максимально жёстко, отрицание по умолчанию:
1. PASS / CONDITIONAL / FAIL + почему.
2. Ушёл ли «пластик»? Теперь это водяной знак — не стал ли он наоборот слишком блеклым/незаметным? Если да — конкретные значения (альфы, stroke, размер).
3. Читается ли метафора «несведённого луча» на p15 или это просто мыло?
4. Если видишь способ сделать интереснее одним ходом — предложи с кодом, но без глитча и неона.
