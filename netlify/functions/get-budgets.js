exports.handler = async () => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  try {
    const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/budgets`, {
      headers: { "apikey": process.env.SUPABASE_KEY, "Authorization": `Bearer ${process.env.SUPABASE_KEY}` }
    });
    const rows = await r.json();
    // Convertir array [{category, amount}] a objeto {Supermercado: 150000, ...}
    const budgets = {};
    rows.forEach(row => { budgets[row.category] = row.amount; });
    return { statusCode: 200, headers, body: JSON.stringify(budgets) };
  } catch(err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
