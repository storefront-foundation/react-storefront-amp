import React, { useState, useEffect, useRef } from 'react'
import { mount } from 'enzyme'

describe('withDataBinding', () => {
  let Test, state, withDataBinding, mockAmp, DataBindingProvider

  beforeEach(() => {
    jest.isolateModules(() => {
      mockAmp = false

      jest.mock('next/amp', () => ({
        useAmp: () => mockAmp,
      }))

      withDataBinding = require('react-storefront-amp/bind/withDataBinding').default
      DataBindingProvider = require('react-storefront-amp/bind/DataBindingProvider').default

      Test = ({ children }) => {
        state = useRef(null)

        const [store, updateStore] = useState({
          pageData: {
            quantity: 1,
            product: { image: { src: '/image.jpg', alt: 'image' } },
            null: null,
            notNull: 'foo',
          },
        })

        useEffect(() => {
          state.current = store
        }, [store])

        return (
          <DataBindingProvider store={store} updateStore={updateStore}>
            {children}
          </DataBindingProvider>
        )
      }
    })
  })

  describe('reads', () => {
    it('should set the value prop when bind is a string', () => {
      let assigned

      const Component = withDataBinding(({ value }) => {
        assigned = value
        return null
      })

      mount(
        <Test>
          <Component bind="quantity" />
        </Test>,
      )

      expect(assigned).toBe(1)
    })

    it('should set the first non-null value when bind is an array', () => {
      let assigned

      const Component = withDataBinding(({ value }) => {
        assigned = value
        return null
      })

      mount(
        <Test>
          <Component bind={['null', 'notNull']} />
        </Test>,
      ).unmount()

      expect(assigned).toBe('foo')

      assigned = null

      mount(
        <Test>
          <Component bind={['notNull', 'null']} />
        </Test>,
      )

      expect(assigned).toBe('foo')
    })

    it('should return null when no value is found', () => {
      let assigned

      const Component = withDataBinding(({ value }) => {
        assigned = value
        return null
      })

      mount(
        <Test>
          <Component bind={['null', 'foo']} />
        </Test>,
      ).unmount()

      expect(assigned).toBe(null)
    })

    it('should set multiple props when bind is an object', () => {
      let assignedSrc, assignedAlt

      const Component = withDataBinding(({ src, alt }) => {
        assignedSrc = src
        assignedAlt = alt
        return null
      })

      mount(
        <Test>
          <Component bind={{ src: 'product.image.src', alt: 'product.image.alt' }} />
        </Test>,
      )

      expect(assignedSrc).toBe('/image.jpg')
      expect(assignedAlt).toBe('image')
    })
  })

  describe('writes', () => {
    it('should set value when bind is a string', () => {
      const Component = withDataBinding(({ value, onChange }) => {
        useEffect(() => {
          onChange(value + 1)
        }, [])
        return null
      })

      mount(
        <Test>
          <Component bind="quantity" />
        </Test>,
      )

      expect(state.current.pageData.quantity).toBe(2)
    })

    it('should set multiple props when bind is an object', () => {
      const Component = withDataBinding(({ src, onSrcChange, alt, onAltChange }) => {
        useEffect(() => {
          onSrcChange('new.png')
          onAltChange('new')
        }, [])
        return null
      })

      mount(
        <Test>
          <Component bind={{ src: 'product.image.src', alt: 'product.image.alt' }} />
        </Test>,
      )

      expect(state.current.pageData.product.image.src).toBe('new.png')
      expect(state.current.pageData.product.image.alt).toBe('new')
    })
  })

  describe('not amp', () => {
    it('should not generate an amp-bind property when useAmp() returns false', () => {
      let ampBind

      const Component = withDataBinding(({ amp, value }) => {
        ampBind = amp.bind({ attribute: 'value', prop: 'value' })
        return null
      })

      mount(
        <Test>
          <Component bind="quantity" />
        </Test>,
      )

      expect(ampBind).toEqual({})
    })

    it('should not generate an amp-bind property when bind is not set', () => {
      mockAmp = true
      let ampBind

      const Component = withDataBinding(({ amp, value }) => {
        ampBind = amp.bind({ field: 'value', prop: 'value' })
        return null
      })

      mount(
        <Test>
          <Component />
        </Test>,
      )

      expect(ampBind).toEqual({})
    })
  })

  describe('amp', () => {
    beforeEach(() => {
      mockAmp = true
    })

    it('should generate an amp-bind property when useAmp() returns true', () => {
      let ampBind

      const Component = withDataBinding(({ amp, value }) => {
        ampBind = amp.bind({ attribute: 'value', prop: 'value' })
        return null
      })

      mount(
        <Test>
          <Component bind="quantity" />
        </Test>,
      )

      expect(ampBind).toEqual({ 'amp-bind': 'value->page.quantity' })
    })

    it('should generate a value that returns the first non-null state when bind is an array', () => {
      let ampBind

      const Component = withDataBinding(({ amp, value }) => {
        ampBind = amp.bind({ attribute: 'value', prop: 'value' })
        return null
      })

      mount(
        <Test>
          <Component bind={['null', 'quantity']} />
        </Test>,
      )

      expect(ampBind).toEqual({ 'amp-bind': 'value->(page.null||page.quantity)' })
    })

    it('should accept custom value', () => {
      let ampBind

      const Component = withDataBinding(({ amp, value }) => {
        ampBind = amp.bind({ attribute: 'value', value: 'custom' })
        return null
      })

      mount(
        <Test>
          <Component bind="quantity" />
        </Test>,
      )

      expect(ampBind).toEqual({ 'amp-bind': 'value->custom' })
    })

    it('should return default amp value', () => {
      let ampValue

      const Component = withDataBinding(({ amp, value }) => {
        ampValue = amp.getValue()
        return null
      })

      mount(
        <Test>
          <Component bind="quantity" />
        </Test>,
      )

      expect(ampValue).toEqual('page.quantity')
    })

    it('should return amp value for a specific prop', () => {
      let ampValue

      const Component = withDataBinding(({ amp, value }) => {
        ampValue = amp.getValue('src')
        return null
      })

      mount(
        <Test>
          <Component bind={{ src: 'product.image.src', alt: 'product.image.alt' }} />
        </Test>,
      )

      expect(ampValue).toEqual('page.product.image.src')
    })

    it('should return null when getting amp value with not found prop', () => {
      let ampValue

      const Component = withDataBinding(({ amp, value }) => {
        ampValue = amp.getValue('notFound')
        return null
      })

      mount(
        <Test>
          <Component bind="quantity" />
        </Test>,
      )

      expect(ampValue).toEqual(null)
    })

    it('should generate an amp change handler', () => {
      let handler

      const Component = withDataBinding(({ amp, value }) => {
        handler = amp.on(
          amp.createHandler('tap', amp.setState({ value: `${amp.getValue()} + 1)` })),
        )

        return null
      })

      mount(
        <Test>
          <Component bind="quantity" />
        </Test>,
      )

      expect(handler).toEqual({
        on: 'tap:AMP.setState({page:{quantity:page.quantity + 1)}})',
      })
    })

    it('should not generate an amp change handler when prop not found', () => {
      let handler

      const Component = withDataBinding(({ amp, value }) => {
        handler = amp.on(
          amp.createHandler(
            'tap',
            amp.setState({
              prop: 'notfound',
              value: `${amp.getValue()} + 1)`,
            }),
          ),
        )

        return null
      })

      mount(
        <Test>
          <Component bind="quantity" />
        </Test>,
      )

      expect(handler).toEqual({})
    })

    it('should not generate an amp change handler when bind not provided', () => {
      let handler

      const Component = withDataBinding(({ amp, value }) => {
        handler = amp.on(
          amp.createHandler('tap', amp.setState({ value: `${amp.getValue()} + 1)` })),
        )

        return null
      })

      mount(
        <Test>
          <Component />
        </Test>,
      )

      expect(handler).toEqual({})
    })

    it('should explode field when setting nested property in AMP state', () => {
      let handler

      const Component = withDataBinding(({ amp, value }) => {
        handler = amp.on(
          amp.createHandler(
            'tap',
            amp.setState({
              prop: 'value',
              value: true,
            }),
          ),
        )

        return null
      })

      mount(
        <Test>
          <Component bind="foo.bar" />
        </Test>,
      )

      expect(handler).toEqual({
        on: 'tap:AMP.setState({page:{foo:{bar:true}}})',
      })
    })

    it('should combine state changes into a single state change', () => {
      let handler

      const Component = withDataBinding(({ amp, value }) => {
        handler = amp.on(
          amp.createHandler(
            'tap',
            amp.setState(
              {
                prop: 'abc',
                value: true,
              },
              {
                prop: 'def',
                value: 1,
              },
            ),
          ),
        )

        return null
      })

      mount(
        <Test>
          <Component bind={{ abc: 'value1', def: 'value2' }} />
        </Test>,
      )

      expect(handler).toEqual({
        on: 'tap:AMP.setState({page:{value1:true,value2:1}})',
      })
    })
  })
})
