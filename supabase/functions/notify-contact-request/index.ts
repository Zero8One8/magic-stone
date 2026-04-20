const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Payload = {
  name?: string;
  phone?: string;
  service?: string;
  comment?: string;
  source?: string;
  page_url?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    const TELEGRAM_NOTIFICATIONS_CHAT_ID = Deno.env.get("TELEGRAM_NOTIFICATIONS_CHAT_ID");

    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY || !TELEGRAM_NOTIFICATIONS_CHAT_ID) {
      return new Response(JSON.stringify({ ok: false, error: "Telegram env is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Payload;
    const message = [
      "📩 <b>Новая заявка с сайта</b>",
      "",
      `<b>Имя:</b> ${escapeHtml(body.name || "—")}`,
      `<b>Телефон:</b> ${escapeHtml(body.phone || "—")}`,
      `<b>Услуга:</b> ${escapeHtml(body.service || "—")}`,
      `<b>Источник:</b> ${escapeHtml(body.source || "—")}`,
      `<b>Страница:</b> ${escapeHtml(body.page_url || "—")}`,
      "",
      `<b>Комментарий:</b> ${escapeHtml(body.comment || "—")}`,
    ].join("\n");

    const response = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
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