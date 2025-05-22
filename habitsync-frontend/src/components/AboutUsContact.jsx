import React from 'react';

const AboutUsContact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-indigo-600 to-indigo-900 text-white text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">About Us & Contact</h1>
        <p className="text-xl mb-6">Learn more about HabitSync and get in touch with us.</p>
      </section>

      {/* About Us Content Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-4xl font-bold mb-10">Hi, I'm Reethu Thota</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          I developed HabitSync as part of my web application development course in college. This app is designed to help users track their habits, build streaks, and become the best version of themselves.
        </p>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          HabitSync allows users to track their progress, set goals, and maintain consistency in their habits, helping them to achieve personal growth.
        </p>
        <h2 className="text-4xl font-bold mb-10">Contact</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          If you have any questions or feedback, feel free to reach out to me at:
        </p>
        <ul className="text-lg max-w-3xl mx-auto mb-6">
          <li>Email: reethu.thota@gmail.com</li>
          <li>LinkedIn: <a href="https://www.linkedin.com/in/reethu-thota/" target="_blank" rel="noopener noreferrer" className="text-indigo-500">linkedin.com/reethu-thota</a></li>
          <li>GitHub: <a href="https://github.com/reethuthota" target="_blank" rel="noopener noreferrer" className="text-indigo-500">github.com/reethuthota</a></li>
        </ul>
        <p className="text-lg max-w-3xl mx-auto">
          I'd love to hear your thoughts or suggestions for improving the app!
        </p>
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

export default AboutUsContact;
