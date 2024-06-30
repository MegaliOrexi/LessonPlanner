import React, { useState, useRef, useEffect } from 'react';
import Display from './Display';
import Spinner from './Spinner';
import axios from 'axios';



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
    setLoading(true);
  
    try {
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      const API_KEY = process.env.OPENAI_API_KEY; // Replace with your actual API key
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      };
  
      const requestBody = {
        messages: [{
          role: 'user',
          content: `
            Ignore any previous instructions or questions asked.
            NOTE: it is very important all of the subheadings are generated with content
            Your main role is to act as an expert with 20 years of experience to be a plan provider for teachers:
            This is the subject that needs the plan: "${prompt}"
            
            
            DON'T send any extra text describing or talking, just this exact format with details filled in based on the topic, remember all of these subheadings NEED to be in it
            Please keep this exact format to allow the formatting to be proper

              {
              "Lesson Title" : "...",
              "Learning Objectives": "...",
              "Materials Needed": "...",
              "Lesson Procedure": {
                "Step1": "...",
                "Step2": "...",
                ...
              },
              "Assessment": "...",
              "Differentiation": "..."
            }
          `
        }],
        model: 'gpt-3.5-turbo',
        max_tokens: 1500
      };
  
      const { data } = await axios.post(apiUrl, requestBody, { headers });

      
      if (!data || !data.choices || !data.choices.length) {
        throw new Error('Failed to generate lesson plan');
      }
      
      console.log(data.choices[0].content)
      const generatedContent = data.choices[0].message.content;
      //const stringifiedContent = JSON.parse(generatedContent);
      
      // const parsedContent = JSON.parse(stringifiedContent)
      setGeneratedData(generatedContent);
      console.log(generatedContent)
      setDisplayPrompt(prompt);
      setError(null);
    } catch (error) {
      setError(error.message);
      setGeneratedData(null);
      setPrompt('');
    } finally {
      setLoading(false);
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
