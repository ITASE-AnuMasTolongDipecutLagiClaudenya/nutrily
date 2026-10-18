import {
  ArrowLeft,
  ArrowRight,
  ScanLine,
  Sparkles,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Brand from "./brand"
import ProfileDropdown from "./ui/profile-dropdown"
import { NutritionAdviceCard } from "./ScannerFlow"

const previewUrl = `${import.meta.env.BASE_URL}dashboard-preview`
const scannerPreviewUrl = `${import.meta.env.BASE_URL}scanner-preview`

function PhoneMockup({ children, label }) {
  return (
    <div className="mx-auto w-52 sm:w-60 md:w-68">
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.5rem] border border-slate-900 bg-slate-900 p-[0.35rem] shadow-[0_18px_45px_-18px_rgba(15,23,42,.5)]">
        <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-slate-50">
          <span
            aria-hidden
            className="absolute left-1/2 top-2 z-20 h-[1.1rem] w-17 -translate-x-1/2 rounded-full bg-black"
          />
          <div aria-label={label} className="h-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div className="relative h-full overflow-hidden">
      <iframe
        aria-label="Pratinjau dashboard Nutrily"
        className="phone-dashboard-preview pointer-events-none border-0 bg-white"
        loading="lazy"
        src={previewUrl}
        title="Pratinjau dashboard Nutrily"
      />
    </div>
  )
}

function ScanPreview() {
  return (
    <iframe
      aria-label="Pratinjau halaman pemindai Nutrily"
      className="phone-scanner-preview pointer-events-none border-0 bg-slate-50"
      loading="lazy"
      src={scannerPreviewUrl}
      title="Pratinjau halaman pemindai Nutrily"
    />
  )
}

function SummaryPreview() {
  const macros = [
    ["Energi", "150", "kkal", "bg-sky-500"],
    ["Protein", "4", "g", "bg-violet-500"],
    ["Karbohidrat", "22", "g", "bg-emerald-500"],
    ["Lemak", "5", "g", "bg-amber-400"],
  ]

  return (
    <div className="phone-summary-preview bg-slate-50">
      <div className="h-full overflow-y-auto text-slate-900 [scrollbar-width:none]">
        <header className="sticky top-0 z-10 h-[49.44px] w-[263.27px] border-b border-slate-100 bg-white">
          <div className="relative flex h-20 w-[426px] origin-top-left scale-[0.618] items-center justify-between border-b border-slate-100 bg-white px-5">
            <Brand compact />
            <ProfileDropdown
              data={{ name: "Alya Putri", email: "alya@nutrily.id" }}
              onEditProfile={() => {}}
              onSignOut={() => {}}
            />
            <div className="absolute inset-x-0 bottom-0 h-[5px] overflow-hidden bg-sky-100/70">
              <div className="h-full w-0 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600" />
            </div>
          </div>
        </header>

        <main className="px-3 pb-5 pt-3">
          <h3 className="text-sm font-bold">Ringkasan gizimu</h3>
          <p className="mt-0.5 text-[9px] text-slate-500">
            Hasil scan label produk · 1 item
          </p>

          <section className="mt-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <h4 className="text-xs font-bold">Total gizi</h4>
            <div className="mt-2 grid grid-cols-2 gap-x-3">
              {[
                ["Energi", "150 kkal"],
                ["Protein", "4 g"],
                ["Karbohidrat", "22 g"],
                ["Lemak", "5 g"],
                ["Gula", "8 g"],
                ["Natrium", "120 mg"],
              ].map(([label, value]) => (
                <div className="border-b border-slate-100 py-1.5" key={label}>
                  <p className="text-[8px] text-slate-400">{label}</p>
                  <p className="mt-0.5 text-[9px] font-bold">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <h4 className="mb-2 text-xs font-bold">Item yang dipindai</h4>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
                  <ScanLine className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">Granola madu &amp; oat</p>
                  <p className="mt-0.5 text-[9px] text-slate-400">1 sajian · 30 g</p>
                </div>
              </div>
              <p className="shrink-0 text-[10px] font-bold text-slate-700">150 kkal</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-slate-100 pt-3">
              {macros.map(([name, value, unit, color]) => (
                <div className="flex items-center gap-1.5" key={name}>
                  <span className={`size-1.5 shrink-0 rounded-full ${color}`} />
                  <span className="min-w-0 truncate text-[9px] text-slate-500">{name}</span>
                  <b className="ml-auto shrink-0 text-[9px] text-slate-800">{value} {unit}</b>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-3">
            <NutritionAdviceCard
              advice={
                "Granola memberi energi dan karbohidrat untuk memulai hari. Padukan dengan yoghurt tawar untuk menambah protein dan buah segar sebagai sumber serat.\n\n- Pilih yoghurt tanpa gula tambahan.\n- Perhatikan porsi: satu sajian mengandung 8 g gula."
              }
              compact
            />
          </div>

          <button className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 text-[10px] font-bold text-white shadow-sm">
            Lanjutkan konsultasi <ArrowRight className="size-3.5" />
          </button>
        </main>
      </div>
    </div>
  )
}

function Feature({ icon: Icon, title, description, onClick }) {
  return (
    <div className="mx-auto max-w-sm text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-sky-600 shadow-lg">
        <Icon className="size-5.5" />
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-tight text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-6 text-sky-50">{description}</p>
      <button className="landing-cta landing-cta-light mt-5" onClick={onClick} type="button">
        Coba Sekarang <ArrowRight className="size-4" />
      </button>
    </div>
  )
}

export default function PhoneCarouselSection() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const go = () => navigate("/login")
  const previews = [ScanPreview, SummaryPreview, DashboardPreview]
  const ActivePreview = previews[index]

  useEffect(() => {
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % previews.length),
      4000,
    )
    return () => window.clearInterval(timer)
  }, [])

  const previous = () =>
    setIndex((current) => (current - 1 + previews.length) % previews.length)
  const next = () => setIndex((current) => (current + 1) % previews.length)

  return (
    <section className="mt-28 pb-20 sm:mt-32 sm:pb-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Cobain Fitur Unggulan Kami</h2>
          <p className="mt-4 leading-7 text-sky-50">Cobain sekarang 3 fitur unggulan kami untuk memantau kesehatan gizimu!</p>
        </div>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
          <div className="order-2 mx-auto max-w-sm text-center lg:order-1">
            <Feature
              description="Arahkan kamera ke label makanan dan biarkan AI membaca kandungan gizinya untukmu."
              icon={ScanLine}
              onClick={go}
              title="Pindai label makanan"
            />
          </div>

          <div className="order-1 flex items-center justify-center gap-4 sm:gap-6 lg:order-2">
            <button
              aria-label="Mockup sebelumnya"
              className="landing-carousel-control grid size-11 shrink-0 place-items-center rounded-full bg-white text-sky-600 shadow-lg transition hover:bg-sky-50"
              onClick={previous}
              type="button"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <PhoneMockup
                label={[
                  "Tampilan pemindai label produk",
                  "Ringkasan pemindaian dengan rekomendasi gizi",
                  "Pratinjau dashboard Nutrily",
                ][index]}
              >
                <ActivePreview />
              </PhoneMockup>
              <div className="mt-8 mb-10 flex justify-center gap-2 max-lg:mb-12">
                {previews.map((_, slide) => (
                  <button
                    aria-label={`Tampilkan mockup ${slide + 1}`}
                    aria-pressed={slide === index}
                    className={`h-2 rounded-full transition-all ${
                      slide === index
                        ? "w-8 bg-white"
                        : "w-2 bg-sky-200 hover:bg-sky-100"
                    }`}
                    key={slide}
                    onClick={() => setIndex(slide)}
                    type="button"
                  />
                ))}
              </div>
            </div>
            <button
              aria-label="Mockup berikutnya"
              className="landing-carousel-control grid size-11 shrink-0 place-items-center rounded-full bg-white text-sky-600 shadow-lg transition hover:bg-sky-50"
              onClick={next}
              type="button"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>

          <div className="order-3 mx-auto max-w-sm text-center">
            <Feature
              description="Dapatkan saran gizi yang disesuaikan dengan hasil pindai dan kebutuhan harianmu."
              icon={Sparkles}
              onClick={go}
              title="Panduan AI personal"
            />
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-sm text-center">
          <Feature
            description="Lihat ringkasan kalori dan makronutrienmu setiap hari dengan visual yang mudah dipahami."
            icon={Sparkles}
            onClick={go}
            title="Pantau perkembanganmu"
          />
        </div>
      </div>
    </section>
  )
}
