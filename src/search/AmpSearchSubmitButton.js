import React from 'react'
import SearchSubmitButton from 'react-storefront/search/SearchSubmitButton'
import { useAmp } from 'next/amp'

export default function AmpSearchSubmitButton(props) {
  return (
    <SearchSubmitButton {...props} disabled={useAmp() ? false : props.text.trim().length === 0} />
  )
}

AmpSearchSubmitButton.propTypes = SearchSubmitButton.propTypes

AmpSearchSubmitButton.defaultProps = SearchSubmitButton.defaultProps
