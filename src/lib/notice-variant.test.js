import assert from "node:assert/strict"
import { getNoticeVariant } from "./notice-variant.js"

assert.equal(getNoticeVariant("Data berhasil diubah."), "success")
assert.equal(
  getNoticeVariant("Masukkan usia antara 13 hingga 120 tahun."),
  "warning",
)
assert.equal(getNoticeVariant("Google OAuth gagal."), "destructive")
assert.equal(getNoticeVariant("Informasi akun"), "info")
