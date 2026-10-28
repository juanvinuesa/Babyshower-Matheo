import { GIFTS_BY_ID } from '../src/data/gifts.js';

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Libera `release` y toma `pick` en una sola operación atómica.
// Devuelve -1 si `pick` ya llegó a su cupo (y no cambia nada).
const SWAP_SCRIPT = `
local pick, max, release = ARGV[1], tonumber(ARGV[2]), ARGV[3]
if pick ~= '' and max > 0 then
  local c = tonumber(redis.call('HGET', KEYS[1], pick) or '0')
  if c >= max then return -1 end
end
if release ~= '' then
  local r = tonumber(redis.call('HGET', KEYS[1], release) or '0')
  redis.call('HSET', KEYS[1], release, math.max(r - 1, 0))
end
if pick ~= '' then redis.call('HINCRBY', KEYS[1], pick, 1) end
return 1
`;

async function redis(...args) {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  const { result, error } = await res.json();
  if (error) throw new Error(error);
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
          if (GIFTS_BY_ID[raw[i]]) counts[raw[i]] = parseInt(raw[i + 1], 10);
        }
      }
      return res.json({ counts });
    }

    if (req.method === 'POST') {
      // { pick?: id, release?: id } — cada persona tiene un solo regalo,
      // así que cambiar de regalo libera el anterior y toma el nuevo.
      const { pick = '', release = '' } = req.body ?? {};
      if ((!pick && !release) ||
          (pick && !GIFTS_BY_ID[pick]) ||
          (release && !GIFTS_BY_ID[release])) {
        return res.status(400).json({ error: 'Regalo inválido' });
      }
      const max = pick ? (GIFTS_BY_ID[pick].max ?? 0) : 0;
      const result = await redis('EVAL', SWAP_SCRIPT, 1, 'gifts', pick, max, release);
      if (result === -1) {
        return res.status(409).json({ error: 'Ese regalo ya está completo' });
      }
      return res.json({ ok: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }

  res.status(405).end();
}
