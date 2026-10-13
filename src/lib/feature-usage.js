export function featureFromRequest(path, body) {
  if (path === "/scan")
    return body?.get?.("mode") === "receipt" ? "receipt" : "label"
  if (path === "/chat") {
    try {
      const message = body?.get
        ? body.get("message") || ""
        : JSON.parse(body || "{}").message || ""
      return message.startsWith("Saya baru memindai makanan berikut:")
        ? null
        : "chatbot"
    } catch {
      return null
    }
  }
  return null
}
