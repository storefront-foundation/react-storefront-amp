import React from 'react'
import MenuBranch from 'react-storefront/menu/MenuBranch'
import makeStyles from '@material-ui/core/styles/makeStyles'

export const styles = theme => ({
  root: {
    '& section': {
      borderBottom: 'none',
    },
  },
})

const useStyles = makeStyles(styles, { name: 'RSFAmpMenuBranch' })

/**
 * Overrides MenuBranch, adding a tap handler that updates the AMP state
 * to show the appropriate card.
 */
export default function AmpMenuBranch(props) {
  const { item } = props
  const { root, ...classes } = useStyles(props)

  const onTapState = JSON.stringify({
    rsfMenuState: {
      card: item._rsfMenuCard,
      [`card${item._rsfMenuCard}`]: item._rsfMenuItem,
    },
  })

  return (
    <div className={root}>
      <MenuBranch
        {...props}
        classes={classes}
        itemProps={{ on: `tap:AMP.setState(${onTapState})` }}
      />
    </div>
  )
}

AmpMenuBranch.propTypes = MenuBranch.propTypes

AmpMenuBranch.defaultProps = MenuBranch.defaultProps
