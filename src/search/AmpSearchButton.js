import React from 'react'
import SearchButton from 'react-storefront/search/SearchButton'
import { useAmp } from 'next/amp'

/**
 * A AMP-compatible replacement for `react-storefront/search/SearchButton`
 */
export default function AmpSearchButton(props) {
  const ampProps = {}

  if (useAmp()) {
    ampProps.on = 'tap:AMP.setState({ rsfSearchDrawer: { open: true }})'
  }

  return <SearchButton {...props} {...ampProps} />
}

AmpSearchButton.propTypes = SearchButton.propTypes
AmpSearchButton.defaultProps = SearchButton.defaultProps
