import React, { useState } from 'react'
import { mount } from 'enzyme'
import ProductOptionSelector from 'react-storefront-amp/option/AmpProductOptionSelector'
import DataBindingProvider from 'react-storefront-amp/bind/DataBindingProvider'
import ProductOption from 'react-storefront/option/ProductOption'
import PWAContext from 'react-storefront/PWAContext'

describe('ProductOptionSelector', () => {
  let colors
  let sizes
  let wrapper

  beforeEach(() => {
    colors = [
      {
        text: 'Color1',
        id: 'color1',
        image: {
          src: 'src1',
          alt: 'alt1',
        },
      },
    ]
    sizes = [{ id: 'sm', text: 'sm' }]
  })

  afterEach(() => {
    try {
      wrapper.unmount()
    } catch (e) {}
  })

  it('should get the value from bind', () => {
    const Test = () => {
      const [store, updateStore] = useState({ pageData: { colors: colors } })

      return (
        <PWAContext.Provider value={{ hydrating: false }}>
          <DataBindingProvider store={store} updateStore={updateStore}>
            <ProductOptionSelector bind={{ value: 'color', options: 'colors' }} />
          </DataBindingProvider>
        </PWAContext.Provider>
      )
    }

    wrapper = mount(<Test />)

    expect(
      wrapper
        .find(ProductOptionSelector)
        .childAt(0)
        .props().options,
    ).toBe(colors)
  })

  it('should get the right variant depending on options', () => {
    const Test = () => {
      const [store, updateStore] = useState({ pageData: { colors: colors, sizes: sizes } })

      return (
        <PWAContext.Provider value={{ hydrating: false }}>
          <DataBindingProvider store={store} updateStore={updateStore}>
            <ProductOptionSelector bind={{ value: 'color', options: 'colors' }} />
            <ProductOptionSelector bind={{ value: 'size', options: 'sizes' }} />
          </DataBindingProvider>
        </PWAContext.Provider>
      )
    }

    wrapper = mount(<Test />)

    expect(
      wrapper
        .find(ProductOption)
        .first()
        .props().variant,
    ).toBe('swatch')
    expect(
      wrapper
        .find(ProductOption)
        .last()
        .props().variant,
    ).toBe('text')
  })

  it('should set the value on click', () => {
    let size

    const Test = () => {
      const [store, updateStore] = useState({ pageData: { sizes: sizes } })
      size = store.pageData.size

      return (
        <PWAContext.Provider value={{ hydrating: false }}>
          <DataBindingProvider store={store} updateStore={updateStore}>
            <ProductOptionSelector bind={{ value: 'size', options: 'sizes' }} />
          </DataBindingProvider>
        </PWAContext.Provider>
      )
    }

    wrapper = mount(<Test />)
    wrapper.find('button').simulate('click')

    expect(size).toBe(sizes[0])
  })

  it('should return null when options are undefined', () => {
    const Test = () => {
      const [store, updateStore] = useState({ pageData: { colors: colors } })

      return (
        <PWAContext.Provider value={{ hydrating: false }}>
          <DataBindingProvider store={store} updateStore={updateStore}>
            <ProductOptionSelector />
          </DataBindingProvider>
        </PWAContext.Provider>
      )
    }

    wrapper = mount(<Test />)

    expect(wrapper.find(ProductOptionSelector).isEmptyRender()).toBe(true)
  })

  it('should render a skeleton with swatches', () => {
    const Test = () => {
      const [store, updateStore] = useState({ pageData: { colors: colors } })

      return (
        <PWAContext.Provider value={{ hydrating: false }}>
          <DataBindingProvider store={store} updateStore={updateStore}>
            <ProductOptionSelector variant="swatch" skeleton={4} />
          </DataBindingProvider>
        </PWAContext.Provider>
      )
    }

    wrapper = mount(<Test />)

    expect(wrapper.find(ProductOptionSelector).isEmptyRender()).toBe(false)
  })

  it('should render a skeleton with text buttons', () => {
    const Test = () => {
      const [store, updateStore] = useState({ pageData: { colors: colors } })

      return (
        <PWAContext.Provider value={{ hydrating: false }}>
          <DataBindingProvider store={store} updateStore={updateStore}>
            <ProductOptionSelector variant="text" skeleton={4} />
          </DataBindingProvider>
        </PWAContext.Provider>
      )
    }

    wrapper = mount(<Test />)

    expect(wrapper.find(ProductOptionSelector).isEmptyRender()).toBe(false)
  })
})
