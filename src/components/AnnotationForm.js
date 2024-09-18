import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './AnnotationForm.css';
import * as XLSX from 'xlsx';

function AnnotationForm({ rows = [], onAnnotate }) {
  console.log('Rows in AnnotationForm:', rows); // Log rows
  const [currentRow, setCurrentRow] = useState(0);
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    if (rows.length > 0) {
      setAnnotations(rows.map(() => ({
        accuracy: '',
        ranking: '',
        url: '',
        comments: ''
      })));
    }
  }, [rows]);

  useEffect(() => {
    console.log('Annotations:', annotations); // Log annotations
  }, [annotations]);

  const handleInputChange = (e, field) => {
    const newAnnotations = [...annotations];
    newAnnotations[currentRow][field] = e.target.value;
    setAnnotations(newAnnotations);
  };

  const handlePrevious = () => {
    window.scrollTo(0, 0);
    if (currentRow > 0) {
      setCurrentRow(currentRow - 1);
    }
  };

  const handleNext = () => {
    window.scrollTo(0, 0);
    if (currentRow < rows.length - 1) {
      setCurrentRow(currentRow + 1);
    }
  };

  const handleDownload = () => {
    const dataWithConversationId = annotations.map((annotation, index) => ({
      conversationID: rows[index][0],
      ...annotation
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataWithConversationId);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Annotations");
    XLSX.writeFile(workbook, "annotations.xlsx");
  };

  if (rows.length === 0) {
    return <div>No data available</div>;
  }

  const isNextDisabled = !annotations[currentRow]?.accuracy;

  return (
    <div className="annotation-form">
      <p className="centered">Response {currentRow + 1} of {rows.length}</p>
      <h2 className="centered">
        <a href={rows[currentRow][1]} target="_blank" rel="noopener noreferrer">
          <ReactMarkdown>{rows[currentRow][2]}</ReactMarkdown>
        </a>
      </h2>
      <h3 className="centered"><ReactMarkdown>{rows[currentRow][3]}</ReactMarkdown></h3>
      
      {/* First Section: Two Columns with Content Before "Knowledge Consulted" */}
      <div className="columns">
        <div className="left-column">
          <h4>Current Retrieval</h4>
          <p><strong>Response:</strong><ReactMarkdown>{rows[currentRow][4]}</ReactMarkdown></p>
          <hr></hr>
        </div>
        <div className="right-column">
          <h4>GARAGe</h4>
          <p><strong>Response:</strong><ReactMarkdown>{rows[currentRow][8]}</ReactMarkdown></p>
          <hr></hr>
        </div>
      </div>
      
      {/* Second Section: Two Columns with "Knowledge Consulted" */}
      <div className="columns">
        <div className="left-column">
          <p className="knowledge-consulted"><strong>Knowledge Consulted:</strong></p>
          <ul className="knowledge-consulted">
            <li><p className="chunk-heading"><strong>Chunk 1</strong></p><ReactMarkdown>{rows[currentRow][5]}</ReactMarkdown></li>
            <li><p className="chunk-heading"><strong>Chunk 2</strong></p><ReactMarkdown>{rows[currentRow][6]}</ReactMarkdown></li>
            <li><p className="chunk-heading"><strong>Chunk 3</strong></p><ReactMarkdown>{rows[currentRow][7]}</ReactMarkdown></li>
          </ul>
        </div>
        <div className="right-column">
          <p className="knowledge-consulted"><strong>Knowledge Consulted:</strong></p>
          <ul className="knowledge-consulted">
            {Array.from({ length: 10 }, (_, i) => (
              <li key={i}>
                <p className="chunk-heading"><strong>Chunk {i + 1}</strong></p>
                <a href={rows[currentRow][9 + i * 3 + 2]} target="_blank" rel="noopener noreferrer">
                  <ReactMarkdown>{rows[currentRow][9 + i * 3 + 1]}</ReactMarkdown>
                </a>: <ReactMarkdown>{rows[currentRow][9 + i * 3]}</ReactMarkdown>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Full-Width Form for Annotations */}
      <div className="full-width-form">
        <label>
          GARAGe Retrieval Accuracy:
          <select value={annotations[currentRow]?.accuracy || ''} onChange={(e) => handleInputChange(e, 'accuracy')}>
            <option value="">Select</option>
            <option value="right content">Right content</option>
            <option value="some of the right content">Some of the right content</option>
            <option value="none of the right content">None of the right content</option>
          </select>
        </label>
        <label>
          Correct content ranking (ie: 3,7,4):
          <input 
            type="text" 
            value={annotations[currentRow]?.ranking || ''} 
            onChange={(e) => handleInputChange(e, 'ranking')}
          />
        </label>
        <label>
          Right article URL (if not retrieved):
          <input 
            type="text" 
            value={annotations[currentRow]?.url || ''} 
            onChange={(e) => handleInputChange(e, 'url')}
          />
        </label>
        <label>
          Comments:
          <textarea 
            value={annotations[currentRow]?.comments || ''} 
            onChange={(e) => handleInputChange(e, 'comments')}
          />
        </label>
        <div className="form-buttons">
          <button onClick={handlePrevious} disabled={currentRow === 0}>Previous</button>
          {currentRow < rows.length - 1 ? (
            <button onClick={handleNext} disabled={isNextDisabled}>Next</button>
          ) : (
            <button onClick={handleDownload} disabled={isNextDisabled}>Download</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnnotationForm;
