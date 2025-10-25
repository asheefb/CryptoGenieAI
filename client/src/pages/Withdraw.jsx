import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Withdraw() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const withdrawAmount = parseFloat(amount)
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (withdrawAmount > user.balance) {
      setError('Insufficient balance')
      return
    }

    setLoading(true)

    try {
      await axios.post('/api/transactions/withdraw', 
        { amount: withdrawAmount },
        { withCredentials: true }
      )
      await refreshUser()
      setSuccess(`Successfully withdrew $${withdrawAmount.toFixed(2)}!`)
      setAmount('')
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Withdrawal failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <button onClick={() => navigate('/dashboard')} className="text-primary mb-6 hover:underline">
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Withdraw Funds</h1>
        <p className="text-gray-600 mb-6">Remove funds from your account</p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-1">Available Balance</p>
          <p className="text-2xl font-bold">${user?.balance?.toFixed(2) || '0.00'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500 text-lg">$</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[10, 50, 100].map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(Math.min(preset, user?.balance || 0).toString())}
                className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-medium transition"
                disabled={user?.balance < preset}
              >
                ${preset}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmount((user?.balance || 0).toString())}
              className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-medium transition col-span-3"
            >
              All (${user?.balance?.toFixed(2)})
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Withdraw Now'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Simulated Only:</strong> No real money is being withdrawn.
          </p>
        </div>
      </div>
    </div>
  )
}
