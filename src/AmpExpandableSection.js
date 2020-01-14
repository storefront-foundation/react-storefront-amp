import React from 'react'
import { Typography } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import AmpAccordion from './AmpAccordion'
import { useAmp } from 'next/amp'
import ExpandableSection from 'react-storefront/ExpandableSection'

export const styles = theme => ({
  root: {
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: 'transparent',
  },
  summary: {
    backgroundColor: 'transparent',
    padding: `12px ${theme.spacing(2)}px`,
    borderStyle: 'none',
    outlineWidth: 0,
  },
  toggle: {
    position: 'absolute',
    right: '18px',
    top: '13px',
  },
  expand: {
    display: 'block',
    'section[expanded] &': {
      display: 'none',
    },
  },
  collapse: {
    display: 'none',
    'section[expanded] &': {
      display: 'block',
    },
  },
  details: {
    backgroundColor: 'transparent',
    padding: theme.spacing(0, 0, 2, 0),
  },
  margins: {},

  // These are intentionally left blank - react-storefront provides this on Expandable
  // section, so we must as well to avoid warnings
  summaryExpanded: {},
  expandIconExpanded: {},
})

const useStyles = makeStyles(styles, { name: 'RSFAmpExpandableSection' })

/**
 * An AMP-compatible expandable section based on amp-accordion.
 */
export default function AmpExpandableSection(props) {
  if (!useAmp()) {
    return <ExpandableSection {...props} />
  }

  let {
    classes,
    expanded,
    children = [],
    title,
    ExpandIcon,
    CollapseIcon,
    fromAccordion,
    defaultExpanded,
  } = props

  classes = useStyles({ classes })

  if (ExpandIcon === ExpandMore) {
    CollapseIcon = ExpandLess
  }

  const sectionAttributes = {}

  if (expanded || defaultExpanded) sectionAttributes.expanded = ''

  const section = (
    <section {...sectionAttributes} className={clsx(classes.root, classes.margins)}>
      <Typography variant="subtitle1" component="h3" className={classes.summary}>
        {title}
        <ExpandIcon className={clsx(classes.toggle, classes.expand)} />
        <CollapseIcon className={clsx(classes.toggle, classes.collapse)} />
      </Typography>
      <div className={classes.details}>{children}</div>
    </section>
  )

  if (fromAccordion) {
    return section
  } else {
    return <AmpAccordion>{section}</AmpAccordion>
  }
}

AmpExpandableSection.propTypes = {
  /**
   * The title for the header of the expandable section
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * Set to true to expand the panel
   */
  expanded: PropTypes.bool,

  /**
   * Set to true to expand the panel
   */
  defaultExpanded: PropTypes.bool,

  /**
   * The icon to use for collapsed groups
   */
  ExpandIcon: PropTypes.any,

  /**
   * The icon to use for expanded groups
   */
  CollapseIcon: PropTypes.any,

  /**
   * Identifier if component is a child of Accordion
   */
  fromAccordion: PropTypes.bool,
}

AmpExpandableSection.defaultProps = {
  ExpandIcon: ExpandMore,
  CollapseIcon: ExpandMore,
}
