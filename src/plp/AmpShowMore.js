import React, { useContext } from 'react'
import ShowMore from 'react-storefront/plp/ShowMore'
import SearchResultsContext from 'react-storefront/plp/SearchResultsContext'
import { useAmp } from 'next/amp'
import { useRouter } from 'next/router'

export default function AmpShowMore(props) {
  const router = useRouter()
  const {
    pageData: { products },
  } = useContext(SearchResultsContext)
  const ampUrl = router.asPath.split('?')[0] + '?' + `more=true#item-${products.length - 1}`

  return <ShowMore {...props} href={useAmp() ? ampUrl : undefined} />
}

AmpShowMore.propTypes = ShowMore.propTypes

AmpShowMore.defaultProps = ShowMore.defaultProps
