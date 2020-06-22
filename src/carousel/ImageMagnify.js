import React from 'react'
import ReactImageMagnify from 'react-image-magnify'
import { useAmp } from 'next/amp'
import qs from 'qs'

function getOptimizedSrc(url, options) {
  // Do not try to optimize base64 image data
  if (url.indexOf('data:') === 0) return url
  return `https://opt.moovweb.net/?${qs.stringify({ ...options, img: url })}`
}

export default function ImageMagnify(props) {
  if (!useAmp()) return <ReactImageMagnify {...props} />
  const { optimize, smallImage, largeImage, ...others } = props
  return (
    <ReactImageMagnify
      {...others}
      smallImage={{
        ...smallImage,
        src: getOptimizedSrc(smallImage.src, optimize),
      }}
      largeImage={{
        ...largeImage,
        src: getOptimizedSrc(largeImage.src, optimize),
      }}
    />
  )
}
