import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Tasks() {
  const { user, refreshUser } = useAuth()
  const [tasks, setTasks] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', reward: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchTasks()
    } else {
      console.log("no user");
    }
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks', { withCredentials: true })
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axios.post('/api/tasks', newTask, { withCredentials: true })
      setShowCreateModal(false)
      setNewTask({ title: '', description: '', reward: '' })
      await fetchTasks()
      await refreshUser()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptTask = async (taskId) => {
    try {
      await axios.post(`/api/tasks/${taskId}/accept`, {}, { withCredentials: true })
      await fetchTasks()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept task')
    }
  }

  const handleSubmitTask = async (taskId) => {
    const submission = prompt('Enter your submission details:')
    if (!submission) return

    try {
      await axios.post(`/api/tasks/${taskId}/submit`,
        { submissionDetails: submission },
        { withCredentials: true }
      )
      await fetchTasks()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit task')
    }
  }

  const handleApproveTask = async (taskId) => {
    if (!confirm('Approve this task submission?')) return

    try {
      await axios.post(`/api/tasks/${taskId}/approve`, {}, { withCredentials: true })
      await fetchTasks()
      await refreshUser()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve task')
    }
  }

  // const myTasks = tasks.filter(t => t.creatorId === user?.id)
  // const acceptedTasks = tasks.filter(t => t.acceptedByUserId === user?.id)
  // const availableTasks = tasks.filter(t => 
  //   t.status === 'OPEN' && 
  //   t.creatorId !== user?.id &&
  //   t.acceptedByUserId !== user?.id
  // )

  const session_user_str = sessionStorage.getItem('user');
  const session_user = session_user_str ? JSON.parse(session_user_str) : null;

  const myTasks = session_user
    ? tasks.filter(t => Number(t.creatorId) === Number(session_user.userId))
    : [];

  const acceptedTasks = tasks.filter(t => Number(t.acceptedByUserId) === Number(session_user.userId))
  const availableTasks = tasks.filter(t =>
    t.status === 'OPEN' &&
    Number(t.creatorId) !== Number(user?.id) &&
    !t.acceptedByUserId
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Task Marketplace</h1>
          <p className="text-gray-600">Earn rewards by completing microtasks</p>
        </div>
        {session_user?.isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            + Create Task
          </button>
        )}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Available Tasks</h2>
          {availableTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks available</p>
          ) : (
            <div className="space-y-3">
              {availableTasks.map(task => (
                <div key={task.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-bold">${task.reward}</span>
                    <button
                      onClick={() => handleAcceptTask(task.id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">My Accepted Tasks</h2>
          {acceptedTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No accepted tasks</p>
          ) : (
            <div className="space-y-3">
              {acceptedTasks.map(task => (
                <div key={task.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${task.status === 'ACCEPTED' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                      {task.status}
                    </span>
                  </div>
                  {task.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleSubmitTask(task.id)}
                      className="bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600 w-full"
                    >
                      Submit Work
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">My Created Tasks</h2>
          {myTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks created</p>
          ) : (
            <div className="space-y-3">
              {myTasks.map(task => (
                <div key={task.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${task.status === 'OPEN' ? 'bg-gray-100 text-gray-800' :
                      task.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                      {task.status}
                    </span>
                  </div>
                  {task.status === 'SUBMITTED' && task.submissionDetails && (
                    <>
                      <p className="text-xs text-gray-600 mb-2">
                        Submission: {task.submissionDetails}
                      </p>
                      <button
                        onClick={() => handleApproveTask(task.id)}
                        className="bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600 w-full"
                      >
                        Approve & Pay
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reward ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTask.reward}
                  onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Amount will be deducted from your balance now
                </p>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                  {error}
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
