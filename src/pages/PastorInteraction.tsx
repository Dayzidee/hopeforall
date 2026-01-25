import React, { useState } from 'react';

export default function PastorInteraction() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would save to Firestore 'requests' collection
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-montserrat font-bold text-primary-blue mb-6">Pastor Interaction</h1>

      <div className="bg-white-text p-8 rounded-xl shadow-lg border border-gray-100">
        <p className="text-gray-600 mb-6">
          Submit your prayer requests, questions, or testimonies directly to the pastoral team. All submissions are confidential.
        </p>

        {submitted ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 text-center">
            Your message has been sent successfully. We are praying with you.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-dark-text mb-2">Subject</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent outline-none"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            >
                <option value="">Select a topic...</option>
                <option value="prayer">Prayer Request</option>
                <option value="counseling">Counseling Request</option>
                <option value="testimony">Testimony</option>
                <option value="question">Question for Bishop</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-text mb-2">Message</label>
            <textarea
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent outline-none resize-none"
              placeholder="Share your heart..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-blue text-white-text font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Submit to Pastor
          </button>
        </form>
      </div>
    </div>
  );
}
