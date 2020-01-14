import React, { useContext } from 'react'
import MenuCard from 'react-storefront/menu/MenuCard'
import MenuContext from 'react-storefront/menu/MenuContext'
import { useAmp } from 'next/amp'

/**
 * Overrides MenuCard, converting the array items created by AmpMenu to
 * individual MenuCards which are shown/hidden based on on AMP state.
 */
export default function AmpMenuCard(props) {
  if (!useAmp()) return <MenuCard {...props} />

  const { item } = props
  const { drawerWidth } = useContext(MenuContext)

  return (
    <div style={{ width: drawerWidth }}>
      {item.map((item, i) => (
        <div
          key={i}
          amp-bind={`hidden->rsfMenuState.card${item._rsfMenuCard} != ${item._rsfMenuItem}`}
        >
          <MenuCard
            {...props}
            item={item}
            headerProps={{
              backButtonProps: {
                on: 'tap:AMP.setState({ rsfMenuState: { card: rsfMenuState.card - 1 }})',
              },
            }}
          />
        </div>
      ))}
    </div>
  )
}
