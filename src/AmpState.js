import React, { useContext } from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { useAmp } from 'next/amp'
import withDataBinding from './bind/withDataBinding'
import AmpContext from './AmpContext'

/**
 * Creates an amp-state with an initial value
 */
function AmpState({ id, amp, remote, initialState, children }) {
  const { nextId } = useContext(AmpContext) || {}

  id = id || nextId()

  children = children ? children(id) : null

  const props = { id }

  if (remote) {
    Object.assign(props, amp.bind({ attribute: 'src', value: remote.expression }), {
      src: remote.url,
    })
  }

  if (useAmp()) {
    return (
      <>
        <Head>
          <script
            async
            custom-element="amp-bind"
            src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"
          />
        </Head>
        <amp-state {...props}>
          <script
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(initialState),
            }}
          />
        </amp-state>
        {children}
      </>
    )
  } else {
    return children
  }
}

AmpState.propTypes = {
  /**
   * An id for the amp-state element
   */
  id: PropTypes.string,
  /**
   * The initial value of the state
   */
  initialState: PropTypes.any,
  /**
   * Object which contains the URL and expression for fetching
   * new state
   */
  remote: PropTypes.object,
}

AmpState.defaultProps = {
  initialState: {},
}

export default withDataBinding(AmpState)
