import assert from "node:assert/strict"
import test from "node:test"

import { getAvatarCropRect } from "./avatar-crop.js"

test("crop circle remains square and inside source image bounds", () => {
  const rect = getAvatarCropRect(1200, 800, 1.5, { x: 20, y: -10 }, 280)
  assert.equal(rect.size, 800 / 1.5)
  assert.ok(rect.x >= 0 && rect.x + rect.size <= 1200)
  assert.ok(rect.y >= 0 && rect.y + rect.size <= 800)
})
