import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { makeStyles } from '@material-ui/core/styles'
import { useAmp } from 'next/amp'

/**
 * AMP ready video component. All props are spread to the underlying video or amp-video tag.
 *
 * Usage:
 *
 * ```js
 * <Video
 *  src="https://amp.dev/static/inline-examples/videos/kitten-playing.webm"
 *  controls
 * />
 * ```
 */
export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFVideo' })

export default function Video({ children, classes, ...props }) {
  classes = useStyles({ classes })

  const amp = useAmp()
  const Tag = amp ? 'amp-video' : 'video'

  const tagProps = {
    [amp ? 'class' : 'className']: classes.root,
    ...props,
  }

  // Layout must be declared in AMP, so we use "fill" by default if not defined
  if (amp && !props.height && !props.width && !props.layout) {
    tagProps.layout = 'fill'
  }

  return (
    <>
      {amp && (
        <Head>
          <script
            async
            custom-element="amp-video"
            src="https://cdn.ampproject.org/v0/amp-video-0.1.js"
          />
        </Head>
      )}
      <Tag {...tagProps}>{children}</Tag>
    </>
  )
}

Video.propTypes = {
  /**
   * Set to false to hide the browser video controls
   */
  controls: PropTypes.bool,
}

Video.defaultProps = {
  controls: true,
}
