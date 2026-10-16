import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react"
import { Alert, AlertContent, AlertDescription, AlertIcon } from "./alert-1"
import { getNoticeVariant } from "@/lib/notice-variant"

const noticeIcons = {
  destructive: CircleAlert,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
}

export default function NoticeAlert({
  message,
  variant,
  onClose,
  className = "",
  ...props
}) {
  if (!message) return null

  const type = variant || getNoticeVariant(message)
  const Icon = noticeIcons[type] || CircleAlert
  const urgent = type === "destructive" || type === "warning"

  return (
    <Alert
      appearance="light"
      variant={type}
      role={urgent ? "alert" : "status"}
      aria-live={urgent ? "assertive" : "polite"}
      aria-atomic="true"
      close={Boolean(onClose)}
      onClose={onClose}
      className={`!items-center !border-2 !border-sky-400 !bg-white font-poppins text-slate-700 shadow-[0_18px_48px_-20px_rgba(15,23,42,.28)] ${className}`}
      {...props}
    >
      <AlertIcon>
        <Icon aria-hidden="true" />
      </AlertIcon>
      <AlertContent className="min-w-0 flex-1">
        <AlertDescription className="text-[13px] font-medium leading-5 sm:text-sm">
          {message}
        </AlertDescription>
      </AlertContent>
    </Alert>
  )
}
