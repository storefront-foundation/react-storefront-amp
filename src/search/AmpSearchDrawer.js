import React from 'react'
import SearchDrawer from 'react-storefront/search/SearchDrawer'
import DataBindingProvider from '../bind/DataBindingProvider'
import AmpDrawer from '../AmpDrawer'
import { useAmp } from 'next/amp'
import Head from 'next/head'

export default function AmpSearchDrawer(props) {
  return (
    <>
      {useAmp() && (
        <Head>
          <script
            async
            custom-element="amp-form"
            src="https://cdn.ampproject.org/v0/amp-form-0.1.js"
          />
        </Head>
      )}
      <DataBindingProvider
        id="rsfSearchDrawer"
        store={{ open: false, text: '' }}
        root={null}
        updateStore={Function.prototype}
      >
        <SearchDrawer {...props} DrawerComponent={AmpDrawer} />
      </DataBindingProvider>
    </>
  )
}

AmpSearchDrawer.propTypes = {}

AmpSearchDrawer.defaultProps = {}
