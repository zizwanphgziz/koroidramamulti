export default async function handler(req, res) {

  const episodeUrl = req.query.url;

  if (!episodeUrl) {
    return res.status(400).json({ error: "Missing url" });
  }

  try {

    const htmlRes = await fetch(episodeUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.reelshort.com"
      }
    });

    const html = await htmlRes.text();

    const match = html.match(/https?:\/\/[^"]+\.m3u8[^"]*/);

    if (!match) {
      return res.status(404).json({ error: "m3u8 not found" });
    }

    const realM3u8 = match[0];

    const m3u8Res = await fetch(realM3u8, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.reelshort.com"
      }
    });

    let playlist = await m3u8Res.text();

    playlist = playlist.replace(
      /https?:\/\/[^ \n]+\.ts/g,
      (url) => `/api/reelshort/seg?url=${encodeURIComponent(url)}`
    );

    playlist = playlist.replace(
      /URI="([^"]+)"/g,
      (match, url) => `URI="/api/reelshort/key?url=${encodeURIComponent(url)}"`
    );

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.status(200).send(playlist);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Engine failed" });
  }
}
