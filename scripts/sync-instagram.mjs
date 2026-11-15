import fs from "node:fs/promises";
import path from "node:path";

const TOKEN = process.env.IG_TOKEN;
if (!TOKEN) {
  console.log("IG_TOKEN non impostato: sincronizzazione saltata");
  process.exit(0);
}

const OUT = "assets/instagram";
const API = "https://graph.instagram.com";
const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url}";

async function get(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
}

async function download(url, file) {
  try { await fs.access(file); return; } catch {}
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${r.status}`);
  await fs.writeFile(file, Buffer.from(await r.arrayBuffer()));
}

// Rinnova il token (dura 60 giorni) a ogni esecuzione
await get(`${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`).catch(() => {});

await fs.mkdir(OUT, { recursive: true });
let url = `${API}/me/media?fields=${encodeURIComponent(FIELDS)}&limit=50&access_token=${TOKEN}`;
const feed = [];

while (url) {
  const page = await get(url);
  for (const m of page.data) {
    const items = m.media_type === "CAROUSEL_ALBUM" ? m.children.data : [m];
    const images = [];
    for (const it of items) {
      const src = it.media_type === "VIDEO" ? it.thumbnail_url : it.media_url;
      if (!src) continue;
      const file = path.join(OUT, `${it.id}.jpg`);
      await download(src, file);
      images.push(`${OUT}/${it.id}.jpg`);
    }
    if (images.length) feed.push({ id: m.id, caption: m.caption ?? "", date: m.timestamp, link: m.permalink, images });
  }
  url = page.paging?.next ?? null;
}

await fs.writeFile(path.join(OUT, "feed.json"), JSON.stringify(feed, null, 2));
console.log(`Sincronizzati ${feed.length} post`);
