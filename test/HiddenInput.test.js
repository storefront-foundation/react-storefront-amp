import React, { useState } from 'react'
import { mount } from 'enzyme'
import DataBindingProvider from 'react-storefront/bind/DataBindingProvider'

describe('HiddenInput', () => {
  let wrapper, Test, HiddenInput, mockAmp

  beforeEach(() => {
    jest.isolateModules(() => {
      mockAmp = false

      jest.mock('next/amp', () => ({
        useAmp: () => mockAmp,
      }))

      HiddenInput = require('react-storefront/HiddenInput').default

      Test = ({ children }) => {
        const [store, updateStore] = useState({
          pageData: {
            name: 'test',
          },
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
        </Test>,
      )

      expect(wrapper.find(HiddenInput).exists()).toBe(true)
    })

    it('should get the value from bind', () => {
      wrapper = mount(
        <Test>
          <HiddenInput bind="name" />
        </Test>,
      )

      expect(wrapper.find('input').prop('value')).toBe('test')
    })
  })

  describe('amp', () => {
    beforeEach(() => {
      mockAmp = true
    })

    it('should provide right binding', () => {
      wrapper = mount(
        <Test>
          <HiddenInput bind="name" />
        </Test>,
      )
      expect(wrapper.find('input').prop('amp-bind')).toBe("value->page.name || ''")
    })
  })
})
