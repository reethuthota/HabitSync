import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function HabitForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    frequencyLabel: 'daily',
    frequency: [],
    accountabilityPartnerUsername: '', // Input field value
  });
  const [currentPartner, setCurrentPartner] = useState(null); // Existing partner (from DB)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      const fetchHabit = async () => {
        const token = localStorage.getItem('token');
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/habits/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setForm({
            name: data.name,
            frequencyLabel: data.frequencyLabel || 'custom',
            frequency: data.frequency || [],
            accountabilityPartnerUsername: '', // Keep input blank initially
          });
          if (data.accountabilityPartnerUsername) {
            setCurrentPartner(data.accountabilityPartnerUsername);
          }
        } catch (err) {
          console.error('Error fetching habit', err);
        }
      };
      fetchHabit();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemovePartner = async () => {
    const token = localStorage.getItem('token');
    if (!token || !id) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/habits/${id}/remove-partner`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentPartner(null);
    } catch (err) {
      console.error('Error removing partner', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in.');
        setLoading(false);
        return;
      }

      const payload = {
        name: form.name.trim(),
        frequencyLabel: form.frequencyLabel,
        frequency: form.frequency,
      };

      if (!isEdit) {
        // If accountabilityPartnerUsername is non-empty after trim, add it to payload
        const partnerUsername = form.accountabilityPartnerUsername.trim();
        if (partnerUsername) {
          payload.accountabilityPartnerUsername = partnerUsername;
        }
      }

      if (isEdit) {
        // --- Update Habit ---
        await axios.put(`${API_BASE_URL}/api/habits/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // --- Handle Accountability Partner Invitation ---
        if (form.accountabilityPartnerUsername.trim()) {
          await axios.post(
            `${API_BASE_URL}/api/habits/${id}/invite-partner`,
            { username: form.accountabilityPartnerUsername.trim() },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      } else {
        // --- Create Habit ---
        await axios.post(`${API_BASE_URL}/api/habits/create`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day) => {
    setForm((prevForm) => {
      const newDays = prevForm.frequency.includes(day)
        ? prevForm.frequency.filter((d) => d !== day)
        : [...prevForm.frequency, day];
      return { ...prevForm, frequency: newDays };
    });
  };

  return (
    <div className="min-h-screen bg-indigo-100 flex items-center justify-center py-12">
      <section className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-indigo-900 text-center">
          {isEdit ? 'Edit Habit' : 'Create Habit'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Habit name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-4 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* ✨ Accountability Partner */}
          <div className="mt-2 mb-6">
            {currentPartner && (
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-100 rounded">
                <span className="text-gray-700 text-sm">
                  Current partner: <strong>@{currentPartner}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleRemovePartner}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            )}
            <input
              type="text"
              name="accountabilityPartnerUsername"
              placeholder="Invite accountability partner (username)"
              value={form.accountabilityPartnerUsername}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Frequency
            </label>
            <div className="relative">
              <select
                name="frequencyLabel"
                value={form.frequencyLabel}
                onChange={handleChange}
                className="w-full p-4 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="weekly">Weekly (once a week)</option>
                <option value="custom">Custom (choose days)</option>
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {form.frequencyLabel === 'custom' && (
            <div className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'Sunday',
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                ].map((day) => (
                  <motion.button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`w-full p-4 rounded-lg text-white font-semibold transition duration-300 ${
                      form.frequency.includes(day)
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {day.substring(0, 3)}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg disabled:bg-indigo-400 mt-6 hover:bg-indigo-800 transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Habit' : 'Create Habit'}
          </motion.button>
        </form>
      </section>
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { FaChevronDown } from 'react-icons/fa';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// export default function HabitForm() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [form, setForm] = useState({
//     name: '',
//     frequencyLabel: 'daily',
//     frequency: [],
//     accountabilityPartnerUsername: '', // Input field value
//   });
//   const [currentPartner, setCurrentPartner] = useState(null); // Existing partner (from DB)
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const isEdit = Boolean(id);

//   useEffect(() => {
//     if (isEdit) {
//       const fetchHabit = async () => {
//         const token = localStorage.getItem('token');
//         try {
//           const { data } = await axios.get(`${API_BASE_URL}/api/habits/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setForm({
//             name: data.name,
//             frequencyLabel: data.frequencyLabel || 'custom',
//             frequency: data.frequency || [],
//             accountabilityPartnerUsername: data.accountabilityPartnerUsername, // Leave input blank
//           });
//           if (data.accountabilityPartner) {
//             setCurrentPartner(data.accountabilityPartnerUsername);
//           }
//         } catch (err) {
//           console.error('Error fetching habit', err);
//         }
//       };
//       fetchHabit();
//     }
//   }, [id, isEdit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleRemovePartner = async () => {
//     const token = localStorage.getItem('token');
//     if (!token || !id) return;

//     try {
//       await axios.delete(`${API_BASE_URL}/api/habits/${id}/remove-partner`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCurrentPartner(null); 
//     } catch (err) {
//       console.error('Error removing partner', err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('You must be logged in.');
//         return;
//       }

//       const payload = {
//         name: form.name.trim(),
//         frequencyLabel: form.frequencyLabel,
//         frequency: form.frequency,
//       };

//       if (isEdit) {
//         // --- Update Habit ---
//         await axios.put(`${API_BASE_URL}/api/habits/${id}`, payload, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // --- Handle Accountability Partner ---
//         if (form.accountabilityPartnerUsername.trim()) {
//           await axios.post(`${API_BASE_URL}/api/habits/${id}/invite-partner`, {
//             username: form.accountabilityPartnerUsername.trim(),
//           }, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//         }
//       } else {
//         // --- Create Habit ---
//         const createPayload = {
//           ...payload,
//           accountabilityPartnerUsername: form.accountabilityPartnerUsername.trim() || undefined,
//         };

//         await axios.post(`${API_BASE_URL}/api/habits/create`, createPayload, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }

//       navigate('/dashboard');
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleDay = (day) => {
//     setForm((prevForm) => {
//       const newDays = prevForm.frequency.includes(day)
//         ? prevForm.frequency.filter((d) => d !== day)
//         : [...prevForm.frequency, day];
//       return { ...prevForm, frequency: newDays };
//     });
//   };

//   return (
//     <div className="min-h-screen bg-indigo-100 flex items-center justify-center py-12">
//       <section className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
//         <h2 className="text-3xl font-bold text-indigo-900 text-center">
//           {isEdit ? 'Edit Habit' : 'Create Habit'}
//         </h2>

//         <form onSubmit={handleSubmit}>
//           <div>
//             <input
//               type="text"
//               name="name"
//               placeholder="Habit name"
//               value={form.name}
//               onChange={handleChange}
//               className="w-full p-4 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             />
//           </div>

//           {/* ✨ Accountability Partner */}
//           <div className="mt-2 mb-6">
//             {currentPartner && (
//               <div className="flex items-center justify-between mb-4 p-3 bg-gray-100 rounded">
//                 <span className="text-gray-700 text-sm">
//                   Current partner: <strong>@{currentPartner}</strong>
//                 </span>
//                 <button
//                   type="button"
//                   onClick={handleRemovePartner}
//                   className="text-red-500 hover:underline text-sm"
//                 >
//                   Remove
//                 </button>
//               </div>
//             )}
//             <input
//               type="text"
//               name="accountabilityPartnerUsername"
//               placeholder="Invite accountability partner (username)"
//               value={form.accountabilityPartnerUsername}
//               onChange={handleChange}
//               className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-lg font-semibold text-gray-700 mb-4">Frequency</label>
//             <div className="relative">
//               <select
//                 name="frequencyLabel"
//                 value={form.frequencyLabel}
//                 onChange={handleChange}
//                 className="w-full p-4 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
//               >
//                 <option value="daily">Daily</option>
//                 <option value="weekdays">Weekdays</option>
//                 <option value="weekends">Weekends</option>
//                 <option value="weekly">Weekly (once a week)</option>
//                 <option value="custom">Custom (choose days)</option>
//               </select>
//               <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
//             </div>
//           </div>

//           {form.frequencyLabel === 'custom' && (
//             <div className="mt-6">
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
//                   <motion.button
//                     type="button"
//                     key={day}
//                     onClick={() => toggleDay(day)}
//                     className={`w-full p-4 rounded-lg text-white font-semibold transition duration-300 ${
//                       form.frequency.includes(day)
//                         ? 'bg-indigo-600 hover:bg-indigo-700'
//                         : 'bg-gray-300 hover:bg-gray-400'
//                     }`}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     {day.substring(0, 3)}
//                   </motion.button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {error && <p className="text-red-500 text-center mt-4">{error}</p>}

//           <motion.button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg disabled:bg-indigo-400 mt-6 hover:bg-indigo-800 transition-colors duration-300"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.8 }}
//           >
//             {loading ? 'Saving...' : isEdit ? 'Update Habit' : 'Create Habit'}
//           </motion.button>
//         </form>
//       </section>
//     </div>
//   );
// }
