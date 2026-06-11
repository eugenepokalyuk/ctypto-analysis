import { useDispatch, useSelector } from 'react-redux'

import { setLayout } from '../model/layoutSlice'
import { selectLayout } from '../model/selectors'
import type { LayoutType } from '../model/layoutSlice'
import classes from './LayoutSwitcher.module.scss'

const LAYOUTS: { id: LayoutType; label: string; icon: string }[] = [
  {
    id:    'grid',
    label: 'Сетка',
    icon:  'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  },
  {
    id:    'list',
    label: 'Список',
    icon:  'M4 6h16M4 10h16M4 14h16M4 18h16',
  },
  {
    id:    'table',
    label: 'Таблица',
    icon:  'M3 10h18M3 14h18M10 6v12M3 6h18v12H3z',
  },
]

export function LayoutSwitcher() {
  const dispatch = useDispatch()
  const layout   = useSelector(selectLayout)

  return (
    <div className={classes.wrap}>
      {LAYOUTS.map(l => (
        <button
          key={l.id}
          title={l.label}
          className={`${classes.btn} ${layout === l.id ? classes.active : ''}`}
          onClick={() => dispatch(setLayout(l.id))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d={l.icon} />
          </svg>
        </button>
      ))}
    </div>
  )
}
