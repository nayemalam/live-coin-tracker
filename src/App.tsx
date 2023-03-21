import {
  CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title,
  Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];


let flatCoinPairsEndpoint = 'https://api.newton.co/markets/v1/rates'

let candlesEndpoint= 'https://api.newton.co/markets/v1/candles'

type Coin = {
  ask: number,
  bid: number,
  change: number,
  spot: number,
  timestamp: number,
  symbol: string
}

type SelectedTicker = {
  ticker: string
  name: string
}

type Candle = {
  close_timestamp: number,
  close: number,
}

function App() {
  const [coin, setCoin] = useState<Coin>({} as Coin)
  const [selectedTicker, setSelectedTicker] = useState<SelectedTicker>({
    ticker: 'ETH',
    name: 'Ethereum'
  })
  const [candles, setCandles] = useState<Candle[]>([])

  useEffect(() => {
    // ticker: where X is the ticker
    const handleRatesOfCoinPair = async (ticker: string) => {
      try {
        const response = await fetch(flatCoinPairsEndpoint + `?symbol=${ticker}_CAD`)
        const data = await response.json()
        setCoin(data)
      } catch(e) {
        console.log(e)
      }
    }

    const handleCandles = async (ticker: string, timeframe: string = '15m', limit: number = 10) => {
      try {
        const response = await fetch(candlesEndpoint + `?symbol=${ticker}_CAD&timeframe=${timeframe}&limit=${limit}`)
        const data = await response.json()
        const dataReversed = data.reverse()
        setCandles(dataReversed)
      } catch(e) {
        console.log(e)
      }
    }

    handleRatesOfCoinPair(selectedTicker.ticker)
    handleCandles(selectedTicker.ticker)
  }, [selectedTicker])

  const data = {
    labels: candles.map(candle => candle.close_timestamp),
    datasets: [
      {
        label: selectedTicker.name,
        data: candles.map(candle => candle.close),
        borderColor: 'rgb(17, 31, 155)',
        backgroundColor: 'rgba(56, 29, 237, 0.5)',
      },
    ],
  };

  return (
    <div className="flex align-center justify-center flex-col text-center mt-20">
      <div className="card w-6/12 rounded drop-shadow-sm">
        <div className='top-context flex flex-row justify-space-between'>
          <div>
            <div>logo here</div>
            <strong>{selectedTicker.name}</strong>
            <p>{selectedTicker.ticker}</p>
          </div>
          <div>
            <p>$ {coin.spot}</p>
            <p>{coin.change}%</p>
          </div>
        </div>
        <div className='bottom-graph'>
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  )
}

export default App
