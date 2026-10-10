import { supabase } from "./supabase"

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080"

export async function api(path, options = {}) {
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.")
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  if (!data.session)
    throw new Error("Sesi login berakhir. Silakan masuk kembali.")

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
  if (!response.ok)
    throw new Error(result.error || `API gagal (${response.status}).`)
  return result
}
