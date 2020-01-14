import React from 'react'
import withDataBinding from './bind/withDataBinding'

/**
 * Returns a span whose text is pulled from the specified store in react and from the field
 * of the same name provided by DataBindingProvider when rendering amp.
 */
function Text({ amp, value }) {
  return (
    <span
      {...amp.bind({
        attribute: 'text',
        value: `${amp.getValue()} || ''`,
      })}
    >
      {value}
    </span>
  )
}

Text.propTypes = {}

export default withDataBinding(Text)
