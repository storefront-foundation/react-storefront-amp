import React from 'react'
import TabPanel from 'react-storefront/TabPanel'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useAmp } from 'next/amp'
import clsx from 'clsx'
import Head from 'next/head'
import AmpState from './AmpState'

export const styles = theme => ({
  ampSelector: {
    '& [option][selected]': {
      outline: 'none',
      cursor: 'inherit',
    },
  },
  ampPanel: {
    display: 'none',
    '&[selected]': {
      display: 'block',
    },
  },
  ampTab: {
    padding: 0,
    opacity: 1,
    '& .label': {
      width: '100%',
      borderBottom: `2px solid transparent`,
      opacity: 0.7,
      padding: '13px 12px 11px 12px',
    },
    '& .selected': {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
      opacity: 1,
    },
  },
  ampTabLabelContainer: {
    padding: 0,
  },
  ampTabIndicator: {
    display: 'none',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFAmpTabPanel' })

export default function AmpTabPanel({ classes, ...props }) {
  classes = useStyles({ classes })
  const amp = useAmp()

  return (
    <>
      {amp && (
        <Head>
          <script
            async
            custom-element="amp-selector"
            src="https://cdn.ampproject.org/v0/amp-selector-0.1.js"
          />
        </Head>
      )}
      <AmpState initialState={props.selected}>
        {ampStateId => (
          <TabPanel
            {...props}
            tabsProps={{
              classes: {
                indicator: clsx({ [classes.ampTabIndicator]: amp }),
              },
            }}
            tabProps={({ child, index, selected }) => ({
              on: `tap:AMP.setState({ ${ampStateId}: ${index} })`,
              classes: {
                root: clsx({ [classes.ampTab]: amp }),
                labelContainer: clsx({ [classes.ampTabLabelContainer]: amp }),
              },
              label: (
                <div
                  className={clsx('label', { selected: selected === index })}
                  amp-bind={`class->${ampStateId} == ${index} || (${index} == 0 && !${ampStateId}) ? 'label selected' : 'label'`}
                >
                  {child.props.label}
                </div>
              ),
            })}
            panelProps={({ index }) => {
              return {
                option: index,
                selected: props.selected === index,
                className: clsx({
                  [classes.ampPanel]: amp,
                }),
              }
            }}
            renderPanels={panels => {
              return amp ? (
                <amp-selector
                  role="tablist"
                  amp-bind={`selected->${ampStateId}`}
                  class={classes.ampSelector}
                >
                  {panels}
                </amp-selector>
              ) : (
                panels
              )
            }}
          />
        )}
      </AmpState>
    </>
  )
}

AmpTabPanel.propTypes = {}

AmpTabPanel.defaultProps = {
  selected: 0,
}
