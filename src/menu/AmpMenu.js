import React from 'react'
import Menu from 'react-storefront/menu/Menu'
import AmpMenuDrawer from './AmpMenuDrawer'
import { useAmp } from 'next/amp'
import AmpState from '../AmpState'

/**
 *
 * Overrides Menu and renders all menu items at once, using CSS to show/hide then based
 * on the user's navigation through the menu.
 */
export default function AmpMenu(props) {
  if (!useAmp()) {
    return <Menu {...props} />
  }

  const cards = []
  let { root } = props
  let nextId = 0

  function addMenuData(item, depth = 0) {
    const result = {
      ...item,
      _rsfMenuItem: nextId++,
      _rsfMenuCard: depth,
      root: depth === 0,
      items:
        item &&
        item.items &&
        item.items.map(item => {
          return addMenuData(item, depth + 1)
        }),
    }

    let card = cards[depth]
    if (!card) card = cards[depth] = []
    card.push(result)

    return result
  }

  root = addMenuData(props.root)

  return (
    <>
      <AmpState id="rsfMenuState" initialState={{ card0: 0, card: 0 }} />
      <Menu
        {...props}
        renderDrawer={() => <AmpMenuDrawer {...props} root={root} cards={cards} />}
      />
    </>
  )
}

AmpMenu.propTypes = Menu.propTypes
AmpMenu.defaultProps = Menu.defaultProps
