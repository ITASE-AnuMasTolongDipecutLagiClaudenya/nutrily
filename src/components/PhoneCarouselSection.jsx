import { useEffect, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  ScanLine,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const images = [
  {
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    alt: "Salad sehat di aplikasi Nutrily",
  },
  {
    src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    alt: "Bowl makanan sehat di aplikasi Nutrily",
  },
  {
    src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
    alt: "Menu gizi seimbang di aplikasi Nutrily",
  },
  {
    src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80",
    alt: "Sayuran segar di aplikasi Nutrily",
  },
]

export default function PhoneCarouselSection() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setIndex((current) => (current + 1) % images.length),
      4000,
    )
    return () => clearInterval(id)
  }, [])

  const prev = () =>
    setIndex((current) => (current - 1 + images.length) % images.length)
  const next = () => setIndex((current) => (current + 1) % images.length)
  const go = () => navigate("/login")

  return (
    <div className="mt-28 pb-20 sm:mt-32 sm:pb-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Cobain Fitur Unggulan Kami
          </h2>
          <p className="mt-4 leading-7 text-sky-50">
            Cobain sekarang 3 fitur unggulan kami untuk memantau kesehatan
            gizimu!.
          </p>
        </div>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
          <div className="order-2 mx-auto max-w-sm text-center lg:order-1">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-sky-600 shadow-lg">
              <ScanLine className="size-5.5" />
            </div>
            <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
              Pindai dalam sekejap
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-6 text-sky-50">
              Arahkan kamera ke label makanan dan biarkan AI membaca kandungan
              gizinya untukmu.
            </p>
            <button
              className="landing-cta landing-cta-light mt-5"
              onClick={go}
              type="button"
            >
              Coba Sekarang <ArrowRight className="size-4" />
            </button>
          </div>
          <div className="order-1 flex items-center justify-center gap-4 sm:gap-6 lg:order-2">
            <button
              aria-label="Gambar sebelumnya"
              className="landing-carousel-control grid size-11 shrink-0 place-items-center rounded-full bg-white text-sky-600 shadow-lg transition hover:bg-sky-50"
              onClick={prev}
              type="button"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="relative mx-auto w-64 sm:w-72">
              <div className="aspect-[9/19.5] rounded-[2.5rem] border border-slate-900 bg-slate-900 p-[0.35rem] shadow-[0_10px_20px_rgba(0,0,0,0.18),0_40px_60px_-20px_rgba(0,0,0,0.35)]">
                <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-slate-100">
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-2 z-10 h-[1.1rem] w-17 -translate-x-1/2 rounded-full bg-black"
                  />
                  {images.map((image, i) => (
                    <img
                      alt={image.alt}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                        i === index ? "opacity-100" : "opacity-0"
                      }`}
                      key={image.src}
                      loading={i === 0 ? "eager" : "lazy"}
                      src={image.src}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button
              aria-label="Gambar berikutnya"
              className="landing-carousel-control grid size-11 shrink-0 place-items-center rounded-full bg-white text-sky-600 shadow-lg transition hover:bg-sky-50"
              onClick={next}
              type="button"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
          <div className="order-3 mx-auto max-w-sm text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-sky-600 shadow-lg">
              <Sparkles className="size-5.5" />
            </div>
            <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
              Panduan AI personal
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-6 text-sky-50">
              Dapatkan saran gizi yang disesuaikan dengan target dan kebiasaan
              harianmu.
            </p>
            <button
              className="landing-cta landing-cta-light mt-5"
              onClick={go}
              type="button"
            >
              Coba Sekarang <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {images.map((image, i) => (
            <button
              aria-label={`Ke gambar ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-white" : "w-2 bg-sky-200 hover:bg-sky-100"
              }`}
              key={image.src}
              onClick={() => setIndex(i)}
              type="button"
            />
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-sm text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-sky-600 shadow-lg">
            <TrendingUp className="size-5.5" />
          </div>
          <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
            Pantau progres harian
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-6 text-sky-50">
            Lihat ringkasan kalori dan makronutrienmu setiap hari dengan visual
            yang mudah dipahami.
          </p>
          <button
            className="landing-cta landing-cta-light mt-5"
            onClick={go}
            type="button"
          >
            Coba Sekarang <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
