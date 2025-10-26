import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Mining() {
  const { user, refreshUser } = useAuth()
  const [mining, setMining] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [progress, setProgress] = useState(0)
  const [remainingSessions, setRemainingSessions] = useState(3)
  const [message, setMessage] = useState('')
  const [miningDuration, setMiningDuration] = useState(60)

  useEffect(() => {
    fetchRemainingSessions()
  }, [])

  useEffect(() => {
    let interval
    if (mining && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeMining()
            return 0
          }
          return prev - 1
        })
        setProgress(prev => Math.min(100, prev + (100 / miningDuration)))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [mining, timeLeft])

  const fetchRemainingSessions = async () => {
    try {
      const response = await axios.get('/api/mining/remaining', { withCredentials: true })
      setRemainingSessions(response.data)
    } catch (error) {
      console.error('Error fetching remaining sessions:', error)
    }
  }

  const startMining = () => {
    if (remainingSessions <= 0) {
      setMessage('Daily mining limit reached! Come back tomorrow.')
      return
    }
    
    setMining(true)
    setTimeLeft(miningDuration)
    setProgress(0)
    setMessage('')
  }

  const completeMining = async () => {
    try {
      const response = await axios.post(
        '/api/mining/complete',
        { durationSeconds: miningDuration },
        { withCredentials: true }
      )

      console.log('Mining response:', response.data)
      
      setMining(false)
      setProgress(100)
      setMessage(`Mining complete! You earned $${response.data.reward.toFixed(2)}`)
      await fetchRemainingSessions()
      await refreshUser()
    } catch (error) {
      setMining(false)
      setMessage(error.response?.data?.message || 'Mining failed. Please try again.')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl shadow-2xl p-8 mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">⛏️ Crypto Mining</h1>
          <p className="text-purple-100">Mine cryptocurrency and earn rewards!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">{remainingSessions}</div>
            <div className="text-sm text-purple-100">Sessions Left</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">${user?.balance?.toFixed(2) || '0.00'}</div>
            <div className="text-sm text-purple-100">Current Balance</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">3</div>
            <div className="text-sm text-purple-100">Max Per Day</div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur rounded-xl p-6 mb-6">
          {!mining && progress === 0 && (
            <div className="text-center">
              <p className="text-lg mb-4">Select mining duration:</p>
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => setMiningDuration(30)}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    miningDuration === 30
                      ? 'bg-white text-purple-600'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  30 sec
                </button>
                <button
                  onClick={() => setMiningDuration(60)}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    miningDuration === 60
                      ? 'bg-white text-purple-600'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  60 sec
                </button>
                <button
                  onClick={() => setMiningDuration(120)}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    miningDuration === 120
                      ? 'bg-white text-purple-600'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  120 sec
                </button>
              </div>
              <button
                onClick={startMining}
                disabled={remainingSessions <= 0}
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-xl hover:bg-purple-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Mining
              </button>
            </div>
          )}

          {mining && (
            <div className="text-center">
              <div className="text-6xl font-bold mb-4">{formatTime(timeLeft)}</div>
              <div className="w-full bg-white/30 rounded-full h-4 mb-4">
                <div
                  className="bg-white h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-lg">Mining in progress...</p>
              <p className="text-sm text-purple-100 mt-2">
                Reward: ${(0.5 * (miningDuration / 60)).toFixed(2)} (base reward × duration)
              </p>
            </div>
          )}

          {!mining && progress === 100 && (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-xl font-bold mb-4">Mining Complete!</p>
              <button
                onClick={() => {
                  setProgress(0)
                  setMessage('')
                }}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                Mine Again
              </button>
            </div>
          )}
        </div>

        {message && (
          <div className={`text-center p-4 rounded-lg ${
            message.includes('complete') || message.includes('earned')
              ? 'bg-green-500/20 border border-green-300'
              : 'bg-red-500/20 border border-red-300'
          }`}>
            {message}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">How Mining Works</h2>
        <div className="space-y-3 text-gray-600">
          <p>• You can mine up to 3 times per day</p>
          <p>• Choose your mining duration (30, 60, or 120 seconds)</p>
          <p>• Longer mining sessions earn higher rewards</p>
          <p>• Base reward: $0.50 per minute of mining</p>
          <p>• Mining sessions reset daily at midnight</p>
          <p>• Rewards are instantly added to your balance</p>
        </div>
      </div>
    </div>
  )
}
