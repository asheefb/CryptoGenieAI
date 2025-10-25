import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Games() {
  const { refreshUser } = useAuth()
  const [remaining, setRemaining] = useState({ PUZZLE: 5, QUIZ: 5, LUDO: 5 })
  const [activeGame, setActiveGame] = useState(null)
  const [gameState, setGameState] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchRemaining()
  }, [])

  const fetchRemaining = async () => {
    try {
      const results = await Promise.all([
        axios.get('/api/games/PUZZLE/remaining', { withCredentials: true }),
        axios.get('/api/games/QUIZ/remaining', { withCredentials: true }),
        axios.get('/api/games/LUDO/remaining', { withCredentials: true })
      ])
      setRemaining({
        PUZZLE: results[0].data.remaining,
        QUIZ: results[1].data.remaining,
        LUDO: results[2].data.remaining
      })
    } catch (error) {
      console.error('Error fetching remaining games:', error)
    }
  }

  const recordWin = async (gameType) => {
    try {
      await axios.post('/api/games/result', 
        { gameType, won: true },
        { withCredentials: true }
      )
      await fetchRemaining()
      await refreshUser()
      setMessage(`🎉 Congratulations! You won $2!`)
      setTimeout(() => {
        setActiveGame(null)
        setMessage('')
      }, 2000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to record win')
    }
  }

  const startPuzzle = () => {
    setActiveGame('PUZZLE')
    const pieces = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
    setGameState({ pieces, target: [1, 2, 3, 4, 5, 6, 7, 8, 9] })
  }

  const checkPuzzleWin = () => {
    if (JSON.stringify(gameState.pieces) === JSON.stringify(gameState.target)) {
      recordWin('PUZZLE')
    } else {
      setMessage('Not solved yet! Keep trying.')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  const startQuiz = () => {
    setActiveGame('QUIZ')
    setGameState({
      questions: [
        { q: 'What is the largest cryptocurrency by market cap?', a: ['Bitcoin', 'Ethereum', 'Cardano'], correct: 0 },
        { q: 'What consensus mechanism does Bitcoin use?', a: ['Proof of Work', 'Proof of Stake', 'Proof of Authority'], correct: 0 },
        { q: 'Who created Bitcoin?', a: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Elon Musk'], correct: 1 },
        { q: 'What is a blockchain?', a: ['A social media', 'A distributed ledger', 'A video game'], correct: 1 },
        { q: 'What does DeFi stand for?', a: ['Digital Finance', 'Decentralized Finance', 'Direct Finance'], correct: 1 }
      ],
      current: 0,
      score: 0
    })
  }

  const answerQuiz = (index) => {
    const correct = gameState.questions[gameState.current].correct === index
    const newScore = gameState.score + (correct ? 1 : 0)
    
    if (gameState.current < gameState.questions.length - 1) {
      setGameState({ ...gameState, current: gameState.current + 1, score: newScore })
    } else {
      if (newScore >= 4) {
        recordWin('QUIZ')
      } else {
        setMessage(`Quiz completed! Score: ${newScore}/5. Need 4+ to win.`)
        setTimeout(() => {
          setActiveGame(null)
          setMessage('')
        }, 2000)
      }
    }
  }

  const startLudo = () => {
    setActiveGame('LUDO')
    setGameState({ position: 0, target: 20 })
  }

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1
    const newPosition = gameState.position + roll
    
    if (newPosition >= gameState.target) {
      recordWin('LUDO')
    } else {
      setGameState({ ...gameState, position: newPosition })
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Games</h1>
      <p className="text-gray-600 mb-8">Play games and earn $2 per win (max 5 wins/game/day)</p>

      {!activeGame ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">🧩</div>
            <h2 className="text-2xl font-bold mb-2">Puzzle Game</h2>
            <p className="text-gray-600 mb-4">Arrange numbers in order</p>
            <p className="text-sm mb-4">Remaining wins today: <span className="font-bold">{remaining.PUZZLE}/5</span></p>
            <button
              onClick={startPuzzle}
              disabled={remaining.PUZZLE === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {remaining.PUZZLE > 0 ? 'Play Puzzle' : 'Daily Limit Reached'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">❓</div>
            <h2 className="text-2xl font-bold mb-2">Quiz Game</h2>
            <p className="text-gray-600 mb-4">Answer crypto questions</p>
            <p className="text-sm mb-4">Remaining wins today: <span className="font-bold">{remaining.QUIZ}/5</span></p>
            <button
              onClick={startQuiz}
              disabled={remaining.QUIZ === 0}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {remaining.QUIZ > 0 ? 'Play Quiz' : 'Daily Limit Reached'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">🎲</div>
            <h2 className="text-2xl font-bold mb-2">Ludo Lite</h2>
            <p className="text-gray-600 mb-4">Reach the finish line</p>
            <p className="text-sm mb-4">Remaining wins today: <span className="font-bold">{remaining.LUDO}/5</span></p>
            <button
              onClick={startLudo}
              disabled={remaining.LUDO === 0}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {remaining.LUDO > 0 ? 'Play Ludo' : 'Daily Limit Reached'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <button
            onClick={() => setActiveGame(null)}
            className="mb-6 text-primary hover:underline"
          >
            ← Back to Games
          </button>

          {activeGame === 'PUZZLE' && gameState && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Puzzle: Arrange 1-9 in order</h2>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                {gameState.pieces.map((num, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-100 border-2 border-blue-500 rounded-lg h-20 flex items-center justify-center text-3xl font-bold cursor-pointer hover:bg-blue-200"
                    onClick={() => {
                      const newPieces = [...gameState.pieces]
                      if (idx > 0) {
                        ;[newPieces[idx], newPieces[idx-1]] = [newPieces[idx-1], newPieces[idx]]
                        setGameState({ ...gameState, pieces: newPieces })
                      }
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <button
                onClick={checkPuzzleWin}
                className="w-full max-w-md mx-auto block bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
              >
                Check Solution
              </button>
            </div>
          )}

          {activeGame === 'QUIZ' && gameState && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Question {gameState.current + 1}/{gameState.questions.length}
              </h2>
              <div className="max-w-2xl mx-auto">
                <p className="text-xl mb-6">{gameState.questions[gameState.current].q}</p>
                <div className="space-y-3">
                  {gameState.questions[gameState.current].a.map((answer, idx) => (
                    <button
                      key={idx}
                      onClick={() => answerQuiz(idx)}
                      className="w-full bg-blue-100 hover:bg-blue-200 border-2 border-blue-500 py-4 rounded-lg font-medium text-left px-6"
                    >
                      {answer}
                    </button>
                  ))}
                </div>
                <p className="text-center mt-6 text-gray-600">Score: {gameState.score}/{gameState.current}</p>
              </div>
            </div>
          )}

          {activeGame === 'LUDO' && gameState && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Ludo Lite</h2>
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="bg-gray-200 h-8 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full transition-all duration-500"
                      style={{ width: `${(gameState.position / gameState.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-center mt-2 font-bold text-xl">
                    {gameState.position} / {gameState.target}
                  </p>
                </div>
                <button
                  onClick={rollDice}
                  className="w-full bg-purple-500 text-white py-4 rounded-lg font-bold text-xl hover:bg-purple-600"
                >
                  🎲 Roll Dice
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center font-semibold">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
