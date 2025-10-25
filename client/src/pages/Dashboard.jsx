import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, refreshUser } = useAuth()
  const [coins, setCoins] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [coinsRes, transactionsRes] = await Promise.all([
        axios.get('/api/coins?limit=20', { withCredentials: true }),
        axios.get('/api/transactions', { withCredentials: true })
      ])
      setCoins(coinsRes.data)
      setTransactions(transactionsRes.data.slice(0, 10))
      await refreshUser()
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-gray-600 text-sm font-medium">Current Balance</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            ${user?.balance?.toFixed(2) || '0.00'}
          </p>
        </div>
        
        <Link to="/tasks" className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
          <h3 className="text-gray-600 text-sm font-medium">Earn with Tasks</h3>
          <p className="text-xl font-bold text-blue-600 mt-2">View Microtasks →</p>
        </Link>
        
        <Link to="/games" className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
          <h3 className="text-gray-600 text-sm font-medium">Play Games</h3>
          <p className="text-xl font-bold text-purple-600 mt-2">Earn $2/Win →</p>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Top 20 Cryptocurrencies</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Coin</th>
                <th className="text-right py-3 px-4">Price</th>
                <th className="text-right py-3 px-4">24h Change</th>
                <th className="text-right py-3 px-4">Market Cap</th>
                <th className="text-right py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, idx) => (
                <tr key={coin.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                      <span className="font-medium">{coin.name}</span>
                      <span className="text-gray-500 text-sm">{coin.symbol.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 font-medium">
                    ${coin.currentPrice?.toLocaleString()}
                  </td>
                  <td className={`text-right py-3 px-4 font-medium ${coin.priceChangePercentage24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {coin.priceChangePercentage24h >= 0 ? '+' : ''}
                    {coin.priceChangePercentage24h?.toFixed(2)}%
                  </td>
                  <td className="text-right py-3 px-4">
                    ${(coin.marketCap / 1e9).toFixed(2)}B
                  </td>
                  <td className="text-right py-3 px-4">
                    <Link
                      to={`/coin/${coin.symbol.toUpperCase()}`}
                      className="bg-primary text-white px-4 py-1 rounded hover:opacity-90 transition text-sm"
                    >
                      AI Advice
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium">{tx.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </p>
                  {tx.coinSymbol && (
                    <p className="text-sm text-gray-500">{tx.coinSymbol}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
