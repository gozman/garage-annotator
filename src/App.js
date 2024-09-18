import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import AnnotationForm from './components/AnnotationForm';

function App() {
  const [data, setData] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [annotations, setAnnotations] = useState({});

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Skip the first row and first column
      const processedData = data.slice(1).map(row => row.slice(1));
      setData(processedData);
    };
    reader.readAsBinaryString(file);
  };

  const handleAnnotation = (annotation) => {
    setAnnotations({ ...annotations, [currentRow]: annotation });
    setCurrentRow(currentRow + 1);
  };

  const handleSave = () => {
    const annotatedData = data.map((row, index) => [...row, annotations[index] || '']);
    const ws = XLSX.utils.aoa_to_sheet(annotatedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'annotated.xlsx');
  };

  // Helper function to convert string to ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {console.log(data[1])}
      {data.length > 0 && currentRow < data.length && (
//        <AnnotationForm row={data[currentRow]} onAnnotate={handleAnnotation} />
          <AnnotationForm rows={data} onAnnotate={handleAnnotation} />
      )}
      {currentRow >= data.length && (
        <button onClick={handleSave}>Save Annotated File</button>
      )}
    </div>
  );
}

export default App;
