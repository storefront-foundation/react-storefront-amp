import { mount } from 'enzyme'
import React, { useState, useContext, useEffect } from 'react'
import DataBindingContext from 'react-storefront-amp/bind/DataBindingContext'

let DataBindingProvider
let amp

describe('DataBindingProvider', () => {
  let state, Test

  beforeAll(() => {
    jest.doMock('next/amp', () => ({
      useAmp: () => amp,
    }))
    DataBindingProvider = require('react-storefront-amp/bind/DataBindingProvider').default
  })

  beforeEach(() => {
    state = { pageData: { id: '1', name: 'Product 1' } }
    Test = ({ children }) => {
      const [store, updateStore] = useState(state)

      return (
        <DataBindingProvider id="testState" store={store} updateStore={updateStore} root="pageData">
          {children}
        </DataBindingProvider>
      )
    }
  })

  describe('amp', () => {
    beforeAll(() => {
      amp = true
    })

    describe('serialization', () => {
      it('should serialize the store as json', () => {
        const wrapper = mount(<Test />)

        expect(
          wrapper
            .find('amp-state script')
            .first()
            .html(),
        ).toBe(`<script type="application/json">${JSON.stringify(state.pageData)}</script>`)
      })
    })
  })

  describe('!amp', () => {
    beforeEach(() => {
      amp = false
      state = { pageData: { id: '1', name: 'Product 1' } }
      Test = ({ children }) => {
        const [store, updateStore] = useState(state)

        return (
          <DataBindingProvider
            id="testState"
            store={store}
            updateStore={updateStore}
            root="pageData"
          >
            {children}
          </DataBindingProvider>
        )
      }
    })

    it('should not render amp-state', () => {
      const wrapper = mount(<Test />)
      expect(wrapper.find('amp-state')).toHaveLength(0)
    })
  })

  describe('getValue', () => {
    it("should return a value from the store's root", () => {
      let value

      function Child({ name }) {
        const { getValue } = useContext(DataBindingContext)
        value = getValue(name)
        return <span id="value">{value}</span>
      }

      mount(
        <Test>
          <Child name="name" />
        </Test>,
      )

      expect(value).toBe('Product 1')
    })

    it('should return from the store when root is not provided', () => {
      let value

      function Child({ name }) {
        const { getValue } = useContext(DataBindingContext)
        value = getValue(name)
        return <span id="value">{value}</span>
      }

      Test = ({ children }) => {
        const [store, updateStore] = useState(state)

        return (
          <DataBindingProvider id="testState" store={store} updateStore={updateStore} root={null}>
            {children}
          </DataBindingProvider>
        )
      }

      mount(
        <Test>
          <Child name="pageData.name" />
        </Test>,
      )

      expect(value).toBe('Product 1')
    })
  })

  describe('setValue', () => {
    it("should set a value in the store's root", () => {
      let value

      function Child() {
        const { getValue, setValue } = useContext(DataBindingContext)

        useEffect(() => {
          setValue('name', 'Test')
        }, [])

        return <span>{getValue('name')}</span>
      }

      const wrapper = mount(
        <Test>
          <Child />
        </Test>,
      )

      expect(wrapper.find('span').html()).toBe('<span>Test</span>')
    })
  })

  describe('ampState', () => {
    it('should be id', () => {
      let ampState

      function Child() {
        ampState = useContext(DataBindingContext).ampState
        return null
      }

      mount(
        <Test>
          <Child />
        </Test>,
      )

      expect(ampState).toBe('testState')
    })
  })
})
