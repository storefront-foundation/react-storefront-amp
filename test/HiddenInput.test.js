import React, { useState } from 'react'
import { mount } from 'enzyme'
import DataBindingProvider from 'react-storefront-amp/bind/DataBindingProvider'

jest.mock('next/amp', () => ({
  useAmp: () => true
}))

describe('HiddenInput', () => {
  let wrapper, Test, HiddenInput

  beforeEach(() => {
    jest.isolateModules(() => {
      HiddenInput = require('react-storefront-amp/HiddenInput').default

      Test = ({ children }) => {
        const [store, updateStore] = useState({
          pageData: {
            name: 'test'
          }
        })
        return (
          <DataBindingProvider store={store} updateStore={updateStore}>
            {children}
          </DataBindingProvider>
        )
      }
    })
  })

  afterEach(() => {
    try {
      wrapper.unmount()
    } catch (e) {}
  })

  describe('not amp', () => {
    it('should render without error', () => {
      wrapper = mount(
        <Test>
          <HiddenInput />
        </Test>
      )

      expect(wrapper.find(HiddenInput).exists()).toBe(true)
    })

    it('should get the value from bind', () => {
      wrapper = mount(
        <Test>
          <HiddenInput bind="name" />
        </Test>
      )

      expect(wrapper.find('input').prop('value')).toBe('test')
    })
  })

  describe('amp', () => {
    it('should provide right binding', () => {
      wrapper = mount(
        <Test>
          <HiddenInput bind="name" />
        </Test>
      )
      expect(wrapper.find('input').prop('amp-bind')).toBe("value->page.name || ''")
    })
  })
})
