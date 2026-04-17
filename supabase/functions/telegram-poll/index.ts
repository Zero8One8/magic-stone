import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";
const MAX_RUNTIME_MS = 55_000;
const MIN_REMAINING_MS = 5_000;

Deno.serve(async () => {
  const startTime = Date.now();

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
  if (!TELEGRAM_API_KEY) throw new Error("TELEGRAM_API_KEY is not configured");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let totalProcessed = 0;

  const { data: state, error: stateErr } = await supabase
    .from("telegram_bot_state")
    .select("update_offset")
    .eq("id", 1)
    .single();

  if (stateErr) {
    return new Response(JSON.stringify({ error: stateErr.message }), { status: 500 });
  }

  let currentOffset = state.update_offset;

  while (true) {
    const elapsed = Date.now() - startTime;
    const remainingMs = MAX_RUNTIME_MS - elapsed;
    if (remainingMs < MIN_REMAINING_MS) break;

    const timeout = Math.min(50, Math.floor(remainingMs / 1000) - 5);
    if (timeout < 1) break;

    const response = await fetch(`${GATEWAY_URL}/getUpdates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offset: currentOffset,
        timeout,
        allowed_updates: ["message"],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data }), { status: 502 });
    }

    const updates = data.result ?? [];
    if (updates.length === 0) continue;

    for (const update of updates) {
      const msg = update.message;
      if (!msg?.text) continue;

      const chatId = msg.chat.id;
      const text = msg.text.trim();
      const firstName = msg.from?.first_name || "";
      const username = msg.from?.username || "";

      if (text === "/start" || text === "/subscribe") {
        // Subscribe user
        await supabase.from("telegram_subscribers").upsert(
          {
            chat_id: chatId,
            first_name: firstName,
            username: username,
            is_active: true,
          },
          { onConflict: "chat_id" }
        );

        await sendMessage(
          chatId,
          `✨ Добро пожаловать, ${firstName}!\n\nВы подписались на рассылку «Камень дня» 💎\n\nКаждый день вы будете получать информацию о камне, его свойствах и аффирмацию.\n\nКоманды:\n/stop — отписаться\n/crystal — получить камень дня прямо сейчас`,
          LOVABLE_API_KEY,
          TELEGRAM_API_KEY
        );
        totalProcessed++;
      } else if (text === "/stop" || text === "/unsubscribe") {
        await supabase
          .from("telegram_subscribers")
          .update({ is_active: false })
          .eq("chat_id", chatId);

        await sendMessage(
          chatId,
          "Вы отписались от рассылки. Чтобы подписаться снова — /start",
          LOVABLE_API_KEY,
          TELEGRAM_API_KEY
        );
        totalProcessed++;
      } else if (text === "/crystal") {
        // Send today's crystal
        const { crystals } = await import("../_shared/crystals-data.ts");
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
        );
        const crystal = crystals[dayOfYear % crystals.length];

        const message = formatCrystalMessage(crystal);
        await sendMessage(chatId, message, LOVABLE_API_KEY, TELEGRAM_API_KEY);
        totalProcessed++;
      }
    }

    const newOffset = Math.max(...updates.map((u: any) => u.update_id)) + 1;
    await supabase
      .from("telegram_bot_state")
      .update({ update_offset: newOffset, updated_at: new Date().toISOString() })
      .eq("id", 1);

    currentOffset = newOffset;
  }

  return new Response(JSON.stringify({ ok: true, processed: totalProcessed }));
});

async function sendMessage(
  chatId: number,
  text: string,
  lovableKey: string,
  telegramKey: string
) {
  await fetch(`${GATEWAY_URL}/sendMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": telegramKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });
}

function formatCrystalMessage(crystal: any): string {
  const chakras = crystal.chakras.join(", ");
  const effects = crystal.effects.map((e: string) => `• ${e}`).join("\n");

  return `💎 <b>Камень дня: ${crystal.name}</b>

${crystal.description}

🔮 <b>Чакры:</b> ${chakras}

✨ <b>Свойства:</b>
${effects}

🧘 <b>Как использовать:</b>
${crystal.howToUse}

💫 <i>«${crystal.quote}»</i>

🌐 Подробнее на сайте: магия-камней.рф/catalog`;
}
