import React, { useContext } from 'react'
import DataBindingContext from './DataBindingContext'
import { useAmp } from 'next/amp'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import isUndefined from 'lodash/isUndefined'
import upperFirst from 'lodash/upperFirst'

// Converts an expression with dot notation to a nested object
// Example:
//    foo.bar = value -> { foo: { bar: value } }

function ampValueFromExpression(expression, value) {
  if (expression == null) return null

  let node = {}
  const state = node
  const keys = expression.split('.')

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    node[key] = i === keys.length - 1 ? '___' : {}
    node = node[key]
  }

  return JSON.stringify(state)
    .replace(/"/g, '')
    .replace(/___/, value)
}

/**
 * A higher-order function that adds 2-way databinding to a component.
 *
 * This provides the foundation for making components that can read and write state
 * in both React and AMP using a single API.
 *
 * For example, given a SizeField component that allows the user to choose a product size, but doesn't work in AMP:
 *
 * ```js
 * <SizeField value={product.size} onChange={size => updateStore({ product: { size: value })}/>
 * ```
 *
 * Wrapping it in `withDataBinding(SizeField)` would give you the ability to do this instead, which would work in AMP and React:
 *
 * ```js
 * <SizeField bind="product.size"/>
 * ```
 *
 * To generate more complex Amp event handlers, the "on" attribute can be generated for a component
 * that uses withDataBinding by creating handlers for each event:
 *
 * ```
 * <div
 *   {...amp.on(
 *     amp.createHandler('tap',
 *       amp.setState({ prop: 'index', value: 'event.index' }),
 *       `myCarousel.goToSlide(index=event.index)`
 *     ),
 *     amp.createHandler('slideChange',
 *       amp.setState({ prop: 'index', value: 'event.index' }),
 *       `myOtherCarousel.goToSlide(index=event.index)`
 *     )
 *   )}
 * />
 * ```
 *
 * @param {Function} Component
 * @return {Function}
 */
export default function withDataBinding(Component) {
  const Wrapped = ({ bind, name, ...props }) => {
    const normalizedBind = normalizeBind(bind)
    const { ampState, getValue, setValue } = useContext(DataBindingContext) || {}
    const boundProps = getBoundProps(normalizedBind, getValue, setValue)
    const createAmpValueExpression = getAmpValue(ampState, normalizedBind)
    const amp = useAmp()

    if (!name && typeof bind === 'string') {
      name = bind
    }

    return (
      <Component
        {...props}
        {...boundProps}
        name={name}
        bind={normalizedBind}
        amp={{
          state: ampState,
          getValue: createAmpValueExpression,
          bind: getAmpBind(amp, bind, createAmpValueExpression),
          on: createAmpHandlerAttribute(amp, normalizedBind, ampState),
          setState: createAmpStateChangeDescriptor,
          createHandler: createAmpHandlerDescriptor(normalizedBind, ampState)
        }}
      />
    )
  }

  Wrapped.propTypes = Component.propTypes
  return Wrapped
}

/**
 * Creates a function that creates an amp-bind expression for a given field and prop.
 * @param {Boolean} amp True when amp is enabled
 * @param {Object} bind The bind prop
 * @param {Function} createAmpValueExpression A function that generates AMP values expressions for the current state.
 * @return {Object} A props object to spread
 */
function getAmpBind(amp, bind, createAmpValueExpression) {
  if (!amp || !bind) return () => ({})
  return ({ attribute, prop, value }) => ({
    'amp-bind': `${attribute}->${value !== undefined ? value : createAmpValueExpression(prop)}`
  })
}

/**
 * Creates the "on" attribute for a component to react to an AMP event. Uses the descriptors created
 * by amp.createHandler() to generate the attribute by appending the expression strings for each
 * event into an expression usable by Amp.
 * @param {Boolean} amp True when amp is enabled
 * @param {Object} bind The normalized bind expression
 * @param {String} ampState The amp state id
 * @return {Function}
 */
function createAmpHandlerAttribute(amp, bind, ampState) {
  if (!amp || Object.keys(bind).length === 0) return () => ({})

  return (...eventHandlerDescriptors) => {
    const eventStrings = eventHandlerDescriptors
      .filter(Boolean)
      .map(eventHandler => `${eventHandler.event}:${eventHandler.actions.join(',')}`)

    return eventStrings.length
      ? {
          on: eventStrings.join(';')
        }
      : {}
  }
}

/**
 *
 * Creates a descriptor to be used by amp.on() to set the "on" attribute for a component to react to
 * an AMP event
 * @param {Object} normalizedBind The normalized bind object
 * @param {String} ampState The amp state id
 * @return {function(*, ...[*]): {event: *, actions: Array}} Returns a function that expects an event
 * and a list of action descriptors; function will be used by amp.on() to create the "on" attribute
 */
function createAmpHandlerDescriptor(normalizedBind, ampState) {
  return (event, ...actions) => {
    const actionStrings = []
    const stateChanges = []
    actions.forEach(action => {
      if (isString(action)) {
        actionStrings.push(action)
      } else if (action.stateChanges) {
        stateChanges.push(...action.stateChanges)
      }
    })
    if (stateChanges.length) {
      const stateChangeExpr = createAmpStateChangeExpression(stateChanges, normalizedBind)
      if (stateChangeExpr.length) {
        stateChangeExpr.forEach(value => {
          if (value) {
            actionStrings.push(`AMP.setState({${ampState}:${value}})`)
          }
        })
      }
    }
    if (actionStrings.length) {
      return {
        event,
        actions: actionStrings
      }
    }
    return null
  }
}

/**
 * Creates a string to use for the state change needed based on the value/prop pairs
 * @param {Object[]} stateChanges Array of prop+values that should be changed in the state
 * @param {Object} bind The normalized bind object
 * @return {string}
 */
function createAmpStateChangeExpression(stateChanges, bind) {
  return stateChanges.map(({ value, prop = 'value' }) => {
    const expressions = bind[prop]
    if (!expressions) {
      console.warn(
        `could not create AMP event handler for prop ${prop}. No prop with that name was found.`
      )
      return
    }
    return ampValueFromExpression(expressions[0], value)
  })
}

/**
 * Creates a descriptor used by createAmpHandlerAttribute to update AMP state when an even occurs
 * @param {Object[]} valuePropPairs A list of objects with a "value" prop for a value expression
 * that would set the optional "prop" prop ("prop" defaults to "value")
 * @return {{stateChanges: Array}} An array of descriptors to be used by amp.createHandler
 */
function createAmpStateChangeDescriptor(...valuePropPairs) {
  const stateChanges = []
  valuePropPairs.forEach(pair => {
    if (isUndefined(pair.value)) {
      console.warn(
        'AMP state change must have a "value" prop for each object passed to amp.setState'
      )
    } else {
      stateChanges.push(pair)
    }
  })

  return { stateChanges }
}

/**
 * Converts the following forms of bind:
 *
 * bind="someValue"
 *
 * bind={['preferredValue', 'defaultValue']}
 *
 * bind={{
 *   src: 'thumbnail.src',
 *   alt: 'thumbnail.alt'
 * }}
 *
 * to:
 *
 * bind={{
 *   src: ['thumbnail.src'],
 *   alt: ['thumbnail.alt']
 * }}
 *
 * @param {Object|String[]|String} bind The raw bind prop value
 * @return {Object}
 */
function normalizeBind(bind) {
  if (!bind) return {}

  if (!isObject(bind) || Array.isArray(bind)) {
    bind = { value: bind }
  }

  for (let key in bind) {
    bind[key] = normalizeBindValue(bind[key])
  }

  return bind
}

/**
 * Ensures that the specified value expression is an array
 * @param {String|String[]} value
 * @return {String[]}
 */
function normalizeBindValue(value) {
  if (Array.isArray(value)) {
    return value
  } else {
    return [value]
  }
}

/**
 * Creates value and event handler props for each bound property.  In other words,
 * for `bind="value"`, returns:
 *
 * ```js
 * {
 *   value: (the value)
 *   onChange: (function to update the value)
 * }
 * ```
 *
 * @param {Object} bind
 * @param {Function} getValue
 * @param {Function} setValue
 * @return {Object}
 */
function getBoundProps(bind, getValue, setValue) {
  const props = {}

  for (let prop in bind) {
    const expression = bind[prop]
    props[prop] = getBoundValue(expression, getValue)

    if (expression.length === 1) {
      props[getCallback(prop)] = value => {
        setValue(expression[0], value)
      }
    }
  }

  return props
}

/**
 * Gets the name of the event callback
 * @param {String} prop
 * @return {String}
 */
function getCallback(prop) {
  if (prop === 'value') {
    return 'onChange'
  } else {
    return `on${upperFirst(prop)}Change`
  }
}

/**
 * Gets the current value in the store for a binding
 * @param {String[]} expressions
 * @param {Function} getValue
 */
function getBoundValue(expressions, getValue) {
  for (let expression of expressions) {
    const value = getValue(expression)

    if (value != null) {
      return value
    }
  }
  return null
}

/**
 * Returns an expression to get a value from the AMP state.
 * @param {String} ampState The amp state id
 * @param {Object} bind The bind expressions
 * @return {String}
 */
function getAmpValue(ampState, bind) {
  return (prop = 'value') => {
    if (!bind[prop]) {
      return null
    } else if (bind[prop].length === 1) {
      return `${ampState}.${bind[prop]}`
    } else {
      return `(${bind[prop].map(v => `${ampState}.${v}`).join('||')})`
    }
  }
}
