import { useNavigate } from 'react-router-dom'

import { AppRoute } from '@/shared/config/routes'

import classes from './Footer.module.scss'

export function Footer() {
  const navigate = useNavigate()

  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
        <div className={classes.links}>
          <button className={classes.link} onClick={() => navigate(AppRoute.Glossary)}>
            Словарь терминов
          </button>
          <button className={classes.link} onClick={() => navigate(AppRoute.Market)}>
            Рынок
          </button>
          <button className={classes.link} onClick={() => navigate(AppRoute.Portfolio)}>
            Портфель
          </button>
        </div>

        <div className={classes.contact}>
          <span className={classes.author}>Evgenii Pokalyuk</span>
          <a className={classes.email} href="mailto:eugene.pokalyuk@gmail.com">
            eugene.pokalyuk@gmail.com
          </a>
        </div>
      </div>
    </footer>
  )
}
