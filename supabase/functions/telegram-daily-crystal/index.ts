import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crystals } from "../_shared/crystals-data.ts";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

Deno.serve(async () => {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
  if (!TELEGRAM_API_KEY) throw new Error("TELEGRAM_API_KEY is not configured");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Check if already sent today
  const { data: state } = await supabase
    .from("telegram_bot_state")
    .select("last_sent_date, last_crystal_index")
    .eq("id", 1)
    .single();

  const today = new Date().toISOString().split("T")[0];
  if (state?.last_sent_date === today) {
    return new Response(JSON.stringify({ ok: true, message: "Already sent today" }));
  }

  // Pick crystal of the day
  const todayDate = new Date();
  const dayOfYear = Math.floor(
    (todayDate.getTime() - new Date(todayDate.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const crystalIndex = dayOfYear % crystals.length;
  const crystal = crystals[crystalIndex];

  // Get active subscribers
  const { data: subscribers, error } = await supabase
    .from("telegram_subscribers")
    .select("chat_id")
    .eq("is_active", true);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const message = formatCrystalMessage(crystal);
  let sent = 0;
  let failed = 0;

  for (const sub of subscribers || []) {
    try {
      const res = await fetch(`${GATEWAY_URL}/sendMessage`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TELEGRAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: sub.chat_id,
          text: message,
          parse_mode: "HTML",
        }),
      });

      if (res.ok) {
        sent++;
      } else {
        const errData = await res.json();
        // If user blocked the bot, deactivate
        if (errData?.description?.includes("blocked") || errData?.description?.includes("deactivated")) {
          await supabase
            .from("telegram_subscribers")
            .update({ is_active: false })
            .eq("chat_id", sub.chat_id);
        }
        failed++;
      }
    } catch {
      failed++;
    }
  }

  // Update state
  await supabase
    .from("telegram_bot_state")
    .update({
      last_sent_date: today,
      last_crystal_index: crystalIndex,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  return new Response(
    JSON.stringify({ ok: true, crystal: crystal.name, sent, failed, total: subscribers?.length })
  );
});

function formatCrystalMessage(crystal: { chakras: string[]; effects: string[]; name: string; description: string }): string {
  const chakras = crystal.chakras.join(", ");
  const effects = crystal.effects.map((e: string) => `• ${e}`).join("\n");

  return `🌅 <b>Доброе утро! Ваш камень дня:</b>

💎 <b>${crystal.name}</b>

${crystal.description}

🔮 <b>Чакры:</b> ${chakras}

✨ <b>Свойства:</b>
${effects}

🧘 <b>Как использовать сегодня:</b>
${crystal.howToUse}

💫 <i>«${crystal.quote}»</i>

Хорошего дня! ✨`;
}
