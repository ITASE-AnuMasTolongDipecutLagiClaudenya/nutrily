import assert from "node:assert/strict"
import test from "node:test"

import {
  getOriginalGoogleAvatarUrl,
  getProfileAvatarUrl,
  hasCustomAvatar,
} from "./avatar.js"

test("mengutamakan avatar Google asli dari identity", () => {
  assert.equal(
    getOriginalGoogleAvatarUrl({
      user_metadata: { avatar_url: "https://res.cloudinary.com/custom.jpg" },
      identities: [
        {
          provider: "google",
          identity_data: { picture: "https://google.test/photo.jpg" },
        },
      ],
    }),
    "https://google.test/photo.jpg",
  )
})

test("membedakan avatar Google asli dengan avatar kustom", () => {
  assert.equal(
    hasCustomAvatar(
      "https://google.test/photo.jpg",
      "https://google.test/photo.jpg",
    ),
    false,
  )
  assert.equal(
    hasCustomAvatar(
      "https://res.cloudinary.com/custom.jpg",
      "https://google.test/photo.jpg",
    ),
    true,
  )
})

test("avatar aktif beralih ke kustom lalu fallback ke foto Google", () => {
  const google = "https://google.test/photo.jpg"
  assert.equal(
    getProfileAvatarUrl({
      user_metadata: { avatar_url: "https://res.cloudinary.com/custom.jpg" },
      identities: [{ provider: "google", identity_data: { picture: google } }],
    }),
    "https://res.cloudinary.com/custom.jpg",
  )
  assert.equal(
    getProfileAvatarUrl({
      user_metadata: { avatar_url: google },
      identities: [{ provider: "google", identity_data: { picture: google } }],
    }),
    google,
  )
})
