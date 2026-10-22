const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const SECRET      = process.env.RESET_SECRET;

async function redis(...args) {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  const { result } = await res.json();
  return result;
}

export default async function handler(req, res) {
  const { secret } = req.query;

  if (!SECRET || secret !== SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  await redis('DEL', 'gifts');

  return res.json({ ok: true, message: '¡Contadores reiniciados! 🍼' });
}
