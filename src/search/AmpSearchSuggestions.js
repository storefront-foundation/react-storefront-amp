import React, { useContext } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import SearchSuggestions from 'react-storefront/search/SearchSuggestions'
import SearchSuggestionItem from 'react-storefront/search/SearchSuggestionItem'
import SearchSuggestionGroup from 'react-storefront/search/SearchSuggestionGroup'
import Head from 'next/head'
import DataBindingContext from '../bind/DataBindingContext'
import { useAmp } from 'next/amp'

export const styles = theme => ({
  root: {},
  thumbnailGroup: {},
  group: {},
  container: {
    position: 'relative',
    height: '100%',
    overflowY: 'auto',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFAmpSearchSuggestions' })

export default function AmpSearchSuggestions(props) {
  const classes = useStyles(props)
  const { ampState } = useContext(DataBindingContext)

  if (!useAmp()) return <SearchSuggestions {...props} />

  return (
    <>
      <Head>
        <script
          async
          custom-element="amp-list"
          src="https://cdn.ampproject.org/v0/amp-list-0.1.js"
        />
        <script
          async
          custom-template="amp-mustache"
          src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"
        />
      </Head>
      <div className={classes.container}>
        <amp-list
          layout="fill"
          class={classes.root}
          amp-bind={`src->"/api/suggestions?q=" + (${ampState}.text ? encodeURIComponent(${ampState}.text) : '')`}
          items="groups"
          reset-on-refresh
        >
          <template type="amp-mustache">
            <SearchSuggestionGroup
              caption="{{caption}}"
              ui="{{ui}}"
              amp-bind={`class->{{thumbnails}} ? "${classes.thumbnailGroup}" : "${classes.group}"`}
            >
              {'{{#links}}'}
              <SearchSuggestionItem
                thumbnailProps={{
                  height: 100,
                  width: 100,
                }}
                ui="{{ui}}"
                item={{
                  as: '{{as}}',
                  href: '{{href}}',
                  text: '{{text}}',
                  thumbnail: { src: '{{thumbnail.src}}', alt: '{{thumbnail.alt}}' },
                }}
              />
              {'{{/links}}'}
            </SearchSuggestionGroup>
          </template>
        </amp-list>
      </div>
    </>
  )
}

AmpSearchSuggestions.propTypes = SearchSuggestions.propTypes

AmpSearchSuggestions.defaultProps = SearchSuggestions.defaultProps
