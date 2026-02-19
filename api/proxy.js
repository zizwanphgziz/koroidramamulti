export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "URL parameter missing" });
  }

  if (!process.env.API_TOKEN) {
    return res.status(500).json({ error: "API token not configured" });
  }

  try {

    // detect platform from url
    let origin = "https://www.dramabox.com";

    if (targetUrl.includes("/netshort/")) {
      origin = "https://www.netshort.com";
    }

    const apiResponse = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        Origin: origin
      }
    });

    const contentType = apiResponse.headers.get("content-type");

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      return res.status(apiResponse.status).send(errText);
    }

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
