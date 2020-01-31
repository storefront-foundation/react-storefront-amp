import React from 'react'
import DataBindingProvider from '../bind/DataBindingProvider'
import AmpCarousel from './AmpCarousel'
import AmpCarouselThumbnails from './AmpCarouselThumbnails'
import AmpDrawer from '../AmpDrawer'
import AmpMedia from './AmpMedia'
import MediaCarousel from 'react-storefront/carousel/MediaCarousel'
import { makeStyles } from '@material-ui/core/styles'
import { useAmp } from 'next/amp'
import withDataBinding from '../bind/withDataBinding'

const styles = theme => ({
  lightbox: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    '& > div:first-of-type': {
      [theme.breakpoints.down('xs')]: {
        margin: 0
      }
    }
  },
  thumbnails: {
    paddingBottom: theme.spacing(2)
  },
  lightboxMagnifyHint: {
    display: 'none'
  }
})

const useStyles = makeStyles(styles, { name: 'RSFAmpMediaCarousel' })

function AmpMediaCarousel({ amp, maxItems = 8, ...props }) {
  if (!useAmp()) return <MediaCarousel {...props} />

  const classes = useStyles({ classes: props.classes })

  function createSpace(type, magnify) {
    return (_, index) => {
      if (index >= props.media.full.length) return null
      const magnifyPrefix = `${amp.getValue('media')}.full[${index}].magnify.src || `
      return {
        ...props.media[type][index],
        ...amp.bind({
          attribute: 'src',
          value: `${magnify ? magnifyPrefix : ''}${amp.getValue('media')}.${type}[${index}].src`
        })
      }
    }
  }

  function createMedia(isMagnify) {
    return {
      full: Array(maxItems)
        .fill(0)
        .map(createSpace('full', isMagnify))
        .filter(Boolean),
      thumbnails: Array(maxItems)
        .fill(0)
        .map(createSpace('thumbnails'))
        .filter(Boolean)
    }
  }

  const mediaSpace = createMedia(false)
  const lightboxMediaSpace = createMedia(true)

  return (
    <DataBindingProvider
      id="rsfMediaCarousel"
      store={{ open: false }}
      root={null}
      updateStore={Function.prototype}
    >
      <MediaCarousel
        {...props}
        id="ampCarousel"
        pairedCarouselId="ampLightboxCarousel"
        media={mediaSpace}
        CarouselComponent={AmpCarousel}
        MediaComponent={AmpMedia}
        CarouselThumbnailsComponent={AmpCarouselThumbnails}
        bind={{
          index: `ampCarousel.index`,
          pairedIndex: `ampLightboxCarousel.index`,
          open: 'open'
        }}
      />
      <AmpDrawer open showCloseButton fullscreen>
        <div className={classes.lightbox}>
          <MediaCarousel
            {...props}
            id="ampLightboxCarousel"
            pairedCarouselId="ampCarousel"
            media={lightboxMediaSpace}
            CarouselComponent={AmpCarousel}
            MediaComponent={AmpMedia}
            CarouselThumbnailsComponent={AmpCarouselThumbnails}
            thumbsClassName={classes.thumbnails}
            magnifyHintClassName={classes.lightboxMagnifyHint}
            bind={{
              index: `ampLightboxCarousel.index`,
              pairedIndex: `ampCarousel.index`
            }}
          />
        </div>
      </AmpDrawer>
    </DataBindingProvider>
  )
}

AmpMediaCarousel.propTypes = MediaCarousel.propTypes
AmpMediaCarousel.defaultProps = { ...MediaCarousel.defaultProps, id: 'carousel' }

export default withDataBinding(AmpMediaCarousel)
