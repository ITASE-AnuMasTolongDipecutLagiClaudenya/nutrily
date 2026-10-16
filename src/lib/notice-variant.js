export function getNoticeVariant(message) {
  const text = String(message).toLowerCase()

  if (
    /gagal|failed|error|tidak dapat|tidak bisa|not found|unauthorized|invalid|expired|kesalahan/.test(
      text,
    )
  )
    return "destructive"
  if (
    /maksimal|wajib|masukkan|gunakan (foto|gambar)|belum siap|belum tersedia|belum dikonfigurasi|selesaikan verifikasi|antara \d/.test(
      text,
    )
  )
    return "warning"
  if (
    /berhasil|success|saved|updated|diperbarui|tersimpan|dihapus|sukses/.test(
      text,
    )
  )
    return "success"
  if (/info|informasi|sedang diproses/.test(text)) return "info"
  return "destructive"
}
