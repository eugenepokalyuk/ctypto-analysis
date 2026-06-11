import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'

import { useGetMarketAnalysisQuery } from '@/shared/api/marketApi'
import { MarketPage } from '@/pages/market/ui/MarketPage'
import { PortfolioPage } from '@/pages/portfolio/ui/PortfolioPage'
import { BottomNav } from '@/widgets/bottom-nav/ui/BottomNav'
import { DataSourceSelector } from '@/features/data-source/ui/DataSourceSelector'
import { selectPreferredSource } from '@/features/data-source/model/selectors'
import { LayoutSwitcher } from '@/features/layout-switcher/ui/LayoutSwitcher'

import classes from './App.module.scss'

type Tab = 'market' | 'portfolio'

const PAGE_VARIANTS = {
  initial: (dir: number) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit:    (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
}

export function App() {
  const dispatch   = useDispatch()
  const preferred  = useSelector(selectPreferredSource)

  const { data = [], isLoading, isError, error, fulfilledTimeStamp, refetch } =
    useGetMarketAnalysisQuery(preferred, { pollingInterval: 5 * 60 * 1000 })

  const [tab, setTab] = React.useState<Tab>('market')
  const prevTab       = React.useRef<Tab>('market')

  const direction = tab === 'portfolio' && prevTab.current === 'market' ? 1 : -1

  function handleTabChange(next: Tab) {
    prevTab.current = tab
    setTab(next)
  }

  const updatedAt = fulfilledTimeStamp
    ? new Date(fulfilledTimeStamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : null

  const errorMessage = isError
    ? (error as { error?: string })?.error ?? 'Ошибка загрузки данных'
    : null

  // suppress unused dispatch warning — kept for potential future use
  void dispatch

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
            {(['market', 'portfolio'] as Tab[]).map(t => (
              <button
                key={t}
                className={`${classes.desktopTab} ${tab === t ? classes.active : ''}`}
                onClick={() => handleTabChange(t)}
              >
                {t === 'market' ? 'Рынок' : 'Портфель'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {errorMessage && (
        <p className={classes.error}>⚠ {errorMessage}</p>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={tab}
          custom={direction}
          variants={PAGE_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', stiffness: 340, damping: 36, mass: 0.9 }}
        >
          {tab === 'market'    && <MarketPage    coins={data} loading={isLoading} />}
          {tab === 'portfolio' && <PortfolioPage marketData={data} />}
        </motion.div>
      </AnimatePresence>

      <BottomNav tab={tab} onChange={handleTabChange} />
    </div>
  )
}
