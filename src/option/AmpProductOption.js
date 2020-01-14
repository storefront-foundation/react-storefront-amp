import React from 'react'
import ProductOption from 'react-storefront/option/ProductOption'
import withDataBinding from '../bind/withDataBinding'
import get from 'lodash/get'

function AmpProductOption({ amp, bind, ...props }) {
  return (
    <ProductOption
      {...props}
      wrapperProps={({ value, selected, selectedClassName }) => ({
        className: selected ? selectedClassName : '',
        ...amp.bind({
          attribute: 'class',
          value: `${amp.getValue('selectedOption')}.id == '${get(
            value,
            'id',
          )}' ? '${selectedClassName}' : ''`,
        }),
      })}
      optionProps={({ value, index }) => ({
        buttonProps: amp.on(
          amp.createHandler(
            'tap',
            amp.setState({
              prop: 'selectedOption',
              value: `${amp.getValue('selectedOption')}.id == '${get(
                value,
                'id',
              )}' ? undefined : ${amp.getValue('options')}[${index}]`,
            }),
          ),
        ),
      })}
    />
  )
}

export default withDataBinding(AmpProductOption)
