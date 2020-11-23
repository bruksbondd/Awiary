import { useEffect, useRef, useState } from 'react'

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const useTraceableState = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);
  const prevValue = usePrevious(value);
  return [prevValue, value, setValue];
};