/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import PropTypes from 'prop-types'
import Head from 'next/head'
import withDataBinding from '../bind/withDataBinding'
import Fill from 'react-storefront/Fill'
import Carousel from 'react-storefront/carousel/Carousel'

export const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'relative',
    '& img': {
      display: 'block',
    },
    flex: 1,
    overflow: 'hidden',
  },

  dot: {
    backgroundColor: fade(theme.palette.text.primary, 0.25),
    width: 8,
    height: 8,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.background.paper,
    borderRadius: '50%',
    display: 'inline-block',
    margin: '0 2px',
    // Same duration as SwipeableViews animation
    transitionDuration: '0.35s',
  },

  dotSelected: {
    backgroundColor: theme.palette.text.primary,
  },

  dots: {
    position: 'absolute',
    bottom: '5px',
    textAlign: 'center',
    width: '100%',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFAmpCarousel' })

function Dot({ index, classes, ampStateProperty }) {
  classes = useStyles({ classes })
  return (
    <div
      key={index}
      className={clsx(classes.dot, {
        [classes.dotSelected]: index === 0,
      })}
      amp-bind={`class->${ampStateProperty} == ${index} ? '${classes.dot} ${classes.dotSelected}' : '${classes.dot}'`}
    />
  )
}

/**
 * A swipeable image selector suitable for PDPs
 */
function AmpCarousel(props) {
  let {
    amp,
    id,
    pairedCarouselId,
    classes,
    className,
    height,
    indicators,
    style,
    children,
    layout,
    belowAdornments,
    autoplay,
    interval,
    slideSpacing,
  } = props

  if (!amp) return <Carousel {...props} />

  classes = useStyles({ classes })

  return (
    <div className={clsx(className, classes.root)} style={style}>
      <Head>
        <script
          async
          custom-element="amp-carousel"
          src="https://cdn.ampproject.org/v0/amp-carousel-0.1.js"
        />
      </Head>
      <Fill height={height}>
        <amp-carousel
          id={id}
          controls
          layout={layout}
          type="slides"
          {...amp.on(
            amp.createHandler(
              'slideChange',
              amp.setState(
                { prop: 'index', value: 'event.index' },
                { prop: 'pairedIndex', value: 'event.index' },
              ),
              `${pairedCarouselId}.goToSlide(index=event.index)`,
            ),
          )}
          {...(autoplay ? { autoplay, delay: interval } : {})}
        >
          {React.Children.map(children, (child, index) => (
            <div
              style={{
                padding: `0 ${slideSpacing}px`,
              }}
              {...amp.on(
                amp.createHandler(
                  'tap',
                  amp.setState(
                    { value: index, prop: 'pairedIndex' },
                    { value: true, prop: 'open' },
                  ),
                  `${pairedCarouselId}.goToSlide(index=${index})`,
                ),
              )}
            >
              {child}
            </div>
          ))}
        </amp-carousel>
      </Fill>
      {belowAdornments}
      {indicators && (
        <div className={classes.dots}>
          {React.Children.map(children, (_, index) => (
            <Dot index={index} ampStateProperty={`rsfMediaCarousel.${id}.index`} />
          ))}
        </div>
      )}
    </div>
  )
}

AmpCarousel.propTypes = {
  /**
   * Display left/right arrows for navigating through images
   */
  arrows: PropTypes.bool,

  /**
   * Display indicator dots at the bottom of the component
   */
  indicators: PropTypes.bool,

  /**
   * Option to manually set the selected index
   */
  selectedIndex: PropTypes.number,

  /**
   * Height on carousel container, defaults to 300
   */
  height: PropTypes.number,

  /**
   * ID to use for amp-carousel component, defaults to "carousel"
   */
  id: PropTypes.string,

  /**
   * ID of another amp-carousel that should also be changed when this one is changed
   */
  pairedCarouselId: PropTypes.string,

  /**
   * AMP layout type, defaults to "fill"
   */
  layout: PropTypes.string,

  /**
   * If false, the auto play behavior is disabled
   */
  autoplay: PropTypes.bool,

  /**
   * Delay between auto play transitions (in ms)
   */
  interval: PropTypes.number,

  /**
   * Amount of pixels of spacing between each slide
   */
  slideSpacing: PropTypes.number,
}

AmpCarousel.defaultProps = {
  arrows: true,
  indicators: true,
  id: 'carousel',
  layout: 'fill',
  autoplay: false,
  interval: 3000,
  slideSpacing: 0,
}

export default withDataBinding(AmpCarousel)
