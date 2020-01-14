import React from 'react'
import Image from 'react-storefront/Image'
import { useAmp } from 'next/amp'
import PropTypes from 'prop-types'
import withDataBinding from './bind/withDataBinding'
import clsx from 'clsx'
import qs from 'qs'

function AmpImage({ src, optimize, amp, bind, ...props }) {
  const isAmp = useAmp()
  let layout

  if (isAmp) {
    layout = props.contain || props.fill || props.aspectRatio ? 'fill' : 'intrinsic'
  }

  const additionalProps = !isAmp
    ? {}
    : {
        ...amp.bind({
          attribute: 'src',
          value: `'${getOptimizedSrc(
            isAmp,
            '__url__',
          )}'.split('__url__').join(encodeURIComponent(${amp.getValue('src')}))`,
        }),
        lazy: false,
        layout,
      }

  return (
    <Image
      {...props}
      {...additionalProps}
      src={getOptimizedSrc(isAmp, src, optimize)}
      ImgElement={isAmp ? AmpImg : 'img'}
    />
  )
}

function AmpImg({ className, onError, ...props }) {
  return <amp-img class={className} {...props} />
}

AmpImage.propTypes = {
  ...Image.propTypes,
  /**
   * When specified, the image will be optimized for mobile devices by the Moovweb CDN.  Accepts the following keys:
   *
   * - quality  - A number or string containing the number for the desired quality, on a scale from 1 (worst) to 100 (best).
   * - width - A number or string containing the number for the desired pixel width.
   * - height - A number or string containing the number for the desired pixel height.
   * - format - A string containing the desired file format. Accepts "webp" or "jpeg".
   */
  optimize: PropTypes.shape({
    quality: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    format: PropTypes.oneOf(['webp', 'jpeg']),
  }),
}

AmpImage.defaultProps = {
  ...Image.defaultProps,
  optimize: {},
}

export default withDataBinding(AmpImage)

/**
 * Returns a URL for Moovweb's image optimizer for the given src URL and optimization
 * options
 * @param {Boolean} amp Set to true when rendering amp
 * @param {String} url The source image url
 * @param {Object} options See the prop types for AmpImage
 * @return {String}
 */
export function getOptimizedSrc(amp, url, options) {
  url = `https://opt.moovweb.net/?${qs.stringify({ ...options, img: url })}`

  // this allows use to generate optimized URLs using moustache templates, as in the case of `AmpSearchSuggestions`
  if (amp) url = url.replace(encodeURIComponent('{{'), '{{').replace(encodeURIComponent('}}'), '}}')

  return url
}
