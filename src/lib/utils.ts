export const cn = (...classes: (string | null | undefined | false)[]) =>
  classes.filter(Boolean).join(" ")
