import React, { useState, useRef, useEffect } from 'react';
import Display from './Display';
import Spinner from './Spinner';

const Prompt = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedData, setGeneratedData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayPrompt, setDisplayPrompt] = useState('');
  const targetRef = useRef(null);

  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generatedData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch('https://lessonplanner-api.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson plan');
      }

      const content = await response.json();
      setGeneratedData(JSON.stringify(content.data));
      setDisplayPrompt(prompt);
      setError(null);
    } catch (error) {
      setError(error.message);
      setGeneratedData(null);
      setPrompt('')
    } finally {
      setLoading(false); // Set loading to false when fetching completes (success or error)
    }
  };

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-gray-100 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
        <label htmlFor="prompt" className="block text-lg font-medium mb-2">Enter Subject:</label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          required
        />
        <button type="submit" className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-200 w-full sm:w-auto">Generate Lesson Plan</button>
      </form>
      {loading && <Spinner />}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {generatedData && <Display generatedData={generatedData} prompt={displayPrompt} />}
      <div ref={targetRef}></div>
    </div>
  );
};

export default Prompt;
