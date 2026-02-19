export default async function handler(req, res) {

  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "URL parameter missing" });
  }

  if (!process.env.API_TOKEN) {
    return res.status(500).json({ error: "API token not configured" });
  }

  // Detect platform
  let origin = "https://www.dramabox.com";

  if (targetUrl.includes("/netshort/")) {
    origin = "https://www.netshort.com";
  }

  if (targetUrl.includes("/reelshort/")) {
    origin = "https://www.reelshort.com";
  }

  try {

    const apiResponse = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        Origin: origin,
        Referer: origin,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*"
      }
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error("Upstream error:", errText);
      return res.status(apiResponse.status).json({ error: errText });
    }

    const contentType = apiResponse.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await apiResponse.json();
      return res.status(200).json(data);
    } else {
      const text = await apiResponse.text();
      return res.status(200).send(text);
    }

  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Proxy failed" });
  }
}
