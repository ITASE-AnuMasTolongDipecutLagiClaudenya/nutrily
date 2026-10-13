import assert from "node:assert/strict"
import test from "node:test"
import { featureFromRequest } from "./feature-usage.js"

test("maps only real scan and chatbot feature requests", () => {
  const label = new FormData()
  label.set("mode", "label")
  const receipt = new FormData()
  receipt.set("mode", "receipt")
  const chat = new FormData()
  chat.set("message", "Taksir gizi menu ini")
  const scanChat = new FormData()
  scanChat.set("message", "Saya baru memindai makanan berikut:\nMenu")

  assert.equal(featureFromRequest("/scan", label), "label")
  assert.equal(featureFromRequest("/scan", receipt), "receipt")
  assert.equal(featureFromRequest("/chat", chat), "chatbot")
  assert.equal(featureFromRequest("/chat", scanChat), null)
  assert.equal(
    featureFromRequest(
      "/chat",
      JSON.stringify({ message: "Berapa protein telur?" }),
    ),
    "chatbot",
  )
  assert.equal(
    featureFromRequest(
      "/chat",
      JSON.stringify({
        message: "Saya baru memindai makanan berikut:\nDaftar pindai",
      }),
    ),
    null,
  )
  assert.equal(
    featureFromRequest("/meals", JSON.stringify({ name: "Hasil pemindaian" })),
    null,
  )
})
