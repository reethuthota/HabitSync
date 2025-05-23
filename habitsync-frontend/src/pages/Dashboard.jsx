import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import HabitChart from '../components/HabitChart';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]); // Default to empty array
  const [accountabilityHabits, setAccountabilityHabits] = useState([]); // For habits where user is an accountability partner
  const [error, setError] = useState(null); // Track errors for UI feedback

  const fetchHabits = async () => {
    const token = localStorage.getItem('token');
    setError(null); // Reset error state

    // Fetch own habits
    try {
      const ownHabitsResponse = await axios.get(`${API_BASE_URL}/api/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ownHabits = ownHabitsResponse.data.filter(
        (habit) => habit && habit._id && habit.name // Filter out invalid habits
      );
      setHabits(ownHabits);
      console.log('Own Habits:', ownHabits);
      console.table(ownHabits);
    } catch (err) {
      console.error('Error fetching own habits', err);
      setHabits([]);
      setError('Failed to load your habits. Please try again.');
    }

    // Fetch partner habits
    try {
      const partnerHabitsResponse = await axios.get(`${API_BASE_URL}/api/habits/partner-habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const partnerHabits = partnerHabitsResponse.data.filter(
        (habit) => habit && habit._id && habit.name // Filter out invalid habits
      );
      setAccountabilityHabits(partnerHabits);
      console.log('Partner Habits:', partnerHabits);
    } catch (err) {
      console.error('Error fetching partner habits', err);
      setAccountabilityHabits([]);
      setError('Failed to load accountability habits. Please try again.');
    }
  };

  // Fetch habits when the component mounts
  useEffect(() => {
    fetchHabits();
  }, []); // Empty dependency array to only run on component mount

  const logHabit = async (habitId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/habits/${habitId}/log`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        fetchHabits(); // Refetch habits after logging
      }
    } catch (err) {
      console.error('Error logging habit', err);
      setError('Failed to log habit. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen p-6 bg-indigo-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.name} 👋</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Your Habits Section */}
      <div className="bg-indigo-50 p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Your Habits</h2>
          <button
            onClick={() => navigate('/habits/new')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition duration-300"
          >
            + New Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <p className="text-gray-600">No habits yet. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => {
              const lastLogDate = habit.logs && habit.logs.length > 0 ? habit.logs[habit.logs.length - 1] : null;
              const today = new Date().toISOString().slice(0, 10);
              const isLoggedToday = lastLogDate ? lastLogDate.slice(0, 10) === today : false;

              return (
                <div
                  key={habit._id || Math.random()}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{habit.name || 'Unnamed Habit'}</h3>
                  <p className="text-sm text-indigo-600 mt-2">
                    🔥 Current Streak: {habit.streak ?? 0} day{habit.streak !== 1 ? 's' : ''}
                  </p>

                  {habit && <HabitChart habit={habit} />}

                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => logHabit(habit._id)}
                      disabled={isLoggedToday}
                      className={`px-4 py-2 rounded-lg text-white transition duration-300 ${
                        isLoggedToday ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {isLoggedToday ? 'Logged Today' : 'Log Today'}
                    </button>
                    <button
                      onClick={() => navigate(`/habits/${habit._id}/edit`)}
                      className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition duration-300"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Accountability Habits Section */}
      <div className="bg-indigo-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Habits You Are an Accountability Partner For</h2>

        {accountabilityHabits.length === 0 ? (
          <p className="text-gray-600">No habits where you are an accountability partner yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accountabilityHabits.map((habit) => {
              const lastLogDate = habit.logs && habit.logs.length > 0 ? habit.logs[habit.logs.length - 1] : null;
              const today = new Date().toISOString().slice(0, 10);
              const isLoggedToday = lastLogDate ? lastLogDate.slice(0, 10) === today : false;

              return (
                <div
                  key={habit._id || Math.random()}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{habit.name || 'Unnamed Habit'}</h3>
                  <p className="text-sm text-indigo-600 mt-2">
                    👤 Habit Owner: <span className="font-semibold">{habit.ownerUsername || 'Unknown'}</span>
                  </p>
                  <p className="text-sm text-indigo-600 mt-2">
                    🔥 Current Streak: {habit.streak ?? 0} day{habit.streak !== 1 ? 's' : ''}
                  </p>
                  <p className={`text-sm mt-2 ${isLoggedToday ? 'text-green-600' : 'text-red-600'}`}>
                    {isLoggedToday ? '✅ Logged today!' : '❌ Not logged today'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}