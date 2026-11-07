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
