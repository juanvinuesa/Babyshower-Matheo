const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(503).json({ error: 'Redis no configurado', counts: {} });
  }

  try {
    if (req.method === 'GET') {
      const raw = await redis('HGETALL', 'gifts');
      const counts = {};
      if (Array.isArray(raw)) {
        for (let i = 0; i < raw.length; i += 2) {
          counts[raw[i]] = parseInt(raw[i + 1], 10);
        }
      }
      return res.json({ counts });
    }

    if (req.method === 'POST') {
      const { id, delta } = req.body ?? {};
      if (!id || typeof delta !== 'number') {
        return res.status(400).json({ error: 'Faltan id o delta' });
      }
      const newVal = await redis('HINCRBY', 'gifts', String(id), delta);
      if (typeof newVal === 'number' && newVal < 0) {
        await redis('HSET', 'gifts', String(id), 0);
      }
      return res.json({ ok: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }

  res.status(405).end();
}
