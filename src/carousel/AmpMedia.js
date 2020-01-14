import React from 'react'
import Media from 'react-storefront/carousel/Media'
import { useAmp } from 'next/amp'

export default function AmpMedia(props) {
  if (!useAmp()) return <Media {...props} />
  const imageProps = { ImgElement: 'amp-img', layout: 'fill' }
  if (props['amp-bind']) {
    imageProps['amp-bind'] = props['amp-bind']
  }
  return <Media {...props} imageProps={imageProps} magnify={false} />
}

AmpMedia.propTypes = Media.propTypes
AmpMedia.defaultProps = Media.defaultProps
