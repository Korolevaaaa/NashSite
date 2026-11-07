Второй раунд ревью wordmark WEB-STUDIO (ZETRONIX hero). Контекст и ограничения — те же, что в прошлом запросе (робот/сетка/переход/луч не трогаем, аудитория — бизнес-клиенты, светлая премиальная тема, без слопа).

# ЧТО ИЗМЕНЕНО (commit `e0b3fdb`)

Твои три MAJOR + MINOR из прошлого раунда внедрены дословно:

```css
.hero-wordmark {
  opacity: calc(1 - min(1, var(--hero-p, 0) * 3.5)); /* было *6 */
}
.hero-wordmark span {
  /* длинная мягкая маска вместо жёсткого 42% */
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.12) 22%, rgba(0,0,0,0.42) 52%, #000 76%);
  mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.12) 22%, rgba(0,0,0,0.42) 52%, #000 76%);
}
@media (max-width: 767px) {
  .hero-wordmark { top: 72%; } /* было 68% */
  .hero-wordmark span {
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 22%, rgba(0,0,0,0.36) 46%, #000 70%);
    mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 22%, rgba(0,0,0,0.36) 46%, #000 70%);
  }
}
```

# СКРИНШОТЫ (свежие, после правок)

1. `wm-hero0` — p=0 десктоп: левый край мягко уходит под текст, правая часть чёткая за роботом
2. `wm-hero03` — p=0.3: расфокус почти завершён (теперь гаснет к ~0.29)
3. `wm-scrub075`, `wm-scrub09` — луч и голограмма без изменений (контроль)
4. `wm-hero0-m` — мобила: надпись опущена за корпус робота

# НУЖНО

1. **ВЕРДИКТ**: PASS / CONDITIONAL / FAIL + почему.
2. Закрыты ли твои MAJOR-ы по скринам?
3. Если остались MINOR — конкретные правки кодом. Не придумывай новых проблем без скрин-доказательств.
