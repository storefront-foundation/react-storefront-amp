import React from 'react'
import withDataBinding from './bind/withDataBinding'

/**
 * Returns a hidden input whose value is pulled from the specified store in react and from the field
 * of the same name provided by DataBindingProvider when rendering amp.
 */
function HiddenInput({ name, amp, value }) {
  return (
    <input
      type="hidden"
      name={name}
      value={value || ''}
      {...amp.bind({
        attribute: 'value',
        value: `${amp.getValue()} || ''`,
      })}
    />
  )
}

HiddenInput.propTypes = {}

export default withDataBinding(HiddenInput)
