import { LEGAL } from "../../data/legal";
import { useSeo } from "../../hooks/useSeo";

/* Юридические страницы: /privacy (политика ПДн, 152-ФЗ) и /oferta
   (публичная оферта на готовые макеты). Реквизиты — src/data/legal.ts. */

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-8 text-lg font-semibold text-[var(--z-ink)]">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-2 text-[14px] leading-relaxed text-[var(--z-ink)]/70">
    {children}
  </p>
);

export function PrivacyPage() {
  useSeo({
    title: `Политика конфиденциальности — ${LEGAL.siteName}`,
    description: `Политика обработки персональных данных ${LEGAL.siteName}`,
    path: "/privacy",
  });
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-[var(--z-ink)]">
        Политика конфиденциальности
      </h1>
      <P>
        Настоящая политика описывает, как {LEGAL.siteName} ({LEGAL.entityName},
        ИНН {LEGAL.inn}) обрабатывает персональные данные посетителей сайта{" "}
        {LEGAL.siteUrl} в соответствии с ФЗ-152 «О персональных данных».
      </P>
      <H>Что мы собираем</H>
      <P>
        Имя и контактные данные (телефон, e-mail, Telegram), которые вы
        добровольно указываете в формах заявки; технические данные визита —
        страницы просмотров, источник перехода, время на сайте — в обезличенном
        виде для аналитики.
      </P>
      <H>Зачем</H>
      <P>
        Чтобы связаться с вами по заявке, подготовить предложение и смету,
        улучшать сайт и рекламу. Данные не продаются и не передаются третьим
        лицам, кроме подрядчиков, участвующих в обработке заявки.
      </P>
      <H>Хранение и удаление</H>
      <P>
        Данные хранятся до достижения целей обработки. Вы можете запросить
        уточнение или удаление своих данных письмом на{" "}
        <a className="underline" href={`mailto:${LEGAL.privacyEmail}`}>
          {LEGAL.privacyEmail}
        </a>
        .
      </P>
      <H>Cookies и аналитика</H>
      <P>
        Сайт использует Яндекс.Метрику и технические cookies для статистики
        посещаемости. Продолжая пользоваться сайтом, вы соглашаетесь с этой
        политикой.
      </P>
    </main>
  );
}

export function OfferPage() {
  useSeo({
    title: `Публичная оферта — ${LEGAL.siteName}`,
    description: `Условия продажи готовых макетов сайтов ${LEGAL.siteName}`,
    path: "/oferta",
  });
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-[var(--z-ink)]">
        Публичная оферта
      </h1>
      <P>
        {LEGAL.entityName} (ИНН {LEGAL.inn}), далее «Исполнитель», предлагает
        заключить договор на передачу прав использования готовых макетов сайтов
        и услуг по их адаптации на условиях ниже.
      </P>
      <H>Предмет</H>
      <P>
        Исполнитель передаёт заказчику неисключительное право использования
        выбранного макета и выполняет его адаптацию (бренд, тексты, фото,
        контакты) в оговорённый срок. Цены указаны на страницах макетов и
        фиксируются в смете до начала работ.
      </P>
      <H>Порядок оплаты и сдачи</H>
      <P>
        Разовая оплата по смете после согласования состава работ. Доработки
        сверх сметы оцениваются отдельно и запускаются только после
        подтверждения заказчиком.
      </P>
      <H>Права</H>
      <P>
        После оплаты заказчик получает развёрнутый сайт и право его
        коммерческого использования без ограничений по времени. Исполнитель
        вправе показывать работу в портфолио без коммерческих данных заказчика.
      </P>
      <H>Реквизиты</H>
      <P>
        {LEGAL.entityName}, ИНН {LEGAL.inn}, {LEGAL.city}
        {LEGAL.address ? `, ${LEGAL.address}` : ""}. Почта:{" "}
        <a className="underline" href={`mailto:${LEGAL.privacyEmail}`}>
          {LEGAL.privacyEmail}
        </a>
      </P>
    </main>
  );
}
