/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import clsx from 'clsx'
import Image from '../AmpImage'
import CarouselThumbnails, { styles } from 'react-storefront/carousel/CarouselThumbnails'
import { makeStyles } from '@material-ui/core/styles'
import { useAmp } from 'next/amp'
import withDataBinding from '../bind/withDataBinding'

const useStyles = makeStyles(styles, { name: 'RSFAmpCarouselThumbnails' })

function AmpCarouselThumbnails(props) {
  if (!useAmp()) return <CarouselThumbnails {...props} />

  const { amp, carouselId, thumbnails, className, thumbnailPosition } = props

  const styles = useStyles()
  const isVertical = ['left', 'right'].includes(thumbnailPosition)

  return (
    <div
      className={clsx(className, styles.thumbs, styles.tabsRoot, {
        [styles.tabsVertical]: isVertical,
        [styles.tabsRootLeft]: thumbnailPosition === 'left',
        [styles.tabsRootRight]: thumbnailPosition === 'right',
        [styles.tabsRootTop]: thumbnailPosition === 'top',
        [styles.tabsRootBottom]: thumbnailPosition === 'bottom',
      })}
    >
      {thumbnails.map((props, i) => {
        const icon = (
          <Image {...props} ImgElement="amp-img" layout="fill" contain className={styles.thumb} />
        )
        return (
          <div
            className={clsx(styles.tabRoot, i === 0 && styles.selectedTab)}
            on={`tap:${carouselId}.goToSlide(index=${i})`}
            {...amp.bind({
              attribute: 'class',
              value: `${amp.getValue()} == ${i} ? '${clsx(
                styles.tabRoot,
                styles.selectedTab,
              )}' : '${styles.tabRoot}'`,
            })}
          >
            <div className={clsx(styles.tabWrapper)}>{icon}</div>
            <div
              className={clsx(styles.tabsIndicator, { [styles.hidden]: i !== 0 })}
              {...amp.bind({
                attribute: 'class',
                value: `${amp.getValue()} == ${i} ? '${clsx(
                  styles.tabsIndicator,
                )}' : '${clsx(styles.tabsIndicator, { [styles.hidden]: true })}'`,
              })}
            />
          </div>
        )
      })}
    </div>
  )
}

export default withDataBinding(AmpCarouselThumbnails)
