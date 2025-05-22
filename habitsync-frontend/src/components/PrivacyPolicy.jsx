import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-indigo-600 to-indigo-900 text-white text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl mb-6">Your privacy is important to us. Please read this policy carefully.</p>
      </section>

      {/* Privacy Policy Content Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-4xl font-bold mb-10">Information Collection</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          We collect information when you use our application, such as registration details, usage data, and feedback. We do not share any personal data with third parties without your consent.
        </p>
        <h2 className="text-4xl font-bold mb-10">Data Usage</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          We use the data to improve our services, provide personalized experiences, and maintain the application’s functionality.
        </p>
        <h2 className="text-4xl font-bold mb-10">Data Protection</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          Your data is stored securely, and we implement reasonable safeguards to prevent unauthorized access, disclosure, or modification.
        </p>
        <h2 className="text-4xl font-bold mb-10">Changes to this Policy</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          We may update this Privacy Policy from time to time. Please check this page periodically for updates.
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

export default PrivacyPolicy;
