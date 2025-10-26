import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-2xl font-bold flex items-center">
              🧞 Crypto Genie
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="hover:bg-white/10 px-3 py-2 rounded transition">
                Dashboard
              </Link>
              <Link to="/mining" className="hover:bg-white/10 px-3 py-2 rounded transition">
                Mining
              </Link>
              <Link to="/tasks" className="hover:bg-white/10 px-3 py-2 rounded transition">
                Tasks
              </Link>
              <Link to="/games" className="hover:bg-white/10 px-3 py-2 rounded transition">
                Games
              </Link>
              {user?.admin && (
                <Link to="/admin" className="hover:bg-white/10 px-3 py-2 rounded transition">
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg font-semibold">
              Balance: ${user?.balance?.toFixed(2) || '0.00'}
            </div>
            <div className="flex space-x-2">
              <Link
                to="/deposit"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition font-medium"
              >
                Deposit
              </Link>
              <Link
                to="/withdraw"
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition font-medium"
              >
                Withdraw
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden bg-white/10 px-4 py-2">
        <div className="flex justify-around">
           <Link to="/dashboard" className="text-sm">Dashboard</Link>
          <Link to="/mining" className="text-sm">Mining</Link>
          <Link to="/tasks" className="text-sm">Tasks</Link>
          <Link to="/games" className="text-sm">Games</Link>
          {user?.admin && <Link to="/admin" className="text-sm">Admin</Link>}
        </div>
      </div>
    </nav>
  )
}
