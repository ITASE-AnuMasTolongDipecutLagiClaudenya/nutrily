import { useEffect, useRef, useState } from "react"

import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Copy,
  Images,
  LoaderCircle,
  Plus,
  ReceiptText,
  ScanLine,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react"

import { useLocation } from "react-router-dom"

import { api } from "../lib/api"
import NoticeAlert from "./ui/notice-alert"

import Markdown from "./ui/markdown"

import { useAuth } from "../lib/AuthProvider"

const copy = {
  receipt: {
    title: "Scan struk",

    hint: "Arahkan kamera ke daftar belanja. AI hanya mengambil makanan, minuman, dan buah.",

    icon: ReceiptText,
  },

  label: {
    title: "Scan label produk",

    hint: "Arahkan kamera ke tabel informasi gizi pada kemasan.",

    icon: ScanLine,
  },
}

function Button({ children, className = "", variant = "primary", ...props }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50 ${
        variant === "primary"
          ? "bg-sky-500 text-white hover:bg-sky-600"
          : "border border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50"
      } ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

function readSession(storageKey) {
  try {
    const session = JSON.parse(sessionStorage.getItem(storageKey))

    return session && Array.isArray(session.items) ? session : null
  } catch {
    return null
  }
}

function nutritionSources(sources) {
  return Array.isArray(sources)
    ? sources.filter(
        (source) =>
          source &&
          typeof source.url === "string" &&
          /^https:\/\//i.test(source.url),
      )
    : []
}

async function optimizeScanImage(image) {
  if (!globalThis.createImageBitmap) return image

  let bitmap
  try {
    bitmap = await createImageBitmap(image)
    const maxDimension = 2400
    let scale = Math.min(
      1,
      maxDimension / Math.max(bitmap.width, bitmap.height),
    )
    if (
      scale === 1 &&
      image.type === "image/jpeg" &&
      image.size <= 2 * 1024 * 1024
    )
      return image

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) return image
    let best = image
    for (let attempt = 0; attempt < 4; attempt += 1) {
      canvas.width = Math.round(bitmap.width * scale)
      canvas.height = Math.round(bitmap.height * scale)
      context.fillStyle = "#fff"
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.82 - attempt * 0.07),
      )
      if (!blob) return image
      if (blob.size < best.size)
        best = new File([blob], "nutrily-scan.jpg", { type: "image/jpeg" })
      if (best.size <= 2 * 1024 * 1024) return best
      scale *= 0.85
    }
    return best
  } catch {
    return image
  } finally {
    bitmap?.close()
  }
}

function CameraView({ mode, onCapture, onClose }) {
  const videoRef = useRef(null)

  const fileRef = useRef(null)

  const [stream, setStream] = useState(null)

  const [notice, setNotice] = useState("")

  const [scanning, setScanning] = useState(false)

  const [previewURL, setPreviewURL] = useState("")

  useEffect(
    () => () => {
      if (previewURL) URL.revokeObjectURL(previewURL)
    },

    [previewURL],
  )

  useEffect(() => {
    let active = true

    let cameraStream

    if (!navigator.mediaDevices?.getUserMedia) {
      setNotice("Kamera tidak tersedia. Unggah foto untuk melanjutkan.")

      return undefined
    }

    navigator.mediaDevices

      .getUserMedia({
        audio: false,

        video: { facingMode: { ideal: "environment" } },
      })

      .then((result) => {
        cameraStream = result

        if (!active) return result.getTracks().forEach((track) => track.stop())

        setStream(result)

        if (videoRef.current) videoRef.current.srcObject = result
      })

      .catch(
        () =>
          active &&
          setNotice(
            "Izin kamera tidak tersedia. Unggah foto untuk melanjutkan.",
          ),
      )

    return () => {
      active = false

      cameraStream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream
  }, [stream])

  const scan = async (image) => {
    if (!image || scanning) return

    if (!/^image\/(jpeg|png)$/.test(image.type)) {
      setNotice("Gunakan foto JPG atau PNG.")

      return
    }

    if (image.size > 8 * 1024 * 1024) {
      setNotice("Ukuran foto maksimal 8 MB.")

      return
    }

    setScanning(true)

    setNotice("")

    setPreviewURL(URL.createObjectURL(image))

    try {
      await onCapture(await optimizeScanImage(image))
    } catch (error) {
      setNotice(
        error.message || "Pemindaian gagal. Coba foto yang lebih jelas.",
      )
    } finally {
      setScanning(false)

      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const capture = () => {
    const video = videoRef.current

    if (!video?.videoWidth) {
      setNotice("Kamera belum siap. Tunggu sebentar atau unggah foto.")

      return
    }

    const canvas = document.createElement("canvas")

    canvas.width = video.videoWidth

    canvas.height = video.videoHeight

    canvas.getContext("2d").drawImage(video, 0, 0)

    canvas.toBlob(
      (blob) => {
        if (blob)
          scan(new File([blob], "nutrily-scan.jpg", { type: "image/jpeg" }))
        else setNotice("Foto gagal diambil. Coba sekali lagi.")
      },

      "image/jpeg",

      0.92,
    )
  }

  return (
    <main className="fixed inset-0 z-50 overflow-hidden bg-black text-white">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}
      <button
        aria-label="Kembali ke pemindai"
        className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] z-20 grid size-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/75"
        onClick={onClose}
        type="button"
      >
        <ArrowLeft className="size-5" />
      </button>
      {scanning && previewURL ? (
        <div className="absolute inset-0 grid place-items-center bg-black">
          <div className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black">
            <img
              alt="Foto yang sedang dianalisis"
              className="h-full w-full object-contain"
              src={previewURL}
            />
            <span className="scan-line absolute inset-x-0 top-2 h-0.5 bg-sky-300 shadow-[0_0_18px_5px_rgba(125,211,252,.85)]" />
          </div>
        </div>
      ) : null}
      {!stream && !scanning && <div className="absolute inset-0 bg-black" />}
      {!scanning && (
        <footer className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center bg-slate-950/55 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {notice && (
            <NoticeAlert
              className="absolute bottom-full left-4 right-4 mb-3 bg-white/95 text-left sm:left-auto sm:right-5 sm:max-w-md"
              message={notice}
              variant="destructive"
            />
          )}
          <div className="flex shrink-0 items-center gap-8">
            <button
              aria-label="Unggah foto"
              className="grid size-12 place-items-center rounded-full bg-white/15"
              onClick={() => fileRef.current?.click()}
            >
              <Images className="size-5" />
            </button>
            <button
              aria-label="Ambil foto"
              className="grid size-14 place-items-center rounded-full bg-white text-slate-900 shadow-lg"
              onClick={capture}
            >
              <Camera className="size-7" />
            </button>
          </div>
          <input
            ref={fileRef}
            accept="image/jpeg,image/png"
            capture="environment"
            className="hidden"
            onChange={(event) => scan(event.target.files?.[0])}
            type="file"
          />
        </footer>
      )}
    </main>
  )
}

function ScannerLanding({ navigate, start }) {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-28 pt-8 sm:px-8 lg:pb-10">
      <p className="text-sm font-semibold text-sky-600">Pemindai Nutrily</p>
      <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Pahami makananmu dari kamera
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        Pilih yang ingin dipindai. Periksa hasil AI sebelum menyimpan ringkasan.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {["receipt", "label"].map((mode) => {
          const Icon = copy[mode].icon

          return (
            <button
              key={mode}
              className="group flex min-h-52 flex-col items-start rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              onClick={() => start(mode)}
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-sky-50 text-sky-600 transition group-hover:bg-sky-500 group-hover:text-white">
                <Icon className="size-6" />
              </span>
              <span className="mt-6 text-xl font-bold text-slate-900">
                {copy[mode].title}
              </span>
              <span className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {copy[mode].hint}
              </span>
              <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-sky-600">
                Buka kamera <ArrowRight className="size-4" />
              </span>
            </button>
          )
        })}
      </div>
    </main>
  )
}

function ScannerFlow({ navigate, onSessionName }) {
  const { pathname, state: locationState } = useLocation()

  const { user } = useAuth()

  const storageKey = `nutrily:scan-session:${user?.id || "anonymous"}`

  const [session, setSession] = useState(null)

  const sessionRef = useRef(null)

  const [sessionReady, setSessionReady] = useState(false)

  const [busy, setBusy] = useState(false)

  const [preparingName, setPreparingName] = useState(false)

  const [sessionNameDraft, setSessionNameDraft] = useState("")

  const [sessionNameDialog, setSessionNameDialog] = useState(false)

  const [notice, setNotice] = useState("")

  const [messages, setMessages] = useState([])

  const [messageSessionId, setMessageSessionId] = useState("")

  const [question, setQuestion] = useState("")

  const [copied, setCopied] = useState(false)

  const chatScrollRef = useRef(null)

  useEffect(() => {
    const node = chatScrollRef.current

    if (node) node.scrollTop = node.scrollHeight
  }, [busy, messages])

  const modeMatch = pathname.match(/^\/scanner\/(receipt|label)(\/confirm)?$/)

  const mode = modeMatch?.[1]

  const isConfirm = Boolean(modeMatch?.[2])

  const summaryId = pathname.match(/^\/scanner\/summary\/([^/]+)$/)?.[1]

  const isSummary = Boolean(summaryId)

  useEffect(() => {
    const stored = readSession(storageKey)

    sessionRef.current = stored

    setSession(stored)

    setMessages([])

    setMessageSessionId("")

    setSessionReady(true)
  }, [storageKey])

  useEffect(() => {
    onSessionName?.(session?.sessionName || "")
  }, [onSessionName, session?.sessionName])

  const saveSession = (next) => {
    sessionRef.current = next

    setSession(next)

    try {
      sessionStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      /* session remains available in memory */
    }
  }

  const start = (nextMode) => {
    const freshSession = {
      mode: nextMode,

      items: [],

      savedCount: 0,

      sessionId: crypto.randomUUID(),

      advice: "",
    }

    sessionRef.current = freshSession

    setSession(freshSession)

    setMessages([])

    setMessageSessionId(freshSession.sessionId)

    setNotice("")

    sessionStorage.setItem(storageKey, JSON.stringify(freshSession))

    navigate(`/scanner/${nextMode}`)
  }

  useEffect(() => {
    if (!sessionReady || !isSummary || !summaryId) return

    const navigationSession = locationState?.scanSession
    if (
      navigationSession?.sessionId === summaryId &&
      session?.sessionId !== summaryId
    ) {
      saveSession(navigationSession)
      return
    }

    if (session?.sessionId === summaryId) return

    let active = true

    api(`/meals?scan_session_id=${encodeURIComponent(summaryId)}`)

      .then((items) => {
        if (!active) return

        if (!items.length) {
          navigate("/scanner", { replace: true })

          return
        }

        const restored = {
          sessionId: summaryId,
          mode: items[0].scan_mode || "label",
          sessionName:
            items.find((item) => item.scan_session_name)?.scan_session_name ||
            "",
          items: items.map(
            ({
              name,
              serving_size,
              calories,
              protein_g,
              carbs_g,
              fat_g,
              sugar_g,
              sodium_mg,
              nutrition_sources,
            }) => ({
              name,
              serving_size,
              calories,
              protein_g,
              carbs_g,
              fat_g,
              sugar_g,
              sodium_mg,
              sources: nutrition_sources || [],
            }),
          ),
          savedCount: items.length,

          advice: "",
        }

        saveSession(restored)
      })

      .catch((error) => active && setNotice(error.message))

    return () => {
      active = false
    }
  }, [
    isSummary,
    locationState,
    navigate,
    session?.sessionId,
    sessionReady,
    summaryId,
  ])

  useEffect(() => {
    if (!sessionReady) return

    if (
      (isConfirm &&
        (!session || !session.items?.length || session.mode !== mode)) ||
      (!isConfirm && !isSummary && pathname !== "/scanner" && !modeMatch)
    )
      navigate("/scanner", { replace: true })
  }, [
    isConfirm,
    isSummary,
    mode,
    modeMatch,
    navigate,
    pathname,
    session?.items?.length,
    session?.mode,
    sessionReady,
  ])

  useEffect(() => {
    if (
      !sessionReady ||
      !isSummary ||
      !summaryId ||
      session?.sessionId !== summaryId
    )
      return

    let active = true

    setMessages([])

    setMessageSessionId("")

    setMessageSessionId(summaryId)

    api(`/chat?conversation_id=${encodeURIComponent(summaryId)}`, {
      method: "GET",
    })

      .then((result) => {
        if (!active) return

        const history = result.messages || []

        const summaryIndex = history.findIndex(
          (item) =>
            item.role === "user" &&
            item.content.startsWith("Saya baru memindai makanan berikut:"),
        )

        const conversation =
          summaryIndex >= 0 ? history.slice(summaryIndex + 2) : history

        const advice =
          summaryIndex >= 0 && history[summaryIndex + 1]?.role === "assistant"
            ? history[summaryIndex + 1].content
            : ""

        if (advice && sessionRef.current && !sessionRef.current.advice)
          saveSession({ ...sessionRef.current, advice })

        setMessages(
          conversation.map((item) => ({
            from: item.role === "assistant" ? "ai" : "user",

            text: item.content,
          })),
        )
      })

      .catch((error) => active && setNotice(error.message))

    return () => {
      active = false
    }
  }, [isSummary, session?.sessionId, sessionReady, summaryId])

  const scanImage = async (image) => {
    const form = new FormData()

    form.append("image", image)

    form.append("mode", mode)

    const result = await api("/scan", { method: "POST", body: form })

    const found = Array.isArray(result.items) ? result.items : []

    if (!found.length)
      throw new Error(
        mode === "receipt"
          ? "Tidak ditemukan makanan, minuman, atau buah. Coba foto struk yang lebih jelas."
          : "Hasil label tidak terbaca. Coba foto yang lebih jelas.",
      )

    const current =
      sessionRef.current?.mode === mode
        ? sessionRef.current
        : {
            mode,

            items: [],

            savedCount: 0,

            sessionId: crypto.randomUUID(),

            advice: "",
          }

    saveSession({ ...current, items: [...current.items, ...found] })

    navigate(`/scanner/${mode}/confirm`)
  }

  const patchItem = (index, patch) =>
    saveSession({
      ...sessionRef.current,

      items: sessionRef.current.items.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    })

  const removeItem = (index) =>
    saveSession({
      ...sessionRef.current,

      items: sessionRef.current.items.filter((_, i) => i !== index),
    })

  const requestConfirmation = async () => {
    const current = sessionRef.current
    if (!current?.items?.length || busy || preparingName) return
    if (current.sessionName) return confirmItems()

    setPreparingName(true)
    let sessionNumber = 1
    try {
      const meals = await api("/meals", { method: "GET" })
      const existingSessions = new Set(
        meals
          .filter(
            (meal) => meal.scan_mode === current.mode && meal.scan_session_id,
          )
          .map((meal) => meal.scan_session_id),
      )
      sessionNumber += existingSessions.size
    } catch {
      // Keep naming available if history cannot be loaded; saving reports API errors.
    }

    const typeName = current.mode === "receipt" ? "Scan struk" : "Scan label"
    setSessionNameDraft(current.sessionName || `${typeName} ${sessionNumber}`)
    setSessionNameDialog(true)
    setPreparingName(false)
  }

  const submitSessionName = (event) => {
    event.preventDefault()
    const current = sessionRef.current
    const sessionName = sessionNameDraft.trim()
    if (!current || !sessionName) return

    saveSession({ ...current, sessionName })
    setSessionNameDialog(false)
    confirmItems()
  }

  const confirmItems = async () => {
    const current = sessionRef.current

    if (!current?.items?.length || busy) return

    setBusy(true)

    setNotice("")

    try {
      const id = current.sessionId || crypto.randomUUID()

      let saved = { ...current, sessionId: id }

      saveSession(saved)

      // Nutrition is resolved after the user confirms the parsed items:
      // catalog first, then cache, then a sourced AI lookup.
      const enriched = await api("/scan/nutrition", {
        method: "POST",
        body: JSON.stringify({ mode: saved.mode, items: saved.items }),
      })
      if (Array.isArray(enriched.items) && enriched.items.length) {
        saved = { ...saved, items: enriched.items }
        saveSession(saved)
      }

      for (
        let index = saved.savedCount || 0;
        index < saved.items.length;
        index += 1
      ) {
        const item = saved.items[index]

        const nutrition = Object.fromEntries(
          [
            "calories",

            "protein_g",

            "carbs_g",

            "fat_g",

            "sugar_g",

            "sodium_mg",
          ]

            .map((key) => [key, item[key]])

            .filter(
              ([, value]) =>
                value != null &&
                Number.isFinite(Number(value)) &&
                Number(value) >= 0,
            )

            .map(([key, value]) => [key, Number(value)]),
        )

        await api("/meals", {
          method: "POST",

          body: JSON.stringify({
            name: item.name || "Hasil pemindaian",

            ...nutrition,

            ...(item.serving_size ? { serving_size: item.serving_size } : {}),
            nutrition_sources: item.sources || [],
            scan_session_id: id,
            scan_mode: saved.mode,
            scan_session_name: saved.sessionName,
          }),
        })

        saved = { ...saved, savedCount: index + 1 }

        saveSession(saved)
      }

      const history = await api(
        `/chat?conversation_id=${encodeURIComponent(id)}`,

        { method: "GET" },
      )

      let advice =
        history.messages?.at(-1)?.role === "assistant"
          ? history.messages.at(-1).content
          : ""

      if (!advice) {
        const lines = saved.items.map(
          (item) =>
            `- ${item.name || "Makanan"} (${item.serving_size || "1 sajian"}): ${item.calories ?? "tidak diketahui"} kcal, protein ${item.protein_g ?? "?"}g, karbo ${item.carbs_g ?? "?"}g, lemak ${item.fat_g ?? "?"}g, gula ${item.sugar_g ?? "?"}g, natrium ${item.sodium_mg ?? "?"}mg`,
        )

        const totals = [
          "calories",

          "protein_g",

          "carbs_g",

          "fat_g",

          "sugar_g",

          "sodium_mg",
        ].map((key) =>
          saved.items.every((item) => item[key] != null)
            ? saved.items.reduce((sum, item) => sum + Number(item[key]), 0)
            : null,
        )

        const result = await api("/chat", {
          method: "POST",

          body: JSON.stringify({
            conversation_id: id,

            message: `Saya baru memindai makanan berikut:\n${lines.join("\n")}\nRingkasan nilai per item telah dikonfirmasi pengguna. Total berturut-turut (kkal, protein g, karbo g, lemak g, gula g, natrium mg): ${totals.map((value) => value ?? "belum lengkap").join(", ")}. Beri saran gizi singkat maksimal 5 poin. Hanya bahas gizi dan kesehatan terkait pemindaian ini.`,
          }),
        })

        advice = result.answer

        saved = { ...saved, advice }

        saveSession(saved)
      }

      saveSession({ ...saved, advice })

      navigate(`/scanner/summary/${id}`)
    } catch (error) {
      setNotice(error.message || "Ringkasan belum tersimpan. Coba lagi.")
    } finally {
      setBusy(false)
    }
  }

  const ask = async (event) => {
    event.preventDefault()

    const text = question.trim()

    if (!text || busy || !session?.sessionId) return

    setBusy(true)

    setNotice("")

    setQuestion("")

    setMessages((items) => [...items, { from: "user", text }])

    try {
      const result = await api("/chat", {
        method: "POST",

        body: JSON.stringify({
          conversation_id: session.sessionId,

          message: text,
        }),
      })

      setMessages((items) => [...items, { from: "ai", text: result.answer }])

      setMessageSessionId(session.sessionId)
    } catch (error) {
      setNotice(error.message)

      setMessages((items) =>
        items.filter((item) => !(item.from === "user" && item.text === text)),
      )

      setQuestion(text)
    } finally {
      setBusy(false)
    }
  }

  if (mode && !isConfirm)
    return (
      <CameraView
        mode={mode}
        onCapture={scanImage}
        onClose={() => navigate("/scanner")}
      />
    )

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900">
      {pathname === "/scanner" && (
        <ScannerLanding navigate={navigate} start={start} />
      )}

      {isConfirm && session && (
        <main className="mx-auto max-w-5xl px-5 pb-10 pt-8 sm:px-8">
          {/** Keep confirmed items immutable after a partial save so retry cannot duplicate meals. */}
          {(() => {
            const locked = (session.savedCount || 0) > 0

            return (
              <>
                <p className="text-sm font-semibold text-sky-600">
                  {copy[mode].title}
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                  Periksa hasil pindai
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  {locked
                    ? "Penyimpanan sempat terhenti. Lanjutkan untuk menyelesaikan sesi."
                    : "Ubah nama, hapus hasil keliru, atau pindai lagi untuk menambahkan item."}
                </p>
                {notice && (
                  <NoticeAlert
                    className="mt-5"
                    message={notice}
                    variant="destructive"
                  />
                )}
                <section className="mt-6 rounded-2xl border border-slate-100 bg-white px-4 sm:px-6">
                  <div className="divide-y divide-slate-100">
                    {session.items.map((item, index) => (
                      <article
                        className="border-b border-slate-100 bg-white px-1 py-5 last:border-0"
                        key={`${item.name}-${index}`}
                      >
                        <div className="flex items-start gap-3">
                          <label className="min-w-0 flex-1">
                            <span className="sr-only">Nama item</span>
                            <input
                              className="h-10 w-full border-0 border-b border-slate-200 bg-transparent px-0 text-base font-semibold outline-none focus:border-sky-500 focus:ring-0 disabled:text-slate-500"
                              disabled={locked}
                              maxLength={160}
                              onChange={(event) =>
                                patchItem(index, { name: event.target.value })
                              }
                              value={item.name || ""}
                            />
                          </label>
                          <button
                            aria-label={`Hapus ${item.name || "item"}`}
                            className="grid size-10 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                            disabled={locked}
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <label className="flex items-center gap-2 text-xs text-slate-500">
                            <span>Jumlah</span>
                            <input
                              className="h-8 w-16 rounded-lg border border-slate-200 px-2 text-sm font-semibold text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:text-slate-500"
                              disabled={locked}
                              min={1}
                              max={99}
                              onChange={(event) =>
                                patchItem(index, {
                                  quantity: Math.max(
                                    1,
                                    Number(event.target.value) || 1,
                                  ),
                                })
                              }
                              type="number"
                              value={Number(item.quantity) || 1}
                            />
                          </label>
                          {item.raw_name && (
                            <span className="min-w-0 truncate text-xs text-slate-400">
                              Tertulis: {item.raw_name}
                            </span>
                          )}
                        </div>
                        {item.name_confidence === "low" && (
                          <p className="mt-1 text-xs text-amber-700">
                            Nama produk kurang pasti. Mohon dicek.
                          </p>
                        )}
                      </article>
                    ))}
                    {!session.items.length && (
                      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                        Semua item dihapus. Pindai lagi untuk menambahkan item.
                      </p>
                    )}
                  </div>
                </section>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Button
                    disabled={locked}
                    variant="secondary"
                    onClick={() => navigate(`/scanner/${mode}`)}
                  >
                    <Plus className="size-4" /> Pindai lagi
                  </Button>
                  <Button
                    disabled={!session.items.length || busy || preparingName}
                    onClick={requestConfirmation}
                  >
                    {busy ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}
                    {busy
                      ? "Menyimpan…"
                      : preparingName
                        ? "Menyiapkan…"
                        : "Konfirmasi"}
                  </Button>
                </div>
              </>
            )
          })()}
        </main>
      )}

      {sessionNameDialog && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
          <form
            aria-labelledby="scan-session-name-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            onSubmit={submitSessionName}
            role="dialog"
          >
            <h2
              className="text-lg font-semibold text-slate-900"
              id="scan-session-name-title"
            >
              Beri nama sesi
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Nama ini akan ditampilkan pada ringkasan pemindaian.
            </p>
            <input
              aria-label="Nama sesi"
              autoFocus
              className="mt-5 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              maxLength={60}
              onChange={(event) => setSessionNameDraft(event.target.value)}
              required
              value={sessionNameDraft}
            />
            <div className="mt-5 flex justify-end gap-2">
              <Button
                onClick={() => setSessionNameDialog(false)}
                variant="secondary"
              >
                Batal
              </Button>
              <Button disabled={!sessionNameDraft.trim() || busy} type="submit">
                Konfirmasi
              </Button>
            </div>
          </form>
        </div>
      )}

      {isSummary && session?.sessionId === summaryId && (
        <main className="font-poppins mx-auto w-[92%] px-5 pb-28 pt-7 sm:px-8 lg:pb-10">
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Ringkasan gizimu
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {session.items.length} item dari{" "}
              {copy[session.mode]?.title.toLowerCase()}.
            </p>
          </div>
          <div className="grid items-start gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <div className="flex flex-col gap-5">
              <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Item yang dipindai
                </h2>
                <ul className="mt-3 divide-y divide-slate-100">
                  {session.items.map((item, index) => (
                    <li
                      className="flex items-start justify-between gap-4 py-4"
                      key={`${item.name}-${index}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                          {item.name || "Makanan"}
                        </span>
                        <span className="mt-1 block text-xs text-slate-400">
                          {item.serving_size || "Takaran saji tidak diketahui"}
                          {Number(item.quantity) > 1
                            ? ` · ${item.quantity}×`
                            : ""}
                        </span>
                        <span className="mt-2 grid grid-cols-3 gap-x-3 gap-y-1 text-[11px] text-slate-600 sm:grid-cols-6">
                          {[
                            ["Kalori", item.calories, "kkal"],
                            ["Protein", item.protein_g, "g"],
                            ["Karbo", item.carbs_g, "g"],
                            ["Lemak", item.fat_g, "g"],
                            ["Gula", item.sugar_g, "g"],
                            ["Natrium", item.sodium_mg, "mg"],
                          ].map(([label, value, unit]) => (
                            <span className="flex flex-col" key={label}>
                              <span className="font-semibold text-slate-800">
                                {value == null ? "—" : `${value} ${unit}`}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {label}
                              </span>
                            </span>
                          ))}
                        </span>
                        {nutritionSources(item.sources).length > 0 && (
                          <span className="mt-2 block text-xs text-slate-500">
                            Sumber:{" "}
                            {nutritionSources(item.sources).map(
                              (source, sourceIndex) => (
                                <a
                                  className="mr-2 text-sky-700 underline underline-offset-2 hover:text-sky-900"
                                  href={source.url}
                                  key={source.url}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  {source.title || `Sumber ${sourceIndex + 1}`}
                                </a>
                              ),
                            )}
                          </span>
                        )}
                        {!item.sources?.length && item.nutrition_source === "estimate_unsourced" && (
                          <span className="mt-1 block text-[11px] text-amber-700">
                            Estimasi AI tanpa sumber; mohon verifikasi.
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-800">
                        {item.calories == null ? "—" : `${item.calories} kkal`}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
              {session.advice && (
                <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-2 text-sky-700">
                    <Sparkles className="size-4" />
                    <h2 className="text-lg font-bold text-slate-900">
                      Rekomendasi gizi
                    </h2>
                  </div>
                  <div className="mt-3 text-sm text-slate-600">
                    <Markdown content={session.advice} />
                  </div>
                </section>
              )}
            </div>
            <div className="lg:self-stretch">
              <div className="lg:sticky lg:top-24">
                <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    Total gizi
                  </h2>
                  <div className="mt-3 grid grid-cols-2 gap-x-5">
                    {[
                      ["Energi", "calories", "kkal"],

                      ["Protein", "protein_g", "g"],

                      ["Karbohidrat", "carbs_g", "g"],

                      ["Lemak", "fat_g", "g"],

                      ["Gula", "sugar_g", "g"],

                      ["Natrium", "sodium_mg", "mg"],
                    ].map(([label, key, unit]) => {
                      const known = session.items.filter(
                        (item) =>
                          Number.isFinite(Number(item[key])) &&
                          item[key] != null,
                      )

                      const total = known.length
                        ? known.reduce(
                            (sum, item) => sum + Number(item[key]),
                            0,
                          )
                        : null

                      return (
                        <div
                          className="border-b border-slate-100 py-3"
                          key={key}
                        >
                          <p className="text-xs text-slate-500">{label}</p>
                          <p className="mt-1 text-base font-bold text-slate-900">
                            {total == null
                              ? "Belum terbaca"
                              : `${
                                  known.length < session.items.length ? "~" : ""
                                }${Number(total.toFixed(1))} ${unit}`}
                          </p>
                          {known.length > 0 &&
                            known.length < session.items.length && (
                              <p className="mt-1 text-[10px] text-slate-400">
                                {known.length}/{session.items.length} item
                                terbaca
                              </p>
                            )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-500">
                        ID sesi konsultasi
                      </p>
                      <p className="mt-1 break-all font-mono text-xs text-slate-600">
                        {session.sessionId}
                      </p>
                    </div>
                    <button
                      className="grid size-9 shrink-0 place-items-center rounded-lg bg-sky-500 text-white transition-colors hover:bg-sky-600"
                      aria-label="Salin ID sesi"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(session.sessionId)

                          setCopied(true)

                          setTimeout(() => setCopied(false), 1500)
                        } catch {
                          setNotice("ID sesi tidak dapat disalin.")
                        }
                      }}
                    >
                      {copied ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </button>
                  </div>
                </section>
              </div>
            </div>
            <section className="rounded-3xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Tanya tentang hasil ini
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Konsultasi lanjutan khusus gizi dan kesehatan.
                </p>
              </div>
              <div
                aria-live="polite"
                className="max-h-80 space-y-4 overflow-y-auto bg-slate-50 px-5 py-5 sm:px-6"
                ref={chatScrollRef}
              >
                {!messages.length && (
                  <p className="text-sm text-slate-400">
                    Tanyakan kandungan, porsi, atau pilihan yang lebih seimbang.
                  </p>
                )}
                {(messageSessionId === summaryId ? messages : []).map(
                  (item, index) =>
                    item.from === "ai" ? (
                      <div
                        className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-4 py-2.5 text-sm leading-6 text-slate-700 shadow-sm"
                        key={`${index}-${item.from}`}
                      >
                        <Markdown content={item.text} />
                      </div>
                    ) : (
                      <div
                        className="ml-auto max-w-[85%] whitespace-pre-line rounded-2xl rounded-tr-sm bg-sky-500 px-4 py-2.5 text-sm leading-6 text-white shadow-sm shadow-sky-200"
                        key={`${index}-${item.from}`}
                      >
                        {item.text}
                      </div>
                    ),
                )}
                {busy && (
                  <div className="mr-auto flex max-w-[85%] items-center gap-2.5 rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                    <span className="flex items-center gap-1">
                      <span className="size-1.5 animate-bounce rounded-full bg-sky-500 [animation-delay:-300ms]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-sky-500 [animation-delay:-150ms]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-sky-500" />
                    </span>
                    <span className="animate-pulse">
                      Nutrily AI sedang berpikir…
                    </span>
                  </div>
                )}
              </div>
              {notice && (
                <NoticeAlert
                  className="mt-4"
                  message={notice}
                  variant="destructive"
                />
              )}
              <form
                className="flex gap-2 border-t border-slate-100 p-4 sm:p-5"
                onSubmit={ask}
              >
                <input
                  className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50"
                  maxLength={4000}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Tanya tentang gizi sesi ini…"
                  value={question}
                />
                <button
                  aria-label="Kirim pertanyaan"
                  className="grid size-12 shrink-0 place-items-center rounded-xl bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
                  disabled={busy || !question.trim()}
                >
                  <Send className="size-5" />
                </button>
              </form>
            </section>
          </div>
          <div className="mt-4">
            <Button onClick={() => navigate(`/chat/${summaryId}`)}>
              <Sparkles className="size-4" /> Lanjutkan konsultasi lanjutan di
              chat
            </Button>
          </div>
        </main>
      )}
    </div>
  )
}

export default ScannerFlow
