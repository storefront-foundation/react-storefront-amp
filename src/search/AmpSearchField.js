import React, { useContext } from 'react'
import SearchField from 'react-storefront/search/SearchField'
import DataBindingContext from '../bind/DataBindingContext'
import AmpSearchSubmitButton from './AmpSearchSubmitButton'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useAmp } from 'next/amp'

export const styles = theme => ({
  hidden: {
    display: 'block',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearchField' })

export default function AmpSearchField(props) {
  const amp = useAmp()
  const { ampState } = useContext(DataBindingContext)
  const classes = useStyles(props)

  return (
    <div>
      <SearchField
        {...props}
        classes={amp ? classes : undefined}
        SubmitButtonComponent={AmpSearchSubmitButton}
        inputProps={
          amp
            ? {
                'amp-bind': `value->${ampState}.text || ''`,
                on: `input-debounced:AMP.setState({ ${ampState}: { text: ${ampState}.___moov_submitting ? ${ampState}.text : event.value } })`,
              }
            : undefined
        }
        clearButtonProps={
          amp
            ? {
                on: `tap:AMP.setState({ ${ampState}: { text: '' }})`,
                'amp-bind': `hidden->${ampState}.text.length == 0`,
              }
            : undefined
        }
        submitButtonProps={
          amp
            ? {
                'amp-bind': `hidden->${ampState}.text.length == 0`,
              }
            : undefined
        }
      />
    </div>
  )
}

AmpSearchField.propTypes = SearchField.propTypes

AmpSearchField.defaultProps = SearchField.defaultProps
