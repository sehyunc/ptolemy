/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react"

interface useDetectOutsideClickProps {
  ref: React.RefObject<HTMLInputElement>
  callback: Function
}

function useDetectOutsideClick({ ref, callback }: useDetectOutsideClickProps) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback && callback()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
}

export default useDetectOutsideClick
