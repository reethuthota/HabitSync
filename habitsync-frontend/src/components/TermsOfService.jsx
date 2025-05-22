import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-indigo-600 to-indigo-900 text-white text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
        <p className="text-xl mb-6">Please read these terms and conditions carefully before using our service.</p>
      </section>

      {/* Terms of Service Content Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-4xl font-bold mb-10">License</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          We grant you a limited, non-exclusive, non-transferable license to use the application solely for personal or internal business purposes.
        </p>
        <h2 className="text-4xl font-bold mb-10">Restrictions</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          You agree not to reverse engineer, decompile, or exploit the Service in any way. Unauthorized use will result in termination of your access.
        </p>
        <h2 className="text-4xl font-bold mb-10">Limitation of Liability</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          HabitSync is not responsible for any indirect, incidental, or consequential damages resulting from the use of the application.
        </p>
        <h2 className="text-4xl font-bold mb-10">Governing Law</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          These terms shall be governed by and construed in accordance with the laws of your jurisdiction.
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

export default TermsOfService;
