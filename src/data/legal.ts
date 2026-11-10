/* Реквизиты для юридических страниц (/privacy, /oferta).
   ЗАПОЛНИТЬ перед деплоем — прислать: статус, ФИО/название, ИНН,
   город/адрес, почта для ПДн-запросов. */
export const LEGAL = {
  entityType: "self-employed" as
    | "self-employed"
    | "ip"
    | "ooo", // самозанятый / ИП / ООО
  entityName: "ФИО / Название — заполнить", // TODO: реквизиты владельца
  inn: "—", // TODO: ИНН
  city: "Новосибирск",
  address: "", // TODO: юридический/почтовый адрес
  privacyEmail: "noreply@zetronix.ru",
  siteName: "ZETRONIX",
  siteUrl: "https://zetronix.ru",
};
