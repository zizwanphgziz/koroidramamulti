export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "URL parameter missing" });
  }

  if (!process.env.API_TOKEN) {
    return res.status(500).json({ error: "API token not configured" });
  }

  try {
    const apiResponse = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        Origin: "https://www.dramabox.com"
      }
    });

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
