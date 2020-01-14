import React, { useRef, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useAmp } from 'next/amp'
import DataBindingContext from './DataBindingContext'
import get from 'lodash/get'
import set from 'lodash/set'
import merge from 'lodash/merge'
import AmpState from '../AmpState'

function parseRemote(remote) {
  const remoteVariablePattern = /{([^}]+)}/g
  return {
    getUrl(root) {
      if (!remote) return null
      return remote.replace(remoteVariablePattern, (_, path) => get(root, path))
    },
    getExpression(prefix) {
      if (!remote) return null
      return (
        '"' +
        remote.replace(remoteVariablePattern, (_, path) => {
          return `"+${prefix}.${path}+"`
        }) +
        '"'
      )
    },
  }
}

/**
 * Provides a way to access and update state that works with both React and AMP.
 *
 * All page components should use `DataBindingProvider` as the root element:
 *
 * ```js
 * function Product(lazyProps) {
 *   const [store, updateStore] = useLazyStore(lazyProps)
 *
 *   return (
 *     <DataBindingProvider store={store} updateStore={updateStore}>
 *        // access values from page state by name
 *        <Typography variant="h1">
 *          <Bind name="product.name"/>
 *        </Typography>
 *
 *        // form fields will automatically update state by name
 *        <Label>QTY:</Label>
 *        <QuantitySelector name="quantity"/>
 *     </DataBindingProvider>
 *   )
 * })
 * ```
 */
export default function DataBindingProvider({ id, children, store, updateStore, root, remote }) {
  const lastRemoteUrl = useRef(null)

  const url = parseRemote(remote).getUrl(store[root])

  const value = useMemo(() => {
    return {
      getValue: path => {
        return get(store, `${normalizeRoot(root)}${path}`)
      },
      setValue: (path, value) => {
        updateStore(store => {
          const newStore = { ...store }
          set(newStore, `${normalizeRoot(root)}${path}`, value)
          return newStore
        })
      },
      ampState: id,
      root,
    }
  }, [store, updateStore, id, root])

  useEffect(() => {
    if (!remote) return

    if (!lastRemoteUrl.current) {
      lastRemoteUrl.current = url
      return
    }

    if (url !== lastRemoteUrl.current) {
      lastRemoteUrl.current = url
      // Fetch new data since remote url changed
      fetch(url)
        .then(res => res.json())
        .then(pageData => {
          updateStore(() => {
            const newStore = { ...store }
            merge(newStore, { pageData })
            return newStore
          })
        })
    }
  }, [store])

  const ampStateProps = {
    id,
    bind: 'page',
    initialState: root ? get(store, root) : store,
  }

  if (useAmp && remote) {
    ampStateProps.remote = {
      url,
      expression: parseRemote(remote).getExpression(id),
    }
  }

  return (
    <DataBindingContext.Provider value={value}>
      {useAmp && <AmpState {...ampStateProps} />}
      {children}
    </DataBindingContext.Provider>
  )
}

function normalizeRoot(root) {
  if (root) {
    return `${root}.`
  } else {
    return ''
  }
}

DataBindingProvider.propTypes = {
  /**
   * An id for the root object
   */
  id: PropTypes.string,

  /**
   * The page store returned from `hooks/useLazyStore`
   */
  store: PropTypes.object,

  /**
   * The page store update function returned from `hooks/useLazyStore`
   */
  updateStore: PropTypes.func,

  /**
   * A path prepended to all paths passed to `getValue` and `setValue`.
   */
  root: PropTypes.string,

  /**
   * A URL for fetching state at runtime when a part of the data model
   * changes. This is used for both AMP and non-AMP environments.
   *
   * Example: "/api/p/{product.id}?color={color.id}"
   *
   */
  remote: PropTypes.string,
}

DataBindingProvider.defaultProps = {
  id: 'page',
  store: {},
  updateStore: Function.prototype,
  root: 'pageData',
}
