import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CoinDetails() {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const [coin, setCoin] = useState(null)
  const [advice, setAdvice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchCoinData()
  }, [symbol])

  const fetchCoinData = async () => {
    try {
      const coinsRes = await axios.get('/api/coins?limit=100', { withCredentials: true })
      const coinData = coinsRes.data.find(c => c.symbol.toUpperCase() === symbol)
      setCoin(coinData)
    } catch (error) {
      console.error('Error fetching coin:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAIAdvice = async () => {
    try {
      const response = await axios.get(`/api/advice/${symbol}`, { withCredentials: true })
      setAdvice(response.data)
      setShowModal(true)
    } catch (error) {
      console.error('Error fetching advice:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!coin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl mb-4">Coin not found</p>
        <button onClick={() => navigate('/dashboard')} className="bg-primary text-white px-6 py-2 rounded">
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/dashboard')} className="text-primary mb-6 hover:underline">
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <img src={coin.image} alt={coin.name} className="w-16 h-16" />
          <div>
            <h1 className="text-3xl font-bold">{coin.name}</h1>
            <p className="text-gray-500">{coin.symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Current Price</p>
            <p className="text-2xl font-bold">${coin.currentPrice?.toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">24h Change</p>
            <p className={`text-2xl font-bold ${coin.priceChangePercentage24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {coin.priceChangePercentage24h >= 0 ? '+' : ''}
              {coin.priceChangePercentage24h?.toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Market Cap</p>
            <p className="text-xl font-bold">${(coin.marketCap / 1e9).toFixed(2)}B</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">24h Price Change</p>
            <p className={`text-xl font-bold ${coin.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(coin.priceChange24h)?.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={getAIAdvice}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition"
        >
          🤖 Get AI Investment Advice
        </button>
      </div>

      {showModal && advice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">AI Investment Advice for {symbol}</h2>
            
            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-lg ${
                advice.recommendation === 'BUY' ? 'bg-green-100 border-2 border-green-500' :
                advice.recommendation === 'SELL' ? 'bg-red-100 border-2 border-red-500' :
                'bg-yellow-100 border-2 border-yellow-500'
              }`}>
                <p className="text-sm font-medium">Recommendation</p>
                <p className="text-3xl font-bold">{advice.recommendation}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">Risk Level</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full"
                      style={{ width: `${advice.riskPercentage}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{advice.riskPercentage}%</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Rationale</p>
                <p className="text-gray-700">{advice.rationale}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-700 mb-1">Stop Loss</p>
                  <p className="text-xl font-bold text-red-700">${advice.stopLoss?.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-700 mb-1">Take Profit</p>
                  <p className="text-xl font-bold text-green-700">${advice.takeProfit?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-xs text-yellow-800">{advice.disclaimer}</p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
