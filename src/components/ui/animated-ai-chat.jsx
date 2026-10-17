import { useEffect, useRef } from "react"
import { ArrowUp, ImagePlus, LoaderCircle, Sparkles, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "../../lib/utils"

const prompts = [
  "Berapa kebutuhan protein harianku?",
  "Bantu pilih menu makan siang sehat",
  "Apa manfaat serat untuk tubuh?",
]

export default function AnimatedAIChat({
  hasMessages,
  message,
  onMessageChange,
  onSend,
  sending,
  image,
  imageInputRef,
  onChooseImage,
  onRemoveImage,
}) {
  const textareaRef = useRef(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "60px"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }, [message])

  const usePrompt = (prompt) => {
    onMessageChange(prompt)
    textareaRef.current?.focus()
  }

  return (
    <div className="font-poppins mx-auto w-full max-w-3xl text-slate-800">
      {!hasMessages && (
        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {prompts.map((prompt, index) => (
            <motion.button
              animate={{ opacity: 1, y: 0 }}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-left text-xs text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:text-sm"
              initial={{ opacity: 0, y: 8 }}
              key={prompt}
              onClick={() => usePrompt(prompt)}
              transition={{ delay: index * 0.07, duration: 0.25 }}
              type="button"
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      )}

      <form
        className="relative overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_16px_48px_-30px_rgba(15,23,42,.28)] transition focus-within:border-sky-300 focus-within:shadow-[0_16px_50px_-25px_rgba(14,165,233,.24)]"
        onSubmit={onSend}
      >
        <AnimatePresence initial={false}>
          {image && (
            <motion.div
              animate={{ opacity: 1, height: "auto" }}
              className="px-4 pt-4"
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
            >
              <div className="relative w-fit">
                <img
                  alt="Pratinjau gambar"
                  className="size-20 rounded-xl border border-slate-200 object-cover"
                  src={image.url}
                />
                <button
                  aria-label="Hapus gambar"
                  className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-slate-800 text-white shadow ring-1 ring-white hover:bg-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                  onClick={onRemoveImage}
                  type="button"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          aria-label="Pesan untuk Nutrily AI"
          className="block max-h-[200px] min-h-[60px] w-full resize-none bg-transparent px-5 py-4 text-[15px] leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus-visible:ring-0"
          maxLength={4000}
          onChange={(event) => onMessageChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          placeholder="Tanya apa saja tentang gizi dan kebiasaan makan..."
          ref={textareaRef}
          rows={1}
          value={message}
        />

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-3 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <input
              accept="image/jpeg,image/png"
              className="sr-only"
              onChange={onChooseImage}
              ref={imageInputRef}
              type="file"
            />
            <button
              aria-label="Lampirkan gambar JPG atau PNG"
              className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-40"
              disabled={sending}
              onClick={() => imageInputRef.current?.click()}
              title="Lampirkan gambar JPG atau PNG"
              type="button"
            >
              <ImagePlus className="size-[18px]" />
            </button>
            <span className="hidden text-[11px] text-slate-400 sm:block">
              Shift + Enter untuk baris baru
            </span>
          </div>

          <button
            aria-label="Kirim pesan"
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed",
              message.trim() || image
                ? "bg-sky-500 text-white shadow-[0_8px_24px_-10px_rgba(14,165,233,.65)] hover:bg-sky-600"
                : "bg-slate-100 text-slate-400",
            )}
            disabled={sending || (!message.trim() && !image)}
            type="submit"
          >
            {sending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <ArrowUp className="size-4" />
            )}
            <span className="hidden sm:inline">
              {sending ? "Menjawab" : "Kirim"}
            </span>
          </button>
        </div>
      </form>
      <p className="mt-3 flex items-center justify-center gap-1.5 px-3 text-center text-[10px] leading-5 text-slate-400 sm:text-[11px]">
        <Sparkles
          aria-hidden="true"
          className="size-3 shrink-0 text-sky-500/70"
        />
        Jawaban AI bisa keliru. Untuk saran medis, konsultasikan dengan tenaga
        kesehatan.
      </p>
    </div>
  )
}
