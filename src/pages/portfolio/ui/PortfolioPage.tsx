import type { CoinAnalysis } from '@/entities/coin/model/types'
import { PortfolioPanel } from '@/widgets/portfolio-panel/ui/PortfolioPanel'

interface Props {
  marketData: CoinAnalysis[]
}

export function PortfolioPage({ marketData }: Props) {
  return <PortfolioPanel marketData={marketData} />
}
