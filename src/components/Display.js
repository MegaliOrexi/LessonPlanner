import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles for React Quill

const Display = ({ generatedData, prompt }) => {
  const [editableContent, setEditableContent] = useState('');

  useEffect(() => {
    if (generatedData) {
      try {
       //const formattedContent = formatContent(he.decode(generatedData))
       const parsedData = JSON.parse(generatedData);
       const formattedContent = formatContent(parsedData);
       console.log(formattedContent)
        setEditableContent(formattedContent);
      } catch (error) {
        console.error('Error parsing generatedData:', error);
      }
    }
  }, [generatedData]);

  const formatContent = (data) => {
    if (!data) {
      throw new Error('Failed to generate lesson plan, please try again');
    }

    const { "Lesson Title": lessonTitle, "Learning Objectives": learningObjectives, "Materials Needed": materialsNeeded, "Lesson Procedure": lessonProcedure, Assessment, Differentiation } = data;

    let content = '';
    content += `<div id = "displayedContent">`
    if (lessonTitle) content += `<h1>${lessonTitle}</h1><br/>`;
    if (learningObjectives) content += `<h2>Learning Objectives</h2><p>${learningObjectives}</p><br/>`;
    if (materialsNeeded) content += `<h2>Materials Needed</h2><p>${materialsNeeded}</p><br/>`;

    if (lessonProcedure) {
      content += `<h2>Lesson Procedure</h2><ul>`;
      for (const [step, description] of Object.entries(lessonProcedure)) {
        content += `<li><strong>${step}:</strong> ${description}</li>`;
      }
      content += `</ul><br/>`;
    }

    if (Assessment) content += `<h2>Assessment</h2><p>${Assessment}</p><br/>`;
    if (Differentiation) content += `<h2>Differentiation</h2><p>${Differentiation}</p><br/>`;
    content += `</div>`
    return content;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 mt-8">
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-4">Generated Output For: {prompt}</h2>
        <div className="quill-editor">
          <ReactQuill
            value={editableContent}
            onChange={setEditableContent} 
            className="h-auto w-full"
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            formats={[
              'header',
              'font',
              'size',
              'bold',
              'italic',
              'underline',
              'strike',
              'blockquote',
              'list',
              'bullet',
              'link',
              'image',
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Display;
