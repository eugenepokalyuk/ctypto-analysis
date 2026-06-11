import { motion } from 'framer-motion'

import classes from './BottomNav.module.scss'

type Tab = 'market' | 'portfolio'

interface TabDef {
  id: Tab
  label: string
  path: string
}

const TABS: TabDef[] = [
  {
    id: 'market',
    label: 'Рынок',
    path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    id: 'portfolio',
    label: 'Портфель',
    path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
]

interface Props {
  tab: Tab
  onChange: (t: Tab) => void
}

export function BottomNav({ tab, onChange }: Props) {
  return (
    <nav className={classes.nav}>
      {TABS.map(t => (
        <button
          key={t.id}
          className={`${classes.tab} ${tab === t.id ? classes.active : ''}`}
          onClick={() => onChange(t.id)}
        >
          {tab === t.id && (
            <motion.div
              layoutId="nav-pill"
              className={classes.pill}
              transition={{ type: 'spring', stiffness: 420, damping: 38 }}
            />
          )}
          <svg className={classes.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={t.path} />
          </svg>
          <span className={classes.label}>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
