import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus } from "lucide-react"

const cn = (...classes) => classes.filter(Boolean).join(" ")

const categories = {
  umum: "Umum",
  fitur: "Fitur",
  akun: "Akun",
}

const faqData = {
  umum: [
    {
      question: "Apa itu Nutrily?",
      answer:
        "Nutrily adalah asisten gizi pribadi yang membantumu memantau asupan harian lewat pemindaian makanan, ringkasan gizi, dan panduan AI yang personal.",
    },
    {
      question: "Apakah Nutrily gratis?",
      answer:
        "Ya, gratis untuk memulai tanpa kartu kredit. Kamu bisa langsung mendaftar dan mencoba fitur utamanya.",
    },
    {
      question: "Apakah data kesehatanku aman?",
      answer:
        "Ya. Data kesehatanmu milikmu sendiri dan hanya dipakai untuk menyesuaikan target harianmu. Privasi adalah prioritas kami.",
    },
  ],
  fitur: [
    {
      question: "Bagaimana cara memindai makanan?",
      answer:
        "Buka menu Pemindai, arahkan kamera ke label produk atau struk belanja, lalu konfirmasi hasil OCR sebelum disimpan.",
    },
    {
      question: "Apa itu konsultan gizi AI?",
      answer:
        "Fitur chat yang menjawab pertanyaan gizimu berdasarkan profil dan riwayat makananmu, dengan konteks kesehatan yang aktif.",
    },
    {
      question: "Bagaimana target harianku dihitung?",
      answer:
        "Target dihitung dari profil tubuhmu (usia, berat, tinggi), level aktivitas, dan tujuanmu saat onboarding. Kamu bisa memperbaruinya kapan saja.",
    },
  ],
  akun: [
    {
      question: "Bagaimana cara mendaftar?",
      answer:
        "Klik Mulai Sekarang, daftar dengan email atau lanjutkan dengan Google, lalu lengkapi onboarding singkat.",
    },
    {
      question: "Bisakah saya mengubah data profil?",
      answer:
        "Bisa. Data usia, berat, tinggi, aktivitas, dan tujuan bisa diperbarui kapan saja agar target gizimu tetap akurat.",
    },
    {
      question: "Bagaimana cara keluar dari akun?",
      answer:
        "Klik ikon keluar di header atau sidebar. Sesimu aman dan bisa masuk kembali kapan saja.",
    },
  ],
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className={cn(
        "rounded-xl border border-transparent bg-white shadow-lg transition-colors hover:border-sky-100",
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
        type="button"
      >
        <span className={cn("text-base font-semibold text-slate-900")}>
          {question}
        </span>
        <motion.span
          variants={{ open: { rotate: "45deg" }, closed: { rotate: "0deg" } }}
          transition={{ duration: 0.2 }}
        >
          <Plus className={cn("size-5 text-sky-600")} />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : "0px",
          marginBottom: isOpen ? "16px" : "0px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden px-4"
      >
        <p className="text-sm leading-6 text-slate-500">{answer}</p>
      </motion.div>
    </motion.div>
  )
}

export default function FaqSection() {
  const keys = Object.keys(categories)
  const [selected, setSelected] = useState(keys[0])
  return (
    <div className="mt-12 sm:mt-16">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-sky-100">
            Punya pertanyaan?
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pertanyaan yang sering ditanyakan
          </h2>
          <p className="mt-4 leading-7 text-sky-50">
            Jawaban cepat seputar Nutrily, fitur, dan akunmu.
          </p>
        </div>
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              aria-pressed={selected === key}
              onClick={() => setSelected(key)}
              type="button"
              className="landing-cta landing-cta-light"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <AnimatePresence mode="wait">
            {Object.entries(faqData).map(([category, questions]) => {
              if (selected !== category) return null
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: "backIn" }}
                  className="space-y-4"
                >
                  {questions.map((faq, i) => (
                    <FAQItem key={i} {...faq} />
                  ))}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
