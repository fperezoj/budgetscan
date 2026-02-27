exports.handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod !== "DELETE") return { statusCode: 405, headers, body: "Method Not Allowed" };
  try {
    const { id } = JSON.parse(event.body);
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/expenses?id=eq.${id}`, {
      method: "DELETE",
      headers: { "apikey": process.env.SUPABASE_KEY, "Authorization": `Bearer ${process.env.SUPABASE_KEY}` }
    });
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch(err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
