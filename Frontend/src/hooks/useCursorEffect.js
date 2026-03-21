import { useEffect, useState, useRef } from 'react'

export function useCursorEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const positionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // ✅ FIX 1: Better touch device detection
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) {
      setIsHidden(true)
      return
    }

    // ✅ FIX 2: Track mouse position with ref for accuracy
    const mouseMove = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      setPosition({ x: e.clientX, y: e.clientY })
      // Show cursor whenever mouse moves — prevents disappearing
      setIsHidden(false)
    }

    const mouseDown = () => setIsClicking(true)
    const mouseUp = () => setIsClicking(false)

    // ✅ FIX 3: Improved hover detection — checks full ancestor chain
    const handleMouseOver = (e) => {
      const target = e.target
      if (!target) return

      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'LABEL' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('[data-cursor-pointer]') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'

      setIsHovering(!!isInteractive)
    }

    // ✅ FIX 4: THE MAIN BUG FIX
    // mouseleave on documentElement fires when mouse goes
    // over iframes, certain SVGs, or child elements in 
    // some browsers — causing cursor to vanish inside dashboard
    //
    // OLD (buggy):
    // document.documentElement.addEventListener('mouseleave', () => setIsHidden(true))
    //
    // NEW: Only hide cursor when mouse truly leaves the WINDOW
    // Use document-level mouseleave with a position check
    const handleMouseLeave = (e) => {
      // Only hide if mouse actually left the browser window
      // Check if coordinates are outside the viewport
      const x = e.clientX
      const y = e.clientY
      const w = window.innerWidth
      const h = window.innerHeight

      const trulyLeft = x <= 0 || y <= 0 || x >= w || y >= h

      if (trulyLeft) {
        setIsHidden(true)
      }
      // If not truly left — do NOT hide cursor
      // This prevents the disappearing bug inside dashboard
    }

    const handleMouseEnter = () => {
      setIsHidden(false)
    }

    // ✅ FIX 5: Use document instead of documentElement
    // documentElement misses events on certain elements
    // in React apps (portals, modals, dropdowns, tables)
    window.addEventListener('mousemove', mouseMove, { passive: true })
    window.addEventListener('mousedown', mouseDown)
    window.addEventListener('mouseup', mouseUp)
    window.addEventListener('mouseover', handleMouseOver, { passive: true })

    // Listen on document for leave/enter — more reliable than documentElement
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mousedown', mouseDown)
      window.removeEventListener('mouseup', mouseUp)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  return { position, isHovering, isClicking, isHidden }
}