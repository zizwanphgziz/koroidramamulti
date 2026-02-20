export default async function handler(req, res) {

  const segmentUrl = req.query.url;

  if (!segmentUrl) {
    return res.status(400).json({ error: "Missing segment url" });
  }

  try {

    const response = await fetch(segmentUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.reelshort.com"
      }
    });

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "video/mp2t");
    res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Segment failed" });
  }
}
