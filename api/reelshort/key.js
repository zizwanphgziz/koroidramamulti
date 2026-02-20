export default async function handler(req, res) {

  const keyUrl = req.query.url;

  if (!keyUrl) {
    return res.status(400).json({ error: "Missing key url" });
  }

  try {

    const response = await fetch(keyUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.reelshort.com"
      }
    });

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "application/octet-stream");
    res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Key failed" });
  }
}
