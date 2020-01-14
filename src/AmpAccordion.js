/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import Head from 'next/head'
import { makeStyles } from '@material-ui/core/styles'
import { useAmp } from 'next/amp'
import Accordion from 'react-storefront/Accordion'

export const styles = () => ({
  accordion: {},
})

const useStyles = makeStyles(styles, { name: 'RSFAmpAccordion' })

export default function AmpAccordion(props) {
  let { classes, children, ...otherProps } = props
  classes = useStyles({ classes })

  if (useAmp()) {
    return (
      <>
        <Head>
          <script
            async
            custom-element="amp-accordion"
            src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"
          />
        </Head>
        <amp-accordion
          expand-single-section
          disable-session-states
          class={classes.accordion}
          {...otherProps}
        >
          {React.Children.map(children, child =>
            React.cloneElement(child, {
              fromAccordion: true,
            }),
          )}
        </amp-accordion>
      </>
    )
  } else {
    return <Accordion {...props} />
  }
}
