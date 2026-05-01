const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Payload = {
  name?: string;
  phone?: string;
  contact_method?: string;
  service?: string;
  comment?: string;
  source?: string;
  page_url?: string;
  // delivery fields
  city?: string;
  pickup_point?: string;
  delivery_comment?: string;
  order_id?: string;
  email?: string;
  record?: Payload;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_NOTIFICATIONS_CHAT_ID =
      Deno.env.get("TELEGRAM_NOTIFICATIONS_CHAT_ID") || Deno.env.get("ADMIN_ID");

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_NOTIFICATIONS_CHAT_ID) {
      return new Response(JSON.stringify({ ok: false, error: "Set TELEGRAM_BOT_TOKEN and TELEGRAM_NOTIFICATIONS_CHAT_ID (or ADMIN_ID)" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = (await req.json()) as Payload;
    const body = payload.record ?? payload;

    const isDelivery = body.source === "delivery_form" || Boolean(body.city);

    let message: string;
    if (isDelivery) {
      message = [
        "🚚 <b>Новая заявка на доставку</b>",
        "",
        `<b>Имя:</b> ${escapeHtml(body.name || "—")}`,
        `<b>Телефон:</b> ${escapeHtml(body.phone || "—")}`,
        body.email ? `<b>Email:</b> ${escapeHtml(body.email)}` : null,
        `<b>Telegram/WhatsApp:</b> ${escapeHtml(body.contact_method || "—")}`,
        `<b>Город:</b> ${escapeHtml(body.city || "—")}`,
        `<b>Пункт выдачи:</b> ${escapeHtml(body.pickup_point || "—")}`,
        body.delivery_comment ? `<b>Комментарий:</b> ${escapeHtml(body.delivery_comment)}` : null,
        body.order_id ? `<b>Заказ:</b> ${escapeHtml(body.order_id)}` : null,
        `<b>Страница:</b> ${escapeHtml(body.page_url || "—")}`,
      ].filter(Boolean).join("\n");
    } else {
      message = [
        "📩 <b>Новая заявка с сайта</b>",
        "",
        `<b>Имя:</b> ${escapeHtml(body.name || "—")}`,
        `<b>Телефон:</b> ${escapeHtml(body.phone || "—")}`,
        `<b>Telegram/WhatsApp:</b> ${escapeHtml(body.contact_method || "—")}`,
        `<b>Услуга:</b> ${escapeHtml(body.service || "—")}`,
        `<b>Источник:</b> ${escapeHtml(body.source || "—")}`,
        `<b>Страница:</b> ${escapeHtml(body.page_url || "—")}`,
        "",
        `<b>Комментарий:</b> ${escapeHtml(body.comment || "—")}`,
      ].join("\n");
    }

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: Number(TELEGRAM_NOTIFICATIONS_CHAT_ID),
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return new Response(JSON.stringify({ ok: false, error: text }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
