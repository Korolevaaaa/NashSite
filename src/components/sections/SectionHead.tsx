export default function SectionHead({
  title,
  sub,
  eyebrow,
}: {
  title: string;
  sub?: string;
  /** set ONLY where the title is ambiguous without it (max ~1 in 3 sections) */
  eyebrow?: string;
}) {
  return (
    <header className="max-w-[760px]">
      {eyebrow && <p className="zt-kicker mb-4">{eyebrow}</p>}
      <h2 className="zt-title">{title}</h2>
      {sub && <p className="zt-lead mt-4">{sub}</p>}
    </header>
  );
}
