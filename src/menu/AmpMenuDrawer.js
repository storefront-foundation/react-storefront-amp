import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import AmpMenuBody from './AmpMenuBody'
import { makeStyles } from '@material-ui/core/styles'

export default function AmpMenuDrawer({
  id,
  classes,
  drawerWidth,
  anchor,
  cards,
  rootHeader,
  rootFooter,
}) {
  const styles = theme => ({
    root: {
      position: 'relative',
      maxWidth: '100vw',
      marginTop: theme.headerHeight,
      height: `calc(100vh - ${theme.headerHeight}px)`,
      backgroundColor: theme.palette.background.paper,
      boxShadow: '10px 2px 10px -5px rgba(0, 0, 0, 0.2)',
      paddingBottom: '64px',
      width: drawerWidth,
      '& [expanded] > h3': {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        '& svg': {
          fill: theme.palette.secondary.contrastText,
        },
      },
      '& a': {
        color: theme.typography.body1.color,
      },
      '& ~ div[class*="amphtml-sidebar-mask"]': {
        background: 'rgba(0, 0, 0, 0.5)',
        opacity: 1,
      },
    },
  })

  classes = makeStyles(styles, { name: 'RSFAmpMenuDrawer' })({ classes })

  return (
    <>
      <Head>
        <script
          async
          custom-element="amp-sidebar"
          src="https://cdn.ampproject.org/v0/amp-sidebar-0.1.js"
        />
        <script
          async
          custom-element="amp-bind"
          src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"
        />
      </Head>
      <amp-sidebar
        id={id}
        key="sidebar"
        class={classes.root}
        layout="nodisplay"
        side={anchor}
        on="sidebarClose:AMP.setState({ rsfMenuState: { open: false } })"
      >
        <AmpMenuBody
          cards={cards}
          rootHeader={rootHeader}
          rootFooter={rootFooter}
          drawerWidth={drawerWidth}
        />
      </amp-sidebar>
    </>
  )
}

AmpMenuDrawer.propTypes = {
  id: PropTypes.string.isRequired,
  anchor: PropTypes.string,
}

AmpMenuDrawer.defaultProps = {
  id: 'rsfMenu',
  anchor: 'left',
}
