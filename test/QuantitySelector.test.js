import React, { useState } from 'react'
import { mount } from 'enzyme'
import QuantitySelector from 'react-storefront-amp/AmpQuantitySelector'
import DataBindingProvider from 'react-storefront-amp/bind/DataBindingProvider'
import { IconButton, Input } from '@material-ui/core'

describe('QuantitySelector', () => {
  let wrapper,
    name,
    addIcon,
    subtractIcon,
    minValue,
    maxValue,
    onChange,
    ariaLabel,
    quantity = 1,
    isChanged = false,
    value

  const clearValues = () => {
    wrapper.unmount()
    name = undefined
    addIcon = undefined
    subtractIcon = undefined
    minValue = undefined
    maxValue = undefined
    onChange = undefined
    ariaLabel = undefined
    quantity = 1
    isChanged = false
    value = undefined
  }

  const Test = () => {
    const [store, updateStore] = useState({ pageData: { quantity: quantity } })
    value = store.pageData.quantity

    return (
      <DataBindingProvider store={store} updateStore={updateStore}>
        <QuantitySelector
          minValue={minValue}
          maxValue={maxValue}
          onChange={onChange}
          addIcon={addIcon}
          subtractIcon={subtractIcon}
          name={name}
          ariaLabel={ariaLabel}
          bind="quantity"
        />
      </DataBindingProvider>
    )
  }

  describe('should render component with default values', () => {
    afterEach(() => {
      clearValues()
    })

    it('should have right default aria labels', () => {
      wrapper = mount(<Test />)
      const ariaLabelFinder = wrapper.findWhere(n => n.prop('aria-label'))

      expect(
        ariaLabelFinder
          .filterWhere(n => n.prop('aria-label').includes('subtract one quantity'))
          .exists(),
      ).toBe(true)
      expect(
        ariaLabelFinder
          .filterWhere(n => n.prop('aria-label').includes('add one quantity'))
          .exists(),
      ).toBe(true)
      expect(
        ariaLabelFinder.filterWhere(n => n.prop('aria-label').includes('does not exist')).exists(),
      ).toBe(false)
    })

    it('should have right default name', () => {
      wrapper = mount(<Test />)

      expect(
        wrapper.findWhere(n => n.prop('name') && n.prop('name').includes('quantity')).exists(),
      ).toBe(true)
    })

    it('should not allow subtracting more than default min value', () => {
      quantity = 1
      onChange = value => (isChanged = true)
      wrapper = mount(<Test />)

      wrapper
        .find(IconButton)
        .first()
        .simulate('click')

      expect(isChanged).toBe(false)
    })

    it('should not allow adding more than default max value', () => {
      quantity = 100
      onChange = value => (isChanged = true)
      wrapper = mount(<Test />)

      wrapper
        .find(IconButton)
        .last()
        .simulate('click')

      expect(isChanged).toBe(false)
    })

    it('should have right initial value', () => {
      quantity = undefined
      wrapper = mount(<Test />)

      expect(wrapper.find('input').prop('value')).toBe(1)
    })
  })

  describe('should render component with custom values', () => {
    afterEach(() => {
      clearValues()
    })

    it('should not allow adding more than custom max value', () => {
      maxValue = 200
      quantity = 200
      onChange = value => (isChanged = true)
      wrapper = mount(<Test />)

      wrapper
        .find(IconButton)
        .last()
        .simulate('click')

      expect(isChanged).toBe(false)
    })

    it('should not allow subtracting more than custom min value', () => {
      minValue = 100
      quantity = 100
      onChange = value => (isChanged = true)
      wrapper = mount(<Test />)

      wrapper
        .find(IconButton)
        .first()
        .simulate('click')

      expect(isChanged).toBe(false)
    })

    it('should allow custom name', () => {
      name = 'testName'
      wrapper = mount(<Test />)

      expect(wrapper.findWhere(n => n.prop('name') && n.prop('name').includes(name)).exists()).toBe(
        true,
      )
    })

    it('should allow custom aria label', () => {
      ariaLabel = 'customAria'
      wrapper = mount(<Test />)
      const ariaLabelFinder = wrapper.findWhere(n => n.prop('aria-label'))

      expect(
        ariaLabelFinder
          .filterWhere(n => n.prop('aria-label').includes(`subtract one ${ariaLabel}`))
          .exists(),
      ).toBe(true)
      expect(
        ariaLabelFinder
          .filterWhere(n => n.prop('aria-label').includes(`add one ${ariaLabel}`))
          .exists(),
      ).toBe(true)
      expect(
        ariaLabelFinder.filterWhere(n => n.prop('aria-label').includes('does not exist')).exists(),
      ).toBe(false)
    })

    it('should allow custom add icon', () => {
      addIcon = <div id="testAddIcon" />
      wrapper = mount(<Test />)

      expect(wrapper.find('#testAddIcon').exists()).toBe(true)
    })

    it('should allow custom subtract icon', () => {
      subtractIcon = <div id="testSubtractIcon" />
      wrapper = mount(<Test />)

      expect(wrapper.find('#testSubtractIcon').exists()).toBe(true)
    })
  })

  describe('should interact with DataBingindProvider', () => {
    afterEach(() => {
      clearValues()
    })

    it('should change store value on substract or add click', () => {
      quantity = 1
      wrapper = mount(<Test />)

      wrapper
        .find(IconButton)
        .last()
        .simulate('click')

      expect(value).toBe(2)

      wrapper
        .find(IconButton)
        .first()
        .simulate('click')

      expect(value).toBe(1)
    })

    it('should read initial value from store', () => {
      quantity = 10
      wrapper = mount(<Test />)

      expect(value).toBe(10)
    })
  })
})
