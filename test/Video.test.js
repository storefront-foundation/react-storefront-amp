/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Video from 'react-storefront-amp/Video'
import * as next from 'next/amp'

describe('Video', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render the component', () => {
    wrapper = mount(<Video src="test" />)
    expect(wrapper.exists()).toBe(true)
  })

  it('should use controls=true by default', () => {
    wrapper = mount(<Video src="test" />)
    expect(wrapper.find('video').prop('controls')).toBe(true)
  })

  it('should accept children', () => {
    const Child = () => <h1>Child</h1>

    wrapper = mount(
      <Video src="haha.mp4">
        <Child />
      </Video>,
    )
    expect(wrapper.find(Child).text()).toBe('Child')
  })

  it('should pass spreaded props', () => {
    wrapper = mount(<Video src="haha.mp4" testprops="test" />)
    expect(wrapper.find(Video).prop('testprops')).toBe('test')
  })

  it('should have amp-video tag and layout set to fill', () => {
    const ampSpy = jest.spyOn(next, 'useAmp').mockReturnValue(true)

    wrapper = mount(<Video src="haha.mp4" />)
    expect(wrapper.find('amp-video')).toExist()
    expect(wrapper.find('amp-video').prop('layout')).toBe('fill')
    ampSpy.mockRestore()
  })
})
