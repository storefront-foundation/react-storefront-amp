import React, { useState, useEffect, useContext } from 'react'
import SortButton from 'react-storefront/plp/SortButton'
import { useAmp } from 'next/amp'
import { useRouter } from 'next/router'
import qs from 'qs'

export default function AmpSortButton(props) {
  const router = useRouter()
  const { amp, ...query } = router.query
  const ampUrl = router.asPath.split('?')[0] + '?' + qs.stringify({ ...query, openSort: 1 })
  return <SortButton {...props} href={useAmp() ? ampUrl : undefined} />
}

AmpSortButton.propTypes = SortButton.propTypes

AmpSortButton.defaultProps = SortButton.defaultProps
