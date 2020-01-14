import React, { useState, useEffect, useContext } from 'react'
import FilterButton from 'react-storefront/plp/FilterButton'
import { useAmp } from 'next/amp'
import { useRouter } from 'next/router'
import qs from 'qs'

export default function AmpFilterButton(props) {
  const router = useRouter()
  const { amp, ...query } = router.query
  const ampUrl = router.asPath.split('?')[0] + '?' + qs.stringify({ ...query, openFilter: 1 })
  return <FilterButton {...props} href={useAmp() ? ampUrl : undefined} />
}

AmpFilterButton.propTypes = FilterButton.propTypes

AmpFilterButton.defaultProps = FilterButton.defaultProps
