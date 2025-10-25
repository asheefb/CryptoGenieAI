import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  const [rewardUserId, setRewardUserId] = useState(null)
  const [rewardAmount, setRewardAmount] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  
  const fetchData = async () => {
    try {
      const [usersRes, transactionsRes] = await Promise.all([
        axios.get('/api/admin/users', { withCredentials: true }),
        axios.get('/api/admin/transactions', { withCredentials: true })
      ])
      setUsers(usersRes.data)
      setTransactions(transactionsRes.data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }

  const handleReward = async (userId) => {
    const amount = parseFloat(rewardAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    try {
      await axios.post(`/api/admin/users/${userId}/reward`, 
        { amount },
        { withCredentials: true }
      )
      await fetchData()
      setRewardUserId(null)
      setRewardAmount('')
      alert('Reward issued successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to issue reward')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h1>

      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 font-semibold ${
              activeTab === 'users' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-600'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-4 font-semibold ${
              activeTab === 'transactions' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-600'
            }`}
          >
            Transactions ({transactions.length})
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-right py-3 px-4">Balance</th>
                  <th className="text-center py-3 px-4">Admin</th>
                  <th className="text-center py-3 px-4">Verified</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.id}</td>
                    <td className="py-3 px-4 font-medium">{user.email}</td>
                    <td className="text-right py-3 px-4">${user.balance?.toFixed(2)}</td>
                    <td className="text-center py-3 px-4">
                      {user.admin ? '✅' : '❌'}
                    </td>
                    <td className="text-center py-3 px-4">
                      {user.emailVerified ? '✅' : '❌'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right py-3 px-4">
                      {rewardUserId === user.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={rewardAmount}
                            onChange={(e) => setRewardAmount(e.target.value)}
                            placeholder="Amount"
                            className="w-24 px-2 py-1 border rounded text-sm"
                          />
                          <button
                            onClick={() => handleReward(user.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                          >
                            Send
                          </button>
                          <button
                            onClick={() => {
                              setRewardUserId(null)
                              setRewardAmount('')
                            }}
                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setRewardUserId(user.id)}
                          className="bg-primary text-white px-4 py-1 rounded text-sm hover:opacity-90"
                        >
                          Reward
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">All Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">User ID</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Coin</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 100).map(tx => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{tx.id}</td>
                    <td className="py-3 px-4">{tx.userId}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-800' :
                        tx.type === 'WITHDRAWAL' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`text-right py-3 px-4 font-medium ${
                      tx.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.amount >= 0 ? '+' : ''}${tx.amount?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">{tx.coinSymbol || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{tx.description || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
