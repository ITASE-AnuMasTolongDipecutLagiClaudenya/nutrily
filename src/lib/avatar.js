export function getOriginalGoogleAvatarUrl(user) {
  const metadata = user?.user_metadata || {}
  const googleIdentity =
    user?.identities?.find(({ provider }) => provider === "google")
      ?.identity_data || {}
  const currentUrl = metadata.avatar_url || ""

  return (
    metadata.google_avatar_url ||
    googleIdentity.avatar_url ||
    googleIdentity.picture ||
    metadata.picture ||
    (currentUrl.includes("res.cloudinary.com/") ? "" : currentUrl)
  )
}

export function getProfileAvatarUrl(user) {
  return user?.user_metadata?.avatar_url || getOriginalGoogleAvatarUrl(user)
}

export function hasCustomAvatar(avatarUrl, originalAvatarUrl) {
  return Boolean(avatarUrl && avatarUrl !== originalAvatarUrl)
}
