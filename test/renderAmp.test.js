import React from 'react'
import { ServerStyleSheets, makeStyles } from '@material-ui/core/styles'
import { removeInvalidCssClasses } from '../src/renderAmp'
import ReactDOMServer from 'react-dom/server'

describe('renderAmp', () => {
  describe('removeInvalidCssClasses', () => {
    const makeSheetsObject = (styles = {}) => {
      const useStyles = makeStyles(
        {
          testClass: {
            padding: 0,
            ...styles
          }
        },
        { name: 'RSFTest' }
      )
      const TestComp = props => {
        let { classes } = props
        classes = useStyles({ classes })
        return (
          <div className={classes.testClass}>
            <div />
          </div>
        )
      }
      const sheets = new ServerStyleSheets()
      ReactDOMServer.renderToString(sheets.collect(<TestComp />))
      return sheets
    }

    it('should ignore CSS classes that are valid for Amp', () => {
      const sheets = removeInvalidCssClasses(makeSheetsObject())
      expect(sheets.sheetsRegistry.registry).toHaveLength(1)
      expect(Object.keys(sheets.sheetsRegistry.registry[0].rules.map)).toHaveLength(2)
      expect(sheets.sheetsRegistry.registry[0].rules.map.testClass).toBeDefined()
      expect(sheets.sheetsRegistry.registry[0].rules.map['.RSFTest-testClass-1']).toBeDefined()
    })

    it('should rename invalid Amp CSS classes that are stand-alone', () => {
      const sheets = removeInvalidCssClasses(
        makeSheetsObject({
          '& .i-amphtml-layout': {
            padding: 0
          }
        })
      )
      removeInvalidCssClasses(sheets)
      expect(sheets.sheetsRegistry.registry).toHaveLength(1)
      expect(Object.keys(sheets.sheetsRegistry.registry[0].rules.map)).toHaveLength(3)
      expect(
        sheets.sheetsRegistry.registry[0].rules.map['.RSFTest-testClass-1 .i-amphtml-layout']
      ).toBeUndefined()
      expect(
        sheets.sheetsRegistry.registry[0].rules.map[
          '.RSFTest-testClass-1 [class*="amphtml-layout"]'
        ]
      ).toBeDefined()
    })

    it('should rename invalid Amp CSS classes that are combined with another selector', () => {
      const sheets = removeInvalidCssClasses(
        makeSheetsObject({
          '& .i-amphtml-layout.test-2': {
            padding: 0
          }
        })
      )
      removeInvalidCssClasses(sheets)
      expect(sheets.sheetsRegistry.registry).toHaveLength(1)
      expect(Object.keys(sheets.sheetsRegistry.registry[0].rules.map)).toHaveLength(3)
      expect(
        sheets.sheetsRegistry.registry[0].rules.map['.RSFTest-testClass-1 .i-amphtml-layout.test-2']
      ).toBeUndefined()
      expect(
        sheets.sheetsRegistry.registry[0].rules.map[
          '.RSFTest-testClass-1 [class*="amphtml-layout"].test-2'
        ]
      ).toBeDefined()
    })

    it('should rename invalid Amp CSS classes that are combined with another invalid selector', () => {
      const sheets = removeInvalidCssClasses(
        makeSheetsObject({
          '& .i-amphtml-layout.i-amphtml-loader': {
            padding: 0
          }
        })
      )
      removeInvalidCssClasses(sheets)
      expect(sheets.sheetsRegistry.registry).toHaveLength(1)
      expect(Object.keys(sheets.sheetsRegistry.registry[0].rules.map)).toHaveLength(3)
      expect(
        sheets.sheetsRegistry.registry[0].rules.map[
          '.RSFTest-testClass-1 .i-amphtml-layout.i-amphtml-loader'
        ]
      ).toBeUndefined()
      expect(
        sheets.sheetsRegistry.registry[0].rules.map[
          '.RSFTest-testClass-1 [class*="amphtml-layout"][class*="amphtml-loader"]'
        ]
      ).toBeDefined()
    })

    it('should rename invalid Amp CSS classes that are are nested', () => {
      const sheets = removeInvalidCssClasses(
        makeSheetsObject({
          '& .i-amphtml-layout .i-amphtml-loader': {
            padding: 0
          }
        })
      )
      removeInvalidCssClasses(sheets)
      expect(sheets.sheetsRegistry.registry).toHaveLength(1)
      expect(Object.keys(sheets.sheetsRegistry.registry[0].rules.map)).toHaveLength(3)
      expect(
        sheets.sheetsRegistry.registry[0].rules.map[
          '.RSFTest-testClass-1 .i-amphtml-layout .i-amphtml-loader'
        ]
      ).toBeUndefined()
      expect(
        sheets.sheetsRegistry.registry[0].rules.map[
          '.RSFTest-testClass-1 [class*="amphtml-layout"] [class*="amphtml-loader"]'
        ]
      ).toBeDefined()
    })
  })
})
