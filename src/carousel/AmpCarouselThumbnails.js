/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import clsx from 'clsx'
import Image from 'react-storefront/Image'
import { styles } from 'react-storefront/carousel/CarouselThumbnails'
import { makeStyles } from '@material-ui/core/styles'
import withDataBinding from '../bind/withDataBinding'

const useStyles = makeStyles(styles, { name: 'RSFAmpCarouselThumbnails' })

function AmpCarouselThumbnails({ amp, carouselId, thumbnails, className }) {
  const styles = useStyles()
  return (
    <div className={clsx(className, styles.thumbs, styles.tabsRoot)}>
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
