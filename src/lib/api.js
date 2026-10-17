import { supabase } from "./supabase"
import { featureFromRequest } from "./feature-usage"

const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:8080")
  .replace(/\/+$/, "")
  .replace(/\/api$/, "")

export async function verifyTurnstile(token) {
  const response = await fetch(`${baseUrl}/api/auth/verify-turnstile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok)
    throw new Error(result.error || `Verifikasi gagal (${response.status}).`)
}

export async function api(path, options = {}) {
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.")
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  if (!data.session)
    throw new Error("Sesi login berakhir. Silakan masuk kembali.")

  const feature =
    options.method?.toUpperCase() === "GET"
      ? null
      : featureFromRequest(path, options.body)
  const response = await fetch(`${baseUrl}/api${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${data.session.access_token}`,
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401) await supabase.auth.signOut()
    throw new Error(result.error || `API gagal (${response.status}).`)
  }
  if (feature) {
    window.dispatchEvent(
      new CustomEvent("nutrily:feature-usage", {
        detail: { userId: data.session.user.id, feature },
      }),
    )
  }
  return result
}
