/* Реквизиты для юридических страниц (/privacy, /oferta).
   ЗАПОЛНИТЬ перед деплоем — прислать: статус, ФИО/название, ИНН,
   город/адрес, почта для ПДн-запросов. */
export const LEGAL = {
  entityType: "self-employed" as
    | "self-employed"
    | "ip"
    | "ooo", // самозанятый / ИП / ООО
  entityName: "Королева Валерия Евгеньевна",
  inn: "540860780515",
  city: "Новосибирск",
  address: "", // домашний адрес не публикуем — город + почта достаточно
  privacyEmail: "noreply@zetronix.ru",
  phone: "+7 (953) 873-49-73",
  siteName: "ZETRONIX",
  siteUrl: "https://zetronix.ru",
};
