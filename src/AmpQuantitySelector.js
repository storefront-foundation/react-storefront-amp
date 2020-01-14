import React from 'react'
import QuantitySelector from 'react-storefront/QuantitySelector'
import { useAmp } from 'next/amp'
import withDataBinding from './bind/withDataBinding'

/**
 * An AMP-compatible version of `react-storefront/QuantitySelector`.  All props are
 * forwarded to the underlying `QuantitySelector` element.
 */
function AmpQuantitySelector({ amp, ...props }) {
  const isAmp = useAmp()

  return (
    <QuantitySelector
      {...props}
      {...{ [isAmp ? 'readOnly' : 'disabled']: true }}
      subtractButtonProps={amp.on(
        amp.createHandler(
          'tap',
          amp.setState({
            value: `max(${props.minValue}, (${amp.getValue()} || ${props.value}) - 1)`,
          }),
        ),
      )}
      addButtonProps={amp.on(
        amp.createHandler(
          'tap',
          amp.setState({
            value: `min(${props.maxValue}, (${amp.getValue()} || ${props.value}) + 1)`,
          }),
        ),
      )}
      inputProps={amp.bind({
        attribute: 'value',
        value: `${amp.getValue()} || 1`,
      })}
    />
  )
}

AmpQuantitySelector.propTypes = QuantitySelector.propTypes
AmpQuantitySelector.defaultProps = QuantitySelector.defaultProps

export default withDataBinding(AmpQuantitySelector)
