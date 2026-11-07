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
