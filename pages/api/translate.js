export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { text, style } = req.body;
  if (!text) return res.status(400).json({ error: "Brak tekstu" });

  const systemPrompts = {
    formal: "You are a professional Polish to Croatian translator specializing in formal business correspondence. Translate the text from Polish to Croatian using formal, professional business language. Use formal forms of address. Return ONLY the Croatian translation — no explanations, no notes, no original text.",
    casual: "You are a Polish to Croatian translator. Translate the text from Polish to Croatian using casual, relaxed, everyday language — as if texting a friend. Return ONLY the Croatian translation — no explanations, no notes, no original text.",
    neutral: "You are a professional Polish to Croatian translator. Translate every message you receive from Polish to Croatian. Return ONLY the Croatian translation — no explanations, no notes, no original text. Preserve tone, style, and formatting."
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompts[style] || systemPrompts.neutral,
      messages: [{ role: "user", content: text }]
    })
  });

  const data = await response.json();
  if (!response.ok) return res.status(500).json({ error: data.error?.message });

  res.json({ translation: data.content?.[0]?.text || "" });
}
