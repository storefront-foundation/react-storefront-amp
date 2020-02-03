import React from 'react'
import AmpAppBar from 'react-storefront-amp/AmpAppBar'
import AppBar from 'react-storefront/AppBar'
import { mount } from 'enzyme'
import createTheme from 'react-storefront/theme/createTheme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import PWA from 'react-storefront/PWA'

describe('AmpAppBar', () => {
  it('should render an AppBar', () => {
    const theme = createTheme()
    const wrapper = mount(
      <PWA>
        <MuiThemeProvider theme={theme}>
          <AmpAppBar />
        </MuiThemeProvider>
      </PWA>,
    )
    expect(wrapper.find(AppBar)).toHaveLength(1)
  })
})
