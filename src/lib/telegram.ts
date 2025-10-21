
import { Telegraf, Markup } from "telegraf";

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

export function buildLeadMessage(lead: any) {
  const cats = (lead.categories || []).join(", ");
  const models = (lead.models || []).map((m:any) => m.model?.name).join("; ");
  return `🆕 Новый лид\nИмя: ${lead.customerName}\nТел: ${lead.phone}\nКатегории: ${cats}\nМодели: ${models}`;
}

export function clientMenu() {
  return Markup.keyboard([["Каталог", "Отзывы", "Открыть сайт"]]).resize();
}
