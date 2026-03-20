export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Brak tekstu" });

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
      system: "You are a professional Polish to Croatian translator. Translate every message you receive from Polish to Croatian. Return ONLY the Croatian translation — no explanations, no notes, no original text. Preserve tone, style, and formatting.",
      messages: [{ role: "user", content: text }]
    })
  });

  const data = await response.json();
  if (!response.ok) return res.status(500).json({ error: data.error?.message });

  res.json({ translation: data.content?.[0]?.text || "" });
}
