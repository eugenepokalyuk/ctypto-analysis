import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'

import { toggleFavorite } from '../model/favoritesSlice'
import { selectIsFavorite } from '../model/selectors'
import classes from './FavoriteButton.module.scss'

interface Props {
  coinId: string
}

export function FavoriteButton({ coinId }: Props) {
  const dispatch = useDispatch()
  const isFav = useSelector(selectIsFavorite(coinId))

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation() // не открывать детали при клике на звезду
    dispatch(toggleFavorite(coinId))
  }

  return (
    <button
      className={`${classes.btn} ${isFav ? classes.active : ''}`}
      onClick={handleClick}
      aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      <motion.svg
        className={classes.icon}
        viewBox="0 0 24 24"
        fill={isFav ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        animate={{ scale: isFav ? [1, 1.4, 1] : 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </motion.svg>
    </button>
  )
}
