import React, { useContext } from 'react'
import MenuBody from 'react-storefront/menu/MenuBody'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'
import MenuContext from 'react-storefront/menu/MenuContext'
import { useAmp } from 'next/amp'

/**
 * Overrides MenuBody and provides a way to switch cards based on AMP state.
 */
export default function AmpMenuBody(props) {
  if (!useAmp()) {
    return <MenuBody {...props} />
  }

  const { drawerWidth } = useContext(MenuContext)

  const styles = theme => ({
    ampBody: {
      transform: 'translateX(0px)',
      overflowY: 'auto',
      height: '100%',
      left: 0,
      top: 0,
      position: 'absolute',
      display: 'flex',
      flex: '1 1 0%',
      transition: 'transform ease-out .2s',
      alignItems: 'stretch',
      '&.card0': {
        transform: 'translateX(0)',
      },
      '&.card1': {
        transform: `translateX(${-1 * drawerWidth}px)`,
      },
      '&.card2': {
        transform: `translateX(${-2 * drawerWidth}px)`,
      },
      '&.card3': {
        transform: `translateX(${-3 * drawerWidth}px)`,
      },
    },
  })

  const useStyles = makeStyles(styles, { name: 'RSFAmpMenuBody' })
  const classes = useStyles(props)

  return (
    <MenuBody
      {...props}
      classes={{
        bodyWrap: clsx(classes.ampBody, classes.inFocus),
      }}
      wrapProps={{
        // This conditional handles the positioning of each menu body
        // By default all bodies except for root are hidden to the right
        //
        // If moving forward through the menu, the current body translates in
        // from the right and the previous body is translated to the left.
        //
        // When moving backwards this is reversed. There are some checks for the root
        // body since it always is hidden to the left.
        'amp-bind': `class->'${classes.ampBody}' + ' card' + (rsfMenuState.card || 0)`,
      }}
    />
  )
}

AmpMenuBody.propTypes = MenuBody.propTypes

AmpMenuBody.defaultProps = MenuBody.defaultProps
