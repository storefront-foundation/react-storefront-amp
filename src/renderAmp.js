import React from 'react'
import cheerio from 'cheerio'
import { renderAmpAnalyticsTags } from 'react-storefront-analytics'
import batchPromises from './utils/batchPromises'
import getImageSize from './utils/getImageSize'
import { absoluteURL } from './utils/url'
import URL from 'url'

const INVALID_CSS_CLASS_REGEX = /\.i-(amphtml[^\s.]*)/g

export const removeInvalidCssClasses = sheets => {
  sheets.sheetsRegistry.registry.forEach(reg => {
    const invalidKeys = Object.keys(reg.rules.map).filter(key => key.includes('.i-amphtml'))
    invalidKeys.forEach(key => {
      const replacementKey = key.replace(INVALID_CSS_CLASS_REGEX, '[class*="$1"]')
      reg.rules.map[replacementKey] = reg.rules.map[key]
      const styleIndex = reg.rules.index.find(idx => idx.key === key)
      styleIndex.key = styleIndex.selectorText = styleIndex.options.selector = replacementKey
      delete reg.rules.map[key]
    })
  })
  return sheets
}

export default async function renderAmp(document, sheets, currentUrl, { imageService } = {}) {
  // $('img').attr({ height: '64', width: '64' })
  // document.html = $('body').html()

  const $ = cheerio.load(document.html)

  const imagesThatNeedSizes = []

  // Add ⚡ to html
  $('html').attr('⚡', '')

  if (process.env.NODE_ENV === 'development') {
    $('html').attr('data-ampdevmode', '')
  }

  // remove default css rendering
  $('#ssr-css').remove()

  $('*[amp-bind]').each((i, el) => {
    const $el = $(el)
    const expressions = $el.attr('amp-bind').split(/,\s*/)

    for (let expression of expressions) {
      const [name, value] = expression.split('->')
      $el.attr(`[${name}]`, value)
    }

    $el.removeAttr('amp-bind')
  })

  $('amp-img').each((i, img) => {
    const $img = $(img)
    $img.attr('class', $img.attr('class') + ' ' + $img.attr('classname'))
    $img.removeAttr('classname')
  })

  // replace attr="true" with attr
  $('*').each((i, el) => {
    const $el = $(el)
    for (let name in el.attribs) {
      const value = el.attribs[name]
      if (value === 'true') {
        $el.attr(name, '')
      }
    }
  })

  // Add tabindex and role to all elements with `on` that are not `button` or `a`
  $('[on]').each((i, el) => {
    const $el = $(el)

    if (!['button', 'a'].includes($el.prop('tagName'))) {
      if ($el.attr('tabindex') == null) {
        $el.attr('tabindex', '0')
      }

      if ($el.attr('role') == null) {
        $el.attr('role', 'button')
      }
    }
  })

  $('*[classname]').each((i, el) => {
    const $el = $(el)
    $el.attr('class', $el.attr('classname'))
    $el.removeAttr('classname')
  })

  // remove invalid attributes on all svg elements
  $('svg[focusable]').removeAttr('focusable')
  $('svg[xlink]').removeAttr('xlink')
  $('svg[alt]').removeAttr('alt')

  // material-ui puts this on tab underlines
  $('div[direction]').removeAttr('direction')

  let styleId = 0
  const inlineStyles = new Map()
  const styles = []

  // move all inline styles to classes in the main style tag
  $('*[style]').each((i, el) => {
    const $el = $(el)
    const style = $el.attr('style')
    let className = inlineStyles.get(style)

    if (!className) {
      className = `mi${styleId++}`
      inlineStyles.set(style, className)
      styles.push(`.${className} {${style}}`)
    }
    $el.removeAttr('style')
    $el.addClass(className)
  })

  // replace all img tags with amp-img
  $('img').each((_, img) => {
    const $img = $(img)
    const $ampImg = $('<amp-img layout="intrinsic"></amp-img>')
    if ($img.attr('src')) $ampImg.attr('src', $img.attr('src'))
    if ($img.attr('alt')) $ampImg.attr('alt', $img.attr('alt'))
    if ($img.attr('height')) $ampImg.attr('height', $img.attr('height'))
    if ($img.attr('width')) $ampImg.attr('width', $img.attr('width'))
    if ($img.attr('data-height')) $ampImg.attr('height', $img.attr('data-height'))
    if ($img.attr('data-width')) $ampImg.attr('width', $img.attr('data-width'))
    for (let name in img.attribs) {
      if (name.startsWith('data-amp-')) {
        $ampImg.attr(name.replace(/^data-amp-/, ''), img.attribs[name])
      }
    }
    $img.replaceWith($ampImg)
  })

  // All img tags need a height and width in AMP.  If those are missing, call moovweb's image size service
  // to get the height and width and assign it to the image.
  $('amp-img').each((_, img) => {
    const $img = $(img)

    if ($img.attr('layout') == 'fill') {
      return
    } else if (!$img.attr('height') || !$img.attr('width')) {
      imagesThatNeedSizes.push($img)
    }
  })

  // Fetch sizes for images that are missing a height and width in batches of 10 concurrently.
  await batchPromises(10, imagesThatNeedSizes, async $img => {
    const src = $img.attr('src')
    try {
      const url = src.startsWith('data:') ? src : absoluteURL(src, URL.parse(currentUrl))
      const { height, width } = await getImageSize(url, imageService)
      $img.attr('height', height)
      $img.attr('width', width)
    } catch (e) {
      console.log(`warning: could not get height and width for ${src}`, e)
    }
  })

  $('body')
    .addClass('moov-amp')
    .prepend(renderAmpAnalyticsTags())

  document.html = $.html()

  // replaces any CSS selectors starting with '.i-amphtml-(etc)' with 'class*=["amphtml-(etc)"]'
  const validSheets = removeInvalidCssClasses(sheets)

  document.head.push(
    <meta
      key={'amp-google-client-id-api'}
      name="amp-google-client-id-api"
      content="googleanalytics"
    />,
    <script
      key={'amp-analytics'}
      async
      custom-element="amp-analytics"
      src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
    />,
    <style
      amp-custom={validSheets
        .toString()
        .replace(/\!important/g, '')
        .concat(styles.join(''))}
      key={'amp-custom'}
    />,
  )

  return document
}
