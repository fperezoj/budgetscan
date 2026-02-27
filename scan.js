const CATEGORIES = ["Supermercado","Farmacia","Restaurante","Transporte","Entretenimiento","Ropa","Hogar","Salud","Educación","Servicios","Otros"];

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };

  try {
    const { base64, mimeType, date } = JSON.parse(event.body);
    if (!base64 || !mimeType) return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing image data" }) };

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
            { type: "text", text: `Analiza esta boleta/ticket de compra. Extrae todos los ítems con sus montos.
Clasifica cada ítem en una de estas categorías: ${CATEGORIES.join(", ")}.
Responde SOLO en JSON sin texto adicional ni backticks:
{"store":"nombre comercio","date":"YYYY-MM-DD","total":monto_número,"items":[{"name":"nombre","amount":monto_número,"category":"categoría"}]}
Si no aparece fecha usa: ${date}.` }
          ]
        }]
      })
    });

    if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
    const data = await res.json();
    const text = data.content?.find(b => b.type === "text")?.text || "{}";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

    return { statusCode: 200, headers, body: JSON.stringify(parsed) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
