// Proxy transparan. Nama file sengaja dibuat biasa (bukan pola
// "[...path].js") — semua request /api/* diarahkan ke sini lewat
// rewrite rule di vercel.json, bukan lewat konvensi penamaan file.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const targetUrl = "https://satudata.acehprov.go.id" + req.url;

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (dashboard-proxy)"
      }
    });

    const contentType = upstream.headers.get("content-type") || "";
    res.status(upstream.status);

    if (contentType.includes("application/json")) {
      res.json(await upstream.json());
    } else {
      res.send(await upstream.text());
    }
  } catch (err) {
    res.status(502).json({ error: "Gagal menghubungi satudata.acehprov.go.id", detail: err.message });
  }
}