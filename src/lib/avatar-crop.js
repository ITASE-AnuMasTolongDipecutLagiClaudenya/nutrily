export function getAvatarCropRect(imageWidth, imageHeight, zoom, offset, size) {
  const scale = Math.max(size / imageWidth, size / imageHeight) * zoom
  const sourceSize = size / scale
  return {
    x: (imageWidth - sourceSize) / 2 - offset.x / scale,
    y: (imageHeight - sourceSize) / 2 - offset.y / scale,
    size: sourceSize,
  }
}
