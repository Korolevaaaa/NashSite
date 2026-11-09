import { useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/* «Какой сценарий ваш» — мини-квиз внутри статьи.
   3 вопроса → рекомендация сценария + ссылка на витрину. */

type ScenId = "template" | "freelance" | "maket" | "studio";

interface Result {
  id: ScenId;
  title: string;
  text: string;
  link?: string;
  linkLabel?: string;
}

const RESULTS: Record<ScenId, Result> = {
  template: {
    id: "template",
    title: "Шаблон с маркетплейса — 3–15к ₽",
    text: "Ваш вариант — попробовать сами: купите шаблон на ThemeForest или тему в конструкторе и наполните сами. Но помните про скрытые расходы из статьи — времени уйдёт больше, чем кажется.",
  },
  freelance: {
    id: "freelance",
    title: "Фрилансер — 15–30к ₽",
    text: "Задача простая, бюджет аккуратный — проверенный фрилансер справится. Главное — берите по рекомендации и фиксируйте, что входит в цену.",
  },
  maket: {
    id: "maket",
    title: "Готовый макет с адаптацией — 20–45к ₽",
    text: "Ваш сценарий — золотая середина: проверенный сайт под нишу, ваш бренд и запуск за неделю. Посмотрите нашу витрину — там уже есть макеты для ресторанов, баз отдыха и магазинов.",
    link: "#templates",
    linkLabel: "Открыть витрину",
  },
  studio: {
    id: "studio",
    title: "Студия с нуля — от 40к ₽",
    text: "У вас нестандартная задача или сайт — сам продукт. Здесь нужен полный цикл: стратегия, уникальный дизайн, разработка. Расскажите задачу — посчитаем честно.",
    link: "#contacts",
    linkLabel: "Обсудить проект",
  },
};

const QUESTIONS: { q: string; opts: { t: string; points: Partial<Record<ScenId, number>> }[] }[] = [
  {
    q: "Что за сайт нужен?",
    opts: [
      { t: "Лендинг или визитка", points: { maket: 2, freelance: 1 } },
      { t: "Магазин или сервис", points: { maket: 2, studio: 1 } },
      { t: "Нестандартный проект", points: { studio: 3 } },
    ],
  },
  {
    q: "Сколько времени готовы вложить сами?",
    opts: [
      { t: "Ноль — нужно под ключ", points: { maket: 2, studio: 2 } },
      { t: "Готов разбираться сам", points: { template: 3, freelance: 1 } },
    ],
  },
  {
    q: "Какой бюджет реалистичен?",
    opts: [
      { t: "До 15 000 ₽", points: { template: 3 } },
      { t: "20 000–50 000 ₽", points: { maket: 3, freelance: 1 } },
      { t: "60 000 ₽ и больше", points: { studio: 3 } },
    ],
  },
];

export default function CostQuiz() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<ScenId, number>>({
    template: 0,
    freelance: 0,
    maket: 0,
    studio: 0,
  });
  const [done, setDone] = useState(false);

  const q = QUESTIONS[step];

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setTimeout(
      () => {
        const pts = q.opts[i].points;
        const next = { ...scores };
        (Object.keys(pts) as ScenId[]).forEach(
          (k) => (next[k] += pts[k] ?? 0),
        );
        setScores(next);
        setPicked(null);
        if (step + 1 < QUESTIONS.length) setStep(step + 1);
        else setDone(true);
      },
      reduced ? 0 : 380,
    );
  };

  const restart = () => {
    setStep(0);
    setPicked(null);
    setDone(false);
    setScores({ template: 0, freelance: 0, maket: 0, studio: 0 });
  };

  const winner = (Object.keys(scores) as ScenId[]).reduce((a, b) =>
    scores[b] > scores[a] ? b : a,
  );
  const result = RESULTS[winner];

  return (
    <div className={`post-viz quiz ${done ? "is-done" : ""}`}>
      <div className="quiz__head">
        <span className="quiz__tag">Мини-тест</span>
        <div className="quiz__dots" aria-hidden="true">
          {QUESTIONS.map((_, i) => (
            <i
              key={i}
              className={
                done || i < step ? "is-past" : i === step ? "is-now" : ""
              }
            />
          ))}
        </div>
      </div>

      {!done ? (
        <div className="quiz__q" key={step}>
          <p className="quiz__title">
            {step + 1}. {q.q}
          </p>
          <div className="quiz__opts">
            {q.opts.map((o, i) => (
              <button
                key={o.t}
                type="button"
                className={`quiz__opt ${picked === i ? "is-pick" : ""}`}
                onClick={() => answer(i)}
              >
                {o.t}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="quiz__result">
          <p className="quiz__res-label">Ваш сценарий:</p>
          <p className="quiz__res-title">{result.title}</p>
          <p className="quiz__res-text">{result.text}</p>
          <div className="quiz__res-actions">
            {result.link && (
              <a className="quiz__res-btn" href={result.link}>
                {result.linkLabel}
              </a>
            )}
            <button type="button" className="quiz__again" onClick={restart}>
              Пройти заново
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
