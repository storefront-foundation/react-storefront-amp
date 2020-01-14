import React, { useRef, useCallback } from 'react'
import AmpContext from './AmpContext'

export default function AmpProvider({ children }) {
  const idRef = useRef(0)

  const nextId = useCallback(() => {
    idRef.current = idRef.current + 1

    return `rsf${idRef.current}`
  }, [])

  return <AmpContext.Provider value={{ nextId }}>{children}</AmpContext.Provider>
}
