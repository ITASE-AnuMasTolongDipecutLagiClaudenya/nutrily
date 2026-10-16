const activities = [
  "Minim gerak",
  "Ringan",
  "Sedang",
  "Sangat aktif",
  "Aktivitas fisik berat",
]

const goals = [
  "Menurunkan berat badan",
  "Menjaga berat badan",
  "Menambah berat badan",
]

export function hasOnboardingInput(profile) {
  return Object.values(profile).some(
    (value) => value != null && String(value).trim() !== "",
  )
}

export function validateOnboardingStep(step, profile) {
  if (step === 0) {
    const age = Number(profile.age)
    if (!Number.isInteger(age) || age < 13 || age > 120)
      return "Masukkan usia antara 13 hingga 120 tahun."
    if (profile.gender !== "Pria" && profile.gender !== "Wanita")
      return "Pilih jenis kelamin untuk melanjutkan."
    if (
      profile.gender === "Wanita" &&
      ![
        "Tidak ada",
        "Trimester 1",
        "Trimester 2",
        "Trimester 3",
        "Menyusui 6 bulan pertama",
        "Menyusui 6 bulan kedua",
      ].includes(profile.status)
    )
      return "Pilih status kehamilan atau menyusui untuk melanjutkan."
  }

  if (step === 1) {
    const weight = Number(profile.weight)
    const height = Number(profile.height)
    if (
      !Number.isFinite(weight) ||
      weight < 20 ||
      weight > 200 ||
      !Number.isFinite(height) ||
      height < 30 ||
      height > 200
    )
      return "Masukkan berat 20–200 kg dan tinggi 30–200 cm."
  }

  if (step === 2) {
    if (!activities.includes(profile.activity))
      return "Pilih tingkat aktivitas untuk melanjutkan."
    if (typeof profile.isGym !== "boolean")
      return "Pilih apakah kamu rutin gym."
  }

  if (step === 3 && !goals.includes(profile.goal))
    return "Pilih targetmu untuk melanjutkan."

  return ""
}

export function firstInvalidOnboardingStep(targetStep, profile) {
  for (let step = 0; step < targetStep; step += 1) {
    const error = validateOnboardingStep(step, profile)
    if (error) return { step, error }
  }
  return null
}
