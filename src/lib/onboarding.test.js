import assert from "node:assert/strict"
import test from "node:test"

import { hasOnboardingInput, validateOnboardingStep } from "./onboarding.js"
import { getGoalCalorieAdjustment } from "./nutrition.js"

const validProfile = {
  age: "28",
  gender: "Wanita",
  status: "Tidak ada",
  weight: "60",
  height: "165",
  activity: "Sedang",
  isGym: false,
  goal: "Menurunkan berat badan",
}

test("wajib mengisi pilihan sebelum lanjut dan menerima profil lengkap", () => {
  assert.match(validateOnboardingStep(0, { ...validProfile, age: "" }), /usia/)
  assert.match(
    validateOnboardingStep(0, { ...validProfile, status: "" }),
    /status kehamilan/,
  )
  assert.match(
    validateOnboardingStep(1, { ...validProfile, weight: "" }),
    /berat/,
  )
  assert.match(
    validateOnboardingStep(2, { ...validProfile, activity: "" }),
    /aktivitas/,
  )
  assert.match(validateOnboardingStep(2, { ...validProfile, isGym: null }), /gym/)
  assert.equal(validateOnboardingStep(2, validProfile), "")
  assert.match(
    validateOnboardingStep(3, { ...validProfile, goal: "" }),
    /target/,
  )
  assert.equal(validateOnboardingStep(3, validProfile), "")
  assert.equal(
    validateOnboardingStep(3, { ...validProfile, goal: "Menjaga berat badan" }),
    "",
  )
  assert.equal(getGoalCalorieAdjustment("Menurunkan berat badan"), -300)
  assert.equal(getGoalCalorieAdjustment("Menjaga berat badan"), 0)
  assert.equal(getGoalCalorieAdjustment("Menambah berat badan"), 250)
  assert.equal(getGoalCalorieAdjustment("Menambah berat badan", true), 0)
  assert.equal(hasOnboardingInput({ age: "", gender: "", goal: "" }), false)
  assert.equal(hasOnboardingInput({ age: "28", gender: "", goal: "" }), true)
})
