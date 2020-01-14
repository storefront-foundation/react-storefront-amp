import React from 'react'
import ProductOptionSelector from 'react-storefront/option/ProductOptionSelector'
import withDataBinding from '../bind/withDataBinding'
import AmpProductOption from './AmpProductOption'

function AmpProductOptionSelector({ bind, optionProps, ...props }) {
  return (
    <ProductOptionSelector
      {...props}
      OptionComponent={AmpProductOption}
      optionProps={{
        ...optionProps,
        bind: {
          options: bind.options,
          selectedOption: bind.value,
        },
      }}
    />
  )
}

AmpProductOptionSelector.propTypes = ProductOptionSelector.propTypes
AmpProductOptionSelector.defaultProps = ProductOptionSelector.defaultProps

export default withDataBinding(AmpProductOptionSelector)
