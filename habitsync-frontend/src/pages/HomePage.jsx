import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-screen bg-gradient-to-r from-indigo-600 to-indigo-900 text-white flex items-center justify-center text-center px-6 md:px-12">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://source.unsplash.com/random/1600x900/?nature,technology')",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        ></motion.div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold leading-tight mb-4">Welcome to HabitSync</h1>
          <p className="text-xl mb-6">Track your habits, build streaks, and become the best version of yourself.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg text-xl"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-4xl font-bold mb-10">Why HabitSync?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Track Your Habits</h3>
            <p className="text-lg">Stay on top of your goals with detailed habit tracking and visual progress.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Stay Consistent</h3>
            <p className="text-lg">Maintain your streaks and keep motivated with daily habit reminders.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Get Insights</h3>
            <p className="text-lg">Analyze your habits and track your progress over time to see improvement.</p>
          </div>
        </div>
      </section>

        {/* Accountability Section */}
        <section className="py-20 bg-indigo-50 text-center">
        <h2 className="text-4xl font-bold mb-6">Stay Accountable Together</h2>
        <p className="text-lg max-w-2xl mx-auto mb-10">
            Invite an accountability partner to join your journey. They'll get notified if you miss a habit log, helping you stay consistent through encouragement and friendly pressure.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 px-6">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
            <h3 className="text-2xl font-semibold mb-2">Invite a Partner</h3>
            <p>Choose someone you trust to keep you on track and celebrate your wins.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
            <h3 className="text-2xl font-semibold mb-2">Stay on Track</h3>
            <p>Your partner gets notified if you miss a log—making sure you never fall off alone.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
            <h3 className="text-2xl font-semibold mb-2">Achieve Together</h3>
            <p>Progress feels better when shared. Help each other build powerful, lasting habits.</p>
            </div>
        </div>
        </section>


      {/* Stats Section */}
      <section className="py-20 bg-indigo-900 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Our Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 px-6">
          <motion.div
            className="stats-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-3xl font-semibold mb-2">10,000+</h3>
            <p>Users Reached</p>
          </motion.div>
          <motion.div
            className="stats-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-3xl font-semibold mb-2">50,000+</h3>
            <p>Habits Logged</p>
          </motion.div>
          <motion.div
            className="stats-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-3xl font-semibold mb-2">500+</h3>
            <p>Streaks Maintained</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 text-center">
        <h2 className="text-4xl font-bold mb-6">What People Are Saying</h2>
        <div className="flex justify-center gap-8 px-6">
          <div className="testimonial-card p-6 bg-white shadow-lg rounded-lg">
            <p className="italic mb-4">"HabitSync has transformed my daily routine. I'm more productive than ever!"</p>
            <p className="font-semibold">John Doe</p>
            <p>Regular User</p>
          </div>
          <div className="testimonial-card p-6 bg-white shadow-lg rounded-lg">
            <p className="italic mb-4">"I love how easy it is to track my habits and see progress. Highly recommend!"</p>
            <p className="font-semibold">Jane Smith</p>
            <p>Motivated Habit Tracker</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>&copy; 2025 HabitSync. All Rights Reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="/privacy-policy" className="hover:text-indigo-500">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:text-indigo-500">Terms of Service</a>
          <a href="/about-us-contact" className="hover:text-indigo-500">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
