import React, { useState } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import ReactVisibilitySensor from 'react-visibility-sensor'
import DataBindingProvider from 'react-storefront-amp/bind/DataBindingProvider'
import PWAContext from 'react-storefront/PWAContext'

describe('Image', () => {
  let wrapper,
    Image,
    src = 'test.com',
    notFoundSrc,
    aspectRatio,
    quality = null,
    contain = false,
    fill = false,
    lazy = false,
    lazyOffset = 100,
    optimize = {},
    spreadprops,
    bind,
    value

  const clearValues = () => {
    wrapper.unmount()
    src = 'test.com'
    notFoundSrc = undefined
    aspectRatio = undefined
    quality = null
    contain = false
    fill = false
    lazy = false
    lazyOffset = 100
    optimize = {}
    spreadprops = undefined
    bind = undefined
  }

  afterEach(() => {
    clearValues()
  })

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.mock('next/amp', () => ({
        useAmp: () => false
      }))

      Image = require('react-storefront-amp/AmpImage').default
    })
  })

  afterAll(() => {
    jest.resetModules()
  })

  const Test = () => {
    const [store, updateStore] = useState({ pageData: { color: { src: 'bind.test' } } })

    return (
      <PWAContext.Provider value={{ hydrating: false }}>
        <DataBindingProvider store={store} updateStore={updateStore}>
          <Image
            src={src}
            notFoundSrc={notFoundSrc}
            aspectRatio={aspectRatio}
            quality={quality}
            contain={contain}
            fill={fill}
            lazy={lazy}
            lazyOffset={lazyOffset}
            optimize={optimize}
            spreadprops={spreadprops}
            bind={bind}
          />
        </DataBindingProvider>
      </PWAContext.Provider>
    )
  }

  it('should return empty render when src not provided', () => {
    src = undefined
    wrapper = mount(<Test />)

    expect(wrapper.find(Image).isEmptyRender()).toBe(true)
  })

  it('should spread props to img', () => {
    spreadprops = { test: 'test' }
    wrapper = mount(<Test />)

    expect(wrapper.find('img').prop('spreadprops')).toBe(spreadprops)
  })

  it('should optimize image when quality prop is provided', () => {
    quality = 100
    wrapper = mount(<Test />)

    expect(wrapper.find('img').prop('src')).toBe(`https://opt.moovweb.net/?quality=100&img=${src}`)
  })

  it('should optimize image when optimize prop is provided', () => {
    optimize = { quality: 50 }
    wrapper = mount(<Test />)

    expect(wrapper.find('img').prop('src')).toBe(`https://opt.moovweb.net/?quality=50&img=${src}`)
  })

  it('should lazy load image when lazy prop is provided', async () => {
    lazy = true
    wrapper = mount(<Test />)

    expect(wrapper.find('img').exists()).toBe(false)

    await act(async () => {
      await wrapper.find(ReactVisibilitySensor).prop('onChange')(true)
      await wrapper.update()
    })

    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('should use fallback img when main image fails and notFoundSrc prop is provided', async () => {
    notFoundSrc = 'notfound.com'
    wrapper = mount(<Test />)

    await act(async () => {
      await wrapper.find('img').prop('onError')()
      await wrapper.update()
    })

    expect(wrapper.find('img').prop('src')).toBe(notFoundSrc)
  })

  it('should use fallback img when main image is loaded, natural width is 0 and notFoundSrc prop is provided', async () => {
    notFoundSrc = 'notfound.com'
    const spy = jest
      .spyOn(HTMLImageElement.prototype, 'complete', 'get')
      .mockImplementation(() => true)

    wrapper = mount(<Test />)

    expect(wrapper.find('img').prop('src')).toBe(notFoundSrc)
    spy.mockRestore()
  })

  it('should have right styles when contain prop is provided', async () => {
    contain = true
    wrapper = mount(<Test />)

    expect(
      wrapper
        .find('img')
        .parent()
        .prop('className')
    ).toContain('contain')
  })

  it('should have right styles when fill prop is provided', async () => {
    fill = true
    wrapper = mount(<Test />)

    expect(
      wrapper
        .find('img')
        .parent()
        .prop('className')
    ).toContain('fill')
  })

  it('should have right styles when aspectRatio prop is provided', async () => {
    aspectRatio = 0.5
    wrapper = mount(<Test />)

    expect(wrapper.find('img').prop('className')).toContain('fit')
    expect(
      wrapper
        .find('div')
        .filterWhere(n => n.prop('style'))
        .first()
        .prop('style').paddingTop
    ).toBe('50%')
  })

  it('should take values from store when bind is provided', async () => {
    bind = { src: 'color.src' }
    wrapper = mount(<Test />)

    expect(wrapper.find('img').prop('src')).toContain('bind.test')
  })
})
