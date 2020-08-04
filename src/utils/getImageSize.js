import getImageAttributes from 'probe-image-size/sync'

/**
 * Returns the height and width of an image
 * @param {String} url The image url or src for inline images
 * @param {Object} options
 * @param {Object} options.imageService The hostname to use for the image size service
 * @return {Object} An object with `height` and `width`.
 */
export default function getImageSize(url, imageService = 'image.moovweb.net') {
  // we're dealing with an inline image
  if (url.startsWith('data:')) {
    const base64Img = url
      .toString()
      .split(',')[1]
      .trim()
    const imgAttributes = getImageAttributes(Buffer.from(base64Img, 'base64'))
    const { width, height } = imgAttributes
    return { width, height }
  }

  // it's an external url - use the Moovweb image service
  return fetch(`https://${imageService}/size?url=${encodeURIComponent(url)}`).then(res =>
    res.json(),
  )
}
