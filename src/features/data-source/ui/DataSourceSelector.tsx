import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'

import { PROVIDERS, FALLBACK_ORDER } from '@/shared/api/providers'
import { setPreferredSource } from '../model/dataSourceSlice'
import { selectActiveSource, selectPreferredSource } from '../model/selectors'
import classes from './DataSourceSelector.module.scss'

export function DataSourceSelector() {
  const dispatch   = useDispatch()
  const preferred  = useSelector(selectPreferredSource)
  const active     = useSelector(selectActiveSource)
  const [open, setOpen] = React.useState(false)

  const isFallback = active !== null && active !== preferred
  const displayName = PROVIDERS[preferred].name

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('[data-source-selector]')) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className={`${classes.wrap} ${open ? classes.open : ''}`} data-source-selector="">
      <button className={classes.trigger} onClick={() => setOpen(v => !v)}>
        <span className={`${classes.dot} ${isFallback ? classes.fallback : ''}`} />
        {displayName}
        <svg className={classes.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={classes.dropdown}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
          >
            {FALLBACK_ORDER.map(id => {
              const p = PROVIDERS[id]
              return (
                <button
                  key={id}
                  className={`${classes.option} ${id === preferred ? classes.active : ''}`}
                  onClick={() => { dispatch(setPreferredSource(id)); setOpen(false) }}
                >
                  <span className={`${classes.optionDot} ${classes[`s_${id}`]}`} />
                  <div className={classes.optionText}>
                    <p className={classes.optionName}>{p.name}</p>
                    <p className={classes.optionDesc}>{p.description}</p>
                  </div>
                  {id === preferred && <span className={classes.activeCheck}>✓</span>}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
