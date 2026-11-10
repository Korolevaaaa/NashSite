import { initialsOf, type Partner } from "../data/partners";
import { CONTACT_EMAIL } from "../data/content";

/* Плавающая карточка «ваш менеджер» — показывается посетителям,
   пришедшим по ref-ссылке партнёра. CTA ведёт на контакты партнёра
   (его лиды идут напрямую к нему, минуя общие каналы). */
export default function PartnerBadge({ partner }: { partner: Partner }) {
  const tg = partner.telegram?.replace(/^@/, "");
  const href = tg
    ? `https://t.me/${tg}`
    : partner.phone
      ? `tel:${partner.phone.replace(/[^\d+]/g, "")}`
      : `mailto:${partner.email ?? CONTACT_EMAIL}?subject=${encodeURIComponent(`Заявка с сайта — менеджер ${partner.name}`)}`;

  return (
    <aside
      aria-label="Ваш персональный менеджер"
      className="fixed bottom-5 right-5 z-40 w-[min(300px,calc(100vw-40px))] rounded-2xl border border-[var(--z-line)] bg-white/95 p-4 shadow-[0_12px_40px_rgba(21,27,32,0.14)] backdrop-blur"
    >
      <div className="flex items-center gap-3">
        {partner.photo ? (
          <img
            src={partner.photo}
            alt={partner.name}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-full bg-[var(--z-ink)] text-[13px] font-semibold tracking-wide text-white"
          >
            {initialsOf(partner.name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="zt-meta !mt-0 !text-[10px]">Ваш менеджер</p>
          <p className="truncate text-[14px] font-semibold text-[var(--z-ink)]">
            {partner.name}
          </p>
          <p className="text-[11px] text-[var(--z-ink)]/55">{partner.role}</p>
        </div>
      </div>
      <a
        href={href}
        className="mt-3 block rounded-xl bg-[var(--z-ink)] px-4 py-2.5 text-center text-[13px] font-medium text-white transition-opacity hover:opacity-85"
      >
        Написать менеджеру
      </a>
    </aside>
  );
}
