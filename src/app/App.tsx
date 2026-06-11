import React from 'react'

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useSelector } from 'react-redux'

import { useGetMarketAnalysisQuery } from '@/shared/api/marketApi'
import { AppRoute } from '@/shared/config/routes'
import { MarketPage } from '@/pages/market/ui/MarketPage'
import { PortfolioPage } from '@/pages/portfolio/ui/PortfolioPage'
import { GlossaryPage } from '@/pages/glossary/ui/GlossaryPage'
import { BottomNav } from '@/widgets/bottom-nav/ui/BottomNav'
import { DataSourceSelector } from '@/features/data-source/ui/DataSourceSelector'
import { selectPreferredSource } from '@/features/data-source/model/selectors'
import { LayoutSwitcher } from '@/features/layout-switcher/ui/LayoutSwitcher'

import classes from './App.module.scss'

const PAGE_VARIANTS = {
  initial: (dir: number) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit:    (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
}

export function App() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const preferred = useSelector(selectPreferredSource)

  const { data = [], isLoading, isError, error, fulfilledTimeStamp, refetch } =
    useGetMarketAnalysisQuery(preferred, { pollingInterval: 5 * 60 * 1000 })

  const prevPath  = React.useRef(location.pathname)
  const ORDER = [AppRoute.Market, AppRoute.Portfolio, AppRoute.Glossary]
  const direction = ORDER.indexOf(location.pathname as AppRoute) > ORDER.indexOf(prevPath.current as AppRoute) ? 1 : -1
  React.useEffect(() => { prevPath.current = location.pathname }, [location.pathname])

  const isPortfolio = location.pathname === AppRoute.Portfolio
  const isGlossary  = location.pathname === AppRoute.Glossary

  const updatedAt = fulfilledTimeStamp
    ? new Date(fulfilledTimeStamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : null

  const errorMessage = isError
    ? (error as { error?: string })?.error ?? 'Ошибка загрузки данных'
    : null

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div className={classes.logo}>
          <span className={classes.logoMark}>◈</span>
          <span className={classes.logoName}>Crypto Advisor</span>
        </div>

        <div className={classes.headerRight}>
          {updatedAt && (
            <span className={classes.timestamp}>{updatedAt}</span>
          )}

          <DataSourceSelector />
          <LayoutSwitcher />

          <button className={classes.refreshBtn} onClick={refetch} title="Обновить">↺</button>

          <div className={classes.desktopTabs}>
            <button
              className={`${classes.desktopTab} ${!isPortfolio ? classes.active : ''}`}
              onClick={() => navigate(AppRoute.Market)}
            >
              Рынок
            </button>
            <button
              className={`${classes.desktopTab} ${isPortfolio ? classes.active : ''}`}
              onClick={() => navigate(AppRoute.Portfolio)}
            >
              Портфель
            </button>
            <button
              className={`${classes.desktopTab} ${isGlossary ? classes.active : ''}`}
              onClick={() => navigate(AppRoute.Glossary)}
            >
              Словарь
            </button>
          </div>
        </div>
      </header>

      {errorMessage && (
        <p className={classes.error}>⚠ {errorMessage}</p>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={location.pathname}
          custom={direction}
          variants={PAGE_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', stiffness: 340, damping: 36, mass: 0.9 }}
        >
          <Routes location={location}>
            <Route path={AppRoute.Market}    element={<MarketPage    coins={data} loading={isLoading} />} />
            <Route path={AppRoute.Portfolio} element={<PortfolioPage marketData={data} />} />
            <Route path={AppRoute.Glossary}  element={<GlossaryPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}
