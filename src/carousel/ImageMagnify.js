import React from 'react'
import ReactImageMagnify from 'react-image-magnify'
import qs from 'qs'

function getOptimizedSrc(url, options) {
  return `https://opt.moovweb.net/?${qs.stringify({ ...options, img: url })}`
}

export default function ImageMagnify({ optimize, smallImage, largeImage, ...props }) {
  return (
    <ReactImageMagnify
      {...props}
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
