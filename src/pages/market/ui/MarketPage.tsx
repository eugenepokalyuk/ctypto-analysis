import React from 'react'

import {AnimatePresence, motion} from 'framer-motion'
import {useSelector} from 'react-redux'

import {selectLayout} from '@/features/layout-switcher/model/selectors'
import type {CoinAnalysis} from '@/entities/coin/model/types'
import {CoinGrid} from '@/widgets/coin-grid/ui/CoinGrid'
import {CoinList} from '@/widgets/coin-list/ui/CoinList'
import {CoinTable} from '@/widgets/coin-table/ui/CoinTable'
import {CoinDetail} from '@/widgets/coin-detail/ui/CoinDetail'

import classes from './MarketPage.module.scss'

interface Props {
    coins:CoinAnalysis[]
    loading:boolean
}

function CoinListView({ coins, selectedId, onSelect }:{
    coins:CoinAnalysis[];
    selectedId:string|null;
    onSelect:(id:string) => void
}) {
    const layout = useSelector(selectLayout)
    if (layout === 'list') return <CoinList coins={coins} selectedId={selectedId} onSelect={onSelect}/>
    if (layout === 'table') return <CoinTable coins={coins} selectedId={selectedId} onSelect={onSelect}/>
    return <CoinGrid coins={coins} loading={false} selectedId={selectedId} onSelect={onSelect}/>
}

export function MarketPage({ coins, loading }:Props) {
    const layout = useSelector(selectLayout)
    const [selectedId, setSelectedId] = React.useState<string|null>(null)
    const selected = coins.find(c => c.id === selectedId) ?? null

    // В режиме таблицы на мобильном — нет правой панели, открываем детали под таблицей
    const isTableMobile = layout === 'table'

    return (
        <div className={`${classes.page} ${selected ? classes.detailOpen : ''}`}>
            <div className={classes.sidebar}>
                {loading
                    ? <CoinGrid coins={[]} loading selectedId={null} onSelect={() => {
                    }}/>
                    : <CoinListView coins={coins} selectedId={selectedId} onSelect={setSelectedId}/>
                }

                {/* Детали под списком на мобильном в режиме таблицы */}
                {isTableMobile && selected && (
                    <div className={classes.inlineDetail}>
                        <button className={classes.backBtn} onClick={() => setSelectedId(null)}>← Назад</button>
                        <CoinDetail coin={selected}/>
                    </div>
                )}
            </div>

            {/* Правая панель — только на desktop и не в режиме таблицы */}
            <div className={classes.main}>
                <AnimatePresence mode="wait">
                    {selected ? (
                        <motion.div
                            key={selected.id}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
                            className={classes.detailWrap}
                        >
                            <button className={classes.backBtn} onClick={() => setSelectedId(null)}>← Назад</button>
                            <CoinDetail coin={selected}/>
                        </motion.div>
                    ) : (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className={classes.empty}>
                            <span className={classes.emptyIcon}>◈</span>
                            <span>Выбери монету для анализа</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
