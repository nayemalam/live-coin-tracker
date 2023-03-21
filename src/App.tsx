import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import './App.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'bottom' as const,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  pointRadius: 1,
  pointHoverRadius: 1,
}

let flatCoinPairsEndpoint = 'https://api.newton.co/markets/v1/rates'

let candlesEndpoint = 'https://api.newton.co/markets/v1/candles'

let symbolEndpoint =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=cad'

type Coin = {
  ask: number
  bid: number
  change: number
  spot: number
  timestamp: number
  symbol: string
}

type SelectedTicker = {
  ticker: string
  name: string
  symbol: string
}

type Candle = {
  close_timestamp: number | string
  close: number
}

function App() {
  const [coin, setCoin] = useState<Coin>({} as Coin)
  const [selectedTicker, setSelectedTicker] = useState<SelectedTicker>({
    ticker: 'ETH',
    name: 'Ethereum',
    symbol:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
  })
  const [candles, setCandles] = useState<Candle[]>([])

  const data = useMemo(() => {
    const items = {
      labels: candles.map((candle) => candle.close_timestamp),
      datasets: [
        {
          label: selectedTicker.name,
          data: candles.map((candle) => candle.close),
          borderColor: '#04478f',
          backgroundColor: '#4E81B9',
          tension: 0.8,
        },
      ],
    }
    return items
  }, [candles, selectedTicker])

  // ticker: where X is the ticker
  const handleRatesOfCoinPair = useCallback(async (ticker: string) => {
    try {
      const response = await fetch(
        flatCoinPairsEndpoint + `?symbol=${ticker}_CAD`
      )
      const data = await response.json()
      setCoin(data)
    } catch (e) {
      console.log(e)
    }
  }, [])

  const handleCandles = useCallback(
    async (ticker: string, timeframe: string = '15m', limit: number = 50) => {
      try {
        const response = await fetch(
          candlesEndpoint +
            `?symbol=${ticker}_CAD&timeframe=${timeframe}&limit=${limit}`
        )
        const data = await response.json()
        const dataReversed = data.reverse()
        // convert all timestamps to human readable time
        dataReversed.forEach((candle: Candle) => {
          candle.close_timestamp = new Date(
            Number(candle.close_timestamp) * 1000
          )
            .toISOString()
            .slice(11, 16)
        })
        setCandles(dataReversed)
      } catch (e) {
        console.log(e)
      }
    },
    []
  )

  const handleRetrieveSymbol = useCallback(async () => {
    try {
      const response = await fetch(symbolEndpoint)
      const data = await response.json()
      const symbol = data.find(
        (coin: any) => coin.symbol === selectedTicker.ticker.toLowerCase()
      )
      setSelectedTicker({
        ...selectedTicker,
        symbol: symbol.image,
      })
    } catch (e) {
      console.log(e)
    }
  }, [selectedTicker])

  useEffect(() => {
    handleRatesOfCoinPair(selectedTicker.ticker)
    handleCandles(selectedTicker.ticker)
  }, [selectedTicker, handleRatesOfCoinPair, handleCandles])

  useEffect(() => {
    handleRetrieveSymbol()
  }, [])

  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <div className="card w-6/12 rounded drop-shadow-sm border p-8">
        <div className="flex flex-row items-center justify-between gap-10 pb-8">
          <div>
            <div className="flex items-center">
              <img
                className="w-3 h-3 rounded-full"
                src={selectedTicker.symbol}
              />
              <p className="text-[#4E81B9] text-xs">{selectedTicker.name}</p>
            </div>
            <div className="pl-2">
              <strong className="text-lg">{selectedTicker.name}</strong>
              <p className="text-sm">{selectedTicker.ticker}</p>
            </div>
          </div>
          <div>
            <div className="invisible">_</div>
            <p className="text-lg">$ {coin.spot?.toFixed(2) ?? '-'}</p>
            <p className="text-right">
              {coin.change > 0 ? (
                <span className="text-green-500">↑</span>
              ) : (
                <span className="text-red-500">↓</span>
              )}{' '}
              {coin.change} %
            </p>
          </div>
        </div>
        <div className="bottom-graph">
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  )
}

export default App
