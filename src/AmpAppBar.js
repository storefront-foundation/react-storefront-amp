import React from 'react'
import { useAmp } from 'next/amp'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from 'react-storefront/AppBar'

const useStyles = makeStyles(theme => ({
  withAmp: {
    zIndex: theme.zIndex.amp.modal + 1,
  },
}))

export default function AmpAppBar(props) {
  const classes = useStyles(props)
  return <AppBar classes={{ root: useAmp() ? classes.withAmp : undefined }} {...props} />
}
